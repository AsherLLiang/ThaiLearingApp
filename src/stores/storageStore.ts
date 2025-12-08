// src/stores/storageStore.ts

import { create } from 'zustand';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import type {
  StorageDownloadUrlResponse,
  StorageBatchDownloadUrlResponse,
} from '@/src/entities/types/storage.types';

interface StorageStoreState {
  isLoading: boolean;
  error: string | null;

  getDownloadUrl: (fileId: string, maxAge?: number) => Promise<string | null>;
  batchGetDownloadUrls: (
    fileIds: string[],
    maxAge?: number,
  ) => Promise<StorageBatchDownloadUrlResponse | null>;
  clearError: () => void;
}

export const useStorageStore = create<StorageStoreState>((set, get) => ({
  isLoading: false,
  error: null,

  getDownloadUrl: async (fileId: string, maxAge: number = 7200) => {
    set({ isLoading: true, error: null });
    try {
      const res = await callCloudFunction<StorageDownloadUrlResponse>(
        'getDownloadUrl',
        {
          action: 'getDownloadUrl',
          fileId,
          maxAge,
        },
        {
          endpoint: API_ENDPOINTS.STORAGE.GET_DOWNLOAD_URL.cloudbase,
        },
      );

      if (!res.success || !res.data) {
        throw new Error(res.error ?? '获取下载链接失败');
      }

      set({ isLoading: false });
      return res.data.downloadUrl;
    } catch (e: any) {
      console.error('[storageStore.getDownloadUrl] error:', e);
      set({ isLoading: false, error: e?.message ?? '获取下载链接失败' });
      return null;
    }
  },

  batchGetDownloadUrls: async (
    fileIds: string[],
    maxAge: number = 7200,
  ) => {
    set({ isLoading: true, error: null });

    if (fileIds.length > 50) {
      set({
        isLoading: false,
        error: '单次最多支持 50 个文件',
      });
      return null;
    }

    try {
      const res = await callCloudFunction<StorageBatchDownloadUrlResponse>(
        'batchGetDownloadUrls',
        {
          action: 'batchGetDownloadUrls',
          fileIds,
          maxAge,
        },
        {
          endpoint: API_ENDPOINTS.STORAGE.BATCH_GET_DOWNLOAD_URLS.cloudbase,
        },
      );

      if (!res.success || !res.data) {
        throw new Error(res.error ?? '批量获取下载链接失败');
      }

      set({ isLoading: false });
      return res.data;
    } catch (e: any) {
      console.error('[storageStore.batchGetDownloadUrls] error:', e);
      set({ isLoading: false, error: e?.message ?? '批量获取下载链接失败' });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
