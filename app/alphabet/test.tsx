import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { callCloudFunction } from '@/src/utils/apiClient';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { useTranslation } from 'react-i18next';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface TestQuestion {
    id: string;
    question: string;
    options: string[];
}

interface UserAnswer {
    questionId: string;
    answer: string;
}

interface TestResponse {
    questions: TestQuestion[];
}

interface SubmitResponse {
    passed: boolean;
    score?: number;
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
    const [questions, setQuestions] = useState<TestQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    // 1️⃣ Fetch Test Data on Mount
    useEffect(() => {
        fetchTest();
    }, []);

    const fetchTest = async () => {
        try {
            setLoading(true);
            // 调用后端云函数：获取测试题
            const result = await callCloudFunction<TestResponse>(
                'getLetterTest',
                {},
                { endpoint: API_ENDPOINTS.ALPHABET.GET_TEST }
            );

            if (result.success && result.data?.questions) {
                setQuestions(result.data.questions);
            } else {
                Alert.alert('Error', 'Failed to load test questions.');
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

            const formattedAnswers: UserAnswer[] = Object.entries(answers).map(([qid, ans]) => ({
                questionId: qid,
                answer: ans
            }));

            // 调用后端云函数：提交答案
            const result = await callCloudFunction<SubmitResponse>(
                'submitLetterTest',
                { answers: formattedAnswers },
                { endpoint: API_ENDPOINTS.ALPHABET.SUBMIT_TEST }
            );

            if (result.success) {
                if (result.data?.passed) {
                    // 🎉 Test Passed
                    Alert.alert(
                        'Congratulations!',
                        'You have passed the test. All modules are now unlocked.',
                        [{
                            text: 'Go to Courses',
                            onPress: async () => {
                                // 🔒 关键步骤：刷新用户权限状态以解锁前端
                                await useModuleAccessStore.getState().getUserProgress();
                                router.replace('/courses'); // 替换路由，防止回退
                            }
                        }]
                    );
                } else {
                    // ❌ Test Failed
                    Alert.alert(
                        'Test Failed',
                        'You did not reach the passing score. Please try again or continue learning.',
                        [{ text: 'OK' }]
                    );
                }
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
                        <Text style={styles.questionText}>{index + 1}. {q.question}</Text>

                        <View style={styles.optionsContainer}>
                            {q.options.map((opt) => {
                                const isSelected = answers[q.id] === opt;
                                return (
                                    <Pressable
                                        key={opt}
                                        style={[styles.optionButton, isSelected && styles.optionSelected]}
                                        onPress={() => selectAnswer(q.id, opt)}
                                    >
                                        <View style={[styles.radioCircle, isSelected && styles.radioSelected]} />
                                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                            {opt}
                                        </Text>
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
