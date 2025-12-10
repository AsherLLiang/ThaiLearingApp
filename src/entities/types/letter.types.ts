// src/entities/types/letter.types.ts

/**
 * 字母类型定义
 *
 * 数据源: letters_final.enriched.json (80 个泰语字母/元音/声调)
 * 更新日期: 2025-12-06
 *
 * 说明: 此接口尽量贴近数据库 letters 集合的实际结构。
 * - 部分历史字段 (audioPath/learningLevel/strokeCount/createdAt/lessonNumber)
 *   在最新版本中已从数据源中移除,因此在类型中保留为可选,仅用于兼容旧数据。
 */

// ==================== 基础类型 ====================

/**
 * 字母类型
 */
export type LetterType = 'consonant' | 'vowel' | 'tone';

/**
 * 辅音类别 (仅辅音有效)
 */
export type ConsonantClass = 'mid' | 'high' | 'low';

/**
 * 学习级别
 */
export type LearningLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

/**
 * 字母主类别
 */
export type LetterCategory = 'mid_consonant' | 'high_consonant' | 'low_consonant' | 'vowel' | 'tone';

// ==================== 主要接口 ====================

/**
 * Letter - 完整的字母数据结构
 * 
 * ⭐ 此接口包含letters_final.json的所有字段
 * ⭐ 对应数据库letters集合的文档结构
 */
export interface Letter {
    // ===== 基础字段 (原有数据库字段) =====
    _id: string;                    // 唯一标识 (如: "TH_C_01")
    type: LetterType;               // 类型: consonant | vowel | tone
    thaiChar: string;               // 泰文字符 (如: "ก")
    nameThai: string;               // 泰文名称 (如: "ไก่")
    nameEnglish: string;            // 英文名称 (如: "ko kai")
    initialSound: string;           // 首音 (如: "k")
    finalSound: string;             // 尾音 (如: "k")
    class: ConsonantClass | null;   // 辅音类别 (仅辅音有效,元音/声调为null)
    exampleWord: string;            // 例词 (如: "ไก่")
    exampleMeaning: string;         // 例词含义 (如: "鸡")

    // 以下为历史字段,目前数据源中已移除,保留为可选以兼容旧数据
    audioPath?: string;             // 旧版音频路径 (可能为空,建议使用fullSoundUrl)
    strokeCount?: number;           // 笔画数 (预留字段,暂未使用)
    learningLevel?: LearningLevel;  // 学习级别
    createdAt?: string;             // 创建日期 (ISO格式)
    
    // ===== 新增字段 (来自letters.json合并) =====
    
    // 课程与分类
    lessonId?: string;              // 主课程 ID (如: "lesson1")
    lessonNumber?: number;          // 旧课程编号 (1-7), 已废弃
    category: LetterCategory;       // 主类别 (如: "mid_consonant", "high_consonant")
    subCategory: string;            // 子类别 (如: "lesson1_mid", "lesson4_high")
    
    // 键盘输入
    keyboardKey?: string;           // 键盘按键 (如: "d", "j") - 可选
    
    // 发音系统 (多层级音频)
    fullSound?: string;             // 完整发音标识 (如: "consonant-ko-kai")
    fullSoundUrl?: string;          // ⭐ 完整发音URL (优先使用)
    fullSoundFileId?: string;       // CloudBase 完整发音 fileId (cloud://...)
    fullSoundLocalPath?: string;    // 本地缓存路径（file://）

    syllableSoundName?: string;     // 音节发音名称 (如: "k")
    syllableSound?: string;         // 音节发音标识
    syllableSoundUrl?: string;      // 音节发音URL (用于音节练习)
    syllableSoundFileId?: string;   // CloudBase 音节发音 fileId
    syllableSoundLocalPath?: string;// 本地缓存路径

    endSyllableSoundName?: string;  // 尾音节名称
    endSyllableSound?: string;      // 尾音节发音标识
    endSyllableSoundUrl?: string;   // 尾音节发音URL (用于辅音尾音练习)
    endSyllableSoundFileId?: string;// CloudBase 尾音节发音 fileId
    endSyllableSoundLocalPath?: string;// 本地缓存路径

    letterNamePronunciation?: string; // ⭐ 字母名称发音 (如: "kay`")
    letterPronunciationUrl?: string;  // 字母发音URL
    letterPronunciationFileId?: string; // CloudBase 字母发音 fileId
    letterPronunciationLocalPath?: string; // 本地缓存路径
    
    // 多媒体资源
    letterImageUrl?: string;        // 字母图片URL (预留)
    
    // 描述信息
    description?: string;           // 额外描述信息 (可选)

    // 课程编排（来自 letters_final.enriched.json）
    usageTag?: string;                     // 使用标签: core / rare / supplement 等
    lessonGroup?: string;                  // 课程组别: core / supplement 等
    curriculumLessonIds?: string[];        // 所属课程 ID 列表，例如 ['lesson1', 'lesson3']
    curriculumLessonOrders?: number[];     // 各课程内排序序号
    primaryCurriculumLessonId?: string;    // 主课程 ID，例如 'lesson1'
    primaryCurriculumLessonOrder?: number; // 主课程中的排序
}

/**
 * LetterListItem - 简化版字母数据 (用于列表显示)
 */
export interface LetterListItem {
    _id: string;
    thaiChar: string;
    nameThai: string;
    nameEnglish: string;
    type: LetterType;
    class: ConsonantClass | null;
    lessonId?: string;
    category: LetterCategory;
    isMastered?: boolean;           // 前端添加: 是否已掌握
}

/**
 * LetterProgress - 字母学习进度
 */
export interface LetterProgress {
    masteredCount: number;          // 已掌握数量
    totalCount: number;             // 总数量 (80个)
    accuracy: number;               // 正确率 (0-100)
    masteredIds: string[];          // 已掌握的字母ID列表
}

/**
 * LetterStatistics - 字母统计信息
 */
export interface LetterStatistics {
    total: number;
    consonants: number;
    vowels: number;
    tones: number;
    byLesson: {
        lesson1: number;
        lesson2: number;
        lesson3: number;
        lesson4: number;
        lesson5: number;
        lesson6: number;
        lesson7: number;
    };
    byClass: {
        mid: number;
        high: number;
        low: number;
    };
}

/**
 * LetterFilter - 字母搜索/过滤条件
 */
export interface LetterFilter {
    type?: LetterType;
    lessonId?: string;
    class?: ConsonantClass;
    category?: LetterCategory;
    subCategory?: string;
    excludeIds?: string[];
}

// ==================== 辅助类型 ====================

/**
 * 音频URL优先级类型
 */
export type AudioUrlPriority = {
    primary: string | undefined;    // fullSoundUrl
    secondary: string | undefined;  // letterPronunciationUrl
    fallback: string;               // audioPath
};

/**
 * 字母显示信息 (用于UI组件)
 */
export interface LetterDisplayInfo {
    char: string;                   // 泰文字符
    name: string;                   // 名称 (优先泰文)
    pronunciation: string;          // 发音 (优先letterNamePronunciation)
    example: string;                // 完整例词 (包含中文)
    audioUrl: string;               // 音频URL (已处理优先级)
    keyboardHint?: string;          // 键盘提示
}
