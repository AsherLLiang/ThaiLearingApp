const fs = require('fs');

// ✅ 你的原始题库文件（数组格式）
const inputFile = './.json';

// ✅ 读取并解析
const raw = fs.readFileSync(inputFile, 'utf-8');
const data = JSON.parse(raw);

// ✅ 转换为 JSON Lines，但仍然输出为 .json 后缀
const output = data.map(item => JSON.stringify(item)).join('\n');

// ✅ 覆盖写回原文件（后缀不变！）
fs.writeFileSync(inputFile, output, 'utf-8');

console.log('✅ 已转换为 JSON Lines 格式（后缀仍为 .json）');
console.log('✅ 现在可以直接上传到 CloudBase 导入');
