// src/hooks/useVocabularyLearningEngine.ts
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { VocabQueueSource } from '@/src/entities/types/vocabulary.types';
export function useVocabularyLearningEngine() {
    const { 
        queue, 
        currentIndex, 
        submitResult, 
        phase,
        totalSessionWords,
        completedCount 
    } = useVocabularyStore();
    const currentItem = queue[currentIndex] || null;
    // 计算当前应该渲染哪个组件
    const getComponentType = (): VocabQueueSource | 'loading' | 'completed' | 'idle' => {
        if (phase === 'vocab-loading') return 'loading';
        if (phase === 'vocab-completed') return 'completed';
        if (!currentItem) return 'idle';
        return currentItem.source;
    };
    return {
        // 数据
        currentItem,
        currentIndex,
        queueLength: queue.length,
        progress: totalSessionWords > 0 ? completedCount / totalSessionWords : 0,
        
        // 状态标识
        componentType: getComponentType(),
        isReview: currentItem?.source === 'vocab-review',
        isQuiz: ['vocab-rev-quiz', 'vocab-new-quiz', 'vocab-error-retry'].includes(currentItem?.source || ''),
        isNew: currentItem?.source === 'vocab-new',
        // 操作转换
        handleAnswer: (isCorrect: boolean, score?: number) => {
            submitResult(isCorrect, score);
        }
    };
}