# project-freeze 说明

本目录下的文档用于冻结 ThaiLearningApp 的核心架构与模块规格，  
所有后续开发应优先参考这里的 Spec，而不是直接凭感觉改代码。

当前包含（按模块划分，一模块一文档）：

- `PROJECT_OVERVIEW_SPEC.md`  
  - 项目总纲：模块划分、阶段任务、里程碑、代码快照与数据库文档约定。

- `frontend-shell-module-spec.md`  
  - 前端壳层与导航模块：Tab 导航、首页展示、用户中心与基础设置。

- `alphabet-module-spec.md`  
  - 字母模块（Alphabet Module）完整规格：路由、Hook、Store、memory-engine、数据结构与流程。

- `courses-and-learningstore-spec.md`  
  - Courses 入口页 + LearningStore 全局学习管理层规格。

- `backend-memory-engine-spec.md`  
  - 统一记忆引擎（memory-engine + learn-vocab）与模块解锁逻辑。

- `vocabulary-module-spec.md`  
  - 词汇模块（Vocabulary Module）规格：题型、会话状态、与 learn-vocab/memory-engine 的对接。

- `ai-module-spec.md`  
  - 轻量 AI 模块设计：发音反馈、弱项词汇强化、微阅读生成。

- `database_schema.md`  
  - 数据库结构规范（V2.1.0）：以 local_cleaner 输出与当前云函数为准。

所有新模块、新云函数、新 Store 在落地之前都应先在本目录下补充对应 Spec，并在 `PROJECT_OVERVIEW_SPEC.md` 中登记。***
