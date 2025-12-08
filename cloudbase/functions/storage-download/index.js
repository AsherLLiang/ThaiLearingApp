// functions/storage-download/index.js
'use strict';

const cloud = require('wx-server-sdk');
const { createResponse } = require('../shared/response'); // 复用已有工具

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

/**
 * HTTP 入口
 * event.body 可能是 string / object
 */
exports.main = async (event, context) => {
  let body;

  try {
    body =
      typeof event.body === 'string'
        ? JSON.parse(event.body)
        : event.body || {};
  } catch (err) {
    console.error('[storage-download] 解析 body 失败:', err);
    return createResponse(false, null, '请求体解析失败', 'PARSE_ERROR');
  }

  const { action } = body || {};
  if (!action) {
    return createResponse(false, null, '缺少 action 参数', 'MISSING_ACTION');
  }

  try {
    switch (action) {
      case 'getDownloadUrl':
        return await getDownloadUrl(body);
      case 'batchGetDownloadUrls':
        return await batchGetDownloadUrls(body);
      default:
        return createResponse(
          false,
          null,
          `不支持的操作: ${action}`,
          'UNSUPPORTED_ACTION',
        );
    }
  } catch (error) {
    console.error('[storage-download] 未捕获错误:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
};

/**
 * 单文件：获取临时下载链接
 * data.fileId 需是 CloudBase 的 fileID（cloud:// 开头）
 */
async function getDownloadUrl(data) {
  const { fileId, maxAge = 7200 } = data || {};

  if (!fileId) {
    return createResponse(false, null, '缺少 fileId 参数', 'INVALID_PARAMS');
  }

  try {
    const result = await cloud.getTempFileURL({
      fileList: [fileId],
      maxAge,
    });

    if (!result.fileList || result.fileList.length === 0) {
      return createResponse(false, null, '文件不存在', 'FILE_NOT_FOUND');
    }

    const fileInfo = result.fileList[0];

    if (fileInfo.status !== 0) {
      return createResponse(
        false,
        null,
        fileInfo.errmsg || '获取下载链接失败',
        'DOWNLOAD_URL_ERROR',
      );
    }

    const now = Date.now();
    return createResponse(
      true,
      {
        fileId: fileInfo.fileID,
        downloadUrl: fileInfo.tempFileURL,
        maxAge,
        expiresAt: new Date(now + maxAge * 1000).toISOString(),
      },
      '获取下载链接成功',
    );
  } catch (error) {
    console.error('[getDownloadUrl] error:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}

/**
 * 批量：获取临时下载链接（最多 50 个）
 */
async function batchGetDownloadUrls(data) {
  const { fileIds, maxAge = 7200 } = data || {};

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return createResponse(
      false,
      null,
      'fileIds 必须是非空数组',
      'INVALID_PARAMS',
    );
  }

  if (fileIds.length > 50) {
    return createResponse(
      false,
      null,
      '单次最多支持 50 个文件',
      'TOO_MANY_FILES',
    );
  }

  try {
    const result = await cloud.getTempFileURL({
      fileList: fileIds,
      maxAge,
    });

    const files = (result.fileList || []).map((f) => ({
      fileId: f.fileID,
      downloadUrl: f.status === 0 ? f.tempFileURL : null,
      status: f.status === 0 ? 'success' : 'failed',
      error: f.status === 0 ? null : f.errmsg,
    }));

    const success = files.filter((f) => f.status === 'success').length;
    const now = Date.now();

    return createResponse(
      true,
      {
        files,
        summary: {
          total: files.length,
          success,
          failed: files.length - success,
        },
        maxAge,
        expiresAt: new Date(now + maxAge * 1000).toISOString(),
      },
      `获取 ${success}/${files.length} 个文件下载链接成功`,
    );
  } catch (error) {
    console.error('[batchGetDownloadUrls] error:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}
