#!/bin/bash

MEMORY_ENGINE_URL="https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/memory-engine"
LEARN_VOCAB_URL="https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/learn-vocab"
USER_ID="u_1764867682959_dwqxjcjoo"

echo "======================================"
echo "Thai Learning App - 正确的 API 测试"
echo "======================================"
echo ""

# ============ memory-engine 测试 ============
echo "📦 memory-engine 云函数测试"
echo "========================================="
echo ""

echo "1️⃣ submitMemoryResult (✅ 正确端点)"
curl -s -X POST "$MEMORY_ENGINE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"submitMemoryResult\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"results\": [{
        \"entityType\": \"letter\",
        \"entityId\": \"TH_C_02\",
        \"quality\": \"模糊\"
      }]
    }
  }" | jq .
echo ""
echo ""

echo "2️⃣ getTodayMemories (✅ 正确端点)"
curl -s -X POST "$MEMORY_ENGINE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getTodayMemories\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"entityType\": \"word\",
      \"limit\": 20
    }
  }" | jq .
echo ""
echo ""

# ============ learn-vocab 测试 ============
echo "📚 learn-vocab 云函数测试"
echo "========================================="
echo ""

echo "3️⃣ getTodayWords"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getTodayWords\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"limit\": 20,
      \"offset\": 0
    }
  }" | jq .
echo ""
echo ""

echo "4️⃣ getReviewStatistics"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getReviewStatistics\",
    \"data\": {
      \"userId\": \"$USER_ID\"
    }
  }" | jq .
echo ""
echo ""

echo "5️⃣ getVocabularyList"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getVocabularyList\",
    \"data\": {
      \"limit\": 5,
      \"offset\": 0
    }
  }" | jq .
echo ""
echo ""

echo "6️⃣ getVocabularyDetail"
curl -s -X POST "$LEARN_VOCAB_URL" \
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

echo "7️⃣ updateMastery"
curl -s -X POST "$LEARN_VOCAB_URL" \
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

echo "8️⃣ toggleSkipWord"
curl -s -X POST "$LEARN_VOCAB_URL" \
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

echo "9️⃣ getSkippedWords"
curl -s -X POST "$LEARN_VOCAB_URL" \
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
echo "✅ 测试完成!"
echo "======================================"