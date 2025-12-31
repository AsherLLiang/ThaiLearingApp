// src/dev/registry.ts

export interface PlaygroundComponent {
    id: string;
    name: string;
    category: string;
    variants: {
        id: string;
        name: string;
        mockId: string; // 对应 Mock 数据的 key
    }[];
}

export const COMPONENT_REGISTRY: PlaygroundComponent[] = [
    {
        id: 'PhonicsRuleCard',
        name: 'Phonics Rule Card',
        category: 'Learning',
        variants: [
            { id: 'standard', name: '标准场景', mockId: 'standard' },
            { id: 'long_text', name: '超长文本测试', mockId: 'long_text' },
            { id: 'no_interactive', name: '无交互示例', mockId: 'no_interactive' },
            { id: 'with_chart', name: '带图表', mockId: 'with_chart' },
        ],
    },
    // 将来可以在这里添加更多组件，如 RecoveryModal, RoundCompletionView 等
];
