# 配置与 API 指南

本文档详细介绍了 Thai Learning App 的配置管理和 API 结构 (v1.0.2 新增)。

---

## 为什么需要配置中心？

在 v1.0.2 版本中，我们引入了 `src/config/` 目录来集中管理应用的所有配置。

**主要好处：**
1.  **单一事实来源**：避免硬编码值散落在代码各处。
2.  **类型安全**：所有配置都使用 TypeScript 强类型定义。
3.  **易于维护**：修改一个值（如 API 超时时间）即可全局生效。
4.  **环境隔离**：便于未来区分开发、测试和生产环境。

---

## 目录结构

所有配置文件都位于 `src/config/` 目录下：

```
src/config/
├── constants.ts        # 应用级常量 (集合名, 超时, 错误信息)
├── api.endpoints.ts    # API 端点 URL 定义
└── backend.config.ts   # 后端服务配置 (CloudBase)
```

---

## 1. 应用常量 (`constants.ts`)

**文件**: `src/config/constants.ts`

此文件包含不随环境变化的静态常量。

### 核心模块

#### 数据库集合
用于 CloudBase 数据库操作，避免拼写错误。
```typescript
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  // ...
};
```

#### API 超时
统一管理网络请求的超时时间。
```typescript
export const API_TIMEOUT = {
  DEFAULT: 10000,   // 10秒 - 普通请求
  UPLOAD: 30000,    // 30秒 - 文件上传
  LONG: 60000,      // 60秒 - 长任务
};
```

#### 业务常量
包括用户角色、学习等级等业务逻辑常量。
```typescript
export const USER_ROLES = {
  LEARNER: 'LEARNER',
  ADMIN: 'ADMIN',
};

export const LEVELS = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  // ...
};
```

### 使用示例

```typescript
import { COLLECTIONS, API_TIMEOUT } from '@/src/config/constants';

// 在 API 调用中使用
const result = await db.collection(COLLECTIONS.USERS)
  .where({ ... })
  .get();

// 设置超时
setTimeout(() => { ... }, API_TIMEOUT.DEFAULT);
```

---

## 2. API 端点 (`api.endpoints.ts`)

**文件**: `src/config/api.endpoints.ts`

此文件定义了所有后端 API 的路径。它通常结合环境变量 `EXPO_PUBLIC_API_BASE_URL` 使用。

### 结构

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/user-login',
    REGISTER: '/user-register',
    RESET_PASSWORD: '/user-reset-password',
  },
  COURSE: {
    LIST: '/course-list',
    DETAIL: '/course-detail',
  },
  // ...
};
```

### 使用示例

```typescript
import { API_ENDPOINTS } from '@/src/config/api.endpoints';

// 构建完整 URL
const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`;

// 发起请求
const response = await fetch(url, { ... });
```

---

## 3. 后端配置 (`backend.config.ts`)

**文件**: `src/config/backend.config.ts`

此文件包含连接后端服务所需的配置信息，主要是腾讯云开发 (CloudBase) 的配置。

### 内容

```typescript
export const CLOUDBASE_CONFIG = {
  env: 'cloud1-1gjcyrdd7ab927c6', // 环境 ID
  region: 'ap-shanghai',          // 地域
  // ...
};
```

### 使用示例

```typescript
import cloudbase from '@cloudbase/js-sdk';
import { CLOUDBASE_CONFIG } from '@/src/config/backend.config';

// 初始化 CloudBase
const app = cloudbase.init({
  env: CLOUDBASE_CONFIG.env,
  region: CLOUDBASE_CONFIG.region,
});
```

---

## 最佳实践

### ✅ 推荐做法
1.  **始终导入常量**：不要在代码中手写字符串（如 `'users'`），始终使用 `COLLECTIONS.USERS`。
2.  **分类管理**：如果添加新类型的常量（例如“成就系统”），请在 `constants.ts` 中创建一个新的导出对象（例如 `ACHIEVEMENTS`）。
3.  **大写命名**：常量名使用全大写蛇形命名法（如 `MAX_RETRY_COUNT`）。

### ❌ 避免做法
1.  **硬编码 URL**：不要在组件中直接写 `/user-login`。
2.  **混合逻辑**：配置文件应只包含数据，不应包含复杂的业务逻辑函数。
3.  **敏感信息**：**绝对不要**将私钥、密码或 Secret ID 放入这些文件中。敏感信息应使用环境变量或后端存储。

---

## 如何扩展

### 添加新常量
1. 打开 `src/config/constants.ts`。
2. 在现有对象中添加键值对，或导出新的常量对象。
3. 保存文件，TypeScript 会自动更新类型提示。

### 添加新 API
1. 打开 `src/config/api.endpoints.ts`。
2. 在 `API_ENDPOINTS` 对象下的合适分类中添加新路径。
3. 如果是新模块，可以创建一个新的嵌套对象。

---

**版本历史**
- v1.0.2: 初始创建，集中了分散的常量和配置。
