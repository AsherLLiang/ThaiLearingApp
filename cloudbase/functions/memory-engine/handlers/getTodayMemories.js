/**
 * 统一获取今日学习内容 (字母/单词/句子)
 * Action: getTodayMemories
 */
'use strict';

// 假设 memoryEngine 内部没有严重的全局副作用，如果有问题，可能需要检查 memoryEngine
const { getTodayReviewEntities, getOrCreateMemory, checkModuleAccess } = require('../utils/memoryEngine');
const { createResponse } = require('../utils/response');
const {
  getLessonMetadataFromDb,
  getPhonicsRuleByLessonFromDb,
} = require('../config/alphabetLessonConfig');

const MAX_NEW_LETTERS = 12; // 单课安全上限，防止 3s 超时
const MAX_REVIEW_LIMIT = 2000; // 复习队列宽松上限，确保获取所有复习
const MAX_LETTER_DAILY_LIMIT = 200; // 字母模块每日学习硬上限（稳定模式）
const MAX_GENERIC_DAILY_LIMIT = 200; // 其他模块的兜底上限，防止无界请求

/**
 * 懒初始化：字母进度表
 * 兼容旧用户：如果 user_alphabet_progress 中没有记录，则插入一条默认记录
 * 给字母模块提供进度表
 * col.add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          
        roundHistory: [],        
        createdAt: now,
        updatedAt: now,
      },
 * @param {Object} db
 * @param {string} userId
 * 
 */
async function ensureUserAlphabetProgress(db, userId) {
  const col = db.collection('user_alphabet_progress');
  const existing = await col.where({ userId }).limit(1).get();

  if (!existing.data || existing.data.length === 0) {
    const now = new Date().toISOString();

    // 🔥 并发保护：二次检查防止重复记录
    const checkAgain = await col.where({ userId }).limit(1).get();
    if (checkAgain.data && checkAgain.data.length > 0) {
      console.log('⚠️ [ensureUserAlphabetProgress] 记录已被并发创建, 跳过');
      return;
    }

    await col.add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          // 🔥 新增：默认从第1轮开始
        roundHistory: [],         // 🔥 新增：轮次历史记录
        createdAt: now,
        updatedAt: now,
      },
    });
    console.log('✅ [ensureUserAlphabetProgress] 已创建默认进度记录');
  }
}

//========================================================
/**
 * 懒初始化：用户词汇进度表（传统进度表）
 * 说明：
 * 给单词模块提供进度表
 * col.add({
      data: {
        userId,
        vocabularyId: null,
        mastery: null,
        reviewCount: 0,
        lastReviewed: null,
        nextReviewDate: null,
        intervalDays: 0,
        // 占位记录默认标记为 skipped，避免影响 getTodayWords 等查询逻辑
        skipped: true,
        easinessFactor: 2.5,
        createdAt: now,
        updatedAt: now,
      },
    });
 * - 该集合原本按单词一条记录，这里只为旧用户插入一条「占位记录」
 * - 使用 skipped: true，避免影响 getTodayWords 等查询逻辑
 *
 * @param {Object} db
 * @param {string} userId
 *
async function ensureUserVocabularyProgress(db, userId) {
  const col = db.collection('user_vocabulary_progress');
  const existing = await col.where({ userId }).limit(1).get();

  if (!existing.data || existing.data.length === 0) {
    const now = new Date().toISOString();
    await col.add({
      data: {
        userId,
        vocabularyId: null,
        mastery: null,
        reviewCount: 0,
        lastReviewed: null,
        nextReviewDate: null,
        intervalDays: 0,
        // 占位记录默认标记为 skipped，避免被当成真实复习数据
        skipped: true,
        easinessFactor: 2.5,
        createdAt: now,
        updatedAt: now,
      },
    });
  }
}
*/

//========================================================

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 * @returns {Promise<Object>} - 响应对象
 */
async function getTodayMemories(db, params) {
  /**
     * 第一层：防御与初始化 (Defense & Init)
     * (对应代码 L130-146)
     *
     * 做什么：检查参数 (userId 有没有？)、检查老用户数据状态 (ensure...Progress)。
     * 设计思想：Fail Fast (快速失败)。如果缺参数，第一行就报错返回，别浪费资源往下跑。
   */
  const start = Date.now();
  const { userId, entityType, limit, includeNew = true, roundNumber } = params;
  // 🔍 调试日志：打印收到的 userId
  console.log('📥 [getTodayMemories] 收到请求，userId:', userId, ', entityType:', entityType, ', limit:', limit, ', includeNew:', includeNew, ', roundNumber:', roundNumber);

  if (!userId || !entityType) {
    return createResponse(false, null, 'Missing userId or entityType', 'INVALID_PARAMS');
  }

  try {
    // 0. 懒初始化用户相关进度表（兼容在新增注册逻辑之前的老用户）
    if (entityType === 'letter') {
      await ensureUserAlphabetProgress(db, userId);
    }
    /**
         * 第二层：权限守门 (Gatekeeping)
         * (对应代码 L164-167)
         *
         * 做什么：checkModuleAccess。
         * 设计思想：统一鉴权。不要要在业务逻辑里写 if (score > 60)，
         * 而是抽离成一个独立的权限函数。这样以后改规则（比如从60分改成80分解锁），只需要改一个地方。
    */
    // ============== 1. 检查模块访问权限 =============
    // 使用 memoryEngine 中的统一权限检查
    const accessCheck = await checkModuleAccess(db, userId, entityType);
    if (!accessCheck.allowed) {
      return createResponse(false, null, accessCheck.message, accessCheck.errorCode);
    }

    /**
         * 第三层：调度逻辑 (Scheduling - 核心大脑)
         * (对应代码 L179-226)
         *
         * 做什么：
         * 问 SM-2 算法：今天该复习谁？(getTodayReviewEntities)
         * 问配额系统：今天还能学几个新的？(limit)
         * 算法融合：把“复习的”和“新的”按 3:1 穿插在一起。
         * 设计思想：业务逻辑与数据存储分离。这一层只处理 ID 和 规则，完全不关心“单词意思是啥”、“音频在哪”。它只管“ID列表”。
    */

    // ================ 1.5 获取/更新用户每日学习量设置 =============
    // 注意：
    // - 字母模块（entityType === 'letter'）不再允许前端通过 limit 动态调整每日新字母数量，
    //   只使用服务器端存储的 dailyLimit（如果有），否则退回默认值；
    // - 其他实体类型仍沿用原有逻辑。
    const userProgress = accessCheck.progress; // checkModuleAccess returns progress
    let effectiveLimit = limit;

    // 逻辑分支 A: 字母模块 (固定规则)
    if (entityType === 'letter') {
      // 字母模块强制使用按课获取逻辑，完全忽略用户设置的 limit
      // 直接使用模块最大安全上限，确保能一次性拉取整节课的所有字母
      effectiveLimit = MAX_LETTER_DAILY_LIMIT;
    }
    // 逻辑分支 B: 其他模块 (单词/句子等)
    else {
      // 如果前端传入了新的 limit，且与存量不同 -> 更新数据库
      if (userProgress && params.limit && params.limit !== userProgress.dailyLimit) {
        // [离线更新] 不await，避免拖慢主流程
        db.collection('user_progress').where({ userId }).update({
          data: {
            dailyLimit: params.limit,
            updatedAt: new Date().toISOString()
          }
        }).catch(err => console.error('Limit update failed:', err));
      }
      // 如果 params.limit 没传，但数据库有值 -> 用数据库的
      if (!params.limit && userProgress && userProgress.dailyLimit) {
        effectiveLimit = userProgress.dailyLimit;
      }
      // 强制应用通用上限 (200) 防止恶意请求
      effectiveLimit = Math.min(effectiveLimit, MAX_GENERIC_DAILY_LIMIT);
    }

    // =============== 3. 获取今日复习实体 ===============
    /**
     * reviewMemories
     * 
     * 作用：
     * 去数据库查 SM-2 算法认为“今天到期该复习”的卡片放入 reviewMemories
     * 
     * 适用范围：全模块通用（字母、单词、句子）。
     * 如果 entityType 是 word，它就会去查单词的复习队列。
     * 这一行代码是绝对不能删除或改为字母专用的，否则单词模块就没法复习了。
     */
    let reviewMemories = await getTodayReviewEntities(db, userId, entityType, MAX_REVIEW_LIMIT);

    /* 
     字母模块专用补丁（仅 Letter）
     第 219 - 257 行（如果不算那行 let explicitPreviousCount 的声明）：
     字母模块使用: 显式获取 Round1 跨课程 previous-review（只做 round==1 且 lesson>1）
     作用：这是为了配合字母课程的特殊设计（Round 1 强制滚雪球复习上一课）。
     适用范围：仅字母模块。
     entityType === 'letter' 这个判断条件像一堵墙，把单词和句子模块挡在了外面。
     所以这部分代码虽然写在这里，但对单词模块是 "无公害" 的，不会产生任何副作用。
    */
    let explicitPreviousCount = 0;

    if (entityType === 'letter' && roundNumber === 1 && params.lessonId && params.lessonId !== 'lesson1') {
      try {
        const currentLessonMeta = await getLessonMetadataFromDb(db, params.lessonId);
        if (currentLessonMeta && currentLessonMeta.order && currentLessonMeta.order > 1) {
          const prevLessonId = `lesson${currentLessonMeta.order - 1}`;

          // 查询上一课的字母
          const prevLettersResult = await db.collection('letters')
            .where({ curriculumLessonIds: db.command.in([prevLessonId]) })
            .limit(20)
            .get();

          const explicitPrevMemories = [];

          // 获取这些字母的记忆状态
          for (const letter of prevLettersResult.data) {
            const mem = await getOrCreateMemory(db, userId, entityType, letter._id, false);
            if (mem) {
              // 浅拷贝避免副作用
              const rep = mem.repetition !== undefined ? mem.repetition : (mem.reviewStage || 0);
              const patched = {
                ...mem,
                repetition: Math.max(rep, 1)
              };
              explicitPrevMemories.push(patched);
            }
          }

          explicitPreviousCount = explicitPrevMemories.length;

          // 合并到 reviewMemories（去重）
          const existingIds = new Set(reviewMemories.map(m => m.entityId));
          const uniquePrev = explicitPrevMemories.filter(m => !existingIds.has(m.entityId));
          reviewMemories = [...uniquePrev, ...reviewMemories];

          console.log(`🔍 [P0-C] lessonId: ${params.lessonId}, prevLessonId: ${prevLessonId}, explicitPrevCount: ${explicitPreviousCount}`);
        }
      } catch (err) {
        console.warn('⚠️ [P0-C] 获取上一课程字母失败:', err);
      }
    }

    // ============= 4. 获取新学习内容 =============
    let newMemories = [];
    if (includeNew) {
      const remainingSlots = effectiveLimit;

      const collectionMap = {
        letter: 'letters',
        word: 'vocabulary',
        sentence: 'sentences'
      };

      const collectionName = collectionMap[entityType];
      if (!collectionName) {
        return createResponse(false, null, `不支持的实体类型: ${entityType}`, 'INVALID_ENTITY_TYPE');
      }

      const query = db.collection(collectionName);
      let newEntities = [];

      // 获取已存在的实体ID (包括复习队列中的)
      const existingEntityIds = reviewMemories.map(m => m.entityId);

      // 字母模块：根据课程一次性取出该课需要的全部字母（不受 limit 限制）
      if (entityType === 'letter' && params.lessonId) {
        const { lessonId } = params;
        const cmd = db.command;

        const whereCondition = {
          curriculumLessonIds: cmd.in([lessonId]),
        };

        // 🔥 Round2/3 时不过滤已有记忆的字母（用于复习）
        if (roundNumber === 1 && existingEntityIds.length > 0) {
          whereCondition._id = cmd.nin(existingEntityIds);
        }
        // Round2/3 时返回该课程的全部字母

        const newEntitiesResult = await query
          .where(whereCondition)
          // 为了安全起见，仍加一个较大的上限（远大于实际字母总数）
          .limit(MAX_NEW_LETTERS)
          .get();

        newEntities = newEntitiesResult.data;
      }
      //===============================单词模块获取逻辑====================================
      // 其他模块或未指定 lessonId：沿用原逻辑，按剩余名额和 lessonNumber 顺序获取
      else {
        let queryRef = query; // query 指向 db.collection('vocabulary')
        const cmd = db.command;

        if (entityType === 'word' && params.source) {
          queryRef = queryRef
            .where({
              source: params.source
            })
          if (userProgress && userProgress.wordProgress && params.source) {
            const wp = userProgress.wordProgress;
            let progressItem;

            // 优先：Map 格式（source 为 key），如 { "BaseThai_1": { lastVId: 5 } }
            if (!Array.isArray(wp) && typeof wp === 'object') {
              progressItem = wp[params.source];
            }
            // 兼容旧数组格式：[{ source: "BaseThai_1", lastVId: 5 }]
            else if (Array.isArray(wp)) {
              progressItem = wp.find(p => p.source === params.source);
            }

            if (progressItem && progressItem.lastVId) {
              console.log(`[FastFetch] Using pointer vId > ${progressItem.lastVId} for ${params.source}`);
              queryRef = queryRef.where({
                vId: cmd.gt(progressItem.lastVId)
              });
            }
          }
        }
        // 确保今天学习的“新单词”里，不会包含那些“已经出现在复习列表里”的单词。
        if (existingEntityIds.length > 0) {
          queryRef = queryRef
            .where({
              _id: cmd.nin(existingEntityIds) //nin: not in ----- 不在（existingEntityIds）数组中的数据
            });
        }



        const newEntitiesResult = await queryRef
          .orderBy('vId', 'asc') // ✅ 改用 vId 排序 (用户清洗后的顺序)
          .limit(Math.min(remainingSlots, MAX_GENERIC_DAILY_LIMIT))
          .get();

        newEntities = newEntitiesResult.data;
      }

      const cappedNewEntities =   // →→→→→ 限制新内容的数量
        entityType === 'letter'
          ? newEntities.slice(0, MAX_NEW_LETTERS)
          : newEntities.slice(0, Math.min(remainingSlots, MAX_GENERIC_DAILY_LIMIT));

      // ✅ 每一位新词，不再调用 getOrCreateMemory 写数据库
      // 而是直接在内存里生成一个 "Virtual Memory Object"
      const now = new Date().toISOString();
      newMemories = cappedNewEntities.map((entity) => ({
        _id: `temp_${entity.vId}`, // 临时ID，或者不给ID也可以，只要不报错
        userId,
        entityType,
        entityId: entity._id,
        vId: entity.vId,

        // SM-2 初始状态
        masteryLevel: 0,
        repetition: 0,
        easinessFactor: 2.5,
        interval: 0,

        // 计数器
        correctCount: 0,
        wrongCount: 0,
        streakCorrect: 0,

        // 时间
        createdAt: now,
        updatedAt: now,

        // 关键标识
        isNew: true
      }));
    }
    /**
     * 第四层：数据富化 (Data Enrichment - 也是 map/filter 所在层)
     * (对应代码 L337-370)
     * 做什：拿着第三层算出来的 [ID1, ID2, ID3]，去 vocabulary 表里一次性查出所有详情，然后组装。
     * 知识点：应用层 Join (Application-side Join)。
     * 在 NoSQL (如 MongoDB/CloudBase) 中，我们很少用复杂的表连接 (Lookup)。
     * 最佳实践：先查出所有 ID -> where({ _id: in(ids) }) 批量查详情 -> 在内存里用 Map 拼装。这比数据库 Join 更快、更灵活。
    */
    // ================= 5. 合并 & 穿插 (Interleave) =================
    // 制作一个数组，包含复习内容和新内容,这里设置内容要按照一定的规则穿插
    // "单词和字母学习开始前，优先复习之前学的内容" -> 优先放入复习内容
    // "这部分内容复习完后才进入三新1复习的穿插学习" -> 复习完老内容后，新内容按 3新:1复习(新) 穿插
    let allMemories = [...reviewMemories];

    // 处理新内容 (3新 : 1复习)
    // 这里 "1复习" 指的是对刚刚学习的新内容的巩固复习 (Intra-session repetition)
    // 例如: N1, N2, N3, N1(复习), N4, N5, N6, N4(复习)...
    if (newMemories.length > 0) {
      for (let i = 0; i < newMemories.length; i++) {
        allMemories.push(newMemories[i]);

        // 每3个新词，插入一个复习 (复习这组的第一个)
        if ((i + 1) % 3 === 0) {
          // 插入 i-2 (即这组的第一个) 作为复习
          // 注意：这里直接push同一个对象，前端会再次渲染它
          allMemories.push(newMemories[i - 2]);
        }
      }
    }

    if (allMemories.length === 0) {
      return createResponse(true, { items: [], summary: { total: 0 } }, '今日无学习内容');
    }

    // ======================== 6. 获取详情 ========================
    // 制作一个数组，包含复习内容和新内容，这里是从数据库中获取的实际内容
    const entityIds = allMemories.map(m => m.entityId);
    const collectionMap = {
      letter: 'letters',
      word: 'vocabulary',
      sentence: 'sentences'
    };

    const entitiesResult = await db.collection(collectionMap[entityType])
      .where({
        _id: db.command.in(entityIds)
      })
      .get();

    const entitiesMap = new Map(entitiesResult.data.map(e => [e._id, e]));

    // ======================= 7. 组装 =======================
    // 将 step5 的数组内容规则和 step6 获得的详细内容，进行组装数据，将复习内容和新内容合并
    const data = allMemories.map(memory => {
      const entity = entitiesMap.get(memory.entityId);
      if (!entity) return null; // 如果没有找到对应的实体，返回 null
      return {
        // ...entity: 展开运算符
        // 将数据库中查询到的单词/字母的所有原始字段（如 thaiWord, meaning, audioPath 等）
        // 原封不动地复制到返回结果中，前端直接使用这些字段。
        ...entity,
        memoryState: {
          masteryLevel: memory.masteryLevel,     // 熟练度
          repetition: memory.repetition !== undefined ? memory.repetition : memory.reviewStage, // 复习阶段
          correctCount: memory.correctCount,     // 正确次数
          wrongCount: memory.wrongCount,         // 错误次数
          streakCorrect: memory.streakCorrect,   // 连续正确次数
          nextReviewDate: memory.nextReviewDate !== undefined ? memory.nextReviewDate : memory.nextReviewAt, // 下次复习时间
          isNew: (memory.repetition !== undefined ? memory.repetition : memory.reviewStage) === 0 // 是否是新内容
        }
      };
    }).filter(Boolean); // 过滤掉 null 值

    const summary = {
      total: data.length,                       // 总数
      reviewCount: reviewMemories.length,       // 复习数
      newCount: newMemories.length,             // 新数
      entityType,                              // 实体类型
    };

    // ======================= 8. 字母模块附加课程元数据 & 拼读规则（真实配置） =======================
    // 这一步是专门为【字母模块】服务的。
    // 字母学习不仅仅是看卡片，还需要知道“这一课的主题是什么”（lessonMetadata）
    // 以及“这一课的拼读规则是什么”（phonicsRule）。
    // 这些信息存储在独立的数据库集合里，需要单独查出来。

    let lessonMetadata = null;
    let phonicsRule = null;

    if (entityType === 'letter' && data.length > 0) {
      // 1. 确定 Lesson ID (课程ID)
      // 因为数据库里的数据可能格式不统一（新老数据混杂），所以这里做了多重兜底：
      // - 优先取前端传过来的 params.lessonId (最准)
      // - 其次取实体里的 lessonId 字段
      // - 再次取 curriculumLessonIds 数组的第一个
      // - 最后兼容老数据的 lessonNumber (数字转字符串)
      const firstEntity = data[0];
      const lessonIdFromParam = params.lessonId;
      const lessonIdFromField = firstEntity.lessonId || null;
      const lessonIdFromCurriculum =
        (firstEntity.curriculumLessonIds &&
          firstEntity.curriculumLessonIds[0]) ||
        null;
      const lessonIdFromLegacy =
        typeof firstEntity.lessonNumber === 'number' &&
          firstEntity.lessonNumber > 0
          ? `lesson${firstEntity.lessonNumber}`
          : null;

      const resolvedLessonId =
        lessonIdFromParam ||
        lessonIdFromCurriculum ||
        lessonIdFromField ||
        lessonIdFromLegacy;

      // 2. 如果确定了课程ID，就去查元数据和规则
      if (resolvedLessonId) {
        // 查课程标题、描述等信息 (collection: 'lessons' 或配置)
        lessonMetadata = await getLessonMetadataFromDb(db, resolvedLessonId);
        // 查拼读规则 (collection: 'phonics_rules')
        phonicsRule = await getPhonicsRuleByLessonFromDb(db, resolvedLessonId);
      }
    }

    return createResponse(
      true,
      {
        items: data,
        summary,
        lessonMetadata,
        phonicsRule,
      },
      '获取今日学习内容成功',
    );

  } catch (error) {
    console.error('getTodayMemories error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  } finally {
    console.log('[FunctionCost] getTodayMemories', Date.now() - start, 'ms');
  }
}

module.exports = getTodayMemories;
