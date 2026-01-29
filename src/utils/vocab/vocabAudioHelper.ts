import * as FileSystem from 'expo-file-system/legacy';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';

// Tencent Cloud Object Storage Base URL
const BASE_URL = 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/vocabulary/';
const CACHE_FOLDER = `${FileSystem.cacheDirectory}audio/`;
/**
 * 拼接完整云端 URL
 * 策略：
 * 如果数据库里存的是完整链接则直接用，否则拼接 BASE_URL
 */
export function resolveVocabPath(path: string | undefined): string {
    if (!path) {
        return '';
    }
    return path.startsWith('http') ? path : `${BASE_URL}${path}`;
}
/**
 * 获取缓存的音频 URI (Get Cached Audio URI)
 * 策略：
 * 1. 调用resolveVocabPath拼接完整远程 URL
 * 2. 预测本地路径
 * 3. 检查本地缓存
 * @param vocab 
 * @returns localUri | remoteUrl
 */
export async function getVocabAudioUrl(vocab: { audioPath?: string }): Promise<string> {
    if (!vocab.audioPath) {
        return '';
    }
    // 1. 拼接完整远程 URL
    const remoteUrl = resolveVocabPath(vocab.audioPath);
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
