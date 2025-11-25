// src/utils/apiClient.ts
/**
 * API Client Utility
 * 
 * Purpose: Centralized HTTP client for calling CloudBase Cloud Functions
 * Features:
 * - Automatic token injection from userStore
 * - Request/response interceptors
 * - Error handling and retry logic
 * - Timeout management
 * 
 * Usage:
 * import { apiClient } from '@/src/utils/apiClient';
 * const data = await apiClient.post('/user-login', { email, password });
 */

import { CLOUDBASE_CONFIG, API_TIMEOUT, ERROR_MESSAGES } from '../config/cloudbase.config';

// Response wrapper type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Request options
interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
}

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = CLOUDBASE_CONFIG.apiBaseUrl;
    this.defaultTimeout = API_TIMEOUT.DEFAULT;
  }

  /**
   * Get auth token from storage
   * This will be called by userStore when available
   */
  private getAuthToken(): string | null {
    // Token will be injected dynamically
    // For now, return null - will be set by userStore
    return null;
  }

  /**
   * Make HTTP request to CloudBase function
   */
  private async request<T>(
    functionName: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      headers = {},
      retries = 1,
    } = options;

    // Build headers
    const authToken = this.getAuthToken();
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    // Build request URL
    // CloudBase HTTP Service format: https://{env-id}.{region}.app.tcloudbase.com/{function-name}
    const url = `${this.baseUrl}/${functionName}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`[API Request] ${method} ${url}`, { data, headers: requestHeaders });

      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[API Response] Status: ${response.status} ${response.statusText}`);

      // Parse response
      let responseData;
      try {
        responseData = await response.json();
        console.log('[API Response Data]', responseData);
      } catch (parseError) {
        console.error('[API Parse Error]', parseError);
        return {
          success: false,
          error: `Failed to parse response: ${response.statusText}`,
          code: 'PARSE_ERROR',
        };
      }

      // Check if response is successful
      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || responseData.message || ERROR_MESSAGES.SERVER_ERROR,
          code: responseData.code || 'SERVER_ERROR',
        };
      }

      return {
        success: true,
        data: responseData.data || responseData,
      };

    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('[API Error]', error);

      // Handle different error types
      if (error.name === 'AbortError') {
        // Retry on timeout if retries available
        if (retries > 0) {
          console.log(`[API Retry] Retrying ${functionName}, attempts left: ${retries - 1}`);
          return this.request(functionName, method, data, {
            ...options,
            retries: retries - 1
          });
        }
        return {
          success: false,
          error: ERROR_MESSAGES.TIMEOUT_ERROR,
          code: 'TIMEOUT',
        };
      }

      if (!navigator.onLine) {
        return {
          success: false,
          error: ERROR_MESSAGES.NETWORK_ERROR,
          code: 'NETWORK_ERROR',
        };
      }

      // Generic error
      return {
        success: false,
        error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * POST request
   */
  async post<T>(functionName: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(functionName, 'POST', data, options);
  }

  /**
   * GET request
   */
  async get<T>(functionName: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(functionName, 'GET', undefined, options);
  }

  /**
   * PUT request
   */
  async put<T>(functionName: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(functionName, 'PUT', data, options);
  }

  /**
   * DELETE request
   */
  async delete<T>(functionName: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(functionName, 'DELETE', undefined, options);
  }

  /**
   * Set auth token (called by userStore after login)
   */
  setAuthToken(token: string | null) {
    // This method allows userStore to inject the token
    // We'll use a closure pattern to store it
    this.getAuthToken = () => token;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
// export { ApiResponse, RequestOptions };
