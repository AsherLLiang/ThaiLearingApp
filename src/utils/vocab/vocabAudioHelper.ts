import * as FileSystem from 'expo-file-system/legacy';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';

// Tencent Cloud Object Storage Base URL
const BASE_URL = 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/vocabulary/';
const CACHE_FOLDER = `${FileSystem.cacheDirectory}audio/`;
/**
 * 获取单词的最佳播放链接
 * 策略：
 * 1. 拼接完整云端 URL
 * 2. 检查本地是否有缓存
 * 3. 有则返回 file:// (极速)，无则返回 https:// (在线)
 * 
 * 注意：此函数 *不* 触发下载，只做检查。下载应由 downloadAudioBatch 在并在后台处理。
 */
export async function getVocabAudioUrl(vocab: Vocabulary): Promise<string> {
    if (!vocab.audioPath) {
        return '';
    }
    // 1. 拼接完整远程 URL
    // 如果数据库里存的是完整链接则直接用，否则拼接 BASE_URL
    const remoteUrl = vocab.audioPath.startsWith('http')
        ? vocab.audioPath
        : `${BASE_URL}${vocab.audioPath}`;
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
