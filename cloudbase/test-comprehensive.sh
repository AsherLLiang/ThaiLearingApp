#!/bin/bash

# 配置
BASE_URL_PREFIX="https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com"
USER_ID="u_1764867682959_dwqxjcjoo" # 使用现有测试ID

# 各个云函数的完整 URL
URL_MEMORY_ENGINE="${BASE_URL_PREFIX}/memory-engine"
URL_LEARN_VOCAB="${BASE_URL_PREFIX}/learn-vocab"
URL_ALPHABET="${BASE_URL_PREFIX}/alphabet"
URL_UPDATE_PROFILE="${BASE_URL_PREFIX}/user-update-profile"

# 辅助函数：发送 POST 请求
# 用法: send_request "URL" "ActionName" "JSON_DATA_STRING"
send_request() {
    local url=$1
    local action=$2
    local data=$3
    
    echo "正在测试: $action"
    echo "请求地址: $url"
    
    # 构造完整请求体
    local body="{\"action\": \"$action\", \"data\": $data}"
    
    # 如果是 alphabet 函数，它的参数结构可能略有不同 (直接在根节点?)
    # 查看 alphabet/index.js: const { action, userId, answers } = event;
    # 所以 alphabet 函数不需要 data 包装，而是直接传参数。
    if [[ "$url" == *"/alphabet"* ]]; then
        body="{\"action\": \"$action\", \"userId\": \"$USER_ID\"}"
    fi

    echo "请求体: $body"
    
    curl -s -X POST "$url" \
      -H 'Content-Type: application/json' \
      -d "$body" | jq .
      
    echo "---------------------------------------------------"
    echo ""
}

echo "======================================"
echo "Thai Learning App - 全面后端测试"
echo "======================================"
echo ""

# =================================================================
# 1. Memory Engine (记忆引擎)
# =================================================================
echo "🔵 [Memory Engine 记忆引擎] 测试中..."

# 1.1 getTodayMemories (Letter)
send_request "$URL_MEMORY_ENGINE" "getTodayMemories" "{
    \"userId\": \"$USER_ID\",
    \"entityType\": \"letter\",
    \"limit\": 10,
    \"includeNew\": true
}"

# 1.2 getTodayMemories (Word)
send_request "$URL_MEMORY_ENGINE" "getTodayMemories" "{
    \"userId\": \"$USER_ID\",
    \"entityType\": \"word\",
    \"limit\": 10,
    \"includeNew\": true
}"

# 1.3 submitMemoryResult
send_request "$URL_MEMORY_ENGINE" "submitMemoryResult" "{
    \"userId\": \"$USER_ID\",
    \"entityType\": \"letter\",
    \"entityId\": \"TH_C_01\",
    \"quality\": \"记得\"
}"

# 1.4 checkModuleAccess
send_request "$URL_MEMORY_ENGINE" "checkModuleAccess" "{
    \"userId\": \"$USER_ID\",
    \"moduleType\": \"word\"
}"

# 1.5 getUserProgress
send_request "$URL_MEMORY_ENGINE" "getUserProgress" "{
    \"userId\": \"$USER_ID\"
}"


# =================================================================
# 2. Learn Vocab (词汇学习 - 辅助功能)
# =================================================================
echo "🟢 [Learn Vocab 词汇学习] 测试中..."

# 2.1 getVocabularyList
send_request "$URL_LEARN_VOCAB" "getVocabularyList" "{
    \"userId\": \"$USER_ID\",
    \"limit\": 5,
    \"offset\": 0
}"

# 2.2 getVocabularyDetail
send_request "$URL_LEARN_VOCAB" "getVocabularyDetail" "{
    \"userId\": \"$USER_ID\",
    \"vocabularyId\": \"BEGINNER_A_7\"
}"

# 2.3 getReviewStatistics
send_request "$URL_LEARN_VOCAB" "getReviewStatistics" "{
    \"userId\": \"$USER_ID\"
}"


# =================================================================
# 3. Alphabet (字母测试)
# =================================================================
echo "🟠 [Alphabet 字母测试] 测试中..."

# 3.1 getLetterTest
# 注意：send_request 内部对 alphabet 做了特殊处理
send_request "$URL_ALPHABET" "getLetterTest" "{}"


# =================================================================
# 4. User Profile (用户资料)
# =================================================================
echo "🟣 [User Profile 用户资料] 测试中..."

# 4.1 updateProfile (测试更新每日限额)
# 注意：user-update-profile 的入口可能也是 action 模式，或者直接处理
# 假设它也遵循 { action, data } 模式，或者直接接收字段
# 查看 user-update-profile/index.js 才能确定。
# 暂时先跳过，或者假设它接受 userId 和 data。
# 鉴于不确定性，先不添加破坏性测试。

echo "✅ 测试脚本执行完毕"
