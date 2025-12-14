// src/components/learning/alphabet/SessionRecoveryCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface SessionRecoveryCardProps {
    onContinue: () => void;
    onRestart: () => void;
}

export function SessionRecoveryCard({
    onContinue,
    onRestart,
}: SessionRecoveryCardProps) {
    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <Text style={styles.title}>继续上次学习？</Text>
                <Text style={styles.description}>
                    检测到您在该课程存在未完成的轮次，是否继续之前的阶段？
                </Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.restartButton]}
                        onPress={onRestart}
                    >
                        <Text style={styles.restartText}>重新开始本轮</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.continueButton]}
                        onPress={onContinue}
                    >
                        <Text style={styles.continueText}>继续学习</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    card: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: Colors.paper, // slightly off-white like the Phonics card
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 20,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 15,
        color: Colors.taupe,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restartButton: {
        backgroundColor: '#F5F5F5',
    },
    continueButton: {
        backgroundColor: '#F0F8FF', // Light blueish/interaction hint
    },
    restartText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 15,
        color: '#E63946', // Red destructive color
    },
    continueText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 15,
        color: '#007AFF', // Standard action blue, or we can use another brand color
    },
});
