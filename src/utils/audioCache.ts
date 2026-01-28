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

        //Check if it exists locally (Check Local)
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
            //console.log(`Audio ${fileName} already cached`);
            return localUri;
        }

        //Download remote Uri
        console.log(`[Downloading] Fetching from cloud: ${fileName}`);
        const downloadRes = await FileSystem.downloadAsync(remoteUrl, localUri);
        return downloadRes.uri

    } catch (error) {
        console.error("Error in getCachedAudioUri:", error);
        // If caching fails, as a fallback solution, directly return the original network URL 
        // to ensure that users can hear the sound.
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
    console.log(`Starting batch download for ${urls.length} files...`);

    if(!urls || urls.length === 0) return;
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
    
