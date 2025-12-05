# 数据库结构说明文档

本文档基于后端云函数代码逻辑推导生成的数据库结构说明。由于缺乏直接的 Schema 定义文件，以下字段类型和结构仅供参考。

## 1. 核心集合 (Collections)

### 1.1 Users (用户表)
**集合名**: `users`
**用途**: 存储用户基本信息。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 记录ID | 自动生成 |
| `userId` | String | 用户唯一标识 | 核心索引字段 |
| `nickname` | String | 昵称 | |
| `avatarUrl` | String | 头像地址 | |
| `createdAt` | Date | 创建时间 | |

### 1.2 Vocabulary (词汇表)
**集合名**: `vocabulary`
**用途**: 存储单词数据。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 单词ID | |
| `thaiWord` | String | 泰语单词 | |
| `meaning` | String | 中文含义 | |
| `pronunciation` | String | 发音/音标 | |
| `audioPath` | String | 音频文件路径 | |
| `partOfSpeech` | String | 词性 | e.g., 'n.', 'v.' |
| `level` | String/Number | 难度等级 | |
| `lessonNumber` | Number | 课程章节号 | 用于排序学习顺序 |

### 1.3 User Vocabulary Progress (用户单词进度表)
**集合名**: `user_vocabulary_progress`
**用途**: 记录用户对每个单词的学习状态。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 记录ID | |
| `userId` | String | 用户ID | 索引 |
| `vocabularyId` | String | 单词ID | 索引 |
| `mastery` | String | 掌握程度 | 枚举: 'UNFAMILIAR', 'FUZZY', 'REMEMBERED' |
| `reviewCount` | Number | 复习次数 | |
| `lastReviewed` | Date | 上次复习时间 | |
| `nextReviewDate` | Date | 下次复习时间 | 核心调度字段 |
| `intervalDays` | Number | 间隔天数 | 记忆算法使用 |
| `skipped` | Boolean | 是否跳过 | |

### 1.4 Letters (字母表)
**集合名**: `letters` (推测)
**用途**: 存储泰语字母数据。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 字母ID | |
| `char` | String | 字母字符 | |
| `type` | String | 类型 | e.g., 'middle', 'high', 'low' (辅音) |
| `pronunciation` | String | 发音 | |

### 1.5 Sentences (句子表)
**集合名**: `sentences` (推测)
**用途**: 存储例句数据。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 句子ID | |
| `thai` | String | 泰语句子 | |
| `chinese` | String | 中文翻译 | |

### 1.6 Letter Test Bank (字母题库)
**集合名**: `letter_test_bank`
**用途**: 存储字母测试题目。

| 字段名 | 类型 | 描述 | 备注 |
| :--- | :--- | :--- | :--- |
| `_id` | String | 题目ID | |
| `question` | String | 题目内容 | |
| `options` | Array | 选项列表 | |
| `answer` | String | 正确答案 | |

## 2. 关联关系

- **用户 -> 进度**: 一对多 (`users.userId` -> `user_vocabulary_progress.userId`)
- **进度 -> 单词**: 多对一 (`user_vocabulary_progress.vocabularyId` -> `vocabulary._id`)

## 3. 补充说明

如果您需要更精确的数据库定义（如索引配置、验证规则），请提供 CloudBase 的 `cloudbaserc.json` 配置文件或导出的数据库模型文件。
