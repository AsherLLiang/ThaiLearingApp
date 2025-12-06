#!/bin/bash

echo "======================================"
echo "完整修复: Node.js 版本 + 符号链接"
echo "======================================"
echo ""

cd ~/LearnOnThailand/ThaiLearningApp/cloudbase/functions

# 1. 修复 shared 的 Node.js 版本
echo "1️⃣ 修复 shared 模块..."
cd shared
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.engines = { node: '>=16.0.0' };
if (!pkg.dependencies) pkg.dependencies = {};
pkg.dependencies['wx-server-sdk'] = '~2.6.3';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ shared/package.json 已更新');
"
npm install --production
cd ..

# 2. 修复每个云函数
for func in alphabet learn-vocab memory-engine; do
  echo ""
  echo "2️⃣ 处理 $func..."
  
  cd $func
  
  # 更新 package.json
  node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.engines = { node: '18.20.0' };
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  console.log('  ✅ package.json 已更新');
  "
  
  # 删除符号链接,复制真实文件
  rm -rf node_modules/@thai-app
  mkdir -p node_modules/@thai-app/shared
  cp -r ../shared/*.js node_modules/@thai-app/shared/
  cp ../shared/package.json node_modules/@thai-app/shared/
  cp -r ../shared/node_modules node_modules/@thai-app/shared/ 2>/dev/null || true
  
  echo "  ✅ shared 已复制为真实文件"
  
  cd ..
done

echo ""
echo "======================================"
echo "3️⃣ 验证配置..."
echo "======================================"
cd memory-engine
node -e "
try {
  console.log('Node 版本:', process.version);
  const shared = require('@thai-app/shared');
  console.log('✅ shared 模块加载成功');
  console.log('导出:', Object.keys(shared));
} catch(err) {
  console.error('❌', err.message);
  process.exit(1);
}
"
cd ..

echo ""
echo "======================================"
echo "✅ 修复完成! 现在重新部署:"
echo "======================================"
echo "tcb fn deploy memory-engine --runtime Nodejs18.20"
echo "tcb fn deploy alphabet --runtime Nodejs18.20"
echo "tcb fn deploy learn-vocab --runtime Nodejs18.20"