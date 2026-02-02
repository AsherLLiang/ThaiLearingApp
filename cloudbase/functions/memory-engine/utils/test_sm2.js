/**
 * 验证 SM-2 算法对不同评分输入的处理逻辑
 * 运行方式: node test_sm2.js
 */

const { calculateSM2, masteryToQuality } = require('./sm2');
const { MasteryLevel } = require('./constants');

console.log('=== SM-2 评分逻辑测试 ===\n');

const testCases = [
    { name: '字符串输入 - 记得', input: MasteryLevel.REMEMBERED, expectedQuality: 5 },
    { name: '字符串输入 - 模糊', input: MasteryLevel.FUZZY, expectedQuality: 3 },
    { name: '字符串输入 - 陌生', input: MasteryLevel.UNFAMILIAR, expectedQuality: 1 },
    { name: '数字输入 - 5 (应该直接识别)', input: 5, expectedQuality: 5 },
    { name: '数字输入 - 3 (应该直接识别)', input: 3, expectedQuality: 3 },
    { name: '数字输入 - 1 (应该直接识别)', input: 1, expectedQuality: 1 },
    { name: '数字字符串输入 - "5"', input: "5", expectedQuality: 5 },
    { name: '边界值 - 0 (目前应映射为 1)', input: 0, expectedQuality: 1 },
    { name: '边界值 - 6 (目前应映射为 5)', input: 6, expectedQuality: 5 },
];

let passCount = 0;

testCases.forEach(tc => {
    const quality = masteryToQuality(tc.input);
    const pass = quality === tc.expectedQuality;
    if (pass) passCount++;

    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${tc.name}`);
    console.log(`    输入: ${JSON.stringify(tc.input)} (${typeof tc.input})`);
    console.log(`    输出 Quality: ${quality}`);
    console.log(`    预期 Quality: ${tc.expectedQuality}\n`);
});

console.log(`测试完成: ${passCount}/${testCases.length} 通过`);

if (passCount < testCases.length) {
    console.log('\n❌ 存在逻辑漏洞：当前算法无法正确处理数字评分输入。');
} else {
    console.log('\n✅ 算法逻辑正常。');
}
