# 前端壳层与展示模块规格说明（Frontend Shell & Navigation Spec, Freeze V2.0.1）

> 目录：`docs/project-freeze/frontend-shell-module-spec.md`  
> 范围：`app/(tabs)/*`、通用导航、首页展示、用户中心与设置页面。  
> 目标：将“App 外壳 + 导航 + 基础设置”单独视为一个模块，冻结其职责与边界，避免与具体学习模块（字母/词汇）的逻辑混淆。

---

## 1. 模块定位与边界

### 1.1 模块职责

- 提供统一的 **主导航与外壳布局**：
  - 底部 Tab 导航：Home / Courses / Profile；
  - 后续可扩展 Settings / AI 等入口，但不嵌入业务逻辑。
- 提供 **首页总览（Home）**：
  - 显示当前主课程、今日进度百分比、学习氛围背景与动效；
  - 提供“继续学习”入口（跳转到 `/learning` 或 `/alphabet`）。
- 提供 **用户中心（Profile）**：
  - 展示用户基本信息与成就徽章；
  - 集中放置 App 级设置项（语言、每日学习量、TTS 选择等）；
  - 提供登出按钮。
- 与其他模块的关系：
  - 只依赖它们暴露的“汇总信息”（如 `userProgress`、`learningStore.progress`），不直接管理学习队列、SRS 或课程内部状态。

### 1.2 模块边界（不做什么）

- 不负责：
  - 字母/词汇/句子具体学习流程；  
  - 记忆引擎调用（`getTodayMemories` / `submitMemoryResult` 等）；  
  - 课程解锁逻辑（由 `memory-engine` + `moduleAccessStore` 管理）。
- 不直接读写数据库，只通过已有 Store / 云函数接口获取统计信息。

---

## 2. 相关代码文件总览

### 2.1 路由层（app/(tabs)）

- `app/(tabs)/_layout.tsx`
  - 定义 Tab 导航结构，包含：
    - `index`（Home）、`courses`（课程）、`profile`（用户中心）。  
  - 负责设置 Tab 图标、标题与配色。

- `app/(tabs)/index.tsx`（HomeScreen）
  - 职责：
    - 展示“今日进度 + 当前课程”的 Hero 卡片；  
    - 展示浮动复习气泡（目前基于 `MOCK_REVIEWS`）；  
    - 展示学习统计（连续天数 / 本周学习时长）和近期成就。
  - 依赖：
    - `useUserStore`：当前登录用户昵称；  
    - `useModuleAccessStore`：`userProgress`（letterProgress/wordProgress/sentenceProgress/articleProgress）；  
    - `FloatingBubbles` / `ThaiPatternBackground` 等 UI 组件。
  - 当前实现中的 `getCurrentCourse()`：
    - 当 `letterProgress < 0.8` → 推荐 Alphabet 模块；  
    - 否则按 `wordProgress` / `sentenceProgress` / `articleProgress` 依次推荐后续模块；  
    - 点击 Hero 卡片时，根据当前推荐模块跳转到 `/learning` 并附带 `module` 参数（字母或单词）。

- `app/(tabs)/courses.tsx`
  - 已在 `courses-and-learningstore-spec.md` 中详述，此处作为壳层的一部分被引用。  

- `app/(tabs)/profile.tsx`（ProfileScreen）
  - 职责：
    - 展示用户头像/昵称（当前头像为占位符）；  
    - 展示成就徽章列表（如连续打卡 7 天等）；  
    - 提供 App 级设置入口；  
    - 提供注销按钮。
  - 依赖：
    - `useUserStore`：获取用户信息与 `logout()`；  
    - `useLearningStore`：读取 streakDays 等学习统计（当前为 demo 数据）；  
    - `useModuleAccessStore`：读取 `userProgress.dailyLimit`；  
    - `LanguageSwitcher`：切换中/泰/英等 UI 文案语言。

---

## 3. 当前已实现的前端展示功能

### 3.1 HomeScreen 功能点

- 顶部问候区：
  - 显示“ສະບາຍດີ, {displayName}`”风格问候语；
  - 显示 `todayProgress` 文案 + 当前推荐课程的完成百分比。
- 浮动复习气泡：
  - `FloatingBubbles` 组件基于 `MOCK_REVIEWS` 显示字母卡片（字符 +类型 + dueIn）；  
  - 点击任意气泡 → 打开 `/review-modal`（暂未与记忆引擎完全接入）。
- Hero 课程卡：
  - 展示当前阶段课程名称（字母/单词/句子/文章）、课程等级标签及泰文短语；  
  - 显示“继续学习”大按钮（带 Play icon），点击后：
    - 若 `currentCourse.module === 'letter'` → `router.push('/learning?module=letter')`；  
    - 若为词汇/句子/文章 → `router.push('/learning')`（目前为占位行为）。
- 学习统计卡片：
  - 显示假数据：连续学习天数（12）与本周学习时长（4.5 小时）；  
  - 后续将使用 `learningStore` 的真实统计字段替代。
- 最近成就区域：
  - 展示若干“掌握字母/单词”的卡片，占位 UI。

### 3.2 ProfileScreen 功能点

- 个人信息卡：
  - 显示头像（当前为字母 L）、用户名、简介文案。
- 成就徽章列表：
  - 通过本地 `achievements` 数组驱动，包括：
    - 连续打卡 7 天（根据 `learningStore.progress.streakDays` 判断是否解锁）；  
    - 其他成就占位（Master、Vocab100 等）。
- 设置卡片：
  - 每日提醒开关（本地 `dailyReminder` 状态，暂未接入通知服务）；  
  - 每日学习数量设置：
    - 弹出 Alert 供用户选择 10/20/50 个；
    - 本地调用 `useModuleAccessStore.setState` 更新 `userProgress.dailyLimit`（前端模拟）；
  - TTS 引擎选择（目前固定为 `Tencent TTS` 文案，尚未跳转到详情页）；  
  - 语言切换：嵌入 `LanguageSwitcher variant="full"` 组件。
- 注销按钮：
  - 调用 `logout()` 并 `router.replace('/(auth)/login')`。

---

## 4. 未来规划的外壳与设置功能（不影响当前冻结模块）

> 本节仅做**方向性规划**，实际开发前需在本 spec 中补充对应字段与路由，并在项目总纲中登记为新任务。

### 4.1 导航层扩展

- 增加 Settings 独立 Tab 或子路由：
  - 例如：`app/(tabs)/settings.tsx` 或 `app/settings/index.tsx`；  
  - Profile 只展示用户信息和成就，所有设置项集中到 Settings 页面。
- 在 HomeScreen 中增加“快速入口区域”：
  - 今日任务（字母/单词复习数量）；  
  - AI 发音练习入口；  
  - 字母复习中心/词汇复习中心入口。

### 4.2 设置项扩展

- 学习偏好：
  - 每日学习目标（字母/单词分开设置）；  
  - 复习优先级（昨日复习优先 vs 新词优先等）。
- 音频与 UI：
  - TTS 引擎选择（Tencent / CloudBase / 本地音频优先级）；  
  - 自动播放选项（进入题目时是否自动播放音频）；  
  - 主题模式（浅色 / 深色）。
- 通知与提醒：
  - 学习提醒时间 / 频率；  
  - 连续打卡提醒。

### 4.3 用户中心扩展

- 完整学习统计页：
  - 总学习时长、学习天数、各模块掌握度统计（从 `user_progress` / `user_alphabet_progress` / `user_vocabulary_progress` 推导）；  
  - 错误最多的字母/单词 Top N，用作 AI 模块输入。  
- 成就系统：
  - 按学习行为（字母完成、词汇数、打卡连续天数等）自动解锁徽章；  
  - 成就详情页展示解锁条件与达成日期。

---

## 5. 实施注意事项

1. 壳层组件（Home / Profile / Settings）不得直接调用记忆引擎，只能通过 Store（`moduleAccessStore` / `learningStore` / `learningPreferenceStore` / `userStore`）读取统计或基础设置。  
2. 所有新增全局设置项，都需要：
   - 在本 spec 中登记；
   - 在相应 Store 中增加字段与接口；
   - 在必要时扩展后端接口（例如存储每日学习目标），并在 `backend-memory-engine-spec.md` 或相关后端 Spec 中说明。  
3. 导航结构变更（新增 Tab、调整路由）必须同步更新：
   - `app/(tabs)/_layout.tsx` 代码；  
   - 本 spec 路由小节；  
   - `PROJECT_OVERVIEW_SPEC.md` 中的模块表与任务列表。

本规格将前端壳层的职责与边界从字母/词汇学习逻辑中抽离出来，保证导航、用户中心与设置相关改动不会意外影响核心学习模块。***
