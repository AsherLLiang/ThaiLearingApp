# 🇹🇭 ThaiLearningApp - 泰语学习应用

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.76.9-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-~52.0.38-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-3178c6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

一款优雅的泰语学习应用，采用间隔重复算法，提供沉浸式的学习体验。

[功能特性](#-功能特性) • [技术栈](#-技术栈) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [开发指南](#-开发指南)

</div>

---

## 📸 应用截图

<div align="center">
  <img src="./docs/screenshots/home.png" width="250" alt="首页" />
  <img src="./docs/screenshots/learning.png" width="250" alt="学习页面" />
  <img src="./docs/screenshots/review.png" width="250" alt="复习页面" />
</div>

## ✨ 功能特性

### 🎯 核心功能
- **统一学习会话**: 复习旧词 + 学习新词的完整学习流程
- **间隔重复算法**: 基于记忆曲线的智能复习系统（每个单词重复3次）
- **三级评估系统**: 认识/模糊/忘记了 - 精准记录学习状态
- **跳过复习**: 灵活的学习节奏控制

### 🌍 国际化支持
- **多语言界面**: 完整支持中文/English
- **自动语言检测**: 根据设备语言自动切换
- **持久化偏好**: 记住用户的语言选择

### 🎨 UI/UX 设计
- **泰国风格主题**: 金色 (#D4AF37) + 墨色 (#1A1A1A) 优雅配色
- **模糊遮罩效果**: 渐进式信息展示，增强学习体验
- **流畅动画**: 使用 `expo-blur` 和 `react-native-reanimated`
- **响应式布局**: 适配各种屏幕尺寸

### 📚 学习功能
- **新词学习**: 
  - 三个标签页：基础释义、例句示例、用法详解
  - 音频发音按钮（准备接入）
  - 渐进式内容展示
- **单词复习**:
  - 上下文例句展示
  - 三按钮快速评估
  - 即时反馈

### 📊 进度追踪
- 学习天数统计
- 学习时长记录
- 掌握单词数量
- 连续打卡天数

## 🛠 技术栈

### 前端框架
- **React Native** 0.76.9 - 跨平台移动应用框架
- **Expo** ~52.0.38 - 开发工具链
- **Expo Router** ~4.0.20 - 文件系统路由
- **TypeScript** 5.1.3 - 类型安全

### UI 组件
- **expo-blur** - 模糊效果
- **lucide-react-native** - 图标库
- **react-native-svg** - SVG 支持
- **expo-linear-gradient** - 渐变效果

### 状态管理 & 数据
- **Zustand** 5.0.8 - 轻量级状态管理
- **i18next** 25.6.3 - 国际化
- **react-i18next** 16.3.4 - React 国际化绑定
- **AsyncStorage** - 本地存储

### 字体
- **Playfair Display** - 英文标题
- **Noto Serif SC** - 中文正文
- **Sarabun** - 泰文专用

### 后端准备
- **Tencent CloudBase** - 云开发平台（准备接入）
- **Axios** - HTTP 客户端

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- npm 或 yarn
- iOS Simulator (macOS) 或 Android Emulator

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/ThaiLearningApp.git
cd ThaiLearningApp
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm start
```

4. **运行应用**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### 环境变量配置

创建 `.env` 文件：
```env
EXPO_PUBLIC_CLOUDBASE_ENV_ID=your_cloudbase_env_id
EXPO_PUBLIC_API_BASE_URL=your_api_base_url
```

## 📁 项目结构

```
ThaiLearningApp/
├── app/                          # Expo Router 页面
│   ├── (auth)/                   # 认证模块
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # 主导航
│   │   ├── index.tsx             # 首页
│   │   ├── courses.tsx           # 课程列表
│   │   └── profile.tsx           # 个人中心
│   ├── learning/                 # 学习模块
│   │   └── index.tsx             # 统一学习会话
│   └── _layout.tsx               # 根布局
├── src/
│   ├── components/               # 组件库
│   │   ├── common/               # 通用组件
│   │   ├── learning/             # 学习组件
│   │   │   ├── NewWordView.tsx   # 新词学习
│   │   │   └── ReviewWordView.tsx # 复习视图
│   │   ├── progress/             # 进度组件
│   │   └── pronunciation/        # 发音组件
│   ├── constants/                # 常量定义
│   │   ├── colors.ts             # 颜色系统
│   │   └── typography.ts         # 字体系统
│   ├── i18n/                     # 国际化
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── zh.ts             # 中文
│   │       └── en.ts             # 英文
│   ├── stores/                   # Zustand 状态
│   │   ├── authStore.ts
│   │   ├── languageStore.ts
│   │   └── learningStore.ts
│   ├── entities/                 # 类型定义
│   └── utils/                    # 工具函数
├── cloudbase/                    # 云开发
│   └── functions/                # 云函数
├── docs/                         # 文档
│   ├── project-snapshot-v5.md    # 项目快照
│   └── screenshots/              # 截图
└── assets/                       # 静态资源
```

## 🎨 设计系统

### 颜色规范
```typescript
Colors = {
  paper: '#FAF9F6',      // 背景色
  ink: '#1A1A1A',        // 主文本
  sand: '#E5E2DB',       // 边框
  taupe: '#8E8B82',      // 次要文本
  thaiGold: '#D4AF37',   // 强调色
  accent: '#B8956A',     // 辅助色
}
```

### 字体规范
- **标题**: Playfair Display (英文) / Noto Serif SC (中文)
- **正文**: Noto Serif SC
- **泰文**: Sarabun

### 组件规范
详见 [项目快照 v5](./docs/project-snapshot-v5.md)

## 💻 开发指南

### 添加新页面
使用 Expo Router 文件系统路由：
```bash
# 创建新页面
touch app/new-page.tsx
```

### 添加新组件
```bash
# 创建组件
touch src/components/MyComponent.tsx
```

### 国际化
1. 在 `src/i18n/locales/zh.ts` 和 `en.ts` 添加翻译键
2. 在组件中使用：
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <Text>{t('myKey')}</Text>;
};
```

### 状态管理
使用 Zustand：
```tsx
import { create } from 'zustand';

const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## � 后端接入

### 数据结构

#### 单词 (Word)
```typescript
interface WordData {
  id: string;
  thai: string;           // 泰文
  phonetic: string;       // 罗马音
  type: string;           // 词性
  meaning: string;        // 释义
  definitions: {
    basic: string;
    examples: { thai: string; meaning: string }[];
    usage: { /* ... */ };
  };
}
```

### API 接口

#### 获取学习队列
```typescript
GET /api/learning/queue
Response: {
  reviewWords: WordData[];
  newWords: WordData[];
}
```

#### 提交学习结果
```typescript
POST /api/learning/submit
Body: {
  wordId: string;
  quality: 'know' | 'unsure' | 'forgot';
  timestamp: number;
}
```

详细后端接入指南请参考 [项目快照 v5](./docs/project-snapshot-v5.md#后端接入指南)

## 📝 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 样式使用 StyleSheet.create()
- 所有用户可见文本必须国际化

### 命名规范
- 组件文件: `PascalCase.tsx`
- 工具文件: `camelCase.ts`
- 常量文件: `camelCase.ts`
- 样式名: `camelCase`

### Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

## 🗺 路线图

### v1.1 (计划中)
- [ ] 接入真实后端 API
- [ ] 实现音频播放功能
- [ ] 添加学习统计图表
- [ ] 实现离线缓存

### v1.2 (计划中)
- [ ] 实现 SM-2 间隔重复算法
- [ ] 添加单词收藏功能
- [ ] 实现学习提醒通知
- [ ] 添加社交分享功能

### v2.0 (规划中)
- [ ] AI 语音评测
- [ ] 个性化学习路径
- [ ] 社区互动功能
- [ ] 游戏化学习

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👥 团队

- **开发者**: Liang Jianyu
- **设计**: ThaiLearningApp Team

## 📧 联系方式

- 项目主页: [GitHub](https://github.com/yourusername/ThaiLearningApp)
- 问题反馈: [Issues](https://github.com/yourusername/ThaiLearningApp/issues)

## 🙏 致谢

- [Expo](https://expo.dev/) - 优秀的开发工具链
- [React Native](https://reactnative.dev/) - 强大的跨平台框架
- [Lucide Icons](https://lucide.dev/) - 精美的图标库
- 所有贡献者和支持者

---

<div align="center">

**[⬆ 回到顶部](#-thailearningapp---泰语学习应用)**

Made with ❤️ by ThaiLearningApp Team

</div>
