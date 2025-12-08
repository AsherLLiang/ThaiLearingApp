'use strict';

/**
 * Alphabet lesson & phonics rule config for backend.
 *
 * 注意：
 * - LESSON_METADATA / PHONICS_RULES 作为本地 fallback；
 * - 优先从 DB 集合 alphabet_lessons / phonics_rules 中读取，
 *   读不到或出错时再退回本地常量，避免前后端数据漂移。
 */

// ==================== Lesson Metadata (7 课) - 本地备份 ====================

const LESSON_METADATA = {
  lesson1: {
    lessonId: 'lesson1',
    title: '第一课:基础拼读能力',
    description: '掌握最基础的中辅音和常见元音,建立CV拼读概念',
    consonants: ['ก', 'ด', 'ต', 'น', 'ม'],
    vowels: ['า', 'ะ', 'ิ'],
    tones: [],
    phonicsRuleId: 'rule_1_cv_structure',
    totalCount: 8,
    minPassRate: 0.95,
    miniReviewInterval: 3,
    order: 1,
  },

  lesson2: {
    lessonId: 'lesson2',
    title: '第二课:前置元音系统',
    description: '学习前置元音(เ แ โ)和更多高频辅音',
    consonants: ['บ', 'ป', 'ร', 'ล', 'ว', 'ย'],
    vowels: ['เ', 'แ', 'โ', 'อ'],
    tones: [],
    phonicsRuleId: 'rule_2_leading_vowel',
    totalCount: 10,
    minPassRate: 0.9,
    miniReviewInterval: 3,
    order: 2,
  },

  lesson3: {
    lessonId: 'lesson3',
    title: '第三课:声调入门',
    description: '掌握送气/不送气对比,引入基础声调系统',
    consonants: ['ข', 'ถ', 'ผ', 'ส', 'ห'],
    vowels: ['ะ', 'ุ', 'ู'],
    tones: ['่', '้'],
    phonicsRuleId: 'rule_3_tone_basics',
    totalCount: 10,
    minPassRate: 0.9,
    miniReviewInterval: 3,
    order: 3,
  },

  lesson4: {
    lessonId: 'lesson4',
    title: '第四课:辅音类与声调',
    description: '理解高/中/低辅音对声调的影响,掌握完整声调系统',
    consonants: ['ค', 'ท', 'พ', 'ช', 'จ', 'ง'],
    vowels: ['ไ', 'ใ', 'เอา', 'อำ'],
    tones: ['๊', '๋'],
    phonicsRuleId: 'rule_4_consonant_class_tones',
    totalCount: 12,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 4,
  },

  lesson5: {
    lessonId: 'lesson5',
    title: '第五课:复合元音系统',
    description: '掌握三合元音(เอีย เอือ อัว)等复杂元音组合',
    consonants: ['ซ', 'ฉ', 'ฝ', 'ฟ', 'ศ', 'ษ', 'ฮ', 'อ'],
    vowels: ['เอีย', 'เอือ', 'อัว', 'เออ', 'ื', 'ึ'],
    tones: [],
    phonicsRuleId: 'rule_5_compound_vowels',
    totalCount: 14,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 5,
  },

  lesson6: {
    lessonId: 'lesson6',
    title: '第六课:完整覆盖(常用进阶)',
    description: '补充常用进阶辅音与复合元音,掌握特殊规则(如 ห นำ 等)',
    consonants: ['ฑ', 'ฒ', 'ณ', 'ภ', 'ธ', 'ฌ', 'ญ', 'ฬ', 'ฎ', 'ฏ', 'ฐ'],
    vowels: ['อาย', 'อุย', 'เอย', 'โอย', 'ออย'],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 19,
    minPassRate: 0.9,
    miniReviewInterval: 4,
    order: 6,
  },

  lesson7: {
    lessonId: 'lesson7',
    title: '第七课:罕用字母与特殊元音',
    description: '集中学习现代泰语中较少使用的辅音与复杂元音,用于阅读古文与特殊专有名词',
    consonants: ['ฃ', 'ฅ'],
    vowels: ['ฤ', 'ฤๅ', 'ฦ', 'ฦๅ', 'แอะ', 'โอะ', 'เอะ', 'เอาะ'],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 10,
    minPassRate: 0.8,
    miniReviewInterval: 4,
    order: 7,
  },
};

// ==================== Phonics Rules (6 条) - 本地备份 ====================

const PHONICS_RULES = {
  rule_1_cv_structure: {
    id: 'rule_1_cv_structure',
    lessonId: 'lesson1',
    title: '拼读规则 1: 辅音+元音',
    content: [
      '✅ 泰语音节 = 辅音(C) + 元音(V)',
      '✅ 元音可在辅音前/后/上/下',
      '✅ 例: ก + า = กา [ka:] (乌鸦)',
      '',
      '🎯 记忆口诀: 先读辅音,再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'า',
      syllable: 'กา',
      pronunciation: 'ka:',
      audioUrl:
        'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3',
    },
    duration: 30,
    order: 1,
  },

  rule_2_leading_vowel: {
    id: 'rule_2_leading_vowel',
    lessonId: 'lesson2',
    title: '拼读规则 2: 前置元音',
    content: [
      '⚠️ 写在辅音前,读在辅音后',
      '',
      '✅ เก = [ke:] 不是 [ek]',
      '✅ แม = [mɛ:] 不是 [ɛm]',
      '✅ โร = [ro:] 不是 [or]',
      '',
      '🎯 记忆口诀: 看到 เ แ โ,先读辅音再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'เ',
      syllable: 'เก',
      pronunciation: 'ke:',
      audioUrl:
        'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/syllable-ke.mp3',
    },
    duration: 30,
    order: 2,
  },

  rule_3_tone_basics: {
    id: 'rule_3_tone_basics',
    lessonId: 'lesson3',
    title: '拼读规则 3: 声调入门',
    content: [
      '🎵 泰语5个声调:',
      '  1. 中平调 ¯ (如: กา [ka:¯])',
      '  2. 低降调 ` (如: ก่า [kà:])',
      '  3. 降调 ˆ (如: ก้า [kâ:])',
      '  4. 高调 ´ (如: ก๊า [ká:])',
      '  5. 升调 ˇ (如: ก๋า [kǎ:])',
      '',
      '📌 声调由4个因素决定:',
      '  • 辅音类(高/中/低)',
      '  • 元音长短',
      '  • 声调符号(่ ้ ๊ ๋)',
      '  • 音节类型(Live/Dead)',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ'],
        ['高辅音', '´', '`', '`', 'ˆ'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 3,
  },

  rule_4_consonant_class_tones: {
    id: 'rule_4_consonant_class_tones',
    lessonId: 'lesson4',
    title: '拼读规则 4: 辅音类与声调',
    content: [
      '🔑 核心概念: 同样的元音+符号,不同辅音类 → 不同声调',
      '',
      '例: า + 无符号',
      '  • ก + า = กา [中平¯] (中辅音)',
      '  • ข + า = ขา [升调´] (高辅音)',
      '  • ค + า = คา [中平¯] (低辅音)',
      '',
      '🎯 学习策略:',
      '  1. 先记辅音类(高/中/低)',
      '  2. 再查声调表',
      '  3. 多听多练,形成直觉',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้', '๊', '๋'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ', '´', 'ˇ'],
        ['高辅音', '´', '`', '`', 'ˆ', '-', '-'],
        ['低辅音', '¯', '´', 'ˆ', '´', '-', '-'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 4,
  },

  rule_5_compound_vowels: {
    id: 'rule_5_compound_vowels',
    lessonId: 'lesson5',
    title: '拼读规则 5: 复合元音',
    content: [
      '🔗 复合元音 = 2-3个元音符号组合',
      '',
      '✅ เอีย [ia]: เ + ี + ย',
      '   例: เมีย [mia] (妻子)',
      '',
      '✅ เอือ [ɯa]: เ + ื + อ',
      '   例: เมือง [mɯaŋ] (城市)',
      '',
      '✅ อัว [ua]: ั + ว',
      '   例: ควาย [khwaːy] (水牛)',
      '',
      '📌 拼读技巧: 先读辅音,再滑过整个复合元音',
    ],
    interactiveExample: {
      consonant: 'ม',
      vowel: 'เอีย',
      syllable: 'เมีย',
      pronunciation: 'mia',
      audioUrl:
        'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-mia.mp3',
    },
    duration: 30,
    order: 5,
  },

  rule_6_special_cases: {
    id: 'rule_6_special_cases',
    lessonId: 'lesson6',
    title: '拼读规则 6: 特殊规则',
    content: [
      '🔸 ญ: 作声母读 [y],作尾音读 [n]',
      '   例: ญาติ [yâːt] (亲戚), หญิง [yǐŋ] (女人)',
      '',
      '🔸 ฤ/ฦ: 梵文专用,现代泰语少见',
      '   例: ฤดู [rɯ́dùː] (季节)',
      '',
      '🔸 ห + 低辅音: 变高调规则',
      '   例: หนู [nǔː] = ห(静音) + นู (变高调)',
      '',
      '🔸 ไ/ใ: 同音不同形,ใ仅28个词',
      '   例: ใกล้ [klây] (近), ไกล [klay] (远)',
    ],
    duration: 40,
    order: 6,
  },
};

/**
 * 从 DB 读取课程元数据，失败时回退到本地 LESSON_METADATA。
 * @param {object} db - cloud.database() 实例
 * @param {string} lessonId
 * @returns {Promise<object|null>}
 */
async function getLessonMetadataFromDb(db, lessonId) {
  if (!lessonId) return null;

  try {
    const col = db.collection('alphabet_lessons');
    const res = await col.doc(lessonId).get();
    if (res && res.data && res.data.length > 0) {
      return res.data[0];
    }
  } catch (err) {
    console.warn(
      '[alphabetLessonConfig] getLessonMetadataFromDb error:',
      lessonId,
      err && err.message,
    );
  }

  return LESSON_METADATA[lessonId] || null;
}

/**
 * 从 DB 读取某课对应的拼读规则，失败时回退到本地 PHONICS_RULES。
 * @param {object} db - cloud.database() 实例
 * @param {string} lessonId
 * @returns {Promise<object|null>}
 */
async function getPhonicsRuleByLessonFromDb(db, lessonId) {
  if (!lessonId) return null;

  try {
    const col = db.collection('phonics_rules');
    const res = await col
      .where({ lessonId })
      .limit(1)
      .get();

    if (res && res.data && res.data.length > 0) {
      return res.data[0];
    }
  } catch (err) {
    console.warn(
      '[alphabetLessonConfig] getPhonicsRuleByLessonFromDb error:',
      lessonId,
      err && err.message,
    );
  }

  const fallback = Object.values(PHONICS_RULES).find(
    (r) => r.lessonId === lessonId,
  );
  return fallback || null;
}

module.exports = {
  LESSON_METADATA,
  PHONICS_RULES,
  getLessonMetadataFromDb,
  getPhonicsRuleByLessonFromDb,
};

