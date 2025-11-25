// functions/user-update-profile/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// Middleware to verify JWT token (simplified)
function verifyToken(event) {
  // In production, verify the JWT token from Authorization header
  // For now, we'll trust the userId from the request
  return event.userId;
}

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

    // ===== Verify authentication =====
    const userId = verifyToken(requestData);
    if (!userId) {
      return {
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      };
    }

    const { displayName, avatar, preferences } = requestData;

    // ===== Build update object =====
    const updateData = {};
    
    // ===== Validate display name =====
    if (displayName !== undefined) {
      if (displayName.length < 2 || displayName.length > 10) {
        return {
          success: false,
          error: 'Display name must be 2-10 characters',
          code: 'INVALID_DISPLAY_NAME'
        };
      }
      updateData.displayName = displayName;
    }

    // ===== Validate avatar =====
    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // ===== Validate preferences =====
    if (preferences !== undefined) {
      updateData.preferences = preferences;
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: 'No fields to update',
        code: 'INVALID_INPUT'
      };
    }

    updateData.updatedAt = new Date().toISOString();

    // ===== Update user =====
    const result = await db.collection('users')
      .where({
        userId: userId
      })
      .update({
        data: updateData
      });

    if (result.stats.updated === 0) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      };
    }

    // ===== Get updated user =====
    const userResult = await db.collection('users')
      .where({
        userId: userId
      })
      .get();

    const { passwordHash, _id, ...userResponse } = userResult.data[0];

    return {
      success: true,
      data: userResponse
    };

  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Profile update failed',
      code: 'SERVER_ERROR'
    };
  }
};