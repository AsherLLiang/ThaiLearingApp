# ThaiLearningApp

基于 **Expo / React Native** 的泰语学习应用：词汇学习、字母与发音、间隔复习、CloudBase 云函数后端，以及通过云函数调用的 AI 能力（释义、微阅读、TTS 等）。

> 项目协作与变更约束见仓库根目录的 `CLAUDE.md`。

## 技术栈（与当前 `package.json` 一致）

| 类别 | 说明 |
|------|------|
| 运行时 | Expo SDK **54**、React Native **0.81**、React **19** |
| 路由 | Expo Router **6** |
| 状态 | Zustand |
| 国际化 | i18next / react-i18next（中文 / English） |
| 网络 | Axios，经 `src/utils/apiClient.ts` 调用 CloudBase 云函数 |
| 其他 | expo-audio / expo-av、expo-notifee（提醒）、Reanimated、AsyncStorage 等 |

## 功能概览

- **主导航**：首页、课程、个人中心（`app/(tabs)/`）
- **认证**：登录、注册、忘记密码（`app/(auth)/`）
- **学习**：统一学习会话、每日上限、学习小结、提醒设置、文章练习与跟读、微阅读等（`app/learning/`）
- **字母模块**：字母课列表、单课学习、测试（`app/alphabet/`）
- **开发辅助路由**：`app/(dev)/`（本地调试页，勿当作生产入口）

业务类型与云端约定见 `src/config/api.endpoints.ts`；默认后端为 CloudBase（`src/config/backend.config.ts`）。

## 环境要求

- Node.js **≥ 18**（仓库含 `.nvmrc` 时可按该版本对齐）
- npm 或兼容包管理器
- iOS 模拟器（macOS）或 Android 模拟器 / 真机；可选 Web

## 本地运行

```bash
npm install
npm start
```

常用脚本：

```bash
npm run ios      # 原生 iOS（需已配置 Xcode / 预构建）
npm run android
npm run web
```

## 环境变量（勿提交真实密钥）

**不要将含真实 API Key 的 `.env` 提交到 Git。** 仓库根目录 `.gitignore` 已忽略 `.env`；本地请自行创建：

```bash
# 示例（键名以你本地实际为准，勿把真实 sk- 填入任何将提交的文档或脚本）
# EXPO_PUBLIC_DS_API_KEY=        # 若前端需直连需公钥前缀的变量，仅放非敏感或 Expo 公开前缀约定
# EXPO_PUBLIC_BACKEND=cloudbase
# EXPO_PUBLIC_CLOUDBASE_ENV=...
# EXPO_PUBLIC_API_BASE_URL=...
# EXPO_PUBLIC_JAVA_API_URL=...   # 切换 Java 后端时使用
```

云端 **DeepSeek / 其他 LLM、TTS、DashScope** 等密钥应在 **CloudBase 云函数环境变量** 中配置（例如 `cloudbase/functions/ai-engine` 使用的 `DEEPSEEK_API_KEY` 等），不要写进客户端 bundle。

本地仅调试云函数逻辑时，可在本机 shell 导出环境变量后运行测试脚本；**勿**在 `test.js` 等会入库的文件中硬编码 Key。

## 目录结构（精简）

```
app/                 # Expo Router 页面与布局
src/
  components/        # UI 组件（通用、课程、学习等）
  config/            # API 端点、后端与常量
  stores/            # Zustand
  services/          # 含 aiService 等对云函数的封装
  i18n/              # 文案
  entities/          # 类型与枚举
  utils/             # API 客户端、学习队列等
cloudbase/           # 云函数与 CloudBase 相关脚本
assets/              # 图标、启动图等（部分课程数据目录可能被 gitignore）
```

## 云开发与构建

- CloudBase 云函数与配置见 `cloudbase/` 目录及根目录 `cloudbaserc.json`（若存在）。
- EAS：`app.json` → `expo.extra.eas.projectId` 已与 Expo 项目关联；构建前请在本机登录 Expo 账号并按需配置 `eas.json`。

## 许可证

若仓库中包含 `LICENSE` 文件，以该文件为准；否则以项目所有者声明为准。
