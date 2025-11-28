# ThaiLearningApp 项目技术文档

## 执行摘要

ThaiLearningApp 是一个基于 React Native + Expo 的泰语学习移动应用，采用现代化的技术栈和云原生架构。项目当前处于 MVP 开发阶段（完成度约40%），版本 1.0.1，最后更新于 2025-11-26。

### 项目概览
- **技术栈**: React Native, Expo, TypeScript, Zustand, CloudBase
- **架构模式**: 移动端MVVM + 云函数后端
- **部署平台**: 腾讯云 CloudBase (云开发)
- **开发状态**: MVP 40% 完成

## 架构概述

### 系统边界
ThaiLearningApp 采用前后端分离架构：
- **前端**: Expo + React Native 移动应用
- **后端**: CloudBase 云函数 + 云数据库
- **认证**: 基于 JWT 的自定义认证系统

### 核心组件交互
```
移动应用 (Expo) → API客户端 → CloudBase云函数 → 云数据库
     ↓
状态管理 (Zustand) ← 本地存储
```

## 项目结构分析

### 目录架构
```
ThaiLearningApp/
├── app/                    # Expo Router 应用页面
│   ├── (auth)/            # 认证相关页面
│   ├── (tabs)/            # 主标签页
│   └── _layout.tsx        # 根布局
├── src/
│   ├── components/        # 可复用组件
│   ├── stores/           # 状态管理
│   ├── services/         # 业务服务
│   ├── utils/            # 工具函数
│   └── types/            # 类型定义
├── cloudbase/            # 云开发配置和函数
└── assets/               # 静态资源
```

## 设计决策与架构选择

### 1. 框架选择理由
**Expo + React Native**:
- 跨平台开发效率高
- 丰富的生态系统和插件
- 简化了原生模块集成
- 支持 OTA 更新

**TypeScript**:
- 类型安全，减少运行时错误
- 更好的开发体验和代码维护
- 与 React Native 生态良好集成

### 2. 状态管理方案
**Zustand** 被选为状态管理库，原因：
- 轻量级，API 简洁
- 类型安全支持优秀
- 无需复杂的样板代码
- 性能优秀，支持中间件

### 3. 后端架构
**CloudBase 云开发**:
- 免运维，快速部署
- 集成认证、数据库、存储
- 按量计费，成本可控
- 支持云函数和 HTTP 触发器

## 核心组件详解

### 1. 应用布局系统

#### 根布局 (`app/_layout.tsx`)
- 实现认证守卫逻辑
- 加载自定义字体
- 设置全局主题和样式
- 管理应用导航状态

#### 认证布局 (`app/(auth)/_layout.tsx`)
- 处理认证流程重定向
- 提供统一的认证页面样式
- 集成登录状态检查

#### 标签页布局 (`app/(tabs)/_layout.tsx`)
- 自定义底部标签栏
- 三标签结构：首页、学习、个人中心
- 集成 Expo Router 导航

### 2. 状态管理架构

#### 用户状态存储 (`src/stores/userStore.ts`)
```typescript
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  register: (userData: RegisterData) => Promise<void>;
  login: (credentials: LoginData) => Promise<void>;
  logout: () => void;
}
```

**设计特点**:
- 使用 `persist` 中间件实现状态持久化
- 集成 API 调用和错误处理
- 类型安全的操作定义

#### 学习状态存储 (`src/stores/learningStore.ts`)
- 管理学习进度和课程状态
- 跟踪用户学习行为
- 支持离线学习数据同步

### 3. 服务层架构

#### API 客户端 (`src/utils/apiClient.ts`)
**核心功能**:
- 统一的 HTTP 请求处理
- 自动错误重试机制
- 请求/响应拦截器
- JWT 令牌管理

**技术实现**:
- 基于 Axios 的封装
- 支持超时配置和取消请求
- 类型安全的请求/响应处理

#### 用户服务 (`src/services/UserService.ts`)
- 封装所有用户相关 API 调用
- 处理用户注册、登录、资料更新
- 集成 CloudBase 云函数通信

### 4. 云函数架构

#### 当前部署的云函数
- `user-register`: 用户注册
- `user-login`: 用户登录  
- `user-reset-password`: 密码重置
- `user-update-profile`: 资料更新

#### 云开发配置
- **环境ID**: `cloud1-1gjcyrdd7ab927c6`
- **区域**: `ap-shanghai` (上海)
- **运行时**: Node.js 16.13

## 数据模型设计

### 用户实体
```typescript
interface User {
  id: string;
  email: string;
  username: string;
  profile?: UserProfile;
  learningProgress: LearningProgress;
}

interface UserProfile {
  avatar?: string;
  level: LanguageLevel;
  dailyGoal: number;
}
```

### 学习进度模型
- 课程完成状态跟踪
- 学习时间统计
- 成就系统集成
- 复习计划管理

## 集成点与外部依赖

### 1. CloudBase 集成
- **认证**: 自定义 JWT 认证流程
- **数据库**: CloudBase 云数据库
- **存储**: 云存储用于媒体文件
- **云函数**: 业务逻辑后端

### 2. 第三方服务
- **字体**: 自定义字体加载
- **图标**: 自适应图标系统
- **国际化**: i18n 多语言支持

### 3. 开发工具链
- **构建工具**: Expo CLI
- **包管理**: npm
- **代码质量**: TypeScript, ESLint
- **样式**: Tailwind CSS

## 部署架构

### 移动应用部署
- **开发**: Expo Go 开发客户端
- **测试**: Expo 开发服务器
- **生产**: Expo Application Services (EAS)

### 后端服务部署
- **平台**: 腾讯云 CloudBase
- **区域**: 上海
- **运行时**: Node.js 16.13
- **触发器**: HTTP 触发器

## 性能特性

### 优化措施
1. **代码分割**: Expo Router 自动路由分割
2. **图片优化**: 自适应图标和图片压缩
3. **状态持久化**: Zustand 状态自动保存
4. **API 缓存**: 请求结果缓存机制

### 已知瓶颈
- 云函数冷启动延迟
- 大文件上传性能
- 离线学习数据同步

## 安全模型

### 认证授权
- JWT 基于令牌的认证
- 令牌自动刷新机制
- 密码哈希存储
- 会话超时控制

### 数据保护
- HTTPS 端到端加密
- 用户数据隔离
- 输入验证和清理
- SQL 注入防护

## 开发工作流

### 开发环境设置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 部署云函数
cloudbase functions:deploy --all
```

### 构建和测试
- **开发构建**: `expo build`
- **生产构建**: `eas build`
- **测试运行**: `npm test`

## 故障排除指南

### 常见问题
1. **云函数部署失败**: 检查 Node.js 版本兼容性
2. **认证错误**: 验证 JWT 令牌配置
3. **构建错误**: 清理缓存重新构建
4. **网络问题**: 检查 CloudBase 环境配置

### 调试技巧
- 使用 Expo Dev Tools 进行远程调试
- 查看 CloudBase 日志监控云函数执行
- 利用 React Native Debugger 进行状态调试

## 当前开发进度 (MVP 40% 完成)

### 已完成功能模块
- [x] **认证系统** (100%)
  - 用户注册/登录界面
  - 密码重置流程
  - JWT 令牌管理
  - 状态持久化
- [x] **基础架构** (100%)
  - 项目脚手架搭建
  - 路由系统配置
  - 状态管理集成
  - API 客户端封装
- [x] **UI 组件** (40%)
  - 认证页面布局
  - 标签栏导航
  - 基础样式系统
- [ ] **学习功能** (0%)
  - 课程展示
  - 学习进度跟踪
  - 练习系统
- [ ] **用户资料** (10%)
  - 基础资料展示
  - 设置页面

### 代码实现状态

#### 认证流程 (已实现)
```typescript
// 注册流程完整实现
const registerFlow = async (userData: RegisterData) => {
  // 1. 表单验证
  const validation = validateRegistrationForm(userData);
  // 2. API 调用
  const result = await UserService.register(userData);
  // 3. 状态更新
  userStore.getState().register(result);
  // 4. 导航跳转
  router.replace('/(tabs)');
};
```

#### API 集成状态
- ✅ 用户认证相关 API
- ✅ CloudBase 环境配置
- ⏳ 学习数据 API
- ⏳ 进度同步 API

#### 待开发功能清单

### 核心学习功能 (优先级: 高)
1. **课程列表页面**
   - 课程卡片组件
   - 分类筛选功能
   - 进度状态显示

2. **学习页面**
   - 课程内容展示
   - 交互式练习
   - 语音播放控制

3. **进度跟踪**
   - 学习数据记录
   - 成就系统
   - 统计图表

### 用户功能 (优先级: 中)
4. **个人中心**
   - 用户资料编辑
   - 学习统计展示
   - 设置页面

5. **复习系统**
   - 错题本功能
   - 智能复习计划
   - 记忆曲线算法

### 高级功能 (优先级: 低)
6. **社交功能**
   - 好友系统
   - 学习排行榜
   - 成就分享

7. **AI 功能**
   - 个性化推荐
   - 智能难度调整
   - 语音识别

## 具体实现指南

### 1. 课程列表页面实现
**文件位置**: `app/(tabs)/courses.tsx`
**依赖组件**: 
- `src/components/learning/CourseCard.tsx`
- `src/stores/learningStore.ts`

**核心逻辑**:
```typescript
// 需要实现的数据结构
interface Course {
  id: string;
  title: string;
  description: string;
  level: LanguageLevel;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail?: string;
}

// 需要实现的 API 调用
const fetchCourses = async (): Promise<Course[]> => {
  return await apiClient.get<Course[]>('/courses');
};
```

### 2. 学习页面实现
**文件位置**: `app/learning/[courseId].tsx`
**功能要点**:
- 课程内容分页显示
- 练习题目交互
- 进度自动保存
- 语音播放集成

### 3. 状态管理扩展
**需要扩展的 store**: `src/stores/learningStore.ts`
```typescript
interface LearningState {
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  progress: Record<string, LessonProgress>;
  // 需要实现的方法
  startCourse: (courseId: string) => void;
  completeLesson: (lessonId: string) => void;
  updateProgress: (progress: Partial<LessonProgress>) => void;
}
```

### 4. 云函数扩展
**需要新增的云函数**:
- `get-courses`: 获取课程列表
- `get-lesson`: 获取课程内容
- `update-progress`: 更新学习进度
- `get-statistics`: 获取学习统计

## 技术债务与优化点

### 代码质量
- [ ] 增加单元测试覆盖
- [ ] 集成 E2E 测试
- [ ] 代码分割优化
- [ ] 性能监控集成

### 用户体验
- [ ] 加载状态优化
- [ ] 错误边界处理
- [ ] 离线功能支持
- [ ] 动画效果增强

### 架构改进
- [ ] 数据缓存策略
- [ ] 图片懒加载
- [ ] 代码分割按需加载
- [ ] 包体积优化

## 演进路线图

### 短期目标 (MVP - 未来2周)
- [ ] 完成核心学习功能 (课程列表、学习页面)
- [ ] 实现用户进度跟踪
- [ ] 部署生产环境
- [ ] 基础测试覆盖

### 中期规划 (1-3个月)
- [ ] 语音识别集成
- [ ] 社交功能
- [ ] 高级分析
- [ ] 多平台支持

### 长期愿景 (6个月+)
- [ ] AI 个性化学习
- [ ] 虚拟教室
- [ ] 企业版功能
- [ ] 国际化扩展

## 关键代码示例

### 认证流程核心代码
```typescript
// src/stores/userStore.ts 中的注册方法
register: async (userData: RegisterData) => {
  try {
    set({ isLoading: true, error: null });
    const response = await UserService.register(userData);
    
    if (response.success && response.data) {
      set({ 
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false 
      });
      // 保存 token 到 API 客户端
      apiClient.setAuthToken(response.data.token);
    } else {
      throw new Error(response.message || '注册失败');
    }
  } catch (error) {
    set({ 
      error: error instanceof Error ? error.message : '注册失败',
      isLoading: false 
    });
    throw error;
  }
}
```

### API 客户端配置
```typescript
// src/utils/apiClient.ts 核心请求方法
async request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
  const config: AxiosRequestConfig = {
    method: options.method,
    url: options.url,
    data: options.data,
    params: options.params,
    timeout: this.timeout,
    headers: {
      'Content-Type': 'application/json',
      ...(this.authToken && { 'Authorization': `Bearer ${this.authToken}` }),
      ...options.headers,
    },
  };

  try {
    const response = await this.axiosInstance.request(config);
    return {
      success: true,
      data: response.data,
      message: '请求成功',
    };
  } catch (error) {
    return this.handleError(error);
  }
}
```

### 页面路由配置
```typescript
// app/(tabs)/_layout.tsx 标签栏配置
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: '学习',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

## 开发规范与约定

### 代码风格指南
1. **组件命名**: PascalCase，与文件名称一致
2. **函数命名**: camelCase，动词开头
3. **变量命名**: 描述性名称，避免缩写
4. **文件组织**: 按功能模块划分，每个模块包含组件、样式、类型

### 状态管理原则
- 使用 Zustand 进行全局状态管理
- 局部状态使用 useState/useReducer
- 异步操作使用 async/await 配合错误处理
- 状态更新遵循不可变原则

### API 设计规范
- 所有 API 调用通过 apiClient 统一处理
- 错误处理在服务层统一封装
- 响应数据格式标准化
- 请求参数类型安全

## 附录

### A. 技术栈版本
- React Native: 最新稳定版
- Expo SDK: 50+
- TypeScript: 5.0+
- Node.js: 16.13 (CloudBase)
- Zustand: 4.4.1
- Axios: 1.5.0

### B. 项目配置参考
- `package.json`: 项目依赖和脚本
- `app.json`: Expo 应用配置
- `cloudbase/cloudbaserc.json`: 云开发环境配置
- `babel.config.js`: Babel 转译配置
- `tailwind.config.js`: 样式配置

### C. 关键文件路径
- 状态管理: `src/stores/`
- 业务服务: `src/services/`
- 工具函数: `src/utils/`
- 类型定义: `src/types/`
- 页面组件: `app/`
- 云函数: `cloudbase/functions/`

### D. 相关文档
- [Expo 文档](https://docs.expo.dev/)
- [CloudBase 文档](https://cloud.tencent.com/document/product/876)
- [React Native 文档](https://reactnative.dev/docs/getting-started)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)

---

*本文档最后更新: 2025-11-26*  
*项目版本: 1.0.1*  
*文档版本: 2.0*  
*MVP 完成度: 30%*

---

*本文档最后更新: 2025-11-26*  
*项目版本: 1.0.1*  
*文档版本: 1.0.1*
