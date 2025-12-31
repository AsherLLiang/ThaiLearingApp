# 冻结设计文档｜发音还原模块（Pronunciation Restoration Module）v1.0

> 状态：**冻结（Frozen）**  
> 模块名：`pronunciation-restoration`  
> 单一事实源（SSoT）：`pron_thai.json`  
> 适用范围：ThaiLearnApp（前端 / 后端 / AI）  

---

## 0. 模块定位（是什么）

本模块不是教学规则展示器，而是**发音结果还原模块**。

它的职责是：  
> 将任意泰语拼写（单词或短语）转换为  
> **“无需用户思考任何拼读规则即可直接朗读的发音态表示”**。

---

## 1. 输出效果目标（必须达到）

### 1.1 用户侧
- 用户看到输出即可读
- 不需要知道：
  - 中 / 高 / 低辅音
  - 清尾 / 浊尾
  - 标 2 读 3、标 3 读 4 等规则
- 第一调永远不标，其余 4 调只标**实际声调**

### 1.2 工程侧
- 输出结构化，可被 UI / 后端 / AI 消费
- 同一规则版本下结果确定

---

## 2. 本模块引入并冻结的新原则

### 2.1 声调符号重建原则
- 永远不直接复用原拼写中的声调符号
- 必须：
  1. 移除历史声调符号
  2. 推导实际声调
  3. 按实际声调重建符号（T1 不标）

### 2.2 罗马音仅为渲染层
- 不参与规则推导
- 仅基于发音态结果生成
- 必须显式标声调（建议数字）

### 2.3 音节边界即输出契约
- 输出泰文必须以空格分隔音节
- 罗马音（若有）同样按音节对齐

---

## 3. 单一事实源（SSoT）

- 所有规则来自 `pron_thai.json`
- 不允许语言直觉硬编码
- 允许生成运行时裁剪版，但必须可追溯

---

## 4. 输入 / 输出契约

### 4.1 输入
- `inputText: string`

### 4.2 输出（建议冻结）

```ts
type SyllableResult = {
  original: string;
  surface_base: string;
  tone: "T1" | "T2" | "T3" | "T4" | "T5";
  surface: string;
  roman?: string;
};

type PronRestoreResult = {
  input: string;
  syllables: SyllableResult[];
  output_thai: string;
  output_roman?: string;
};
```

---

## 5. 流水线（冻结）

1. Normalize
2. Tokenize
3. Syllable Segmentation
4. Orthography Rewrite + 去历史声调
5. Feature Extraction
6. Tone Resolution
7. Tone Explicit Render
8. Romanization Render（可选）
9. Join

---

## 6. 实现建议伪代码

```ts
function restorePronunciation(input: string, opts): PronRestoreResult {
  const syllables = segment(input);
  const results = [];

  for (const s of syllables) {
    const base = rewriteAndStripTone(s);
    const tone = resolveTone(base);
    const surface = renderTone(base, tone);
    const roman = opts.roman ? renderRoman(base, tone) : undefined;

    results.push({ original: s, surface_base: base, tone, surface, roman });
  }

  return {
    input,
    syllables: results,
    output_thai: results.map(r => r.surface).join(" "),
    output_roman: opts.roman ? results.map(r => r.roman).join(" ") : undefined
  };
}
```

---

## 7. 系统对接（非 Demo）

- 前端：词卡 / 学习 / 复习统一调用
- 后端：记录结果与规则版本
- AI：音节 + 声调作为评测目标

---

## 8. 测试与验收

- 同一输入 + 同一规则版本 → 必须输出一致
- 不出现声调误导
- 用户仅按输出即可读

---

## 9. 冻结声明

本模块设计、原则、输出形式与流水线全部冻结。  
任何扩展必须以新模块形式进行，不破坏本模块行为。
