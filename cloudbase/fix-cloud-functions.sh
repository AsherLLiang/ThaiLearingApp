#!/bin/bash
set -e

echo "========================================="
echo "🚀 Cloud Functions Automatic Cleanup Tool"
echo "========================================="

BASE_DIR="./cloudbase/functions"

echo ""
echo "📌 Step 1: 删除所有 node_modules 文件夹..."
find $BASE_DIR -type d -name "node_modules" -prune -exec rm -rf {} +

echo "✔ 已删除本地 node_modules"

echo ""
echo "📌 Step 2: 删除不应该上传的文件（.DS_Store、构建产物）"
find $BASE_DIR -name ".DS_Store" -delete
find $BASE_DIR -name "*.log" -delete
find $BASE_DIR -name "*.tmp" -delete
find $BASE_DIR -name "dist" -prune -exec rm -rf {} +
find $BASE_DIR -name ".turbo" -prune -exec rm -rf {} +

echo "✔ 清理完成"

echo ""
echo "📌 Step 3: 自动为每个云函数生成 package.json"

FUNCTIONS=$(find $BASE_DIR -maxdepth 1 -mindepth 1 -type d)

for FN in $FUNCTIONS; do
  if [ ! -f "$FN/index.js" ]; then
    echo "⚠️ 警告: $FN 缺少 index.js，跳过 package.json 生成"
    continue
  fi

  PKG="$FN/package.json"

  echo "📦 生成 package.json → $PKG"

  cat > "$PKG" <<EOF
{
  "name": "$(basename $FN)",
  "version": "1.0.0",
  "description": "CloudBase Function: $(basename $FN)",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "^2.10.0"
  }
}
EOF

done

echo "✔ package.json 创建完成"

echo ""
echo "📌 Step 4: 修复 cloudbaserc.json（设置 runtime & 安装依赖）"

cat > cloudbaserc.json <<EOF
{
  "functions": [
    {
      "name": "alphabet",
      "timeout": 10,
      "runtime": "Nodejs18.15",
      "installDependency": true
    },
    {
      "name": "learn-vocab",
      "timeout": 10,
      "runtime": "Nodejs18.15",
      "installDependency": true
    },
    {
      "name": "memory-engine",
      "timeout": 10,
      "runtime": "Nodejs18.15",
      "installDependency": true
    }
  ]
}
EOF

echo "✔ cloudbaserc.json 已更新"

echo ""
echo "📌 Step 5: 检查错误 require 路径（跨函数 require 会导致部署失败）"

BAD_IMPORTS=$(grep -R "\.\./shared" -n $BASE_DIR || true)

if [ -n "$BAD_IMPORTS" ]; then
  echo "❌ 检测到跨函数 require 错误:"
  echo "$BAD_IMPORTS"
  echo "❗ 请将 shared 代码复制到每个函数 utils/ 下"
else
  echo "✔ 未检测到跨函数 require"
fi

echo ""
echo "========================================="
echo "🎉  Cloud Functions Cleanup Completed!"
echo "========================================="
