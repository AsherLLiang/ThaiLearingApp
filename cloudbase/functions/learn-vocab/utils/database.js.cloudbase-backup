/**
 * 数据库模块
 * 
 * CloudBase 初始化和集合引用
 * 与前端 backend.config.ts 配置对应
 */

'use strict';

const tcb = require('@cloudbase/node-sdk');
const { COLLECTIONS } = require('./constants');

// ==================== CloudBase 配置 ====================
// 对应前端 BACKEND_CONFIG.cloudbase
const CLOUDBASE_CONFIG = {
  env: process.env.TCB_ENV || 'cloud1-1gjcyrdd7ab927c6',
  region: 'ap-shanghai',
};

// ==================== CloudBase 初始化 ====================
const app = tcb.init({
  env: CLOUDBASE_CONFIG.env,
});

const db = app.database();
const _ = db.command;

// ==================== 集合引用 ====================
// 使用 COLLECTIONS 常量，避免硬编码
const collections = {
  users: db.collection(COLLECTIONS.USERS),
  vocabulary: db.collection(COLLECTIONS.VOCABULARY),
  progress: db.collection(COLLECTIONS.USER_VOCABULARY_PROGRESS),
};

// ==================== 导出 ====================
module.exports = {
  // CloudBase 实例
  app,
  db,
  _,
  
  // 集合引用 (推荐使用)
  userCollection: collections.users,
  vocabularyCollection: collections.vocabulary,
  progressCollection: collections.progress,
  
  // 配置信息 (调试用)
  CLOUDBASE_CONFIG,
};
