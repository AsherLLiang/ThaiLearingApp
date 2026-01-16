import React, { use, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { callCloudFunction } from '@/src/utils/apiClient';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useUserStore } from '@/src/stores/userStore';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { useTranslation } from 'react-i18next';
import { generateQuestion } from '@/src/utils/lettersQuestionGenerator';
import { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';
import { Letter } from '@/src/entities/types/letter.types';
import { AlphabetQuestion } from '@/src/entities/types/alphabet.types';
import { Audio } from 'expo-av';
import { TextStyle } from 'react-native';
import { getLetterAudioUrl } from '@/src/utils/alphabet/audioHelper';
import * as FileSystem from 'expo-file-system/legacy';


// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------


interface UserAnswer {
    questionId: string;
    answer: string;
}

interface TestResponse {
    questions: AlphabetQuestion[];
}

interface SubmitResponse {
    passed: boolean;
    score?: number;
}

// ------------------------------------------------------------------
// Pure Helper: Test Generator
// ------------------------------------------------------------------

/**
 * 纯函数：根据字母池生成 20 道测试题
 * 
 * 逻辑：
 * 1. 打乱字母池
 * 2. 确保凑够 20 个题目源 (不足则循环补充)
 * 3. 转换为 UI 展示用的 TestQuestion 格式
 */

export function generateTestQuestions(allLetters: Letter[]): AlphabetQuestion[] {
    // 防御性编程：如果没有字母或其他异常，返回空数组
    if (!allLetters || allLetters.length === 0) return [];
    // TODO 1: 创建副本并洗牌 (Shuffle)
    const pool = [...allLetters].sort(() => Math.random() - 0.5);
    // TODO 2: 截取或循环补齐到 20 个 (Target Letters)
    const TARGET_COUNT = 20;
    const targetLetters: Letter[] = [];
    let i = 0;
    while (targetLetters.length < TARGET_COUNT) {
        // 取模运算：即使 i 超过 pool.length，也能循环回到开头取值
        targetLetters.push(pool[i % pool.length]);
        i++;
    }
    // TODO 3: Generate Questions & Map to UI Model
    return targetLetters.map((letter, index) => {
        const queueItem = {
            letter,
            letterId: letter._id,
            gameType: Math.random() > 0.5
                ? AlphabetGameType.SOUND_TO_LETTER
                : AlphabetGameType.LETTER_TO_SOUND
        }
        // 提示：调用 generateQuestion(queueItem, allLetters)
        const algoQuestion = generateQuestion(queueItem, allLetters);

        return {
            ...algoQuestion,
            id: `${algoQuestion.id}-${index}`
        };
    }
    )
}

// ------------------------------------------------------------------
// Component: Alphabet Test Page
// ------------------------------------------------------------------
export default function AlphabetTestScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    // State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [questions, setQuestions] = useState<AlphabetQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // 简化的音频播放（参考 AlphabetReviewView）
    const playAudio = async (audioUrl: string) => {
        try {
            // 停止并卸载之前的音频
            if (sound) {
                try {
                    await sound.stopAsync();
                    await sound.unloadAsync();
                } catch (e) {
                    // 忽略清理错误
                }
            }

            // 直接加载并播放
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    };

    //清理音频
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // 🎵 后台音频预下载（参考 alphabetStore）
    const toHttpUrl = (path?: string | null): string => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        let finalPath = path;
        if (!/\.mp3($|\?)/.test(finalPath)) {
            finalPath = `${finalPath}.mp3`;
        }
        return `https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/${finalPath}`;
    };

    const predownloadAudio = async (letters: Letter[]) => {
        try {
            const cacheDir = `${FileSystem.cacheDirectory}alphabet-audio/`;
            const dirInfo = await FileSystem.getInfoAsync(cacheDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
            }

            const updatedLetters = new Map<string, Letter>();

            for (const letter of letters) {
                const updatedLetter = { ...letter };

                // 下载所有音频字段
                const fields: Array<{ key: keyof Letter; localKey: keyof Letter }> = [
                    { key: 'fullSoundUrl', localKey: 'fullSoundLocalPath' },
                    { key: 'syllableSoundUrl', localKey: 'syllableSoundLocalPath' },
                    { key: 'letterPronunciationUrl', localKey: 'letterPronunciationLocalPath' },
                ];

                for (const field of fields) {
                    const url = letter[field.key] as string | undefined;
                    if (!url) continue;

                    const httpUrl = toHttpUrl(url);
                    if (!httpUrl) continue;

                    const fileName = encodeURIComponent(httpUrl);
                    const localPath = `${cacheDir}${fileName}`;

                    try {
                        const info = await FileSystem.getInfoAsync(localPath);
                        if (!info.exists) {
                            await FileSystem.downloadAsync(httpUrl, localPath);
                        }
                        (updatedLetter as any)[field.localKey] = localPath;
                    } catch (err) {
                        console.warn(`Failed to download ${httpUrl}:`, err);
                    }
                }

                updatedLetters.set(letter._id, updatedLetter);
            }

            // 更新 questions 中的 Letter 对象
            setQuestions(prevQuestions =>
                prevQuestions.map(q => ({
                    ...q,
                    targetLetter: updatedLetters.get(q.targetLetter._id) || q.targetLetter,
                    options: q.options?.map(opt =>
                        updatedLetters.get(opt._id) || opt
                    )
                }))
            );

            console.log('✅ Audio predownload completed');
        } catch (error) {
            console.error('Failed to predownload audio:', error);
        }
    };

    // 1️⃣ Fetch Test Data on Mount
    useEffect(() => {
        fetchTest();
    }, []);

    const fetchTest = async () => {
        try {
            setLoading(true);
            // 🆕 调用新的 getAllLetters 接口获取字母池
            const result = await callCloudFunction<{ letters: Letter[] }>(
                'getAllLetters',
                {},
                { endpoint: API_ENDPOINTS.ALPHABET.GET_TEST }
            );

            if (result.success && result.data?.letters) {
                // 🆕 使用生成器函数在前端生成 20 道题
                const generatedQuestions = generateTestQuestions(result.data.letters);
                setQuestions(generatedQuestions);

                // 🎵 后台异步下载音频（不阻塞页面显示）
                (async () => {
                    if (result.data?.letters) {
                        await predownloadAudio(result.data.letters);
                    }
                })();
            } else {
                Alert.alert('Error', 'Failed to load letters.');
            }
        } catch (error) {
            console.error('Fetch test error:', error);
            Alert.alert('Error', 'An error occurred while loading the test.');
        } finally {
            setLoading(false);
        }
    };

    // 2️⃣ Handle Answer Selection
    const selectAnswer = (questionId: string, option: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    // 3️⃣ Submit Test
    const handleSubmit = async () => {
        // Basic Validation
        if (Object.keys(answers).length < questions.length) {
            Alert.alert('Incomplete', 'Please answer all questions before submitting.');
            return;
        }

        try {
            setSubmitting(true);
            // 本地判分
            const correctCount = questions.filter(q => answers[q.id] === q.correctAnswer).length;
            const passed = correctCount >= 17;

            console.log(`判分结果： ${correctCount}/20, 通过： ${passed}`);
            //如果没通过，直接提示失败，不调用后端
            if (!passed) {
                Alert.alert(
                    'Test Failed',
                    `You got ${correctCount}/20 correct. You need at least 17 to pass.`,
                    [{ text: 'Try again' }]
                )
                setSubmitting(false);
                return;     //提前返回，不执行后续网络请求
            }

            // 调用后端云函数：提交答案
            const userId = useUserStore.getState().currentUser?.userId;

            if (!userId) {
                Alert.alert('Error', 'User not logged in');
                setSubmitting(false);
                return;
            }

            const result = await callCloudFunction<SubmitResponse>(
                'submitLetterTest',
                { userId, passed: true },
                { endpoint: API_ENDPOINTS.ALPHABET.SUBMIT_TEST }
            );

            if (result.success) {
                // 🎉 Test Passed
                Alert.alert(
                    'Congratulations!',
                    'You have passed the test. All modules are now unlocked.',
                    [{
                        text: 'Got it',
                        onPress: async () => {
                            await useModuleAccessStore.getState().getUserProgress();
                            router.replace('/courses');
                        }
                    }]
                )

            } else {
                Alert.alert('Error', result.error || 'Submission failed.');
            }
        } catch (error) {
            console.error('Submit test error:', error);
            Alert.alert('Error', 'An error occurred while submitting the test.');
        } finally {
            setSubmitting(false);
        }
    };

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.thaiGold} />
                <Text style={styles.loadingText}>Loading Test...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.1} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Alphabet Test</Text>
                <Text style={styles.subtitle}>Pass this test to unlock all courses immediately.</Text>
            </View>

            {/* Questions List */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {questions.map((q, index) => (
                    <View key={q.id} style={styles.questionCard}>
                        {/* 题号 */}
                        <Text style={styles.questionNumber}>Question {index + 1}/20</Text>
                        {/* 🆕 根据题型显示不同内容 */}
                        {q.gameType === AlphabetGameType.SOUND_TO_LETTER ? (
                            // 听音选字：显示播放按钮
                            <View style={styles.audioQuestionContainer}>
                                <Text style={styles.questionText}>
                                    Which letter matches this sound?
                                </Text>
                                <Pressable
                                    style={styles.playButton}
                                    onPress={() => {
                                        const audioUrl = getLetterAudioUrl(q.targetLetter, 'letter');
                                        if (audioUrl) {
                                            playAudio(audioUrl);
                                        }
                                    }}
                                >
                                    <Text style={styles.playButtonText}>🔊 Play Sound</Text>
                                </Pressable>
                            </View>
                        ) : (
                            // 看字选音：显示泰文字母
                            <View style={styles.letterQuestionContainer}>
                                <Text style={styles.questionText}>
                                    Which sound matches this letter?
                                </Text>
                                <Text style={styles.targetLetter}>
                                    {q.targetLetter.thaiChar}
                                </Text>
                            </View>
                        )}
                        {/* 🆕 选项渲染 */}
                        <View style={styles.optionsContainer}>
                            {q.options?.map((option, optIndex) => {
                                const isSelected = answers[q.id] === option.thaiChar;

                                // SOUND_TO_LETTER: 显示泰文字符
                                if (q.gameType === AlphabetGameType.SOUND_TO_LETTER) {
                                    return (
                                        <Pressable
                                            key={option._id}
                                            style={[styles.optionButton, isSelected && styles.optionSelected]}
                                            onPress={() => selectAnswer(q.id, option.thaiChar)}
                                        >
                                            <View style={[styles.radioCircle, isSelected && styles.radioSelected]} />
                                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                                {option.thaiChar}
                                            </Text>
                                        </Pressable>
                                    );
                                }

                                // LETTER_TO_SOUND: 显示播放按钮
                                return (
                                    <Pressable
                                        key={option._id}
                                        style={[styles.audioOptionButton, isSelected && styles.audioOptionSelected]}
                                        onPress={() => {
                                            // 使用 audioHelper 获取正确的音频路径
                                            const audioUrl = getLetterAudioUrl(option, 'letter');

                                            // 播放音频
                                            if (audioUrl) {
                                                playAudio(audioUrl);
                                            }
                                            // 选择答案
                                            selectAnswer(q.id, option.thaiChar);
                                        }}
                                    >
                                        <View style={[styles.radioCircle, isSelected && styles.radioSelected]} />
                                        <View style={styles.audioOptionContent}>
                                            <Text style={styles.audioOptionLabel}>选项 {optIndex + 1}</Text>
                                            <Text style={styles.audioOptionIcon}>🔊</Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                ))}

                {/* Submit Button */}
                <Pressable
                    style={[
                        styles.submitButton,
                        (submitting || Object.keys(answers).length < questions.length) && styles.submitDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Test</Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.paper,
    },
    loadingText: {
        marginTop: 12,
        fontFamily: Typography.notoSerifRegular,
        color: Colors.taupe,
    },
    header: {
        padding: 24,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    title: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        gap: 24,
    },
    audioQuestionContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    letterQuestionContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    targetLetter: {
        fontSize: 48,
        fontFamily: Typography.notoSerifBold,
        color: Colors.ink,
        marginTop: 12,
    },
    playButton: {
        backgroundColor: Colors.thaiGold,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 12,
    },
    playButtonText: {
        fontSize: 16,
        fontFamily: Typography.notoSerifBold,
        color: Colors.white,
    },
    questionNumber: {
        fontSize: 12,
        fontFamily: Typography.notoSerifRegular,
        color: Colors.taupe,
        marginBottom: 8,
    },
    audioOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
    },
    audioOptionSelected: {
        borderColor: Colors.thaiGold,
        backgroundColor: '#FFF9E6',
    },
    audioOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    audioOptionLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.ink,
    },
    audioOptionIcon: {
        fontSize: 20,
    },
    questionCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    questionText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 16,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
    },
    optionSelected: {
        borderColor: Colors.thaiGold,
        backgroundColor: '#FFF9E6', // Light gold bg
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.taupe,
        marginRight: 12,
    },
    radioSelected: {
        borderColor: Colors.thaiGold,
        backgroundColor: Colors.thaiGold,
    },
    optionText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.ink,
    },
    optionTextSelected: {
        color: Colors.ink, // Keep ink for readability, or change if needed
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    submitDisabled: {
        backgroundColor: '#A0A0A0',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
        letterSpacing: 1,
    },
});
