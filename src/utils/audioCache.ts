import * as FileSystem from 'expo-file-system/legacy';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}audio/`;

/**
 * 确保缓存目录存在
 */
async function ensureCacheFolderExists() {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (!dirInfo.exists) {
        console.log('Cache folder does not exist, creating...');
        await FileSystem.makeDirectoryAsync(
            CACHE_FOLDER,
            { intermediates: true }
        );
    }
}

/**
* 获取缓存的音频 URI (Get Cached Audio URI)
* 逻辑：检查本地 -> 无则下载 -> 返回本地 URI
* @param remoteUrl 腾讯云的音频链接
* @returns 本地 URI (file://) | 网络 URI (https://)
*/
export async function getCachedAudioUri(remoteUrl: string): Promise<string> {
    await ensureCacheFolderExists();
    try {
        const fileName = remoteUrl.split('/').pop() || `temp_${Date.now()}.mp3`;
        const localUri = `${CACHE_FOLDER}${fileName}`;

        // 检查本地缓存是否存在且有效（大于 1KB 排除错误页面）
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists && fileInfo.size && fileInfo.size > 1024) {
            return localUri;
        }

        // 如果文件存在但过小（可能是损坏文件），先删除
        if (fileInfo.exists) {
            console.warn(`⚠️ [AudioCache] Removing corrupted file: ${fileName} (${fileInfo.size} bytes)`);
            await FileSystem.deleteAsync(localUri, { idempotent: true });
        }

        // 下载并验证
        console.log(`[Downloading] Fetching from cloud: ${fileName}`);
        const downloadRes = await FileSystem.downloadAsync(remoteUrl, localUri);

        // 验证 HTTP 状态码
        if (downloadRes.status !== 200) {
            console.warn(`⚠️ [AudioCache] Download failed for ${fileName}: HTTP ${downloadRes.status}`);
            await FileSystem.deleteAsync(localUri, { idempotent: true });
            return remoteUrl;
        }

        // 验证文件大小（有效 MP3 应该 > 1KB）
        const downloadedInfo = await FileSystem.getInfoAsync(localUri);
        if (!downloadedInfo.exists || (downloadedInfo.exists && downloadedInfo.size < 1024)) {
            console.warn(`⚠️ [AudioCache] Downloaded file too small: ${fileName} (${downloadedInfo.exists ? downloadedInfo.size : 0} bytes)`);
            await FileSystem.deleteAsync(localUri, { idempotent: true });
            return remoteUrl;
        }

        return downloadRes.uri;

    } catch (error) {
        console.error("Error in getCachedAudioUri:", error);
        return remoteUrl;
    }
}

/**
 * 批量下载音频 (Batch Download)
 * 控制并发数 (Concurrency Control)
 * @param urls 音频 URL 列表
 * @param batchSize 每批次下载数量，默认为 5
 */
export async function downloadAudioBatch(urls: string[], batchSize: number = 5) {
    if (!urls || urls.length === 0) {
        console.log('⚠️ [AudioCache] downloadAudioBatch called with empty URLs');
        return;
    }

    console.log(`🚀 [AudioCache] Starting batch download for ${urls.length} files...`);
    await ensureCacheFolderExists();
    // 将 URL 数组分成小块 (Chunking)
    // [1,2,3,4,5,6,7] -> [[1,2,3,4,5], [6,7]]
    for (let i = 0; i < urls.length; i += batchSize) {
        const chunk = urls.slice(i, i + batchSize);

        // Promise.all 会等待这一批的 5 个全部完成，再进行下一批（这是最简单的并发控制方法）
        await Promise.all(chunk.map(url => getCachedAudioUri(url)));
        console.log(`Processing batch ${i / batchSize + 1}...`);
    }
}

