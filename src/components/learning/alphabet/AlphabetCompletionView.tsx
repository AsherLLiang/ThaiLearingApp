
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CheckCircle, Trophy, Home } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import type { RoundEvaluationState } from '@/src/entities/types/phonicsRule.types';

interface AlphabetCompletionViewProps {
    roundEvaluation?: RoundEvaluationState;
    onFinish: () => void;
}

export function AlphabetCompletionView({
    roundEvaluation,
    onFinish,
}: AlphabetCompletionViewProps) {
    const rounds = roundEvaluation?.rounds ?? [];
    const averageAccuracy =
        rounds.reduce((acc, r) => acc + r.accuracy, 0) / (rounds.length || 1);
    const isAllPassed = rounds.every((r) => r.passed);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header / Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.iconContainer}>
                        {isAllPassed ? (
                            <Trophy size={64} color={Colors.thaiGold} strokeWidth={1.5} />
                        ) : (
                            <CheckCircle size={64} color={Colors.success} strokeWidth={1.5} />
                        )}
                    </View>

                    <Text style={styles.title}>Lesson Complete!</Text>
                    <Text style={styles.subtitle}>
                        {isAllPassed
                            ? 'Excellent work! You mastered this letter.'
                            : 'Good effort! Keep practicing to improve.'}
                    </Text>
                </View>

                {/* Stats Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Session Summary</Text>

                    {rounds.map((round) => (
                        <View key={round.roundNumber} style={styles.roundRow}>
                            <Text style={styles.roundLabel}>Round {round.roundNumber}</Text>
                            <View style={styles.statContainer}>
                                <Text
                                    style={[
                                        styles.accuracyText,
                                        { color: round.passed ? '#2A9D8F' : '#E63946' },
                                    ]}
                                >
                                    {(round.accuracy * 100).toFixed(0)}%
                                </Text>
                                <Text style={styles.statusLabel}>
                                    {round.passed ? 'PASSED' : 'RETRY'}
                                </Text>
                            </View>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Average Accuracy</Text>
                        <Text style={styles.totalValue}>{(averageAccuracy * 100).toFixed(0)}%</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryButton} onPress={onFinish}>
                    <Text style={styles.primaryButtonText}>Finish Lesson</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    content: {
        padding: 24,
        paddingTop: 60,
        alignItems: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF9E6', // Light gold bg
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontFamily: Typography.playfairBold,
        fontSize: 32,
        color: Colors.ink,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 24,
    },
    card: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 16,
        textAlign: 'left',
    },
    roundRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    roundLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
    },
    statContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    accuracyText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
    },
    statusLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 12,
        color: Colors.taupe,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
    },
    totalValue: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.thaiGold,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: Colors.paper,
    },
    primaryButton: {
        backgroundColor: Colors.ink,
        height: 56,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.white,
    },
});
