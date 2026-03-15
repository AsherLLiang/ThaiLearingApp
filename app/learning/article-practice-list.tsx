import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, BookOpen, Trash2 } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getArticles, deleteArticle } from '@/src/utils/articleStorage';
import type { SavedArticle } from '@/src/entities/types/ai.types';

export default function ArticlePracticeListScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [articles, setArticles] = useState<SavedArticle[]>([]);
    const [loading, setLoading] = useState(true);

    const loadArticles = useCallback(async () => {
        try {
            setLoading(true);
            setArticles(await getArticles());
        } catch {
            setArticles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadArticles();
        }, [loadArticles])
    );

    const handleDelete = (article: SavedArticle) => {
        Alert.alert(
            t('articlePractice.deleteConfirmTitle'),
            t('articlePractice.deleteConfirmMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        const updated = articles.filter(a => a.id !== article.id);
                        setArticles(updated);
                        await deleteArticle(article.id);
                    },
                },
            ]
        );
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const renderItem = ({ item }: { item: SavedArticle }) => (
        <Pressable
            style={styles.articleCard}
            onPress={() =>
                router.push({
                    pathname: '/learning/article-practice',
                    params: { articleId: item.id },
                })
            }
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.cardPreview} numberOfLines={2}>
                    {item.thaiText}
                </Text>
                <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaText}>{formatDate(item.createdAt)}</Text>
                    <Text style={styles.cardMetaDot}>·</Text>
                    <Text style={styles.cardMetaText}>
                        {t('articlePractice.wordCount', { count: item.wordCount })}
                    </Text>
                </View>
            </View>
            <Pressable
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
                hitSlop={8}
            >
                <Trash2 size={16} color={Colors.taupe} />
            </Pressable>
        </Pressable>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <BookOpen size={48} color={Colors.sand} />
            <Text style={styles.emptyTitle}>{t('articlePractice.emptyTitle')}</Text>
            <Text style={styles.emptyMessage}>{t('articlePractice.emptyMessage')}</Text>
        </View>
    );

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('articlePractice.listTitle')}</Text>
                <View style={styles.backButton} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.thaiGold} />
                </View>
            ) : (
                <FlatList
                    data={articles}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
        flexGrow: 1,
    },
    articleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
        gap: 6,
    },
    cardTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.ink,
    },
    cardPreview: {
        fontFamily: Typography.sarabunRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
        lineHeight: 20,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    cardMetaText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    cardMetaDot: {
        fontSize: Typography.small,
        color: Colors.sand,
    },
    deleteBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        gap: 12,
        paddingTop: 80,
    },
    emptyTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
        marginTop: 8,
    },
    emptyMessage: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
        textAlign: 'center',
        lineHeight: 22,
    },
});
