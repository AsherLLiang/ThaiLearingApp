import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { CheckCircle2 } from 'lucide-react-native';

interface RoundCompletionViewProps {
    roundNumber: number;
    onFinish: () => void;
}

export function RoundCompletionView({
    roundNumber,
    onFinish,
}: RoundCompletionViewProps) {
    const { t } = useTranslation();
    const isFinal = roundNumber >= 3;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <CheckCircle2 size={80} color={Colors.thaiGold} style={styles.icon} />

                <Text style={styles.title}>
                    {isFinal
                        ? t('components.completion.courseDone', '课程完成！')
                        : t('components.completion.roundDone', { round: roundNumber, defaultValue: `Round ${roundNumber} 完成` })}
                </Text>

                <Text style={styles.subtitle}>
                    {isFinal
                        ? t('components.completion.courseDoneMsg', '恭喜你完成了本节课程的所有学习内容！')
                        : t('components.completion.roundDoneMsg', '休息一下，准备进入下一轮学习\n每节课需完成3轮学习')}
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onFinish}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {isFinal
                            ? t('components.completion.finishCourse', '完成课程')
                            : t('components.completion.backToCourses', '返回选课')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 32,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    icon: {
        marginBottom: 24,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 100,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});
