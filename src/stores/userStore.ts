// src/stores/userStore.ts
import { create } from 'zustand';  // 核心函数
import { persist, createJSONStorage } from 'zustand/middleware';  // 持久化插件
import AsyncStorage from '@react-native-async-storage/async-storage';  // 本地存储
import { User, UserRole } from '../types/entities';  // 类型定义

// 【接口】定义 Store 的结构
interface UserState {
  // ===== 状态(数据) =====
  currentUser: User | null;      // 当前用户(可能为空)
  isAuthenticated: boolean;      // 是否已登录
  authToken: string | null;      // 认证令牌
  
  // ===== 动作(方法) =====
  login: (email: string, password: string) => Promise<boolean>;  // 登录
  logout: () => void;            // 登出
  updateUser: (userData: Partial<User>) => void;  // 更新用户信息
  setUser: (user: User, token: string) => void;   // 设置用户
}

// 【核心】创建 Store
export const useUserStore = create<UserState>()(  // 注意双括号!
  persist(  // 【插件】持久化到本地
    (set, get) => ({  // set = 更新状态, get = 读取状态
      // ===== 初始状态 =====
      currentUser: null,
      isAuthenticated: false,
      authToken: null,

      // ===== 登录方法 =====
      login: async (email: string, password: string) => {
        try {
          // 模拟网络请求(实际要调云函数)
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // 创建模拟用户
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
          
          // 【关键】更新状态
          set({
            currentUser: mockUser,
            authToken: mockToken,
            isAuthenticated: true,
          });
          
          return true;  // 登录成功
        } catch (error) {
          console.error('Login failed:', error);
          return false;  // 登录失败
        }
      },

      // ===== 登出方法 =====
      logout: () => {
        set({  // 清空所有状态
          currentUser: null,
          authToken: null,
          isAuthenticated: false,
        });
      },

      // ===== 更新用户方法 =====
      updateUser: (userData: Partial<User>) => {  // Partial = 部分字段
        const currentUser = get().currentUser;  // 读取当前用户
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,      // 保留旧数据
              ...userData,         // 覆盖新数据
            },
          });
        }
      },

      // ===== 设置用户方法 =====
      setUser: (user: User, token: string) => {
        set({
          currentUser: user,
          authToken: token,
          isAuthenticated: true,
        });
      },
    }),
    {
      name: 'user-storage',  // 存储的 key
      storage: createJSONStorage(() => AsyncStorage),  // 使用 AsyncStorage
    }
  )
);