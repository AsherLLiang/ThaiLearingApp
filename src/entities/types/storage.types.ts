// src/entities/types/storage.types.ts

export interface StorageDownloadUrlRequest {
  action: 'getDownloadUrl';
  fileId: string;
  maxAge?: number;
}

export interface StorageBatchDownloadUrlRequest {
  action: 'batchGetDownloadUrls';
  fileIds: string[];
  maxAge?: number;
}

export interface StorageFileInfo {
  fileId: string;
  downloadUrl: string | null;
  status: 'success' | 'failed';
  error?: string | null;
}

export interface StorageDownloadUrlResponse {
  fileId: string;
  downloadUrl: string;
  maxAge: number;
  expiresAt: string;
}

export interface StorageBatchDownloadUrlResponse {
  files: StorageFileInfo[];
  summary: {
    total: number;
    success: number;
    failed: number;
  };
  maxAge: number;
  expiresAt: string;
}
