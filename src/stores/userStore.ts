import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api.endpoints';
import type {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse
} from '../entities/types/api.types';
import type { User } from '../entities/types/entities';

// Type definitions


interface UserState {
  // State
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (data: ResetPasswordRequest) => Promise<boolean>;
  updateProfile: (data: { displayName?: string; avatar?: string }) => Promise<boolean>;
  setUser: (user: User, token: string) => void;
  checkAuth: () => boolean;
  clearError: () => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  // 可以添加更多规则
  return { valid: true };
};

// ==================== Store ====================

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ==================== 初始状态 ====================
      currentUser: null,
      isAuthenticated: false,
      authToken: null,
      isLoading: false,
      error: null,

      // ==================== 注册 ====================
      /**
       * Register a new user
       * 
       * Flow:
       * 1. Set loading state
       * 2. Call API
       * 3. If success: save user + token, set authenticated
       * 4. If fail: save error message
       * 
       * @param data Registration data (email, password, displayName)
       * @returns Success status
       */
      register: async (data: RegisterRequest) => {

        if (!validateEmail(data.email)) {
          set({ error: 'Invalid email format' });
          return false;
        }

        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
          set({ error: passwordValidation.error });
          return false;
        }

        if (!data.displayName.trim()) {
          set({ error: 'Display name is required' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<RegisterResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            {
              email: data.email.toLowerCase().trim(),
              password: data.password,
              displayName: data.displayName,
            });

          if (response.success && response.data) {
            const { user, token } = response.data;

            // Save token to apiClient for future requests
            apiClient.setAuthToken(token);

            // Update store state
            set({
              currentUser: user as User,
              authToken: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;

          } else {
            set({
              error: response.error || '注册失败',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || '注册失败',
            isLoading: false,
          });
          return false;
        }
      },

      // ==================== 登录 ====================
      /**
       * Authenticate user
       * 
       * Flow:
       * 1. Set loading state
       * 2. Call API
       * 3. If success: save user + token, set authenticated
       * 4. If fail: save error message
       * 
       * @param email User email
       * @param password User password
       * @returns Success status
       */
      login: async (data: LoginRequest) => {

        if (!validateEmail(data.email)) {
          set({ error: 'Invalid email format' });
          return false;
        }

        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
          set({ error: passwordValidation.error });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            email: data.email.toLowerCase().trim(),
            password: data.password,
          });

          if (response.success && response.data) {
            const { user, token } = response.data;

            // Save token to apiClient for future requests
            apiClient.setAuthToken(token);

            // Update store state
            set({
              currentUser: user as User,
              authToken: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            set({
              error: response.error || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      // ==================== 登出 ====================
      /**
       * Logout current user
       * 
       * Flow:
       * 1. Clear apiClient token
       * 2. Clear store state
       * 3. Clear AsyncStorage (via persist middleware)
       */
      logout: () => {
        // Clear token from apiClient
        apiClient.setAuthToken(null);

        // Clear store state
        set({
          currentUser: null,
          authToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // ==================== 重置密码 ====================
      /**
       * Request password reset email
       * 
       * @param email User email
       * @returns Success status
       */
      requestPasswordReset: async (data: ResetPasswordRequest) => {
        if (!validateEmail(data.email)) {
          set({ error: 'Invalid email format', isLoading: false });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<ResetPasswordResponse>(
            API_ENDPOINTS.AUTH.RESET_PASSWORD,
            { email: data.email.toLowerCase().trim() }
          );

          if (response.success) {
            set({ isLoading: false, error: null });
            return true;
          } else {
            set({
              error: response.error || 'Password reset failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Password reset failed',
            isLoading: false,
          });
          return false;
        }
      },

      // ==================== 更新个人资料 ====================
      /**
       * Update user profile
       * 
       * @param data Profile data to update
       * @returns Success status
       */
      updateProfile: async (data: { displayName?: string; avatar?: string }) => {
        const currentUser = get().currentUser;
        if (!currentUser) {
          set({ error: 'No user logged in' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.put<{ user: User }>(
            API_ENDPOINTS.AUTH.UPDATE_PROFILE,
            {
              userId: currentUser.userId,
              ...data,
            });

          if (response.success && response.data) {
            set({
              currentUser: {
                ...currentUser,
                ...(data.displayName && { displayName: data.displayName }),
                ...(data.avatar && { avatar: data.avatar }),
              },
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: response.error || 'Profile update failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Profile update failed',
            isLoading: false,
          });
          return false;
        }
      },

      // ===== Set User (Direct) =====
      /**
       * Directly set user and token
       * Used for: OAuth flows, token refresh
       * 
       * @param user User object
       * @param token Auth token
       */
      setUser: (user: User, token: string) => {
        apiClient.setAuthToken(token);

        set({
          currentUser: user,
          authToken: token,
          isAuthenticated: true,
          error: null,
        });
      },

      // ===== Check Auth Status =====
      /**
       * Check if user is authenticated
       * 
       * @returns Authentication status
       */
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.authToken !== null;
      },

      // ===== Clear Error =====
      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),

      // Restore auth token to apiClient on rehydration
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.authToken) {
            apiClient.setAuthToken(state.authToken);
          }
        };
      },
    }
  )
);