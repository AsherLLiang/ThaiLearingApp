// src/services/UserService.ts
/**
 * User Service (Optimized)
 * 
 * Purpose: Handle user operations with CloudBase backend
 * 
 * Architecture Decision:
 * ✅ Frontend (validation.ts): User-facing validation for UX
 * ✅ Backend (Cloud Functions): Security validation to prevent malicious requests
 * 
 * This service focuses on:
 * - API communication
 * - Data transformation
 * - Error handling
 * - NOT validation (that's done in components using validation.ts)
 */

import { apiClient, ApiResponse } from '../utils/apiClient';
import { CLOUD_FUNCTIONS } from '../config/cloudbase.config';

// ==================== Types ====================

export interface User {
  userId: string;
  email: string;
  displayName: string;
  role: 'LEARNER' | 'ADMIN';
  registrationDate: string;
  avatar?: string;
  preferences?: {
    language: 'zh' | 'en';
    notificationsEnabled: boolean;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdateProfileRequest {
  userId: string;
  displayName?: string;
  avatar?: string;
  preferences?: {
    language?: 'zh' | 'en';
    notificationsEnabled?: boolean;
  };
}

// ==================== User Service Class ====================

class UserService {
  /**
   * Register a new user
   * 
   * Note: Frontend validation should be done BEFORE calling this
   * Backend will validate again for security
   * 
   * @param data Registration data
   * @returns User object and auth token
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>(
        CLOUD_FUNCTIONS.USER_REGISTER,
        {
          email: data.email.toLowerCase().trim(),
          password: data.password,
          displayName: data.displayName.trim(),
          role: 'LEARNER',
          registrationDate: new Date().toISOString(),
        }
      );

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
        code: 'REGISTRATION_ERROR',
      };
    }
  }

  /**
   * Authenticate user
   * 
   * @param data Login credentials
   * @returns User object and JWT token
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>(
        CLOUD_FUNCTIONS.USER_LOGIN,
        {
          email: data.email.toLowerCase().trim(),
          password: data.password,
        }
      );

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Login failed',
        code: 'LOGIN_ERROR',
      };
    }
  }

  /**
   * Request password reset
   * 
   * @param data Email for password reset
   * @returns Success status
   */
  async requestPasswordReset(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.post<{ message: string }>(
        CLOUD_FUNCTIONS.USER_RESET_PASSWORD,
        {
          email: data.email.toLowerCase().trim(),
        }
      );

      return response;
    } catch (error: any) {
      // For security, always return success
      return {
        success: true,
        data: {
          message: 'If this email is registered, you will receive password reset instructions.',
        },
      };
    }
  }

  /**
   * Update user profile
   * 
   * @param data Profile update data
   * @returns Updated user object
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put<User>(
        CLOUD_FUNCTIONS.USER_UPDATE_PROFILE,
        data
      );

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Profile update failed',
        code: 'UPDATE_ERROR',
      };
    }
  }

  /**
   * Get user by ID
   * 
   * @param userId User ID to fetch
   * @returns User object
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>(
        `user-get-by-id?userId=${userId}`
      );

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch user',
        code: 'FETCH_ERROR',
      };
    }
  }

  /**
   * Verify auth token validity
   * 
   * @param token JWT token to verify
   * @returns Verification status
   */
  async verifyToken(token: string): Promise<ApiResponse<{ valid: boolean }>> {
    try {
      apiClient.setAuthToken(token);

      const response = await apiClient.post<{ valid: boolean }>(
        'user-verify-token'
      );

      return response;
    } catch (error: any) {
      return {
        success: false,
        error: 'Token verification failed',
        code: 'TOKEN_ERROR',
      };
    }
  }
}

// Export singleton instance
export const userService = new UserService();

// Export class for testing
export default UserService;