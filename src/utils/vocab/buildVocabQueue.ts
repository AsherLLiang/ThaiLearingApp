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
    reviewWords.forEach(
        (item) => {
            //Copy the original data to const base and perform basic initialization to ensure the integrity of the data structure
            const base: SessionWord = {
                id: item._id,
                entity: item,
                isNew: false,
                masteryLevel: item.memoryState.masteryLevel || 0,
                mistakeCount: 0,
                source: 'vocab-review' // Set the phase to show the review word
            }
            //Each review word generates 2 records:
            //Show the detail of review word
            queue.push({ ...base, source: 'vocab-review' })
            //Show the quizs of review word
            queue.push({ ...base, source: 'vocab-rev-quiz' })
        }
    )
    //6.遍历新词,为每个新词生成2个记录(精讲、测验)
    newWords.forEach(
        (item) => {
            //Copy the original data to const base and perform basic initialization to ensure the integrity of the data structure
            const base: SessionWord = {
                id: item._id,
                entity: item,
                isNew: true,
                masteryLevel: item.memoryState.masteryLevel || 0,
                mistakeCount: 0,
                source: 'vocab-new' // Set the phase to show the new word
            }
            //Each new word generates 2 records:
            //Show the details of new word（精讲）
            queue.push({ ...base, source: 'vocab-new' })
            //Show the quizs of new word（测验）
            queue.push({ ...base, source: 'vocab-new-quiz' })
        }
    )
    return queue;
}