import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trophy, PlayCircle, Star, Lock } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { useTranslation } from 'react-i18next';

export default function AlphabetHomeScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { getMasteredCount, getTotalCount, getProgressPercentage, masteredIds } = useAlphabetStore();

    const masteredCount = getMasteredCount();
    const totalCount = getTotalCount();
    const accuracy = useAlphabetStore((state) => state.accuracy);

    const categories = [
        { id: 'mid', label: '中辅音', subLabel: 'Mid Class Consonants', count: 9, color: '#4CAF50' },
        { id: 'high', label: '高辅音', subLabel: 'High Class Consonants', count: 11, color: '#FF9800' },
        { id: 'low', label: '低辅音', subLabel: 'Low Class Consonants', count: 24, color: '#2196F3' },
        { id: 'vowel', label: '元音', subLabel: 'Vowels', count: 32, color: '#E91E63' },
    ];

    const isAllMastered = masteredCount >= totalCount;

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ThaiPatternBackground opacity={0.08} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>泰语字母学习</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Progress Section */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>学习进度</Text>
                        <Trophy size={20} color={Colors.thaiGold} />
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {masteredCount} <Text style={styles.statTotal}>/ {totalCount}</Text>
                            </Text>
                            <Text style={styles.statLabel}>已掌握</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{accuracy}%</Text>
                            <Text style={styles.statLabel}>正确率</Text>
                        </View>
                    </View>

                    <View style={styles.progressBarBg}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${getProgressPercentage()}%` }
                            ]}
                        />
                    </View>
                </View>

                {/* Categories Grid */}
                <Text style={styles.sectionTitle}>字母分类</Text>
                <View style={styles.gridContainer}>
                    {categories.map((cat) => (
                        <Pressable
                            key={cat.id}
                            style={styles.categoryCard}
                            onPress={() => router.push({
                                pathname: '/learning/alphabet/list',
                                params: { category: cat.id, title: cat.label }
                            })}
                        >
                            <View style={[styles.iconPlaceholder, { backgroundColor: `${cat.color}20` }]}>
                                <Text style={[styles.iconText, { color: cat.color }]}>{cat.label.charAt(0)}</Text>
                            </View>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryName}>{cat.label}</Text>
                                <Text style={styles.categorySub}>{cat.subLabel}</Text>
                            </View>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{cat.count}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Daily Training */}
                <Text style={styles.sectionTitle}>每日训练</Text>
                <View style={styles.actionButtons}>
                    <Pressable
                        style={styles.actionButton}
                        onPress={() => router.push('/learning/alphabet/training')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                            <PlayCircle size={24} color="#2196F3" />
                        </View>
                        <View>
                            <Text style={styles.actionTitle}>今日拼读训练</Text>
                            <Text style={styles.actionDesc}>强化发音记忆</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        style={styles.actionButton}
                        onPress={() => router.push('/learning/alphabet/review')}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                            <Star size={24} color="#FF9800" />
                        </View>
                        <View>
                            <Text style={styles.actionTitle}>今日字母复习</Text>
                            <Text style={styles.actionDesc}>巩固已学内容</Text>
                        </View>
                    </Pressable>
                </View>

            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <Pressable
                    style={[styles.unlockButton, !isAllMastered && styles.unlockButtonDisabled]}
                    disabled={!isAllMastered}
                    onPress={() => {
                        if (isAllMastered) {
                            // Navigate to word learning or show success
                            router.push('/learning/alphabet/success');
                        }
                    }}
                >
                    {!isAllMastered && <Lock size={20} color={Colors.taupe} style={{ marginRight: 8 }} />}
                    <Text style={[styles.unlockButtonText, !isAllMastered && styles.unlockButtonTextDisabled]}>
                        {isAllMastered ? '进入单词学习' : '通关后解锁单词学习'}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 20,
        color: Colors.ink,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    progressCard: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 4,
    },
    statTotal: {
        fontSize: 14,
        color: Colors.taupe,
        fontFamily: Typography.notoSerifRegular,
    },
    statLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: Colors.sand,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 4,
    },
    sectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 16,
        marginTop: 8,
    },
    gridContainer: {
        gap: 12,
        marginBottom: 24,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    iconPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    iconText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 20,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 4,
    },
    categorySub: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
    },
    countBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 12,
        color: Colors.taupe,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.ink,
        marginBottom: 4,
    },
    actionDesc: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 11,
        color: Colors.taupe,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    unlockButton: {
        flexDirection: 'row',
        backgroundColor: Colors.ink,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    unlockButtonDisabled: {
        backgroundColor: '#E0E0E0',
        shadowOpacity: 0,
        elevation: 0,
    },
    unlockButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
    unlockButtonTextDisabled: {
        color: Colors.taupe,
    },
});
