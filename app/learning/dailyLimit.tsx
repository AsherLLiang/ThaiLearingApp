import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';

export default function DailyLimitSetupScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const moduleParam = typeof params.module === 'string' ? params.module : 'word';
    const moduleType: ModuleType = moduleParam === 'letter' ? 'letter' : 'word';
    const courseSource = typeof params.source === 'string' ? params.source : undefined;

    const { dailyLimits, setDailyLimit } = useLearningPreferenceStore();
    const { setDailyLimit: setProgressDailyLimit } = useModuleAccessStore();
    const { startCourse } = useVocabularyStore();

    const initialLimit = useMemo(() => dailyLimits[moduleType] || 20, [dailyLimits, moduleType]);
    const [limit, setLimit] = useState(initialLimit);

    const handleConfirm = async () => {
        setDailyLimit(moduleType, limit);
        await setProgressDailyLimit(moduleType, limit);
        // User requested: Save setting and go back, do NOT start session immediately.
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ThaiPatternBackground opacity={0.1} />
            <View style={styles.header}>
                <Text style={styles.title}>{t('learning.setupTitle', '今日学习计划')}</Text>
                <Text style={styles.subtitle}>
                    {moduleType === 'letter'
                        ? t('learning.setupSubtitle', '选择今天要学习/复习的字母数量')
                        : t('learning.setupSubtitleWords', '选择今天要学习/复习的单词数量')}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.limitValue}>{limit}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={5}
                    maximumValue={200}
                    step={5}
                    value={limit}
                    onValueChange={(value) => setLimit(Math.round(value))}
                    minimumTrackTintColor={Colors.thaiGold}
                    maximumTrackTintColor={Colors.sand}
                    thumbTintColor={Colors.ink}
                />
                <View style={styles.limitLabels}>
                    <Text style={styles.limitLabel}>5</Text>
                    <Text style={styles.limitLabel}>200</Text>
                </View>

                <Pressable style={styles.startButton} onPress={handleConfirm}>
                    <Text style={styles.startButtonText}>{t('learning.start', '开始学习')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    header: {
        marginBottom: 24,
        gap: 8,
    },
    title: {
        fontFamily: Typography.playfairBold,
        fontSize: 26,
        color: Colors.ink,
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        lineHeight: 20,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    limitValue: {
        fontFamily: Typography.playfairBold,
        fontSize: 42,
        color: Colors.ink,
        textAlign: 'center',
        marginBottom: 12,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    limitLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -8,
        marginBottom: 24,
    },
    limitLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
    },
    startButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    startButtonText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
    },
});
