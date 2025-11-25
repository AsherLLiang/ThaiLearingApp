/**
 * Tencent CloudBase Configuration
 * 
 * Purpose: Centralized configuration for CloudBase SDK initialization
 * Used by: All backend services (UserService, CourseService, etc.)
 * 
 * Setup Instructions:
 * 1. Create a .env file in project root
 * 2. Add your CloudBase credentials:
 *    EXPO_PUBLIC_CLOUDBASE_ENV=your-env-id
 *    EXPO_PUBLIC_CLOUDBASE_REGION=ap-guangzhou
 */



export const CLOUDBASE_CONFIG = {
  env: process.env.EXPO_PUBLIC_CLOUDBASE_ENV || 'cloud1-1gjcyrdd7ab927c6-1387301748',
  
  // CloudBase region
  region: process.env.EXPO_PUBLIC_CLOUDBASE_REGION || 'ap-shanghai',
  
  // API base URL for CloudBase functions
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 
    'https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com',
};

// Collection names in CloudBase database
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  LESSONS: 'lessons',
  EXERCISES: 'exercises',
  PRONUNCIATION_RECORDS: 'pronunciationRecords',
  PROGRESS: 'progress',
  REVIEW_SCHEDULES: 'reviewSchedules',
};

// Cloud Function names
export const CLOUD_FUNCTIONS = {
  // User management
  USER_REGISTER: 'user-register',
  USER_LOGIN: 'user-login',
  USER_RESET_PASSWORD: 'user-reset-password',
  USER_UPDATE_PROFILE: 'user-update-profile',
  
  // Course management
  GET_COURSES: 'course-get-all',
  GET_COURSE_CONTENT: 'course-get-content',
  
  // Learning
  RECORD_COMPLETION: 'learning-record-completion',
  GET_PROGRESS: 'progress-get',
  UPDATE_PROGRESS: 'progress-update',
  
  // Pronunciation
  ASSESS_PRONUNCIATION: 'pronunciation-assess',
  GET_PRONUNCIATION_HISTORY: 'pronunciation-history',
  
  // Review system
  GET_DUE_REVIEWS: 'review-get-due',
  UPDATE_REVIEW: 'review-update',
};

// API timeout settings (in milliseconds)
export const API_TIMEOUT = {
  DEFAULT: 10000, // 10 seconds
  UPLOAD: 30000,  // 30 seconds for file uploads
  LONG: 60000,    // 60 seconds for heavy operations
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败。请检查您的互联网连接。',
  TIMEOUT_ERROR: '请求超时。请稍后重试。',
  AUTH_ERROR: '身份验证失败。请重新登录。',
  SERVER_ERROR: '服务器错误。请稍后重试。',
  INVALID_INPUT: '无效输入。请检查您的信息。',
};

export default CLOUDBASE_CONFIG;