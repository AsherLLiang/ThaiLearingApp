
// scripts/vocab.test.js

// Mock setup must happen before imports
// We need to handle the '@' alias if Jest doesn't pick it up automatically, 
// but assuming babel-jest with expo preset handles it. 
// If it fails, we might need a jest.config.js.

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

// Mock zustand persistence
jest.mock('zustand/middleware', () => ({
    persist: (config) => (set, get, api) => config(set, get, api),
    createJSONStorage: () => ({}),
}));

// Mock Dependencies
jest.mock('../src/utils/apiClient', () => ({
    callCloudFunction: jest.fn(),
}));

jest.mock('../src/utils/audioCache', () => ({
    downloadAudioBatch: jest.fn().mockResolvedValue(undefined),
}));

// Mock vocabAudioHelper to avoid issues with platform specific code if any
jest.mock('../src/utils/vocab/vocabAudioHelper', () => ({
    resolveVocabPath: (path) => path,
}));

// Mock UserStore to provide userId
jest.mock('../src/stores/userStore', () => ({
    useUserStore: {
        getState: () => ({
            currentUser: { userId: 'mock-user-123' }
        })
    }
}));

// Imports
const { useVocabularyStore } = require('../src/stores/vocabularyStore');
const { buildVocabQueue } = require('../src/utils/vocab/buildVocabQueue');
const { callCloudFunction } = require('../src/utils/apiClient');

// Helper
const createMockItem = (id, isNew) => ({
    _id: id,
    vocabularyId: id,
    thaiWord: 'Thai ' + id,
    memoryState: { isNew, masteryLevel: 0 },
    audioPath: id + '.mp3'
});

describe('VocabularyStore Hybrid Scoring Logic (JS)', () => {
    let store;

    beforeEach(() => {
        // Reset Store State
        useVocabularyStore.setState({
            queue: [],
            currentIndex: 0,
            phase: 'IDLE',
            pendingResults: [],
            completedCount: 0,
        });
        store = useVocabularyStore.getState();
        callCloudFunction.mockClear();
    });

    test('Batching Logic: Should structure queue as Learn(5) -> Quiz(5)', () => {
        const items = Array.from({ length: 10 }, (_, i) => createMockItem(`W${i}`, false));
        // Mock response wrapper
        const response = { items, summary: { total: 10 } };
        const queue = buildVocabQueue(response);

        // Expecting 20 items total (10 Learn + 10 Quiz)
        // Batch 1 (Items 0-4):
        // 0-4 should be 'vocab-review'
        // 5-9 should be 'vocab-rev-quiz'

        expect(queue.length).toBe(20);

        const batch1Learn = queue.slice(0, 5);
        const batch1Quiz = queue.slice(5, 10);

        expect(batch1Learn.every(i => i.source === 'vocab-review')).toBe(true);
        expect(batch1Quiz.every(i => i.source === 'vocab-rev-quiz')).toBe(true);

        // Check IDs match within batch (Learn W0 -> Quiz W0)
        expect(batch1Learn[0].id).toBe('W0');
        expect(batch1Quiz[0].id).toBe('W0');
    });

    test('State Sync: markSelfRating should sync to corresponding Quiz item', () => {
        const item = createMockItem('W1', false);
        const queue = buildVocabQueue({ items: [item] }); // [Review, Quiz]
        useVocabularyStore.setState({ queue, currentIndex: 0 });

        // Mark rating
        useVocabularyStore.getState().markSelfRating(5);

        const updatedQueue = useVocabularyStore.getState().queue;
        // Current index should NOT advance immediately? 
        // Wait, implementation says "get().next()".
        expect(useVocabularyStore.getState().currentIndex).toBe(1);

        // Quiz Item (Index 1) should have selfRating=5
        expect(updatedQueue[1].selfRating).toBe(5);
    });

    // --- Scoring Matrix Scenarios ---
    const runScenario = async (mode, rating, mistakes, expectedQuality) => {
        const isNew = mode === 'New';
        const item = createMockItem('W1', isNew);
        const queue = buildVocabQueue({ items: [item] });

        // Setup: Index 1 is the Quiz item
        queue[1].selfRating = rating;

        useVocabularyStore.setState({ queue, currentIndex: 1, pendingResults: [] });

        // Simulate Mistakes
        for (let i = 0; i < mistakes; i++) {
            await useVocabularyStore.getState().submitResult(false);
        }

        // Simulate Correct
        await useVocabularyStore.getState().submitResult(true);

        const pending = useVocabularyStore.getState().pendingResults;
        expect(pending).toHaveLength(1);
        expect(pending[0].quality).toBe(expectedQuality);
    };

    test('Review: Remembered(5) + 0 Mistakes -> Perfect(5)', () => runScenario('Review', 5, 0, 5));
    test('Review: Remembered(5) + 1 Mistake  -> Good(4)', () => runScenario('Review', 5, 1, 4));
    test('Review: Remembered(5) + 2 Mistakes -> Pass(3)', () => runScenario('Review', 5, 2, 3));

    test('Review: Fuzzy(3)      + 0 Mistakes -> Pass(3)', () => runScenario('Review', 3, 0, 3));
    test('Review: Fuzzy(3)      + 1 Mistake  -> Weak(2)', () => runScenario('Review', 3, 1, 2));

    test('Review: Forgot(1)     + 0 Mistakes -> Fail(1)', () => runScenario('Review', 1, 0, 1));

    test('New: Know(5)          + 0 Mistakes -> Perfect(5)', () => runScenario('New', 5, 0, 5));
    test('New: Know(5)          + 1 Mistake  -> Good(4)', () => runScenario('New', 5, 1, 4));
    test('New: Know(5)          + 2 Mistakes -> Pass(3)', () => runScenario('New', 5, 2, 3));

    test('New: DontKnow(3)      + 0 Mistakes -> Pass(3)', () => runScenario('New', 3, 0, 3));
    test('New: DontKnow(3)      + 1 Mistake  -> Weak(2)', () => runScenario('New', 3, 1, 2));

    test('Retry Phase Logic: Errors in retry phase should NOT increment mistakeCount', async () => {
        const item = createMockItem('W1', false);
        const queue = buildVocabQueue({ items: [item] });

        // Simulate existing retry item
        const retryItem = {
            ...queue[1],
            source: 'vocab-error-retry',
            mistakeCount: 1
        };

        queue.push(retryItem);
        // Index 2 is Retry Item
        useVocabularyStore.setState({ queue, currentIndex: 2 });

        // Fail 3 times
        await useVocabularyStore.getState().submitResult(false);
        await useVocabularyStore.getState().submitResult(false);

        const currentItem = useVocabularyStore.getState().queue[2];
        expect(currentItem.mistakeCount).toBe(1); // Should stay 1
    });

    test('Deferred Submission: flushResults triggered at end of session', async () => {
        const item = createMockItem('W1', false);
        const queue = buildVocabQueue({ items: [item] });
        // Index 1 = Quiz
        useVocabularyStore.setState({ queue, currentIndex: 1, pendingResults: [] });

        await useVocabularyStore.getState().submitResult(true);

        // Expect flush
        expect(callCloudFunction).toHaveBeenCalledTimes(1);
        // Arg verification
        const callArgs = callCloudFunction.mock.calls[0];
        expect(callArgs[0]).toBe("submitMemoryResult");
        expect(callArgs[1].quality).toBeDefined();
    });

});
