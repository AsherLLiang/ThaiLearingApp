import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';

// Type definitions
interface User {
  userId: string;
  email: string;
  displayName: string;
  role: 'LEARNER' | 'ADMIN';
  registrationDate: string;
  avatar?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

interface ResetPasswordRequest {
  email: string;
}

interface UserState {
  // State
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: { email: string; password: string; displayName: string }) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  updateProfile: (data: { displayName?: string; avatar?: string }) => Promise<boolean>;
  setUser: (user: User, token: string) => void;
  checkAuth: () => boolean;
  clearError: () => void;
}

// ==================== Store ====================

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ===== Initial State =====
      currentUser: null,
      isAuthenticated: false,
      authToken: null,
      isLoading: false,
      error: null,

      // ===== Register Action =====
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
      register: async (data: { email: string; password: string; displayName: string }) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<any>('/user-register', {
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
              currentUser: user,
              authToken: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            set({
              error: response.error || 'Registration failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isLoading: false,
          });
          return false;
        }
      },

      // ===== Login Action =====
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
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<any>('/user-login', {
            email: email.toLowerCase().trim(),
            password,
          });

          if (response.success && response.data) {
            const { user, token } = response.data;

            // Save token to apiClient for future requests
            apiClient.setAuthToken(token);

            // Update store state
            set({
              currentUser: user,
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

      // ===== Logout Action =====
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

      // ===== Password Reset Action =====
      /**
       * Request password reset email
       * 
       * @param email User email
       * @returns Success status
       */
      requestPasswordReset: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<any>('/user-reset-password', { email });

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

      // ===== Update Profile Action =====
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
          const response = await apiClient.put<any>('/user-update-profile', {
            userId: currentUser.userId,
            ...data,
          });

          if (response.success && response.data) {
            set({
              currentUser: response.data,
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