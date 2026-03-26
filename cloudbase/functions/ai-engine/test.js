// /Users/liangjianyu/LearnOnThailand/ThaiLearningApp/cloudbase/functions/ai-engine/test.js

/**
 * 这是一个仅供本地开发使用的“脱水测试脚本”。
 * 目的：在不部署云端的情况下，直接验证大模型返回的数据结构是否符合我们的 JSON 规范。
 */

// 1. 从环境变量读取 Key（⚠️ 禁止在此文件写入真实 Key 并提交）
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('请先在 shell 中设置 DEEPSEEK_API_KEY 再运行本脚本，例如：export DEEPSEEK_API_KEY=sk-xxxx');
  process.exit(1);
}

// 2. 将云函数的主入口引进来
const { main } = require('./index.js');

// 3. 捏造一个假的前端请求体 (event)
const mockEvent = {
    action: 'explainVocab',
    data: {
        userId: 'test-user-123',
        vocabularyId: 'mock-vocab-1',
        thaiWord: 'สวัสดี'  // 我们测一个最经典的泰语词汇：“你好”
    }
};

// 4. 执行调用并打印结果
async function runTest() {
    console.log("🚀 开始本地模拟调用 AI Engine (Action: explainVocab)...");
    
    // 假装这个空对象是腾讯云的上下文（因为我们的代码里没用到它，传空对象即可）
    const mockContext = {}; 

    try {
        console.time("⏱️ AI 调用耗时"); // 顺便测一下 DeepSeek 返回这段内容要多久
        
        // 直接执行云函数的逻辑
        const result = await main(mockEvent, mockContext);
        
        console.timeEnd("⏱️ AI 调用耗时");
        console.log("\n✅ 调用完成，前端最终会拿到的对象结构：\n");
        
        // 用 null, 2 让 JSON 打印得带有缩进和换行，方便人类阅读
        console.log(JSON.stringify(result, null, 2)); 
        
    } catch (err) {
        console.timeEnd("⏱️ AI 调用耗时");
        console.error("\n❌ 调用在这个环节崩溃了：", err);
    }
}

// 跑起来
runTest();
