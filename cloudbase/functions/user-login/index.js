// functions/user-login/index.js
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

exports.main = async (event, context) => {
  try {
    // Parse request body if coming from HTTP trigger
    let requestData = event;
    if (typeof event.body === 'string') {
      try {
        requestData = JSON.parse(event.body);
      } catch (e) {
        return {
          success: false,
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON'
        };
      }
    } else if (event.body && typeof event.body === 'object') {
      requestData = event.body;
    }

    const { email, password } = requestData;

    // ===== Validation =====
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
        code: 'INVALID_INPUT'
      };
    }

    // ===== Find user by email =====
    const userResult = await db.collection('users')
      .where({
        email: email.toLowerCase()
      })
      .get();
    console.log('User result:', userResult);

    if (userResult.data.length === 0) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
        
      };
    }

    const user = userResult.data[0];

    // ===== Verify password =====
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // ===== Check if account is active =====
    if (!user.isActive) {
      return {
        success: false,
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      };
    }

    // ===== Update last login =====
    await db.collection('users')
      .doc(user._id)
      .update({
        data: {
          lastLogin: new Date().toISOString()
        }
      });

    // ===== Generate JWT token =====
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // ===== Return user data (exclude password hash and _id) =====
    const { passwordHash, _id, ...userResponse } = user;

    return {
      success: true,
      data: {
        user: userResponse,
        token,
        expiresIn: 604800
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed',
      code: 'SERVER_ERROR'
    };
  }
};