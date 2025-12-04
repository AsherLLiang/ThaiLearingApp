// src/utils/cloudFunctionAdapter.ts
import { apiClient } from '@/src/utils/apiClient';
import type { ApiResponse } from '@/src/entities/types/api.types';

/**
 * 调用 Learn‑Vocab 云函数的统一入口
 *
 * @param action   云函数需要的业务标识（如 'getTodayMemories'、'submitMemoryResult' 等）
 * @param data    业务请求的实际参数对象（会被包装在 { action, data } 中发送）
 *
 * @returns        按照后端统一返回结构的 `ApiResponse<T>`，其中 `T` 为业务层期望的 data 类型
 *
 * @example
 * const result = await callCloudFunction<TodayMemoriesResponse>('getTodayMemories', {
 *   userId: 'u123',
 *   entityType: 'letter',
 *   limit: 10,
 * });
 *
 * if (result.success) {
 *   // 正常业务处理
 * } else {
 *   // 根据 result.errorCode 做错误分支
 * }
 */
export interface CloudFunctionOptions {
    /**
     * 云函数的 HTTP 触发路径，默认值为 '/learn-vocab'。
     * 若项目中存在其他云函数（如 '/learn-sentence'），请在调用时显式传入。
     */
    endpoint?: string;
}

/**
 * 通用云函数调用工具，适用于所有基于 `action` 参数的 CloudBase 云函数。
 *
 * @param action   云函数内部业务标识，例如 'getTodayMemories'、'submitMemoryResult'、'learnSentence' 等。
 * @param data     业务请求参数对象，会被包装在 `{ action, data }` 中发送。
 * @param options  可选配置，当前仅支持自定义云函数入口路径（默认 '/learn-vocab'）。
 *
 * @returns        按后端统一返回结构的 `ApiResponse<T>`，其中 `T` 为业务层期望的 data 类型。
 */
export async function callCloudFunction<T>(
    action: string,
    data: Record<string, any>,
    options?: CloudFunctionOptions
): Promise<ApiResponse<T>> {
    // 默认使用 learn‑vocab 云函数入口
    const endpoint = options?.endpoint ?? '/learn-vocab';

    try {
        // 统一的请求体结构：{ action, data }
        const response = await apiClient.post<T>(endpoint, {
            action,
            data,
        });

        // 直接返回后端的标准结构，调用方只需要判断 `success`
        return response;
    } catch (err: any) {
        // 网络/异常错误统一包装成后端约定的结构，方便上层统一处理
        console.error(`❌ CloudFunction "${action}" 调用异常:`, err);

        return {
            success: false,
            error: err?.message ?? '网络请求异常',
            code: err?.code ?? 'NETWORK_ERROR',
            // @ts-ignore – 当请求失败时没有 data，保持类型兼容
            data: undefined,
        };
    }
}