import {
    VocabularyResponse,
    VocabQueueSource,
    SessionWord
} from "@/src/entities/types/vocabulary.types";
/**
 * 构建平铺的单词学习队列
 * 策略：复习词 -> 复习测验 -> 新词 -> 新词测验
 * 目标：将复习词和新词都拆分成两个阶段：精讲和测验
 * @param data 单词响应数据
 * @returns queue:平铺的vocabs队列
 */
export function buildVocabQueue(data: VocabularyResponse): SessionWord[] {
    //1.初始化队列
    const queue: SessionWord[] = [];
    //2.获取单词数据
    const items = data.items || [];
    //3.从 items 中 extract 复习词
    const reviewWords = items.filter(item => item.memoryState.isNew === false);
    //4.从 items 中 extract 新词
    const newWords = items.filter(item => item.memoryState.isNew === true);
    //5.遍历复习词,为每个复习词生成2个记录
    // Helper function to process batches
    const processBatch = (items: VocabularyResponse['items'], isNew: boolean) => {
        const BATCH_SIZE = 5;
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const chunk = items.slice(i, i + BATCH_SIZE);

            // 1. Push Learning/Review Phase Items (The whole batch)
            chunk.forEach(item => {
                const base: SessionWord = {
                    id: item._id,
                    entity: item,
                    isNew: isNew,
                    masteryLevel: item.memoryState.masteryLevel || 0,
                    mistakeCount: 0,
                    source: isNew ? 'vocab-new' : 'vocab-review',
                    // Initialize selfRating as undefined
                };
                queue.push(base);
            });

            // 2. Push Quiz Phase Items (The whole batch)
            chunk.forEach(item => {
                const base: SessionWord = {
                    id: item._id,
                    entity: item,
                    isNew: isNew,
                    masteryLevel: item.memoryState.masteryLevel || 0,
                    mistakeCount: 0,
                    source: isNew ? 'vocab-new-quiz' : 'vocab-rev-quiz',
                };
                queue.push(base);
            });
        }
    };

    // 5. Process Review Words (Batch: 5 Review -> 5 Quiz)
    processBatch(reviewWords, false);

    // 6. Process New Words (Batch: 5 Learn -> 5 Quiz)
    processBatch(newWords, true);
    return queue;
}