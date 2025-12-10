# 字母学习双 Store 架构说明

## 📚 为什么需要两个 Store？

### 设计理念：分离关注点

字母学习功能使用**双 Store 架构**，每个 Store 负责不同的职责：

```
┌─────────────────────────────────────────────────┐
│          字母学习功能                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  letterProgressStore          alphabetLearningStore │
│  ↓                           ↓                  │
│  本地进度追踪                  学习会话管理          │
│  (简单统计)                    (统一记忆引擎)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 1️⃣ letterProgressStore（本地进度追踪）

### 作用
记录用户在**本地**掌握了哪些字母，提供简单的统计数据。

### 数据结构
```typescript
{
  masteredCount: 12,              // 已掌握 12 个字母
  totalCount: 76,                 // 总共 76 个字母
  accuracy: 86,                   // 正确率 86%
  masteredIds: ['TH_C_01', ...]   // 已掌握的字母 ID 列表
}
```

### 使用场景
- ✅ 显示学习进度条
- ✅ 显示"已掌握 X/76"
- ✅ 在字母列表中标记"已掌握"状态
- ✅ 判断是否可以解锁下一阶段

### 特点
- 📱 **纯本地存储**（AsyncStorage）
- 🚀 **快速访问**（无需网络请求）
- 📊 **简单统计**（不涉及复杂算法）

---

## 2️⃣ alphabetLearningStore（统一记忆引擎）

### 作用
管理完整的**学习会话流程**，使用统一记忆引擎决定今天学什么、如何复习。

### 核心设计理念

#### 🎯 统一记忆引擎
字母和单词使用**同一套记忆算法**：
- 根据遗忘曲线安排复习
- 根据答题质量调整复习间隔
- 自动筛选今日需要复习的内容

#### 🔒 强制学习顺序
- 必须先完成字母学习
- 字母进度达到 95% 才能解锁单词
- 保证学习路径的科学性

### 数据结构
```typescript
{
  phase: 'REVIEW',                    // 当前阶段：复习中/测试中/完成
  reviewQueue: [                      // 今日学习队列
    {
      alphabetId: 'TH_C_01',
      thaiChar: 'ก',
      currentAttempts: 2,             // 当前尝试次数
      requiredAttempts: 3,            // 需要尝试 3 次
      qualityHistory: [5, 4],         // 答题质量历史
      isCompleted: false              // 是否完成
    },
    // ...
  ],
  letterProgress: 78,                 // 整体进度 78%
  wordUnlocked: false                 // 单词模块未解锁
}
```

### 使用场景
- ✅ 开始学习会话（获取今日任务）
- ✅ 提交答题结果（记录到记忆引擎）
- ✅ 判断是否解锁下一模块
- ✅ 进行阶段测试

### 特点
- 🌐 **后端驱动**（调用 API）
- 🧠 **智能算法**（记忆引擎）
- 🔄 **会话管理**（学习流程控制）

---

## 🔄 两个 Store 如何协作？

### 场景 1：显示进度（使用 letterProgressStore）

```typescript
// 在首页显示进度
const { progress } = useLetterProgressStore();

<Text>{progress.masteredCount} / {progress.totalCount}</Text>
<ProgressBar value={progress.masteredCount / progress.totalCount} />
```

### 场景 2：开始学习会话（使用 alphabetLearningStore）

```typescript
// 点击"开始学习"按钮
const { initSession, reviewQueue } = useAlphabetLearningStore();

// 从后端获取今日学习任务
await initSession(userId);

// 显示学习队列
reviewQueue.forEach(item => {
  console.log(`今天要学: ${item.thaiChar}`);
});
```

### 场景 3：提交答案（两个 Store 都更新）

```typescript
// 用户答题后
const { submitAnswer } = useAlphabetLearningStore();
const { markAsMastered } = useLetterProgressStore();

// 1. 提交到记忆引擎（alphabetLearningStore）
await submitAnswer('记得');  // 质量评分

// 2. 如果答对，更新本地进度（letterProgressStore）
if (isCorrect) {
  await markAsMastered(letterId);
}
```

---

## 🎨 实际应用示例

### 字母学习首页
```typescript
function AlphabetHomeScreen() {
  // 使用 letterProgressStore 显示进度
  const { progress } = useLetterProgressStore();
  
  return (
    <View>
      <Text>已掌握 {progress.masteredCount}/{progress.totalCount}</Text>
      <ProgressBar value={progress.masteredCount / progress.totalCount} />
      
      <Button 
        title="开始今日学习"
        onPress={() => {
          // 使用 alphabetLearningStore 开始会话
          const { initSession } = useAlphabetLearningStore();
          initSession(userId);
        }}
      />
    </View>
  );
}
```

### 学习会话页面
```typescript
function LearningSessionScreen() {
  // 使用 alphabetLearningStore 管理会话
  const { currentAlphabet, submitAnswer } = useAlphabetLearningStore();
  
  return (
    <View>
      <Text>{currentAlphabet.thaiChar}</Text>
      
      <Button 
        title="陌生" 
        onPress={() => submitAnswer('陌生')} 
      />
      <Button 
        title="模糊" 
        onPress={() => submitAnswer('模糊')} 
      />
      <Button 
        title="记得" 
        onPress={() => submitAnswer('记得')} 
      />
    </View>
  );
}
```

---

## ⚠️ 常见误区

### ❌ 错误：只用一个 Store

**问题**：
- 如果只用 `letterProgressStore`：无法实现智能复习算法
- 如果只用 `alphabetLearningStore`：每次显示进度都要请求后端

### ✅ 正确：双 Store 架构

- `letterProgressStore`：快速本地查询
- `alphabetLearningStore`：智能学习管理

---

## 🚀 未来扩展

### 单词学习
使用**同一个记忆引擎**：

```typescript
// 字母和单词共享记忆引擎
const MEMORY_ENDPOINTS = {
  GET_TODAY: '/vocabulary-get-today-memories',  // 统一接口
  SUBMIT_RESULT: '/vocabulary-submit-memory-result'
};

// 只需传入不同的 entityType
await apiClient.post(MEMORY_ENDPOINTS.GET_TODAY, {
  userId,
  entityType: 'alphabet'  // 或 'word'
});
```

这样字母和单词**无需分开设计**复习逻辑！

---

## 📝 总结

| 特性 | letterProgressStore | alphabetLearningStore |
|------|-------------------|---------------------|
| **职责** | 本地进度统计 | 学习会话管理 |
| **数据源** | 本地存储 | 后端 API |
| **更新频率** | 每次掌握新字母 | 每次学习会话 |
| **使用场景** | 显示进度、标记状态 | 学习流程、智能复习 |
| **是否必需** | ✅ 是 | ✅ 是 |

**两个 Store 互补，缺一不可！**
