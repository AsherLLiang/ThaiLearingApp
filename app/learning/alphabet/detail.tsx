import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Volume2, Check, ChevronRight } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getAllLetters, getLetterById } from '@/src/utils/letterData';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import type { Letter } from '@/src/entities/types/letter.types';
import { Audio } from 'expo-av';

export default function AlphabetDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [letter, setLetter] = useState<Letter | null>(null);
    const [isMastered, setIsMastered] = useState(false);
    const [sound, setSound] = useState<Audio.Sound>();
    const { isLetterMastered, markAsMastered } = useAlphabetStore();

    useEffect(() => {
        loadLetter(params.letterId as string);
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [params.letterId]);

    const loadLetter = (id: string) => {
        const found = getLetterById(id);
        if (found) {
            setLetter(found);
            setIsMastered(isLetterMastered(id));
        }
    };

    const playSound = async () => {
        // Mock audio playback
        console.log('Playing sound for:', letter?.thaiChar);
        // In real app:
        // const { sound } = await Audio.Sound.createAsync({ uri: letter.audioPath });
        // setSound(sound);
        // await sound.playAsync();
    };

    const handleMastered = async () => {
        if (letter) {
            await markAsMastered(letter._id);
            setIsMastered(true);
        }
    };

    const handleNext = () => {
        if (!letter) return;
        const allLetters = getAllLetters();
        const currentIndex = allLetters.findIndex(l => l._id === letter._id);
        if (currentIndex < allLetters.length - 1) {
            const nextId = allLetters[currentIndex + 1]._id;
            router.replace({
                pathname: '/learning/alphabet/detail',
                params: { letterId: nextId }
            });
        }
    };

    const handlePrev = () => {
        if (!letter) return;
        const allLetters = getAllLetters();
        const currentIndex = allLetters.findIndex(l => l._id === letter._id);
        if (currentIndex > 0) {
            const prevId = allLetters[currentIndex - 1]._id;
            router.replace({
                pathname: '/learning/alphabet/detail',
                params: { letterId: prevId }
            });
        }
    };

    if (!letter) return null;

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ThaiPatternBackground opacity={0.08} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>字母详情</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Main Letter Card */}
                <View style={styles.mainCard}>
                    <Text style={styles.thaiChar}>{letter.thaiChar}</Text>
                    <View style={styles.phoneticContainer}>
                        <Text style={styles.phonetic}>/{letter.initialSound}/</Text>
                        <Pressable style={styles.audioButton} onPress={playSound}>
                            <Volume2 size={24} color={Colors.thaiGold} />
                        </Pressable>
                    </View>
                    <Text style={styles.hint}>发音近似：类似汉语 "{letter.initialSound === 'k' ? 'g' : letter.initialSound}"</Text>
                </View>

                {/* Example Word */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>示例拼读</Text>
                    <View style={styles.exampleCard}>
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleThai}>{letter.exampleWord}</Text>
                            <Text style={styles.examplePhonetic}>/{letter.nameEnglish}/</Text>
                        </View>
                        <Text style={styles.exampleMeaning}>{letter.exampleMeaning}</Text>
                        <Pressable style={styles.exampleAudio} onPress={playSound}>
                            <Volume2 size={20} color={Colors.taupe} />
                        </Pressable>
                    </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>泰语名</Text>
                        <Text style={styles.infoValue}>{letter.nameThai}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>类别</Text>
                        <Text style={styles.infoValue}>
                            {letter.class === 'mid' ? '中辅音' :
                                letter.class === 'high' ? '高辅音' :
                                    letter.class === 'low' ? '低辅音' : '元音'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.footer}>
                <View style={styles.navRow}>
                    <Pressable style={styles.navButton} onPress={handlePrev}>
                        <ChevronLeft size={24} color={Colors.ink} />
                        <Text style={styles.navText}>上一个</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.masterButton, isMastered && styles.masterButtonActive]}
                        onPress={handleMastered}
                    >
                        {isMastered ? (
                            <>
                                <Check size={20} color={Colors.white} style={{ marginRight: 8 }} />
                                <Text style={styles.masterButtonText}>已掌握</Text>
                            </>
                        ) : (
                            <Text style={styles.masterButtonText}>标记为已掌握</Text>
                        )}
                    </Pressable>

                    <Pressable style={styles.navButton} onPress={handleNext}>
                        <Text style={styles.navText}>下一个</Text>
                        <ChevronRight size={24} color={Colors.ink} />
                    </Pressable>
                </View>
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
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    mainCard: {
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    thaiChar: {
        fontFamily: Typography.playfairBold,
        fontSize: 80,
        color: Colors.ink,
        marginBottom: 16,
    },
    phoneticContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    phonetic: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 24,
        color: Colors.taupe,
    },
    audioButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF8E1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    hint: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 12,
    },
    exampleCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.sand,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    exampleRow: {
        flex: 1,
    },
    exampleThai: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 20,
        color: Colors.ink,
        marginBottom: 4,
    },
    examplePhonetic: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    exampleMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
        marginRight: 16,
    },
    exampleAudio: {
        padding: 8,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    infoItem: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    infoLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
        marginBottom: 4,
    },
    infoValue: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 32,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 4,
    },
    navText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.ink,
    },
    masterButton: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.thaiGold,
        alignItems: 'center',
    },
    masterButtonActive: {
        backgroundColor: Colors.thaiGold,
    },
    masterButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.ink,
    },
});
