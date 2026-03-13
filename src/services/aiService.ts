// src/services/aiService.ts

import { callCloudFunction } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api.endpoints';
import type { ExplainVocabularyResponse } from '../entities/types/ai.types';
import type { ApiResponse } from '../entities/types/api.types';

/**
 * AI 服务封装类 (类似一个拨号器)
 * 作用：将复杂的网络请求打包，给前端页面直接调用
 */
export class AiService {
  /**
   * 呼叫云端的 explainVocab 动作，获取单词的 AI 解析
   * 
   * @param thaiWord 要查询的泰语单词 (例如: 'สวัสดี')
   * @param vocabularyId (可选) 单词的 ID，如果在系统词库中有的话
   * @param userId 目前用户的 ID
   * @returns 返回一个 Promise，里面装了符合规范的 ApiResponse
   */
  static async explainVocabulary(
    thaiWord: string,
    userId: string,
    language: string = 'zh', // 当前 UI 语言，用于让 AI 返回对应语言的内容
    vocabularyId?: string
  ): Promise<ApiResponse<ExplainVocabularyResponse>> {
    
    // 我们向谁打电话？向我们刚刚配好的 ai-engine 云端地址打。
    const endpoint = API_ENDPOINTS.AI.ENGINE;

    // 我们对云端说什么？我们说：
    // action: "帮我执行解释词汇的任务"
    // data: 包裹我们要查的词语
    try {
      const response = await callCloudFunction<ExplainVocabularyResponse>(
        'explainVocab',  // 这必须和云端 index.js 里的 case 名字一模一样
        {
          userId,
          thaiWord,
          vocabularyId,
          language,             // 将语言传将给云端，让 AI 返回正确语言的解析
          appSecret: 'ThaiApp_2026_Secure' // ✅ 初级防御：我们给云端发送一个约定好的暗号
        },
        { endpoint }
      );

      return response;
    } catch (error: any) {
      // 兜底保护：如果手机断网等极端情况，保证程序不崩
      return {
        success: false,
        error: error.message || '查询 AI 失败',
        code: 'AI_SERVICE_ERROR'
      };
    }
  }
}
