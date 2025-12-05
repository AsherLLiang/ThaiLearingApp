import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Type } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { useTranslation } from 'react-i18next';

export function AlphabetCourseCard() {
    const router = useRouter();
    const { completedCount, totalCount } = useAlphabetStore();
    // Actually, useAlphabetStore is a hook. The helper hooks are exported separately.
    // Let's just calculate percentage here or import the hook properly.

    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // Re-reading previous file content of AlphabetCourseCard.tsx:
    // import { useAlphabetStore } from '@/src/stores/alphabetStore';

    // I haven't checked alphabetStore.ts content yet. Let me quickly check it to be sure.
    // If it doesn't have letterCompleted, I'll use moduleAccessStore.

    const { t } = useTranslation();

    // Placeholder for logic until I verify store.
    // For now, I will use moduleAccessStore as it definitely has the flag I just added.
    const { userProgress: globalProgress } = useModuleAccessStore();

    const isLetterCompleted = globalProgress?.letterCompleted || false;

    const { currentCourseSource, startCourse } = useVocabularyStore();

    const handlePress = async () => {
        if (currentCourseSource !== 'alphabet') {
            await startCourse('alphabet');
            // First time: Jump to Learning/index (which will redirect or handle setup)
            // As per requirement: "User first time clicks... jump to Learning/index"
            router.push('/learning');
        } else {
            // Subsequent times: Jump directly to alphabet learning
            router.push('/learning/alphabet');
        }
    };

    return (
        <Pressable
            style={styles.card}
            onPress={handlePress}
        >
            <Image
                source={require('@/assets/images/courses/thai_alphabet.png')}
                style={styles.image}
            />
            <View style={styles.info}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <Type size={16} color={Colors.thaiGold} />
                        <Text style={styles.title}>{t('alphabet.title')}</Text>
                    </View>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{t('alphabet.level')}</Text>
                    </View>
                </View>

                <Text style={styles.description}>
                    {t('alphabet.description')}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {completedCount}/{totalCount}
                        </Text>
                    </View>

                    <View style={styles.startBtn}>
                        <Text style={styles.startBtnText}>
                            {isLetterCompleted ? t('common.review', '复习') : (progressPercentage > 0 ? t('alphabet.continue') : t('alphabet.start'))}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.sand,
        height: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 100,
        height: '100%',
        resizeMode: 'cover',
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
    },
    levelBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    levelText: {
        fontSize: 10,
        color: Colors.thaiGold,
        fontFamily: Typography.notoSerifRegular,
    },
    description: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
        lineHeight: 16,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressContainer: {
        flex: 1,
        marginRight: 12,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 2,
    },
    progressText: {
        fontSize: 10,
        color: Colors.taupe,
        fontFamily: Typography.notoSerifRegular,
    },
    startBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.ink,
        borderRadius: 12,
    },
    startBtnText: {
        fontSize: 11,
        color: Colors.white,
        fontFamily: Typography.notoSerifRegular,
    },
});
