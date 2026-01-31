const assert = require('assert');
const path = require('path');

// =============================================================================
// Mock Framework
// =============================================================================

// Mock DB Collection
class MockCollection {
    constructor(data = []) {
        this.data = data;
        this.filters = {};
        this.ops = [];
    }

    where(conditions) {
        this.filters = { ...this.filters, ...conditions };
        return this;
    }

    orderBy(field, order) {
        this.ops.push({ type: 'orderBy', field, order });
        return this;
    }

    limit(n) {
        this.ops.push({ type: 'limit', n });
        return this;
    }

    async get() {
        let results = [...this.data];

        // Simple filtering simulation
        if (this.filters._id && this.filters._id.$nin) {
            results = results.filter(item => !this.filters._id.$nin.includes(item._id));
        }

        if (this.filters.nextReviewAt && this.filters.nextReviewAt.$lte) {
            const now = new Date(this.filters.nextReviewAt.$lte);
            results = results.filter(item => new Date(item.nextReviewAt) <= now);
        }

        const limitOp = this.ops.find(op => op.type === 'limit');
        if (limitOp) {
            results = results.slice(0, limitOp.n);
        }

        return { data: results };
    }

    async add(doc) { return { _id: 'mock_id_' + Date.now() }; }
    async update(doc) { return { updated: 1 }; }
}

// Mock DB
const mockDb = {
    collections: {},
    command: {
        in: (arr) => ({ $in: arr }),
        nin: (arr) => ({ $nin: arr }),
        lte: (val) => ({ $lte: val }),
    },
    collection: (name) => {
        if (!mockDb.collections[name]) {
            mockDb.collections[name] = new MockCollection([]);
        }
        return mockDb.collections[name];
    },
};

// =============================================================================
// Dependency Mocks context
// =============================================================================

const Module = require('module');
const originalRequire = Module.prototype.require;

const MOCK_MEMORY_ENGINE = {
    getTodayReviewEntities: async (db, userId, entityType, limit) => {
        console.log(`[Mock] getTodayReviewEntities called with limit: ${limit}`);
        const col = db.collection('memory_status');
        const now = new Date();
        const results = col.data.filter(m =>
            m.userId === userId &&
            m.entityType === entityType &&
            new Date(m.nextReviewAt) <= now
        );
        return results.slice(0, limit);
    },
    getOrCreateMemory: async (db, userId, entityType, entityId) => {
        return {
            entityId, userId, entityType, reviewStage: 0, masteryLevel: 0
        };
    },
    checkModuleAccess: async () => ({ allowed: true, progress: { dailyLimit: 20 } })
};

const MOCK_RESPONSE = {
    createResponse: (success, data, msg) => ({ success, data, msg })
};

const MOCK_ALPHABET_CONFIG = {
    getLessonMetadataFromDb: async () => null,
    getPhonicsRuleByLessonFromDb: async () => null
};

Module.prototype.require = function (path) {
    if (path.includes('memoryEngine')) return MOCK_MEMORY_ENGINE;
    if (path.includes('response')) return MOCK_RESPONSE;
    if (path.includes('alphabetLessonConfig')) return MOCK_ALPHABET_CONFIG;
    return originalRequire.apply(this, arguments);
};

const TARGET_PATH = '/Users/liangjianyu/LearnOnThailand/ThaiLearningApp/cloudbase/functions/memory-engine/handlers/getTodayMemories.js';
const getTodayMemories = require(TARGET_PATH);

// =============================================================================
// Test Scenarios
// =============================================================================

async function runTests() {
    console.log('🧪 Starting Vocab Logic Verification...\n');

    const USER_ID = 'test_user';

    // Setup Mock Data
    const words = Array.from({ length: 50 }, (_, i) => ({
        _id: `word_${i}`,
        word: `Word ${i}`,
        meaning: `Meaning ${i}`,
        lessonNumber: i + 1
    }));

    mockDb.collections['vocabulary'] = new MockCollection(words);

    // --- Scenario 1: New Words Only (No Reviews) ---
    console.log('▶️  Test 1: New Words Only (Limit 10)');
    mockDb.collections['memory_status'] = new MockCollection([]);

    let res = await getTodayMemories(mockDb, { userId: USER_ID, entityType: 'word', limit: 10 });

    assert.strictEqual(res.success, true, 'Should succeed');

    // Logic: 10 unique items. (Interleaving may result in length > 10, that is fine)
    const uniqueIds1 = new Set(res.data.items.map(i => i._id));
    assert.strictEqual(uniqueIds1.size, 10, 'Should return exactly 10 UNIQUE items');
    assert.strictEqual(res.data.summary.newCount, 10, 'Summary newCount should be 10');
    assert.strictEqual(res.data.summary.reviewCount, 0, 'Summary reviewCount should be 0');

    console.log('✅ Passed\n');


    // --- Scenario 2: Reviews + New Words (Mixed) ---
    console.log('▶️  Test 2: Reviews (5) + New Words (Limit 10)');
    console.log('   Goal: Total Unique should be 15 (10 New + 5 Review), NOT capped at 10.');

    // Setup 5 pending reviews
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const reviews = Array.from({ length: 5 }, (_, i) => ({
        _id: `mem_${i}`,
        userId: USER_ID,
        entityType: 'word',
        entityId: `word_${i}`,
        nextReviewAt: yesterday,
        reviewStage: 1
    }));
    mockDb.collections['memory_status'] = new MockCollection(reviews);

    res = await getTodayMemories(mockDb, { userId: USER_ID, entityType: 'word', limit: 10 });

    console.log(`   Result Summary: New=${res.data.summary.newCount}, Review=${res.data.summary.reviewCount}`);

    // Verification
    if (res.data.summary.newCount === 10 && res.data.summary.reviewCount === 5) {
        console.log('✅ Logic is FIXED!');
    } else {
        console.log('❌ Logic needs fix: New Count is ' + res.data.summary.newCount + ' (Expected 10)');
    }

    console.log('\n---------------------------------------------------');
    console.log('🏁 Verification Script Complete');
}

runTests().catch(err => {
    console.error('❌ Test Suit Failed:', err);
});
