import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types/entities';

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setUser: (user: User, token: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      authToken: null,

      login: async (email: string, password: string) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            userId: '1',
            email: email,
            password: password,
            displayName: '张三',
            role: UserRole.LEARNER,
            registrationDate: new Date(),
            lastLoginDate: new Date(),
          };
          
          const mockToken = 'mock_token_' + Date.now();
          
          set({
            currentUser: mockUser,
            authToken: mockToken,
            isAuthenticated: true,
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
          authToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().currentUser;
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,
              ...userData,
            },
          });
        }
      },

      setUser: (user: User, token: string) => {
        set({
          currentUser: user,
          authToken: token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);