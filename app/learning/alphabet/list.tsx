import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getLettersByCategory } from '@/src/utils/letterData';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import type { Letter, LetterCategory } from '@/src/entities/types/letter.types';

export default function AlphabetListScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const categoryId = params.category as LetterCategory;
    const title = params.title as string;

    const [letters, setLetters] = useState<Letter[]>([]);
    const { masteredIds } = useAlphabetStore();

    useEffect(() => {
        loadData();
    }, [categoryId]);

    const loadData = () => {
        const data = getLettersByCategory(categoryId);
        setLetters(data);
    };

    const renderItem = ({ item }: { item: Letter }) => {
        const isMastered = masteredIds.includes(item._id);
        const isErrorProne = false; // Mock

        return (
            <Pressable
                style={[styles.letterCard, isMastered && styles.letterCardMastered]}
                onPress={() => router.push({
                    pathname: '/learning/alphabet/detail',
                    params: { letterId: item._id }
                })}
            >
                <View style={styles.statusIcon}>
                    {isMastered && <CheckCircle size={16} color={Colors.thaiGold} fill={Colors.white} />}
                    {isErrorProne && <AlertCircle size={16} color="#FF9800" />}
                </View>

                <Text style={[styles.thaiChar, isMastered && styles.textMastered]}>{item.thaiChar}</Text>
                <Text style={styles.englishName}>{item.initialSound}</Text>
            </Pressable>
        );
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ThaiPatternBackground opacity={0.08} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={28} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                data={letters}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                numColumns={3}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
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
    listContent: {
        padding: 20,
    },
    columnWrapper: {
        gap: 16,
        marginBottom: 16,
    },
    letterCard: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: Colors.white,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    letterCardMastered: {
        borderColor: Colors.thaiGold,
        backgroundColor: '#FFFCF5',
    },
    statusIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    thaiChar: {
        fontFamily: Typography.playfairBold,
        fontSize: 32,
        color: Colors.ink,
        marginBottom: 4,
    },
    textMastered: {
        color: Colors.thaiGold,
    },
    englishName: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
});
