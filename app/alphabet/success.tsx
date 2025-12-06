import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CheckCircle, Lock, ArrowRight } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export default function AlphabetSuccessScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <ThaiPatternBackground opacity={0.1} />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.emoji}>🎉</Text>
                </View>

                <Text style={styles.title}>恭喜你完成字母学习！</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>你已经具备：</Text>

                    <View style={styles.item}>
                        <CheckCircle size={24} color="#4CAF50" />
                        <Text style={styles.itemText}>字形识别能力</Text>
                    </View>

                    <View style={styles.item}>
                        <CheckCircle size={24} color="#4CAF50" />
                        <Text style={styles.itemText}>基础拼读能力</Text>
                    </View>
                </View>

                <Text style={styles.unlockText}>现在可以解锁：</Text>

                <Pressable
                    style={styles.unlockButton}
                    onPress={() => {
                        // Navigate to word learning (mock)
                        router.push('/learning');
                    }}
                >
                    <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>进入单词学习系统</Text>
                        <ArrowRight size={20} color={Colors.white} />
                    </View>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    iconContainer: {
        marginBottom: 24,
    },
    emoji: {
        fontSize: 80,
    },
    title: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        textAlign: 'center',
        marginBottom: 48,
    },
    card: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    cardTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.taupe,
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    itemText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.ink,
    },
    unlockText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        marginBottom: 16,
    },
    unlockButton: {
        width: '100%',
        backgroundColor: Colors.ink,
        paddingVertical: 18,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buttonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});
