# 课程入口 & LearningStore 最终规格说明（Courses + LearningStore Spec, Freeze V2.0.1）

> 目录：`docs/project-freeze/courses-and-learningstore-spec.md`  
> 适用范围：**Courses 标签页 + 课程配置 JSON + LearningStore 全局学习管理层**  
> 目标：冻结课程入口层的职责划分与数据结构，为后续 Vocabulary / Alphabet / AI 模块提供稳定入口。

---

## 1. 模块定位与边界

### 1.1 Courses 模块职责

- 一致的课程入口：
  - 在 `app/(tabs)/courses.tsx` 中展示所有**可选学习项目**：
    - 字母项目：`assets/courses/alphabetCourses.json`；
    - 单词项目：`assets/courses/courses.json`（基础泰语 1/2/3/4）。
- 统一的“开始/继续学习”行为：
  - 对于单词课程：根据是否已设置每日计划，跳转到 `/learning` 或 `/learning/setup`；
  - 对于字母课程：跳转到字母模块入口 `/alphabet`（再由字母模块内部决定后续流程）。
- 展示每个课程的整体进度（已完成字母/单词数量），数据来源：
  - `moduleAccessStore.userProgress`（后端 `memory-engine.getUserProgress` / `learn-vocab`）。

### 1.2 LearningStore 职责（目标形态）

> 说明：当前 `src/stores/learningStore.ts` 是旧版 demo，包含大量写死值。  
> 本规范描述的是 **目标设计**，后续需要 refactor 使实现与本规范对齐。

- 全局“学习仪表盘”的状态源：
  - 当前主课程 `currentCourseId`（例如 `thai_1`）；
  - 当前字母项目 `currentAlphabetProgramId`（例如 `alphabet` / `alphabet_core_v1`）；
  - 全局统计：`streakDays`, `totalStudyMinutes`, `lastStudyAt` 等。
- 与具体模块的关系：
  - 不直接参与字母或单词的 SRS 逻辑；
  - 只记录“用户正在学哪门课”和“整体学了多久”等宏观信息；
  - 首页 Hero Card、Profile 成就系统从这里读取信息。

### 1.3 模块边界

- Courses 模块 **不负责**：
  - 决定具体字母/单词队列（交给 `alphabetStore` / `vocabularyStore` + `memory-engine`/`learn-vocab`）；
  - 修改 `memory_status` 或 `user_*_progress`。
- LearningStore **不负责**：
  - 单个字母/单词的进度（已掌握多少个具体实体）；
  - SRS 算法或下次复习时间。

---

## 2. 相关代码 / 配置总览

### 2.1 课程配置 JSON

- `assets/courses/courses.json`（单词课程，大课程）

```json
[
  {
    "id": "thai_1",
    "source": "Thai_1",
    "title": "基础泰语1",
    "description": "从零开始学习泰语，掌握一点点词汇。",
    "level": "入门",
    "image": "ThaiBase_1.png",
    "category": "word",
    "lessons": 20
  },
  ...
]
```

- `assets/courses/alphabetCourses.json`（字母项目，大课程）

```json
[
  {
    "id": "alphabet",
    "source": "alphabet",
    "title": "泰语字母表",
    "description": "从44个辅音到元音与声调，逐步掌握泰语读写基础。",
    "level": "入门",
    "image": "thai_alphabet.png",
    "category": "letter",
    "lessons": 44
  }
]
```

> 约定：
> - `id`：用于 UI 和本地逻辑；
> - `source`：传给后端 / vocabularyStore 的课程源标识（如 `Thai_1`）；
> - `category`：决定模块类型：
>   - `'letter'` → 字母模块；
>   - `'word'`   → 词汇模块；
>   - `'sentence'` / `'article'` 预留给后续模块。

### 2.2 Courses Screen（app/(tabs)/courses.tsx）

- 核心类型：

```ts
type CourseItem = {
  id: string;
  source: string;
  title: string;
  description: string;
  level: string;
  image: string;
  category: string;   // 'letter' | 'word' | ...
  lessons: number;
};

type CourseWithImage = CourseItem & {
  imageSource: ImageSourcePropType;
};
```

- 课程列表构造：

```ts
const COURSES: CourseWithImage[] = (
  [
    ...(alphabetCourses as CourseItem[]),
    ...(coursesData as CourseItem[]),
  ]
).map((course) => ({
  ...course,
  imageSource: COURSE_IMAGE_MAP[course.image] || COURSE_IMAGE_MAP.default,
}));
```

- 依赖的 Store：

```ts
const { currentCourseSource, startCourse } = useVocabularyStore();
const { hasDailyLimit } = useLearningPreferenceStore();
const { userProgress, getUserProgress } = useModuleAccessStore();
```

> 注意：当前实现中 **尚未使用 learningStore**；  
> 后续可在本文件中增加对 `useLearningStore` 的调用（见第 4 节）。

### 2.3 AlphabetCourseCard（src/components/courses/AlphabetCourseCard.tsx）

- Props：

```ts
interface AlphabetCourseCardProps {
  course: {
    id: string;
    source: string;
    title: string;
    description: string;
    level: string;
    imageSource: ImageSourcePropType;
    lessons: number;
  };
  isCurrent: boolean;
  progress?: {
    completed: number;
    total: number;
  };
}
```

- 行为：
  - 展示封面图、标题、等级、描述；
  - 若有 `progress`，显示进度条与 “已完成/总数”；
  - 点击「开始学习 / 继续学习」按钮：

```ts
<Pressable
  style={[styles.startBtn, isCurrent && styles.activeStartBtn]}
  onPress={() => router.push('/alphabet')}
>
  <Text>开始学习 / 继续学习</Text>
</Pressable>
```

> 当前 AlphabetCourseCard 只负责 **跳转到 `/alphabet`**，  
> 不负责设置当前字母 Program 或调用 learningStore。  
> 这部分将在未来版本中接入 `useLearningStore.setCurrentAlphabetProgram`。

### 2.4 LearningStore（当前实现 & 目标差异）

- 现有文件：`src/stores/learningStore.ts`

```ts
interface LearningState {
  currentCourse: Course | null;          // 旧：整个 Course 对象
  progress: LearningProgress | null;     // 旧：包含各种写死字段
  completedContent: string[];

  setCourse: (course: Course) => void;
  updateProgress: (contentType: string, score: number) => void;
  getCompletionRate: () => number;
  resetLearning: () => void;
}
```

> 现状问题：
> - `setCourse` 会生成一份写死数据（userId='user_1', completedAlphabets=30 等），不反映真实进度；
> - 项目中几乎未使用 `setCourse`，仅在 Profile 页读 `progress` 做成就展示；
> - 与 memory-engine / moduleAccessStore 的真实进度有割裂。

**目标设计（建议重构后形态）：**

```ts
interface LearningState {
  // 当前“主课程”，用于首页 / Profile 展示
  currentCourseId: string | null;              // 如 'thai_1'

  // 当前字母 Program（大课程）
  currentAlphabetProgramId: string | null;     // 如 'alphabet'

  // 全局学习统计
  streakDays: number;                          // 连续打卡天数
  totalStudyMinutes: number;                   // 总学习时长（分钟）
  lastStudyAt: string | null;                  // 最近一次学习时间 ISO 字符串

  setCurrentCourse: (courseId: string) => void;
  setCurrentAlphabetProgram: (programId: string) => void;
  registerStudySession: (params: {
    module: 'letter' | 'word' | 'sentence' | 'article';
    minutes: number;
    finishedLessonId?: string;
  }) => void;

  resetLearningDashboard: () => void;
}
```

> 重构原则：
> - LearningStore 不再保存“虚假的详细进度”；  
> - 只负责**“当前在学哪门课 + 全局时长/打卡”**；  
> - 详细进度以 `moduleAccessStore.userProgress` + `memory_status` / `user_*_progress` 为准。

---

## 3. Courses 页面逻辑与 Store 交互

### 3.1 分类 / 搜索 / 过滤

```ts
const CATEGORIES = [
  { id: 'all',    label: '全部', icon: Grid },
  { id: 'letter', label: '字母', icon: Type },
  { id: 'word',   label: '单词', icon: BookOpen },
];

const [activeCategory, setActiveCategory] = useState('all');
const [searchQuery, setSearchQuery] = useState('');

const filteredCourses = useMemo(() => {
  return COURSES.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch =
      course.title.includes(searchQuery) || course.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });
}, [activeCategory, searchQuery]);
```

- 分类 Chip 控制 `activeCategory`；
- 搜索框控制 `searchQuery`；
- `filteredCourses` 是之后渲染的唯一数据源。

### 3.2 课程进度（getCourseProgress）

```ts
const { userProgress, getUserProgress } = useModuleAccessStore();

useEffect(() => {
  if (!userProgress) {
    getUserProgress().catch((err) => console.warn('Failed to fetch user progress', err));
  }
}, [userProgress, getUserProgress]);

const getModuleType = (course: CourseWithImage): ModuleType => {
  switch (course.category) {
    case 'letter':   return 'letter';
    case 'sentence': return 'sentence';
    case 'article':  return 'article';
    default:         return 'word';
  }
};

const getCourseProgress = (course: CourseWithImage) => {
  if (!userProgress) return undefined;
  const moduleType = getModuleType(course);
  if (moduleType === 'letter') {
    return {
      completed: userProgress.letterMasteredCount,
      total: userProgress.letterTotalCount || course.lessons,
    };
  }
  if (moduleType === 'word') {
    return {
      completed: userProgress.wordMasteredCount,
      total: userProgress.wordTotalCount || course.lessons,
    };
  }
  return undefined;
};
```

- 课程卡片上的进度条只使用 `userProgress` 的聚合字段；
- 不关心 memory-engine 内部的细节；  
- 对 sentence/article 类型当前返回 `undefined`，即暂不显示进度。

### 3.3 单词课程 Start/Continue 逻辑

```ts
const { currentCourseSource, startCourse } = useVocabularyStore();
const { hasDailyLimit } = useLearningPreferenceStore();

const getModuleType = (course): ModuleType => { ... }; // 如上

const handleStartLearning = (course: CourseWithImage) => {
  return () => {
    const moduleType = getModuleType(course);
    const needsDailySetup = !hasDailyLimit(moduleType);

    // 若当前已经在学同一个 source，直接跳转
    if (currentCourseSource === course.source) {
      router.push({
        pathname: needsDailySetup ? '/learning/setup' : '/learning',
        params: { module: moduleType, source: course.source },
      });
      return;
    }

    // 否则弹窗确认切换课程
    setPendingCourse(course);
    setModalVisible(true);
  };
};

const proceedToCourse = async (course: CourseWithImage) => {
  const moduleType = getModuleType(course);
  const needsDailySetup = !hasDailyLimit(moduleType);

  await startCourse(course.source);  // vocabularyStore 内部会记住 currentCourseSource
  setModalVisible(false);
  setPendingCourse(null);

  router.push({
    pathname: needsDailySetup ? '/learning/setup' : '/learning',
    params: { module: moduleType, source: course.source },
  });
};
```

- `CourseCard`（单词课程卡片）的 `onStart` 会绑定 `handleStartLearning(course)`；
- `startCourse(source)` 是词汇模块的入口，用于初始化词汇学习上下文。

### 3.4 字母课程 Start/Continue 逻辑

```tsx
{filteredCourses.map((course) => {
  const isCurrent = currentCourseSource === course.source;
  const moduleType = getModuleType(course);
  const progress = getCourseProgress(course);

  // 字母课程：使用 AlphabetCourseCard，直接进入 /alphabet 流程
  if (course.category === 'letter') {
    return (
      <AlphabetCourseCard
        key={course.id}
        course={course}
        isCurrent={isCurrent}
        progress={progress}
      />
    );
  }

  // 单词课程：使用标准 CourseCard
  ...
})}
```

- 当前 `AlphabetCourseCard` 不调用 `startCourse` 或 `learningStore`：
  - 它只在点击时 `router.push('/alphabet')`；
  - 字母模块内部根据自身 Store + memory-engine 决定今日课程。

**建议的未来扩展（与 LearningStore 集成）：**

- 在 `AlphabetCourseCard` 的点击 handler 中增加：

```ts
const { setCurrentAlphabetProgram } = useLearningStore();

onPress={() => {
  setCurrentAlphabetProgram(course.id);  // 例如 'alphabet'
  router.push('/alphabet');
}}
```

- 这样首页 / Profile 就可以显示“当前字母项目：泰语字母表”，实现跨模块共享。

---

## 4. LearningStore 与其他模块的集成建议

> 本节描述的是“目标集成方式”，具体实现需 refactor 现有 `learningStore`。

### 4.1 在 Courses 页中设置当前课程 / 字母项目

- 单词课程：

```ts
const { setCurrentCourse } = useLearningStore();

const proceedToCourse = async (course: CourseWithImage) => {
  const moduleType = getModuleType(course);
  const needsDailySetup = !hasDailyLimit(moduleType);

  await startCourse(course.source);
  setCurrentCourse(course.id);          // 'thai_1' / 'thai_2' ...

  router.push({
    pathname: needsDailySetup ? '/learning/setup' : '/learning',
    params: { module: moduleType, source: course.source },
  });
};
```

- 字母课程：

```ts
<AlphabetCourseCard
  ...
  onPress={() => {
    setCurrentAlphabetProgram(course.id);  // 'alphabet'
    router.push('/alphabet');
  }}
/>
```

> 注意：AlphabetCourseCard 目前没有 `onPress` props，  
> 可以在重构时添加 `onStart`，和 `CourseCard` 保持一致。

### 4.2 在学习结束时更新打卡 / 时长

- 在字母模块 / 单词模块的“完成一课”逻辑中调用：

```ts
const { registerStudySession } = useLearningStore();

registerStudySession({
  module: 'letter',        // 或 'word'
  minutes: sessionMinutes, // 本次学习时间
  finishedLessonId: lessonId,
});
```

- `registerStudySession` 内部可以：
  - 根据 `lastStudyAt` 与当前时间判断是否跨日：
    - 若跨日则 streakDays++；
  - 累加 `totalStudyMinutes`；
  - 更新 `lastStudyAt` 为当前时间。

### 4.3 首页 / Profile 中的使用方式（示意）

- 首页 HeroCard：

```ts
const { currentCourseId, currentAlphabetProgramId, streakDays, totalStudyMinutes } = useLearningStore();

// 通过 courses.json / alphabetCourses.json 查找当前课程信息：
const heroCourse = useMemo(
  () => courses.find(c => c.id === currentCourseId),
  [currentCourseId],
);
```

- Profile 成就勋章：
  - 使用 `streakDays` 决定是否解锁“连续学习 7 天”等徽章；
  - 使用 `totalStudyMinutes` 统计总学习时长段位（例如 10 小时、50 小时等）。

---

## 5. ASCII 调用图总览

为了方便从整体上理解 Courses + LearningStore 与其他模块的关系，本节给出一张“横向 ASCII 调用图”。

```text
┌────────────────────────────────────────────────────────────┐
│  用户点击 Courses Tab                                      │
│  app/(tabs)/courses.tsx                                    │
└────────────────────────────────────────────────────────────┘
                │
                │ 渲染课程列表（COURSES: alphabetCourses + courses.json）
                ▼
      ┌────────────────────────────┐        ┌────────────────────────────┐
      │ 字母课程卡 AlphabetCourseCard │      │ 单词课程卡 CourseCard      │
      └────────────────────────────┘        └────────────────────────────┘
                │ onPress                         │ onStart
                │                                 │
                ▼                                 ▼
      router.push('/alphabet')          handleStartLearning(course)
                                               │
                                               ▼
                              ┌────────────────────────────────────┐
                              │ vocabularyStore.startCourse(source)│
                              └────────────────────────────────────┘
                                               │
                                               ▼
                          router.push('/learning' or '/learning/setup')

（未来集成 LearningStore 后）

  AlphabetCourseCard.onPress:
    setCurrentAlphabetProgram(course.id)  // 记录当前字母项目
    router.push('/alphabet')

  proceedToCourse（单词）:
    startCourse(course.source)
    setCurrentCourse(course.id)           // 记录当前主课程
    router.push('/learning...')
```

---

## 6. 实现与扩展注意事项

1. **LearningStore 只做“仪表盘”，不做 SRS**  
   - 细粒度进度和记忆曲线完全交给 `memory-engine` + `alphabetStore` / `vocabularyStore`；
   - LearningStore 不保存“完成多少字母/单词”这种明细。

2. **Courses 页只负责入口，不做业务决策**  
   - 课程卡片只决定跳到哪个模块路由（/alphabet /learning），并调用对应 Store 的入口方法；
   - 具体模块内部如何学习、如何评估由各自模块的 Spec 决定。

3. **所有课程配置统一集中在 assets/courses 下**  
   - 新增课程时，必须：
     - 在 `courses.json` 或 `alphabetCourses.json` 中添加条目；
     - 确保 `image` 能在 `COURSE_IMAGE_MAP` 中找到对应图片；
     - 在本 Spec 文档中备注新增课程的用途。

4. **未来扩展 AI 模块时，仍通过 Courses 页入口**  
   - 可在 `courses.json` 中新增 `category: 'ai'` 的课程项目；
   - Courses 页根据 category 跳转到 `/ai/...` 路由，并使用独立的 aiStore；
   - 不改变既有 letter / word 流程。

---

本规格文档冻结了 Courses + LearningStore 在项目中的角色、数据结构与调用关系。  
