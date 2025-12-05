const getTodayWords = require('./handlers/getTodayWords');
const getVocabularyList = require('./handlers/getVocabularyList');
const getVocabularyDetail = require('./handlers/getVocabularyDetail');
const getTodayMemories = require('./handlers/getTodayMemories');
const getSkippedWords = require('./handlers/getSkippedWords');

// Mock DB
const mockDb = {
    collection: (name) => {
        if (name === 'user_progress') {
            return {
                where: () => ({
                    get: async () => ({
                        data: [{
                            userId: 'test-user',
                            letterCompleted: false,
                            letterProgress: 0.5,
                            wordUnlocked: false,
                            sentenceUnlocked: false,
                            articleUnlocked: false,
                            currentStage: 'letter'
                        }]
                    })
                })
            };
        }
        // Return empty for other collections to avoid errors in subsequent steps if lock check fails
        return {
            where: () => ({
                get: async () => ({ data: [] }),
                count: async () => ({ total: 0 }),
                skip: () => ({ limit: () => ({ get: async () => ({ data: [] }) }) }),
                limit: () => ({ get: async () => ({ data: [] }) })
            }),
            doc: () => ({ get: async () => ({ data: null }) }),
            count: async () => ({ total: 0 })
        };
    }
};

async function runTests() {
    console.log('Starting Module Lock Tests...');
    const userId = 'test-user';

    // Test getTodayWords
    console.log('\nTesting getTodayWords...');
    const res1 = await getTodayWords(mockDb, { userId });
    if (res1.errorCode === 'MODULE_LOCKED') {
        console.log('✅ getTodayWords correctly locked.');
    } else {
        console.error('❌ getTodayWords failed to lock:', res1);
    }

    // Test getVocabularyList
    console.log('\nTesting getVocabularyList...');
    const res2 = await getVocabularyList(mockDb, { userId });
    if (res2.errorCode === 'MODULE_LOCKED') {
        console.log('✅ getVocabularyList correctly locked.');
    } else {
        console.error('❌ getVocabularyList failed to lock:', res2);
    }

    // Test getVocabularyDetail
    console.log('\nTesting getVocabularyDetail...');
    const res3 = await getVocabularyDetail(mockDb, { userId, vocabularyId: '123' });
    if (res3.errorCode === 'MODULE_LOCKED') {
        console.log('✅ getVocabularyDetail correctly locked.');
    } else {
        console.error('❌ getVocabularyDetail failed to lock:', res3);
    }

    // Test getTodayMemories (word)
    console.log('\nTesting getTodayMemories (word)...');
    const res4 = await getTodayMemories(mockDb, { userId, entityType: 'word' });
    if (res4.errorCode === 'MODULE_LOCKED') {
        console.log('✅ getTodayMemories (word) correctly locked.');
    } else {
        console.error('❌ getTodayMemories (word) failed to lock:', res4);
    }

    // Test getTodayMemories (letter) - Should NOT be locked
    console.log('\nTesting getTodayMemories (letter)...');
    const res5 = await getTodayMemories(mockDb, { userId, entityType: 'letter' });
    if (res5.errorCode !== 'MODULE_LOCKED') {
        console.log('✅ getTodayMemories (letter) correctly unlocked.');
    } else {
        console.error('❌ getTodayMemories (letter) was incorrectly locked:', res5);
    }

    // Test getSkippedWords
    console.log('\nTesting getSkippedWords...');
    const res6 = await getSkippedWords(mockDb, { userId });
    if (res6.errorCode === 'MODULE_LOCKED') {
        console.log('✅ getSkippedWords correctly locked.');
    } else {
        console.error('❌ getSkippedWords failed to lock:', res6);
    }
}

runTests().catch(console.error);
