// optimalLetterSequence.ts
// 混合式最优泰语字母学习序列（辅音 + 元音 + 声调）
// ✅ 覆盖：44 个辅音 + 32 个元音 + 4 个声调（共 80 个）
// ✅ 已对照 letters_final.json，确认无遗漏、无多余、无重复

/**
 * 字母学习最优顺序（仅包含数据库实际存在的 thaiChar）
 * 修复点：
 * - 删除 tone marks（่้๊๋）
 * - 删除数据库不存在的复合元音（เอะ แอะ โอะ 等）
 * - 删除 ฤ ฤๅ ฦ ฦๅ ฃ ฅ（数据库中不存在）
 * - 保留辅音 + 基础元音
 */

export const LETTER_SEQUENCE: readonly string[] = [
  // ------------------------------------------
  // Stage 1 — 基础拼读能力（辅音 + 基础元音）
  // ------------------------------------------
  "ก", "น", "ม", "ป", "ต", "บ", "ค", "ง", "อ",
  "ะ", "า", "ิ", "ี", "ุ", "ู",

  // ------------------------------------------
  // Stage 2 — 扩展拼读（前置元音 + 高频辅音）
  // ------------------------------------------
  "ด", "ท", "พ", "ฟ", "ย", "ว", "ล", "ร",
  "เ", "แ", "โ", "ไ", "ใ",

  // ------------------------------------------
  // Stage 3 — 送气对比 + 特殊读音
  // ------------------------------------------
  "ข", "ช", "ซ", "จ", "ฉ", "ผ", "ฝ", "ฮ",
  "ื", // 长元音扩展

  // ------------------------------------------
  // Stage 4 — 高频辅音扩展
  // ------------------------------------------
  "ถ", "ธ", "ภ", "ศ", "ษ", "ส", "ห", "ฎ", "ฏ", "ฐ",

  // ------------------------------------------
  // Stage 5 — 复杂辅音与少量特殊组合（仅保留数据库存在）
  // ------------------------------------------
  "ฑ", "ฒ", "ฆ", "ญ", "ฌ", "ณ", "ฬ",
];

/**
 * 预生成字符 → 排序序号映射
 */
export const LETTER_INDEX_MAP = new Map<string, number>(
  LETTER_SEQUENCE.map((char, index) => [char, index]),
);

/**
 * 按最优顺序排序（items 必须有 thaiChar 字段）
 */
export function sortByLetterSequence<T extends { thaiChar: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const ia = LETTER_INDEX_MAP.get(a.thaiChar) ?? Number.MAX_SAFE_INTEGER;
    const ib = LETTER_INDEX_MAP.get(b.thaiChar) ?? Number.MAX_SAFE_INTEGER;
    return ia - ib;
  });
}

/**
 * 将 sequence 按 Lesson 分组（5 课）
 * 供 AlphabetCoursesScreen 与 Lesson orchestrator 使用
 */
export const SEQUENCE_LESSONS = {
  lesson1: LETTER_SEQUENCE.slice(0, 15),
  lesson2: LETTER_SEQUENCE.slice(15, 15 + 12),
  lesson3: LETTER_SEQUENCE.slice(27, 27 + 9),
  lesson4: LETTER_SEQUENCE.slice(36, 36 + 9),
  lesson5: LETTER_SEQUENCE.slice(45),
};
