//src/entities/types/api.types.ts
//用于API接口的类型定义，使 API 响应统一格式

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// ==================== 认证相关 ====================

//登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

//注册请求
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

//登录响应
export interface LoginResponse {
  user: {
    userId: string;
    email: string;
    displayName: string;
    role: string;
    registrationDate: string;
    avatar?: string;
  };
  token: string;
  expiresIn: number;  // Token 过期时间（秒）
}

//注册响应
export interface RegisterResponse extends LoginResponse { }

//更新用户信息请求
export interface UpdateProfileRequest {
  displayName?: string;
  avatar?: string;
  // Add other fields if needed
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message?: string;
}

// ==================== 课程相关 ====================

//获取课程列表响应
export interface GetCoursesResponse {
  courses: Array<{
    courseId: string;
    name: string;
    nameZh: string;
    description: string;
    level: string;
    isActive: boolean;
  }>;
}

//获取课程内容请求
export interface GetCourseContentRequest {
  courseId: string;
  contentType: 'alphabet' | 'vocabulary' | 'sentence' | 'article';
}

//获取课程内容响应
export interface GetCourseContentResponse {
  content: any[];  // 根据 contentType 返回不同结构
}

// ==================== 学习相关 ====================

//获取词汇请求
export interface GetVocabularyRequest {
  courseId: string;
  difficulty?: string;
}

//获取词汇响应
export interface GetVocabularyResponse {
  vocabulary: Array<{
    vocabId: string;
    thai: string;
    chinese: string;
    pronunciation: string;
    example: string;
    audioUrl?: string;
    difficulty: string;
  }>;
}

//记录学习请求
export interface RecordLearningRequest {
  contentType: 'alphabet' | 'vocabulary' | 'sentence' | 'article';
  contentId: string;
  isCorrect: boolean;
  score?: number;
}

// ==================== 进度相关 ====================

//获取进度响应
export interface GetProgressResponse {
  progressId: string;
  userId: string;
  courseId: string;
  currentLevel: string;
  completedAlphabets: number;
  completedVocabulary: number;
  completedSentences: number;
  completedArticles: number;
  totalScore: number;
  studyTime: number;
  streakDays: number;
}

// ==================== 发音评估 ====================

//发音评估请求
export interface AssessPronunciationRequest {
  audioData: string;  // Base64 编码的音频
  targetText: string;
  language: string;  // 'th' for Thai
}

//发音评估响应
export interface AssessPronunciationResponse {
  overallScore: number;
  toneScore: number;
  phonemeScore: number;
  fluencyScore: number;
  feedback: string;
  pitchData?: number[];
}

// ==================== 复习相关 ====================

//获取待复习响应
export interface GetDueReviewsResponse {
  reviews: Array<{
    scheduleId: string;
    contentType: string;
    contentId: string;
    nextReviewDate: string;
  }>;
}

//更新复习请求
export interface UpdateReviewRequest {
  scheduleId: string;
  quality: number;  // 1-5
}