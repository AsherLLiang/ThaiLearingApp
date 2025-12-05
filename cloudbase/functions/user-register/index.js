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

    // 初始化用户学习进度
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
