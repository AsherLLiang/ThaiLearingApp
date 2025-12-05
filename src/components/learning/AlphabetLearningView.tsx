import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { AlphabetLearningState } from '@/src/stores/alphabetStore';
import { Audio } from 'expo-av';

interface AlphabetLearningViewProps {
    alphabet: AlphabetLearningState;
    onNext: () => void;
}

export const AlphabetLearningView: React.FC<AlphabetLearningViewProps> = ({ alphabet, onNext }) => {
    const { t } = useTranslation();

    const playAudio = async () => {
        if (alphabet.audioPath) {
            try {
                const { sound } = await Audio.Sound.createAsync({ uri: alphabet.audioPath });
                await sound.playAsync();
            } catch (error) {
                console.error('Failed to play audio', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Character Card */}
                <View style={styles.cardContainer}>
                    <View style={styles.charCard}>
                        <Text style={styles.thaiChar}>{alphabet.thaiChar}</Text>

                        <View style={styles.pronunciationRow}>
                            <Pressable style={styles.audioButton} onPress={playAudio}>
                                <Volume2 size={24} color={Colors.thaiGold} />
                            </Pressable>
                            <Text style={styles.pronunciationText}>{alphabet.pronunciation}</Text>
                        </View>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('learning.category', '类别')}</Text>
                        <View style={styles.tagContainer}>
                            <Text style={styles.tagText}>{t(`alphabet.category.${alphabet.category}`, alphabet.category)}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('learning.example', '例词')}</Text>
                        <View style={styles.exampleBox}>
                            <Text style={styles.exampleText}>{alphabet.example}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomBar}>
                <Pressable style={styles.mainButton} onPress={onNext}>
                    <Text style={styles.mainButtonText}>{t('learning.next', '下一个')}</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 100,
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    charCard: {
        width: '100%',
        aspectRatio: 1,
        maxHeight: 300,
        backgroundColor: Colors.white,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    thaiChar: {
        fontFamily: Typography.sarabunBold,
        fontSize: 120,
        color: Colors.ink,
        marginBottom: 16,
    },
    pronunciationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    audioButton: {
        padding: 4,
    },
    pronunciationText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 20,
        color: Colors.ink,
    },
    detailsContainer: {
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.taupe,
    },
    tagContainer: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    tagText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
    },
    exampleBox: {
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    exampleText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 18,
        color: Colors.ink,
        lineHeight: 28,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    mainButton: {
        backgroundColor: Colors.ink,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    mainButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.white,
    },
});
