#!/bin/bash

BASE_URL="https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/learn-vocab"
USER_ID="u_1764867682959_dwqxjcjoo"

echo "======================================"
echo "Thai Learning App - 完整 API 测试"
echo "======================================"
echo ""

# 1. submitMemoryResult
echo "1️⃣ submitMemoryResult - 提交学习结果"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"submitMemoryResult\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"entityType\": \"letter\",
      \"entityId\": \"TH_C_02\",
      \"quality\": \"模糊\"
    }
  }" | jq .
echo ""
echo ""

# 2. getReviewStatistics
echo "2️⃣ getReviewStatistics - 获取复习统计"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getReviewStatistics\",
    \"data\": {
      \"userId\": \"$USER_ID\"
    }
  }" | jq .
echo ""
echo ""

# 3. getVocabularyList
echo "3️⃣ getVocabularyList - 获取词汇列表"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getVocabularyList\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"limit\": 5,
      \"offset\": 0
    }
  }" | jq .
echo ""
echo ""

# 4. getVocabularyDetail (需要真实的 vocabularyId)
echo "4️⃣ getVocabularyDetail - 获取词汇详情"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getVocabularyDetail\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"vocabularyId\": \"BEGINNER_A_7\"
    }
  }" | jq .
echo ""
echo ""

# 5. updateMastery
echo "5️⃣ updateMastery - 更新掌握度"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"updateMastery\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"vocabularyId\": \"BEGINNER_A_7\",
      \"mastery\": \"记得\"
    }
  }" | jq .
echo ""
echo ""

# 6. toggleSkipWord
echo "6️⃣ toggleSkipWord - 划掉单词"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"toggleSkipWord\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"vocabularyId\": \"BEGINNER_A_7\",
      \"skipped\": true
    }
  }" | jq .
echo ""
echo ""

# 7. getSkippedWords
echo "7️⃣ getSkippedWords - 获取已划掉单词"
echo "--------------------------------------"
curl -s -X POST "$BASE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getSkippedWords\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"limit\": 10,
      \"offset\": 0
    }
  }" | jq .
echo ""
echo ""

echo "======================================"
echo "✅ 测试完成！"
echo "======================================"