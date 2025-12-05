import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { NewWordView, WordData } from '@/src/components/learning/NewWordView';
import { ReviewWordView } from '@/src/components/learning/ReviewWordView';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { useAlphabetStore } from '@/src/stores/alphabetStore';

// --- Mock Data ---

const MOCK_OLD_WORDS: WordData[] = [
    {
        id: 'old1',
        thai: 'กิน',
        phonetic: 'Kin',
        type: '动词',
        meaning: '吃',
        definitions: {
            basic: '吃，食用',
            examples: [
                { thai: 'กินข้าวหรือยัง', meaning: '吃饭了吗？' },
                { thai: 'ชอบกินเผ็ด', meaning: '喜欢吃辣' }
            ],
            usage: {
                grammar: [],
                diff: '无',
                mistakes: '口语常用，正式场合可用 รับประทาน',
                similar: 'ทาน (更礼貌)'
            }
        }
    },
    {
        id: 'old2',
        thai: 'นอน',
        phonetic: 'Non',
        type: '动词',
        meaning: '睡',
        definitions: {
            basic: '睡觉，躺',
            examples: [
                { thai: 'นอนหลับฝันดี', meaning: '睡个好觉 (晚安)' },
                { thai: 'ขี้เกียจนอนตื่นสาย', meaning: '懒得睡懒觉' }
            ],
            usage: {
                grammar: [],
                diff: '无',
                mistakes: '无',
                similar: 'หลับ (睡着)'
            }
        }
    },
    {
        id: 'old3',
        thai: 'ไป',
        phonetic: 'Pai',
        type: '动词',
        meaning: '去',
        definitions: {
            basic: '去，往，离开',
            examples: [
                { thai: 'ไปไหน', meaning: '去哪里？' },
                { thai: 'ไปทำงาน', meaning: '去工作' }
            ],
            usage: {
                grammar: [],
                diff: '可作趋向补语',
                mistakes: '无',
                similar: '无'
            }
        }
    },
    {
        id: 'old4',
        thai: 'มา',
        phonetic: 'Ma',
        type: '动词',
        meaning: '来',
        definitions: {
            basic: '来，来到',
            examples: [
                { thai: 'มาจากไหน', meaning: '来自哪里？' },
                { thai: 'มานี่', meaning: '来这里' }
            ],
            usage: {
                grammar: [],
                diff: '可作趋向补语',
                mistakes: '无',
                similar: '无'
            }
        }
    },
    {
        id: 'old5',
        thai: 'รัก',
        phonetic: 'Rak',
        type: '动词',
        meaning: '爱',
        definitions: {
            basic: '爱，喜爱',
            examples: [
                { thai: 'ฉันรักคุณ', meaning: '我爱你' },
                { thai: 'รักชาติ', meaning: '爱国' }
            ],
            usage: {
                grammar: [],
                diff: '无',
                mistakes: '无',
                similar: 'ชอบ (喜欢)'
            }
        }
    }
];

const MOCK_NEW_WORDS: WordData[] = [
    {
        id: 'new1',
        thai: 'ทำงาน',
        phonetic: 'Tham Ngan',
        type: '动词',
        meaning: '工作',
        definitions: {
            basic: '工作，干活',
            examples: [
                { thai: 'วันนี้ทำงานไหม', meaning: '今天工作吗？' },
                { thai: 'ทำงานหนัก', meaning: '工作努力/辛苦' }
            ],
            usage: {
                grammar: [],
                diff: '无',
                mistakes: '无',
                similar: 'งาน (名词: 工作)'
            }
        }
    },
    {
        id: 'new2',
        thai: 'เรียน',
        phonetic: 'Rian',
        type: '动词',
        meaning: '学习',
        definitions: {
            basic: '学习，读书',
            examples: [
                { thai: 'เรียนภาษาไทย', meaning: '学泰语' },
                { thai: 'ไปโรงเรียน', meaning: '去学校' }
            ],
            usage: {
                grammar: [],
                diff: '侧重于在学校学习或上课',
                mistakes: '自学通常用 ศึกษา',
                similar: 'ศึกษา (研究/进修)'
            }
        }
    },
    {
        id: 'new3',
        thai: 'เล่น',
        phonetic: 'Len',
        type: '动词',
        meaning: '玩',
        definitions: {
            basic: '玩，游戏，演奏',
            examples: [
                { thai: 'เล่นเกม', meaning: '玩游戏' },
                { thai: 'พูดเล่น', meaning: '开玩笑 (说玩)' }
            ],
            usage: {
                grammar: [],
                diff: '范围很广，可指玩耍、演奏乐器、开玩笑等',
                mistakes: '无',
                similar: 'เที่ยว (去玩/旅游)'
            }
        }
    },
    {
        id: 'new4',
        thai: 'พูด',
        phonetic: 'Phut',
        type: '动词',
        meaning: '说',
        definitions: {
            basic: '说，讲',
            examples: [
                { thai: 'พูดภาษาไทยได้ไหม', meaning: '会说泰语吗？' },
                { thai: 'พูดช้าๆ หน่อย', meaning: '请说慢一点' }
            ],
            usage: {
                grammar: [],
                diff: '侧重于说话的动作',
                mistakes: '无',
                similar: 'บอก (告诉)'
            }
        }
    },
    {
        id: 'new5',
        thai: 'ฟัง',
        phonetic: 'Fang',
        type: '动词',
        meaning: '听',
        definitions: {
            basic: '听，倾听',
            examples: [
                { thai: 'ฟังเพลง', meaning: '听音乐' },
                { thai: 'ฟังไม่ทัน', meaning: '听不及/没听清' }
            ],
            usage: {
                grammar: [],
                diff: '无',
                mistakes: '无',
                similar: 'ได้ยิน (听见)'
            }
        }
    }
];

// --- Types ---

type SessionMode = 'REVIEW' | 'LEARN_NEW';

interface QueueItem {
    word: WordData;
    type: 'review' | 'new';
    repetitionsLeft: number;
}

export default function LearningSession() {
    const { t } = useTranslation();
    const router = useRouter();
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mode, setMode] = useState<SessionMode>('REVIEW');
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    const {
        reviewQueue: alphaQueue,
        initSession: initAlphaSession
    } = useAlphabetStore();
    const {
        reviewQueue: vocabQueue,
        initSession: initVocabSession,
        currentCourseSource
    } = useVocabularyStore();

    // Redirect to Alphabet Learning if current course is alphabet
    useEffect(() => {
        if (currentCourseSource === 'alphabet') {
            router.replace('/learning/alphabet');
        }
    }, [currentCourseSource]);


    // Initialize Session
    useEffect(() => {
        // 1. Add Old Words (Review Phase) - 3 reps each
        const reviewItems: QueueItem[] = MOCK_OLD_WORDS.map(w => ({
            word: w,
            type: 'review',
            repetitionsLeft: 3
        }));

        // 2. Add New Words (Learn Phase) - 3 reps each
        const newItems: QueueItem[] = MOCK_NEW_WORDS.map(w => ({
            word: w,
            type: 'new',
            repetitionsLeft: 3
        }));

        // Combine: Review items first, then New items
        // Note: In a real app, you might interleave them or manage separate queues.
        // Here we just concat them. The 'mode' state will help us track where we are conceptually.
        setQueue([...reviewItems, ...newItems]);
    }, []);

    const currentItem = queue[currentIndex];

    // Determine current mode based on item type
    useEffect(() => {
        if (currentItem) {
            if (currentItem.type === 'review' && mode !== 'REVIEW') {
                setMode('REVIEW');
            } else if (currentItem.type === 'new' && mode !== 'LEARN_NEW') {
                setMode('LEARN_NEW');
            }
        }
    }, [currentItem, mode]);

    const handleNext = () => {
        if (!currentItem) return;

        const nextQueue = [...queue];
        const currentQueueItem = nextQueue[currentIndex];

        // Decrease repetitions
        currentQueueItem.repetitionsLeft -= 1;

        // If still needs repetition, move to end of queue (or some spaced interval)
        // For this mock, we'll just push it to the end if reps > 0
        if (currentQueueItem.repetitionsLeft > 0) {
            nextQueue.push({ ...currentQueueItem });
        }

        // Move to next item
        if (currentIndex < nextQueue.length - 1) {
            setQueue(nextQueue);
            setCurrentIndex(prev => prev + 1);
        } else {
            // Session Complete
            setIsSessionComplete(true);
        }
    };

    const handleSkipReview = () => {
        // Filter out all remaining 'review' items from the queue
        // and jump straight to the first 'new' item
        const newQueue = queue.filter(item => item.type === 'new');

        if (newQueue.length === 0) {
            Alert.alert(t('learning.noNewWordsTitle'), t('learning.noNewWordsMessage'));
            router.back();
            return;
        }

        setQueue(newQueue);
        setCurrentIndex(0);
        setMode('LEARN_NEW');
    };

    const handleClose = () => {
        Alert.alert(
            t('learning.endSessionTitle'),
            t('learning.endSessionMessage'),
            [
                { text: t('common.cancel'), style: "cancel" },
                { text: t('learning.quit'), style: "destructive", onPress: () => router.back() }
            ]
        );
    };

    if (isSessionComplete) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.completeContainer}>
                    <Text style={styles.completeTitle}>{t('learning.sessionComplete')}</Text>
                    <Pressable style={styles.completeButton} onPress={() => router.back()}>
                        <Text style={styles.completeButtonText}>{t('learning.backToHome')}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        )
    }

    if (!currentItem) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>{t('common.loading')}</Text>
            </SafeAreaView>
        );
    }

    // Calculate Progress
    const progress = Math.round(((currentIndex) / queue.length) * 100);

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>

                {mode === 'REVIEW' ? (
                    <Pressable onPress={handleSkipReview}>
                        <Text style={styles.skipText}>{t('learning.skipReview')}</Text>
                    </Pressable>
                ) : (
                    <View style={{ width: 60 }} /> // Spacer
                )}
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {currentItem.type === 'review' ? (
                    <ReviewWordView
                        key={`${currentItem.word.id}-review-${currentIndex}`} // Force re-render on index change
                        word={currentItem.word}
                        onAnswer={(quality) => {
                            console.log(`Answered ${quality} for ${currentItem.word.thai}`);
                        }}
                        onNext={handleNext}
                    />
                ) : (
                    <NewWordView
                        key={`${currentItem.word.id}-new-${currentIndex}`}
                        word={currentItem.word}
                        onNext={handleNext}
                    />
                )}
            </View>
        </SafeAreaView>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    closeButton: {
        padding: 8,
    },
    progressBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(229, 226, 219, 0.5)',
        borderRadius: 3,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 3,
    },
    skipText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    content: {
        flex: 1,
    },
    completeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 24,
    },
    completeButton: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    completeButtonText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
    },
});
