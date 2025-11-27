// src/utils/apiClient.ts

import {
  getApiBaseUrl,
  CURRENT_BACKEND,
  logBackendInfo
} from '../config/backend.config';
import { getEndpoint, replacePathParams } from '../config/api.endpoints';
import type { EndpointMap } from '../config/api.endpoints';
import { API_TIMEOUT, ERROR_MESSAGES } from '../config/constants';
import type { ApiResponse } from '../entities/types/api.types';

interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  pathParams?: Record<string, string>;  // 路径参数
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = getApiBaseUrl();

    // 打印后端信息（仅开发环境）
    logBackendInfo();
  }

  // ==================== Token 管理 ====================

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (__DEV__) {
      console.log('🔑 Token 已设置:', token ? token.substring(0, 20) + '...' : 'null');
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  // ==================== 构建完整 URL ====================

  private buildUrl(
    endpoint: string | EndpointMap,
    pathParams?: Record<string, string>
  ): string {
    let path: string;

    // 如果是端点映射对象，根据当前后端选择路径
    if (typeof endpoint === 'object') {
      path = getEndpoint(endpoint, CURRENT_BACKEND);
    } else {
      path = endpoint;
    }

    // 替换路径参数（如 /api/courses/:id）
    if (pathParams) {
      path = replacePathParams(path, pathParams);
    }

    // 拼接完整 URL
    const fullUrl = `${this.baseUrl}${path}`;

    return fullUrl;
  }

  // ==================== 通用请求方法 ====================

  private async request<T>(
    endpoint: string | EndpointMap,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = API_TIMEOUT.DEFAULT,
      headers = {},
      pathParams,
    } = options;

    // 构建请求头
    const authToken = this.getAuthToken();
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // 添加 Authorization 头
    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    // 构建 URL
    const url = this.buildUrl(endpoint, pathParams);

    // 超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      if (__DEV__) {
        console.log(`📤 [${method}] ${url}`);
        if (data) console.log('📦 Request data:', data);
      }

      // 发送请求
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (__DEV__) {
        console.log(`📥 Response status: ${response.status}`);
      }

      // 解析响应
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('❌ 解析响应失败:', parseError);
        return {
          success: false,
          error: ERROR_MESSAGES.SERVER_ERROR,
          code: 'PARSE_ERROR',
        };
      }

      // 检查 HTTP 状态码
      if (!response.ok) {
        // 401 Unauthorized - Token 失效
        if (response.status === 401) {
          return {
            success: false,
            error: responseData.error || ERROR_MESSAGES.TOKEN_EXPIRED,
            code: 'TOKEN_EXPIRED',
          };
        }

        // 其他错误
        return {
          success: false,
          error: responseData.error || responseData.message || ERROR_MESSAGES.SERVER_ERROR,
          code: responseData.code || 'SERVER_ERROR',
        };
      }

      // 返回成功响应
      if (__DEV__) {
        console.log('✅ Response data:', responseData);
      }

      return {
        success: true,
        data: responseData.data || responseData,
      };

    } catch (error: any) {
      clearTimeout(timeoutId);

      // 超时错误
      if (error.name === 'AbortError') {
        console.error('⏱️ 请求超时');
        return {
          success: false,
          error: ERROR_MESSAGES.TIMEOUT_ERROR,
          code: 'TIMEOUT',
        };
      }

      // 网络错误
      if (!navigator.onLine) {
        console.error('📡 网络未连接');
        return {
          success: false,
          error: ERROR_MESSAGES.NETWORK_ERROR,
          code: 'NETWORK_ERROR',
        };
      }

      // 其他错误
      console.error('❌ 请求失败:', error);
      return {
        success: false,
        error: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // ==================== HTTP 方法 ====================

  async get<T>(
    endpoint: string | EndpointMap,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  async post<T>(
    endpoint: string | EndpointMap,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  async put<T>(
    endpoint: string | EndpointMap,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  async delete<T>(
    endpoint: string | EndpointMap,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
}

// ==================== 导出单例 ====================
export const apiClient = new ApiClient();