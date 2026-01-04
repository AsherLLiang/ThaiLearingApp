const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

//JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

exports.main = async (event, context) => {
  // Parse request body if coming from HTTP trigger
  let requestData = event;
  if (typeof event.body === 'string') {
    try {
      requestData = JSON.parse(event.body);
    } catch (e) {
      return {
        success: false,
        message: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      };
    }
  } else if (event.body && typeof event.body === 'object') {
    requestData = event.body;
  }

  const { email, password, displayName, role = 'LEARNER' } = requestData;

  // Validate required fields
  if (!email || !password || !displayName) {
    return {
      success: false,
      message: 'Missing required fields: email, password, displayName',
      code: 'MISSING_FIELDS'
    };
  }

  try {
    // Check if email already exists 
    const existingUser = await db.collection('users').where({
      email: email.toLowerCase()
    }).count();

    if (existingUser.count > 0) {
      return {
        success: false,
        message: '邮箱已存在 \n Email already exists',
        code: 'EMAIL_EXISTS'
      };
    }

    // ===== Hash password =====
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 创建新用户
    const userId = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const registrationDate = new Date().toISOString();
    const userDoc = {
      userId,
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      role,
      registrationDate,
      lastLogin: registrationDate,
      isActive: true,
      preferences: {
        language: 'zh',
        notificationsEnabled: true
      }
    };
    // ===== Save to database =====
    await db.collection('users').add({
      data: userDoc
    });

    // 初始化用户整体学习进度 (统一进度表)
    await db.collection('user_progress').add({
      data: {
        userId,
        letterCompleted: false,
        debugSkipLetter: false,
        letterProgress: 0.0,
        wordProgress: 0.0,
        sentenceProgress: 0.0,
        totalStudyDays: 0,
        streakDays: 0,
        lastStudyDate: null,
        createdAt: registrationDate,
        updatedAt: registrationDate
      }
    });

    // 初始化字母模块专用进度表
    // 说明:
    // - letterProgress: 0–1 之间的小数, 0.8 代表 80%
    // - letterCompleted: 三轮全部完成后由记忆引擎更新为 true
    // - completedLessons: 已完成的字母课程ID列表 (例如: ["alphabet-lesson1"])
    // - masteredLetterCount: 已掌握的字母数量
    // - totalLetterCount: 字母总数 (当前约 80, 预留给未来扩展)
    await db.collection('user_alphabet_progress').add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          // 🔥 新增：默认从第1轮开始
        roundHistory: [],         // 🔥 新增：轮次历史记录
        createdAt: registrationDate,
        updatedAt: registrationDate,
      }
    });

    // ===== Generate JWT token =====
    const token = jwt.sign(
      {
        userId,
        email: email.toLowerCase(),
        role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    // ===== Return user data (exclude password hash) =====
    const { passwordHash: _, ...userResponse } = userDoc;

    return {
      success: true,
      data: {
        user: userResponse,
        token,
        expiresIn: 604800 // 7 days in seconds
      }
    };

  } catch (error) {
    console.error('注册失败:', error);
    return {
      success: false,
      message: '注册失败: ' + error.message
    };
  }
};
