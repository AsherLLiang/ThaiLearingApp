// src/utils/letterData.ts

/**
 * 字母数据工具函数
 * 
 * 数据源: @/assets/data/thai_letters_full.json
 * 说明: 提供字母数据的查询、过滤、统计等功能
 */

import lettersData from '@/assets/data/thai_letters_full.json';
import type { 
    Letter, 
    LetterType,
    ConsonantClass,
    LetterCategory,
    LetterFilter,
    LetterListItem,
    LetterStatistics,
    LetterDisplayInfo,
    AudioUrlPriority
} from '@/src/entities/types/letter.types';

// ==================== 基础查询 ====================

/**
 * 获取所有字母
 * @returns 所有80个字母的数组
 */
export function getAllLetters(): Letter[] {
    return lettersData as Letter[];
}

/**
 * 根据ID获取字母
 * @param id - 字母ID (如: "TH_C_01")
 * @returns 字母对象或undefined
 */
export function getLetterById(id: string): Letter | undefined {
    return getAllLetters().find(letter => letter._id === id);
}

/**
 * 根据泰文字符获取字母
 * @param thaiChar - 泰文字符 (如: "ก")
 * @returns 字母对象或undefined
 */
export function getLetterByChar(thaiChar: string): Letter | undefined {
    return getAllLetters().find(letter => letter.thaiChar === thaiChar);
}

/**
 * 获取字母总数
 * @returns 总数量 (80)
 */
export function getTotalLetterCount(): number {
    return getAllLetters().length;
}

// ==================== 分类查询 ====================

/**
 * 根据类型获取字母
 * @param type - 字母类型 ('consonant' | 'vowel' | 'tone')
 * @returns 该类型的所有字母
 */
export function getLettersByType(type: LetterType): Letter[] {
    return getAllLetters().filter(letter => letter.type === type);
}

/**
 * 根据辅音类别获取字母 (仅限辅音)
 * @param consonantClass - 辅音类别 ('mid' | 'high' | 'low')
 * @returns 该类别的所有辅音
 */
export function getLettersByConsonantClass(consonantClass: ConsonantClass): Letter[] {
    return getAllLetters().filter(
        letter => letter.type === 'consonant' && letter.class === consonantClass
    );
}

/**
 * 根据课程编号获取字母
 * @param lessonNumber - 课程编号 (1-7)
 * @returns 该课程的所有字母
 */
export function getLettersByLesson(lessonNumber: number): Letter[] {
    return getAllLetters().filter(letter => letter.lessonNumber === lessonNumber);
}

/**
 * 根据主类别获取字母
 * @param category - 主类别 (如: 'mid_consonant', 'high_consonant')
 * @returns 该类别的所有字母
 */
export function getLettersByCategory(category: LetterCategory | 'vowel'): Letter[] {
    if (category === 'vowel') {
        return getLettersByType('vowel');
    }
    
    const consonantClassMap: Record<string, ConsonantClass> = {
        'mid_consonant': 'mid',
        'high_consonant': 'high',
        'low_consonant': 'low'
    };
    
    const consonantClass = consonantClassMap[category];
    if (consonantClass) {
        return getLettersByConsonantClass(consonantClass);
    }
    
    return [];
}

/**
 * 根据子类别获取字母
 * @param subCategory - 子类别 (如: 'lesson1_mid', 'lesson4_high')
 * @returns 该子类别的所有字母
 */
export function getLettersBySubCategory(subCategory: string): Letter[] {
    return getAllLetters().filter(letter => letter.subCategory === subCategory);
}

// ==================== 高级查询 ====================

/**
 * 根据过滤条件获取字母
 * @param filter - 过滤条件
 * @returns 符合条件的字母数组
 */
export function filterLetters(filter: LetterFilter): Letter[] {
    let letters = getAllLetters();
    
    if (filter.type) {
        letters = letters.filter(l => l.type === filter.type);
    }
    
    if (filter.lessonNumber !== undefined) {
        letters = letters.filter(l => l.lessonNumber === filter.lessonNumber);
    }
    
    if (filter.class) {
        letters = letters.filter(l => l.class === filter.class);
    }
    
    if (filter.category) {
        letters = letters.filter(l => l.category === filter.category);
    }
    
    if (filter.subCategory) {
        letters = letters.filter(l => l.subCategory === filter.subCategory);
    }
    
    if (filter.excludeIds && filter.excludeIds.length > 0) {
        letters = letters.filter(l => !filter.excludeIds!.includes(l._id));
    }
    
    return letters;
}

/**
 * 搜索字母 (支持多字段模糊搜索)
 * @param query - 搜索关键词
 * @returns 匹配的字母数组
 */
export function searchLetters(query: string): Letter[] {
    if (!query.trim()) {
        return [];
    }
    
    const lowerQuery = query.toLowerCase();
    
    return getAllLetters().filter(letter => {
        return (
            letter.thaiChar?.includes(query) ||
            letter.nameThai?.toLowerCase().includes(lowerQuery) ||
            letter.nameEnglish?.toLowerCase().includes(lowerQuery) ||
            letter.initialSound?.toLowerCase().includes(lowerQuery) ||
            letter.exampleWord?.includes(query) ||
            letter.exampleMeaning?.includes(query)
        );
    });
}

/**
 * 获取随机字母
 * @param count - 需要的数量
 * @param filter - 可选的过滤条件
 * @returns 随机字母数组
 */
export function getRandomLetters(count: number, filter?: LetterFilter): Letter[] {
    let letters = filter ? filterLetters(filter) : getAllLetters();
    
    // Fisher-Yates洗牌算法
    const shuffled = [...letters];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ==================== 统计信息 ====================

/**
 * 获取字母统计信息
 * @returns 各维度的统计数据
 */
export function getLetterStatistics(): LetterStatistics {
    const letters = getAllLetters();
    
    return {
        total: letters.length,
        consonants: letters.filter(l => l.type === 'consonant').length,
        vowels: letters.filter(l => l.type === 'vowel').length,
        tones: letters.filter(l => l.type === 'tone').length,
        byLesson: {
            lesson1: letters.filter(l => l.lessonNumber === 1).length,
            lesson2: letters.filter(l => l.lessonNumber === 2).length,
            lesson3: letters.filter(l => l.lessonNumber === 3).length,
            lesson4: letters.filter(l => l.lessonNumber === 4).length,
            lesson5: letters.filter(l => l.lessonNumber === 5).length,
            lesson6: letters.filter(l => l.lessonNumber === 6).length,
            lesson7: letters.filter(l => l.lessonNumber === 7).length,
        },
        byClass: {
            mid: letters.filter(l => l.class === 'mid').length,
            high: letters.filter(l => l.class === 'high').length,
            low: letters.filter(l => l.class === 'low').length,
        }
    };
}

// ==================== 辅助函数 ====================

/**
 * 将Letter转换为ListItem (用于列表显示)
 * @param letter - 字母对象
 * @param isMastered - 是否已掌握 (可选)
 * @returns 简化的列表项
 */
export function letterToListItem(letter: Letter, isMastered?: boolean): LetterListItem {
    return {
        _id: letter._id,
        thaiChar: letter.thaiChar,
        nameThai: letter.nameThai,
        nameEnglish: letter.nameEnglish,
        type: letter.type,
        class: letter.class,
        lessonNumber: letter.lessonNumber,
        category: letter.category,
        isMastered
    };
}

/**
 * 获取字母的音频URL (处理优先级)
 * @param letter - 字母对象
 * @param baseUrl - 音频基础URL (可选)
 * @returns 处理后的音频URL
 */
export function getLetterAudioUrl(letter: Letter, baseUrl?: string): string {
    const audioId = letter.fullSoundUrl || letter.letterPronunciationUrl || letter.audioPath;
    
    if (!audioId) {
        return '';
    }
    
    // 如果已经是完整URL,直接返回
    if (audioId.startsWith('http://') || audioId.startsWith('https://')) {
        return audioId;
    }
    
    // 拼接基础URL
    if (baseUrl) {
        const separator = baseUrl.endsWith('/') || audioId.startsWith('/') ? '' : '/';
        return `${baseUrl}${separator}${audioId}`;
    }
    
    return audioId;
}

/**
 * 获取字母的所有音频URL (带优先级)
 * @param letter - 字母对象
 * @returns 音频URL对象
 */
export function getLetterAudioUrls(letter: Letter): AudioUrlPriority {
    return {
        primary: letter.fullSoundUrl,
        secondary: letter.letterPronunciationUrl,
        fallback: letter.audioPath
    };
}

/**
 * 获取字母的显示信息 (用于UI组件)
 * @param letter - 字母对象
 * @param audioBaseUrl - 音频基础URL (可选)
 * @returns 处理好的显示信息
 */
export function getLetterDisplayInfo(letter: Letter, audioBaseUrl?: string): LetterDisplayInfo {
    return {
        char: letter.thaiChar,
        name: letter.nameThai || letter.nameEnglish,
        pronunciation: letter.letterNamePronunciation || letter.initialSound,
        example: letter.exampleWord 
            ? `${letter.exampleWord} (${letter.exampleMeaning})`
            : '',
        audioUrl: getLetterAudioUrl(letter, audioBaseUrl),
        keyboardHint: letter.keyboardKey
    };
}

/**
 * 按课程分组字母
 * @returns 按课程编号分组的字母对象
 */
export function groupLettersByLesson(): Record<number, Letter[]> {
    const letters = getAllLetters();
    const grouped: Record<number, Letter[]> = {};
    
    for (let i = 1; i <= 7; i++) {
        grouped[i] = letters.filter(l => l.lessonNumber === i);
    }
    
    return grouped;
}

/**
 * 按类型分组字母
 * @returns 按类型分组的字母对象
 */
export function groupLettersByType(): Record<LetterType, Letter[]> {
    const letters = getAllLetters();
    
    return {
        consonant: letters.filter(l => l.type === 'consonant'),
        vowel: letters.filter(l => l.type === 'vowel'),
        tone: letters.filter(l => l.type === 'tone')
    };
}