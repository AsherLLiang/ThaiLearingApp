import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// Components
import { PhonicsRuleCard } from '@/src/components/learning/alphabet/PhonicsRuleCard';

// Mocks
import { MOCK_PHONICS_RULES } from '@/src/dev/mocks/phonicsRule.mock';

export default function ComponentViewer() {
    const { componentId, variantId, mockId } = useLocalSearchParams<{
        componentId: string;
        variantId: string;
        mockId: string;
    }>();

    if (!__DEV__) return null;

    const renderContent = () => {
        switch (componentId) {
            case 'PhonicsRuleCard': {
                const rule = MOCK_PHONICS_RULES[mockId];
                if (!rule) return <ErrorState message={`Mock ID not found: ${mockId}`} />;

                return (
                    <PhonicsRuleCard
                        rule={rule}
                        onComplete={() => console.log('✅ [Dev] onComplete triggered')}
                        showCloseButton={true}
                        onClose={() => console.log('❌ [Dev] onClose triggered')}
                    />
                );
            }
            default:
                return <ErrorState message={`Component ID not found: ${componentId}`} />;
        }
    };

    return (
        <View style={styles.container}>
            {/* 居中容器，模拟 Modal 效果 */}
            <View style={styles.stage}>
                {renderContent()}
            </View>

            <View style={styles.debugPanel}>
                <Text style={styles.debugText}>Component: {componentId}</Text>
                <Text style={styles.debugText}>Variant: {variantId}</Text>
                <Text style={styles.debugText}>Mock Data: {mockId}</Text>
            </View>
        </View>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333', // 深色背景突出组件
    },
    stage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugPanel: {
        backgroundColor: '#000',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    debugText: {
        color: '#0F0',
        fontFamily: 'Menlo',
        fontSize: 12,
        marginBottom: 4,
    },
    errorContainer: {
        padding: 20,
        backgroundColor: Colors.error,
        borderRadius: 8,
    },
    errorText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
    },
});
