const fs = require('fs');
const path = require('path');

console.log("============================================");
console.log("🔍 本地字母音频文件匹配检查工具（JSON+JSONL版）");
console.log("============================================\n");

// 路径配置
const AUDIO_DIR = path.join(__dirname, 'alphabet');
const LETTERS_FILE = path.join(__dirname, 'letters.json');

// 1️⃣ 读取音频文件
const audioFiles = fs.readdirSync(AUDIO_DIR)
  .filter(f => f.toLowerCase().endsWith('.mp3'))
  .map(f => f.toLowerCase());

const audioSet = new Set(audioFiles);

console.log(`📁 MP3 文件数量: ${audioFiles.length}`);


// 2️⃣ 读取 letters（支持 JSON / JSONL）
let letters = [];
const rawContent = fs.readFileSync(LETTERS_FILE, 'utf8').trim();

try {
  if (rawContent.startsWith('[')) {
    letters = JSON.parse(rawContent);
  } else {
    letters = rawContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => JSON.parse(line));
  }
} catch (err) {
  console.error("❌ 无法解析 letters 文件:", err);
  process.exit(1);
}

console.log(`📘 字母数量: ${letters.length}`);


// 3️⃣ 声音相关字段
const soundFields = [
  "letterPronunciationUrl",
  "fullSoundUrl",
  "endSyllableSoundUrl",
  "syllableSoundUrl"
];

const missingList = [];
const matchedList = [];

console.log("\n🔎 开始逐条比较...\n");


// 4️⃣ 遍历字母字段进行对比
letters.forEach(letter => {
  const letterId = letter._id || letter.thaiChar || "unknown";

  soundFields.forEach(field => {
    const value = letter[field];
    if (!value) return;

    const expectedFile = `${value.toLowerCase()}.mp3`;

    if (audioSet.has(expectedFile)) {
      matchedList.push({ letterId, field, expectedFile });
      console.log(`✔ 匹配成功: ${letterId} - ${field} -> ${expectedFile}`);
    } else {
      missingList.push({ letterId, field, expectedFile });
      console.log(`❌ 缺失音频: ${letterId} - ${field} -> ${expectedFile}`);
    }
  });
});


// 5️⃣ **总结区 + 打印所有匹配失败的字母 _id + 缺失音频文件名**
console.log("\n============================================");
console.log("🔚 对比完成");
console.log(`✔ 已匹配文件: ${matchedList.length}`);
console.log(`❌ 缺失音频: ${missingList.length}`);

if (missingList.length > 0) {
  console.log("\n🔔 以下为所有匹配失败的字母及缺失音频文件名：\n");

  missingList.forEach(item => {
    console.log(`❌ ${item.letterId} 缺失音频：${item.expectedFile}`);
  });
}

console.log("============================================\n");
