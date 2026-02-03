import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';

interface WordCardProps {
    vocabulary: Vocabulary;
    autoPlay?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ vocabulary, autoPlay = false }) => {
    const soundRef = useRef<Audio.Sound | null>(null);

    const playAudio = async () => {
        try {
            const url = await getVocabAudioUrl({ audioPath: vocabulary.audioPath });
            if (!url) return;

            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
            }

            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('Playback failed:', error);
        }
    };

    useEffect(() => {
        if (autoPlay) {
            playAudio();
        }
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
            }
        };
    }, [vocabulary._id, autoPlay]);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.wordCard}>
                <Text style={styles.thaiWord}>{vocabulary.thaiWord}</Text>

                <View style={styles.phoneticRow}>
                    <Pressable style={styles.audioButton} onPress={playAudio}>
                        <Volume2 size={20} color={Colors.thaiGold} />
                    </Pressable>
                    <Text style={styles.phoneticText}>{vocabulary.pronunciation}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    wordCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 56,
        color: Colors.ink,
        marginBottom: 8,
    },
    phoneticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    audioButton: {
        padding: 6,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 20,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 18,
        color: Colors.taupe,
    },
});
