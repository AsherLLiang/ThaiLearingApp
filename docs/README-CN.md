# 泰语学习应用 - 文档中心

欢迎来到泰语学习应用项目的完整文档中心。

---

## 📚 文档总览

本文件夹包含涵盖项目各个方面的详细指南。

---

## 🗂️ 文档索引

### **[PROJECT-SNAPSHOT-CN](./PROJECT-SNAPSHOT-CN.md)** ⭐ AI代码生成专用
**为Claude/AI助手压缩的项目知识**
- 完整文件结构及内容摘要
- 所有类型、store和组件API
- 代码模式和约定
- 设计系统标记
- 实现状态和已知问题
- **无需上传所有文件即可让Claude完全理解项目！**

**English Version:** [PROJECT-SNAPSHOT.md](./PROJECT-SNAPSHOT.md) 🇬🇧

**使用指南：** [如何使用快照](./HOW-TO-USE-SNAPSHOT-CN.md)
**English Guide:** [How to Use Snapshot](./HOW-TO-USE-SNAPSHOT.md) 🇬🇧

---

### **[核心概念速查-中文](./核心概念速查-中文.md)** 🔥 中文速查
**提取00-06号英文文档的所有核心要点**
- 7个主题浓缩总结
- 快速理解关键技术
- 代码模式速查
- 无需阅读全部英文文档
- **推荐：先读这个，需要详细内容再看英文原版**

---

## 📖 英文详细文档（7份）

以下文档为英文，采用B2级别英语编写（清晰易懂）：

💡 **提示**：可以先阅读 [核心概念速查-中文](./核心概念速查-中文.md) 快速了解，需要详细内容时再查看对应英文文档。

### 1. **[00 - Project Knowledge Base](./00-Project-Knowledge-Base.md)** ⭐ 人类开发者参考
**项目中心参考**
- 完整项目概览和状态
- 架构图
- 快速参考指南
- 开发工作流
- 已知问题和路线图

### 2. **[01 - Expo Router Explained](./01-Expo-Router-Explained.md)**
**Expo Router完整指南（文件式路由）**
- Expo Router是什么及为何使用
- 文件式路由模式
- Layout系统（\_layout.tsx）
- 路由组（括号）
- 动态路由和参数
- 导航方法

### 3. **[02 - Project Routing & Navigation](./02-Project-Routing-Navigation.md)**
**项目路由与导航**
- 完整路由地图
- 每个路由文件的详细分析
- 用户旅程示例
- 导航模式
- 调试导航问题

### 4. **[03 - File Import & Dependencies](./03-File-Import-Dependencies.md)**
**文件导入与依赖关系**
- 完整导入关系图
- 依赖层次（5层架构）
- 每个文件的导入详解
- 路径别名@/使用
- 避免循环依赖

### 5. **[04 - Parameter Passing Guide](./04-Parameter-Passing-Guide.md)**
**参数传递指南**
- 3种数据传递方式（Props、Zustand、URL参数）
- 每种方式的详细示例
- 完整数据流示例
- TypeScript类型安全

### 6. **[05 - Zustand State Management](./05-Zustand-State-Management.md)**
**Zustand状态管理**
- Zustand vs Redux对比
- 核心概念
- 3个store详解
- AsyncStorage持久化
- 高级模式

### 7. **[06 - Frontend Design Philosophy](./06-Frontend-Design-Philosophy.md)**
**前端设计理念**
- 设计原则
- 色彩系统
- 字体系统
- 布局模式
- 组件设计模式
- 无障碍考虑

---

## 🎯 快速开始

### 对于AI辅助开发（推荐）
1. **阅读**：[PROJECT-SNAPSHOT-CN.md](./PROJECT-SNAPSHOT-CN.md)（15分钟）
2. **学习如何使用**：[HOW-TO-USE-SNAPSHOT-CN.md](./HOW-TO-USE-SNAPSHOT-CN.md)
3. **开始与Claude协作**：粘贴快照或上传到项目知识库

### 对于人类学习
1. **第1天**：[00 - Project Knowledge Base](./00-Project-Knowledge-Base.md)（项目全貌）
2. **第2天**：[01 - Expo Router Explained](./01-Expo-Router-Explained.md)（理解路由）
3. **第3天**：[05 - Zustand State Management](./05-Zustand-State-Management.md)（理解状态）
4. **第4天**：[02 - Project Routing](./02-Project-Routing-Navigation.md)（本项目路由）
5. **第5天**：开始编码！需要时参考其他文档

---

## 📊 文档统计

### 完整文档列表（11份）
1. ⭐ **PROJECT-SNAPSHOT-CN.md** - AI代码生成（中文）
2. ⭐ **HOW-TO-USE-SNAPSHOT-CN.md** - 快照使用指南（中文）
3. **PROJECT-SNAPSHOT.md** - AI代码生成（英文）
4. **HOW-TO-USE-SNAPSHOT.md** - 快照使用指南（英文）
5. **00-Project-Knowledge-Base.md** - 项目知识库
6. **01-Expo-Router-Explained.md** - Expo Router详解
7. **02-Project-Routing-Navigation.md** - 项目路由
8. **03-File-Import-Dependencies.md** - 导入关系
9. **04-Parameter-Passing-Guide.md** - 参数传递
10. **05-Zustand-State-Management.md** - 状态管理
11. **06-Frontend-Design-Philosophy.md** - 设计理念

**总行数**：约5,000行
**总字数**：约50,000词
**文件大小**：约600KB

---

## 💡 使用建议

### 我想... → 应该阅读...

| 需求 | 推荐文档 |
|------|---------|
| **让Claude生成代码** | PROJECT-SNAPSHOT-CN.md |
| **理解项目全貌** | 00-Project-Knowledge-Base.md |
| **学习Expo Router** | 01-Expo-Router-Explained.md |
| **理解本项目路由** | 02-Project-Routing-Navigation.md |
| **查找文件依赖** | 03-File-Import-Dependencies.md |
| **理解数据传递** | 04-Parameter-Passing-Guide.md |
| **学习Zustand** | 05-Zustand-State-Management.md |
| **匹配设计风格** | 06-Frontend-Design-Philosophy.md |

---

## 🚀 AI辅助开发工作流

### 推荐方式（最高效）

**1. 一次性设置（5分钟）**
```
1. 访问 https://claude.ai/projects
2. 创建项目"Thai Learning App"
3. 上传 PROJECT-SNAPSHOT-CN.md（50KB）
4. 完成！
```

**2. 日常开发**
```
直接问Claude：
"基于PROJECT-SNAPSHOT-CN.md，创建一个新的课程列表页面"
"添加一个收藏功能到课程卡片"
"帮我调试认证守卫的重定向问题"

Claude会生成完全匹配项目风格的代码！
```

**3. 保持同步（每周5分钟）**
```
有重大更改时：
1. 更新PROJECT-SNAPSHOT-CN.md相关部分
2. 或者问Claude："我添加了这个store，帮我更新快照"
```

---

## 🎯 关键优势

### 使用PROJECT-SNAPSHOT的好处

✅ **节省空间**：50KB vs 25MB（完整代码库）
✅ **100%可靠**：无GitHub访问问题
✅ **持久记忆**：上传一次，永久使用
✅ **代码一致**：生成的代码匹配项目风格
✅ **快速上手**：15分钟理解整个项目
✅ **团队协作**：统一的项目理解

### 对比传统方式

| 传统方式 | 使用快照 |
|---------|---------|
| 阅读40+源文件 | 阅读1个文档 |
| 花费数小时理解 | 15分钟掌握 |
| Claude访问不稳定 | 100%可用 |
| 用完知识库空间 | 仅用0.2%空间 |
| 生成代码不一致 | 完美匹配风格 |

---

## 📝 维护指南

### 何时更新文档

**立即更新（重要）**
- ✅ 添加新路由或页面
- ✅ 创建新Store
- ✅ 更改架构模式
- ✅ 添加新组件类型

**每周更新**
- ⚠️ 实现进度百分比
- ⚠️ 已知问题列表
- ⚠️ 下一步优先级

**无需更新**
- ❌ 小bug修复
- ❌ 文本更改
- ❌ 样式微调

---

## 🎉 开始使用

### 立即体验AI辅助开发

**步骤1：获取项目理解**
```
1. 打开 PROJECT-SNAPSHOT-CN.md
2. 阅读15分钟
3. 现在你理解了整个项目架构！
```

**步骤2：测试Claude协作**
```
1. 打开Claude对话
2. 粘贴 PROJECT-SNAPSHOT-CN.md
3. 输入："基于项目快照，创建一个settings.tsx页面"
4. 观察Claude生成匹配项目风格的代码
```

**步骤3：长期使用**
```
1. 上传快照到Claude项目知识库
2. 之后每次对话都自动有上下文
3. 高效开发，专注业务逻辑！
```

---

## 🔗 相关资源

### 外部文档
- **Expo Router**：https://docs.expo.dev/router/
- **Zustand**：https://docs.pmnd.rs/zustand/
- **React Native**：https://reactnative.dev/
- **i18next**：https://react.i18next.com/

### 项目仓库
- **GitHub**：（你的仓库链接）
- **问题追踪**：（你的Issues链接）

---

## ❓ 常见问题

**Q: 为什么有英文和中文两个版本？**
A: 中文版（PROJECT-SNAPSHOT-CN.md）方便快速阅读，英文版保持与国际团队协作的可能性。

**Q: 我应该阅读所有文档吗？**
A: 不需要！如果只是要AI辅助开发，只读PROJECT-SNAPSHOT-CN.md即可。详细文档是用来深入学习的。

**Q: 快照文档会过时吗？**
A: 会的。建议每次重大更改后更新，或每周检查一次。

**Q: Claude能100%基于快照生成正确代码吗？**
A: 大多数情况可以。复杂功能可能需要结合实际代码片段。

**Q: 可以只上传快照到知识库，不上传其他文档吗？**
A: 可以！快照已包含代码生成需要的一切。其他文档是学习用的。

**Q: 50KB够吗？会不会太简略？**
A: 足够！快照包含所有类型定义、API、模式和约定。这是压缩但完整的项目知识。

---

## 🎊 总结

这个文档中心为你提供：

✅ **快速通道**：PROJECT-SNAPSHOT-CN.md（15分钟掌握项目）
✅ **AI协作**：HOW-TO-USE-SNAPSHOT-CN.md（高效开发）
✅ **深度学习**：7份英文详细文档（4,000行）
✅ **完整覆盖**：路由、状态、设计、数据流全方位
✅ **实时更新**：随项目进展持续维护

**从PROJECT-SNAPSHOT-CN.md开始，让Claude成为你的AI编程伙伴！** 🚀

---

**创建时间**：2025-11-23
**语言**：中文 + 英文
**文档数量**：11份
**总页数**：约150页（如果打印）
