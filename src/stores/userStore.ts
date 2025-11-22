// src/stores/userStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  userId: string;
  email: string;
  displayName: string;
  role: 'LEARNER' | 'ADMIN';
  registrationDate: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  checkAuth: () => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      authToken: null,

      register: async (email: string, password: string) => {
        try {
          // TODO: 实际API调用
          // const response = await UserService.registerUser(email, password);
        } catch (error) {
          console.error('Register failed:', error);
          return false;
        }
      },
      login: async (email: string, password: string) => {
        try {
          // TODO: 实际API调用
          // const response = await UserService.authenticateUser(email, password);
          
          // 模拟登录
          const mockUser: User = {
            userId: '001',
            email,
            displayName: 'Liang JianYu',
            role: 'LEARNER',
            registrationDate: new Date().toISOString(),
          };
          
          const mockToken = 'mock_jwt_token_' + Date.now();
          
          set({
            currentUser: mockUser,
            isAuthenticated: true,
            authToken: mockToken,
          });
          
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          authToken: null,
        });
      },

      setUser: (user: User, token: string) => {
        set({
          currentUser: user,
          isAuthenticated: true,
          authToken: token,
        });
      },

      checkAuth: () => {
        return get().isAuthenticated && get().authToken !== null;
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);