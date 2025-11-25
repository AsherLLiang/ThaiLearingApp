// functions/user-reset-password/index.js
const cloud = require('wx-server-sdk');
const crypto = require('crypto');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const { email } = event;

    // ===== Validation =====
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
        code: 'INVALID_INPUT'
      };
    }

    // ===== Find user =====
    const userResult = await db.collection('users')
      .where({
        email: email.toLowerCase()
      })
      .get();

    // For security, always return success even if user not found
    if (userResult.data.length === 0) {
      return {
        success: true,
        data: {
          message: 'If this email is registered, you will receive password reset instructions.'
        }
      };
    }

    const user = userResult.data[0];

    // ===== Generate reset token =====
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // ===== Save reset token =====
    await db.collection('users')
      .doc(user._id)
      .update({
        data: {
          resetToken: resetTokenHash,
          resetTokenExpiry: resetTokenExpiry.toISOString()
        }
      });

    // ===== Send email (pseudo-code) =====
    // In production, integrate with email service like SendGrid, AWS SES, etc.
    const resetLink = `https://your-app.com/reset-password?token=${resetToken}`;
    
    // TODO: Implement actual email sending
    console.log(`Password reset link for ${email}: ${resetLink}`);
    
    // Placeholder for email service integration:
    // await sendEmail({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   body: `Click this link to reset your password: ${resetLink}`
    // });

    return {
      success: true,
      data: {
        message: 'If this email is registered, you will receive password reset instructions.'
      }
    };

  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Password reset request failed',
      code: 'SERVER_ERROR'
    };
  }
};