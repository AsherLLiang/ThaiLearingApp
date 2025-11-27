// src/config/backend.config.ts

import { BackendType } from './api.endpoints';

/**
 * 后端配置
 * 
 * 🔧 切换后端只需要修改 CURRENT_BACKEND
 */

// ==================== 🔧 切换后端的地方 ====================
export const CURRENT_BACKEND: BackendType = 
  (process.env.EXPO_PUBLIC_BACKEND as BackendType) || 'cloudbase';

// 提示：在 .env 文件中设置 EXPO_PUBLIC_BACKEND=cloudbase 或 java

// ==================== 后端配置 ====================
export const BACKEND_CONFIG = {
  // CloudBase 云函数
  cloudbase: {
    name: 'CloudBase_CloudFunction',
    env: process.env.EXPO_PUBLIC_CLOUDBASE_ENV || 
         'cloud1-1gjcyrdd7ab927c6-1387301748',
    region: process.env.EXPO_PUBLIC_CLOUDBASE_REGION || 'ap-shanghai',
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 
                'https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com',
  },
  
  // Java Spring Boot
  java: {
    name: 'Java_SpringBoot',
    apiBaseUrl: process.env.EXPO_PUBLIC_JAVA_API_URL || 
                'http://localhost:8080',
    // 未来生产环境：'https://api.thailearning.com'
  },
};

// ==================== 获取当前后端配置 ====================
export function getCurrentBackendConfig() {
  return BACKEND_CONFIG[CURRENT_BACKEND];
}

// ==================== 获取 API 基础地址 ====================
export function getApiBaseUrl(): string {
  return getCurrentBackendConfig().apiBaseUrl;
}

// ==================== 获取后端名称 ====================
export function getBackendName(): string {
  return getCurrentBackendConfig().name;
}

// ==================== 判断是否为 CloudBase ====================
export function isCloudBase(): boolean {
  return CURRENT_BACKEND === 'cloudbase';
}

// ==================== 判断是否为 Java ====================
export function isJava(): boolean {
  return CURRENT_BACKEND === 'java';
}

// ==================== 打印当前配置（开发用）====================
export function logBackendInfo() {
  if (__DEV__) {
    console.log('='.repeat(50));
    console.log('🔧 当前后端配置:');
    console.log('后端类型:', CURRENT_BACKEND);
    console.log('后端名称:', getBackendName());
    console.log('API 地址:', getApiBaseUrl());
    console.log('='.repeat(50));
  }
}