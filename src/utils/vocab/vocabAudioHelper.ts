import * as FileSystem from 'expo-file-system/legacy';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';

// 腾讯云存储 Base URL
const CLOUD_BASE = 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la';
const CACHE_FOLDER = `${FileSystem.cacheDirectory}audio/`;

console.log('📂 [AudioHelper] Cache directory:', FileSystem.cacheDirectory);

/**
 * 拼接完整云端 URL
 * 策略：
 * 如果数据库里存的是完整链接则直接用，否则根据 source 拼接正确的云存储路径
 * 云存储结构：BaseThai_Audio/{source}_Audio/{filename}
 * 例如：BaseThai_Audio/BaseThai_1_Audio/101.mp3
 */
export function resolveVocabPath(path: string | undefined, source?: string): string {
    if (!path) {
        return '';
    }
    if (path.startsWith('http')) {
        return path;
    }
    // 根据 source 构建正确的云存储路径
    const audioFolder = source ? `BaseThai_Audio/${source}_Audio` : 'BaseThai_Audio';
    return `${CLOUD_BASE}/${audioFolder}/${path}`;
}
/**
 * 获取缓存的音频 URI (Get Cached Audio URI)
 * 策略：
 * 1. 调用resolveVocabPath拼接完整远程 URL
 * 2. 预测本地路径
 * 3. 检查本地缓存
 * @param input 传入字符串路径或包含 audioPath 的对象
 * @param source 课程来源，如 'BaseThai_1'
 * @returns localUri | remoteUrl
 */
export async function getVocabAudioUrl(input: string | { audioPath?: string }, source?: string): Promise<string> {
    const path = typeof input === 'string' ? input : input.audioPath;

    if (!path) {
        return '';
    }
    // 1. 拼接完整远程 URL
    const remoteUrl = resolveVocabPath(path, source);
    // 2. 预测本地路径
    const fileName = remoteUrl.split('/').pop() || `temp_${Date.now()}.mp3`;
    const localUri = `${CACHE_FOLDER}${fileName}`;
    // 3. 检查本地缓存
    try {
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
            return localUri;
        } else {
            return remoteUrl;
        }
    } catch (error) {
        console.warn('Error checking local audio cache:', error);
        // 4. 如果没有缓存，返回远程 URL
        return remoteUrl;
    }
}

/**
 * 获取单词关联的所有音频路径 (用于批量预下载)
 */
export function getAllVocabAudioPaths(vocab: Vocabulary): string[] {
    const paths: string[] = [];

    // 1. 主音频
    if (vocab.audioPath) paths.push(vocab.audioPath);

    // 2. 对话音频
    if (vocab.dialogue?.对话内容) {
        Object.values(vocab.dialogue.对话内容).forEach(item => {
            if (item && item.audioPath) paths.push(item.audioPath);
        });
    }

    // 3. 例句音频
    if (vocab.exampleSentences) {
        Object.values(vocab.exampleSentences).forEach(item => {
            if (item && item.audioPath) paths.push(item.audioPath);
        });
    }

    // 4. 同根词音频
    if (vocab.cognates) {
        vocab.cognates.forEach(item => {
            if (item && item.audioPath) paths.push(item.audioPath);
        });
    }

    return Array.from(new Set(paths)); // 去重
}

