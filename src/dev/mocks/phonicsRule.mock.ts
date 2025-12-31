// src/dev/mocks/phonicsRule.mock.ts

import { PhonicsRule, PhonicsRuleId } from "@/src/entities/types/phonicsRule.types";

/**
 * 拼读规则 Mock 工厂
 * 包含多种场景的测试数据
 */
export const MOCK_PHONICS_RULES: Record<string, PhonicsRule> = {
    // 1. 标准场景
    standard: {
        id: "mock_rule_standard" as PhonicsRuleId,
        lessonId: "mock_lesson_1",
        title: "拼读规则 1: 辅音+元音",
        content: [
            "✅ 泰语音节 = 辅音(C) + 元音(V)",
            "✅ 元音可在辅音前/后/上/下",
            "✅ 例: ก + า = กา [ka:] (乌鸦)",
            "",
            "🎯 记忆口诀: 先读辅音,再读元音"
        ],
        interactiveExample: {
            consonant: "ก",
            vowel: "า",
            syllable: "กา",
            pronunciation: "ka:",
            audioUrl: "https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3"
        },
        duration: 30,
        order: 1
    },

    // 2. 超长文本场景 (测试 ScrollView)
    long_text: {
        id: "mock_rule_long" as PhonicsRuleId,
        lessonId: "mock_lesson_2",
        title: "非常长的规则标题测试非常长的规则标题测试非常长的规则标题测试",
        content: [
            "✅ 第一行内容",
            "✅ 第二行内容非常非常长，用来测试当文字超过一行时是否会自动换行，以及对布局的影响。",
            "✅ 第三行内容",
            "",
            "✅ 以下是重复内容，用于撑开高度测试滚动：",
            ...Array(20).fill("📝 重复的测试文本行，用于验证 ScrollView 的滚动能力是否正常工作。"),
            "",
            "🎯 结束行"
        ],
        interactiveExample: {
            consonant: "ก",
            vowel: "า",
            syllable: "กา",
            pronunciation: "ka:",
            audioUrl: "https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3"
        },
        duration: 60,
        order: 2
    },

    // 3. 无交互示例场景
    no_interactive: {
        id: "mock_rule_simple" as PhonicsRuleId,
        lessonId: "mock_lesson_3",
        title: "纯文本规则",
        content: [
            "这是一个没有下方交互按钮的规则。",
            "仅包含文本说明。",
            "用来测试布局收缩是否正常。"
        ],
        duration: 15,
        order: 3
    },

    // 4. 带有复杂图表的场景
    with_chart: {
        id: "mock_rule_chart" as PhonicsRuleId,
        lessonId: "mock_lesson_4",
        title: "声调图表规则",
        content: [
            "这也是之前引起 Crash 的复杂情况。",
            "请检查图表渲染。"
        ],
        visualChart: {
            columns: ["", "平", "二", "三", "四", "五"],
            rows: [
                ["中辅音", "-", "\\", "^", "/", "v"],
                ["高辅音", "v", "\\", "^", "(N/A)", "(N/A)"]
            ],
            interactive: true
        },
        duration: 45,
        order: 4
    }
};
