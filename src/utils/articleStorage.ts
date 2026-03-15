import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedArticle } from '@/src/entities/types/ai.types';

const STORAGE_KEY = 'articlePracticeList';
const CLOZE_HINTS_PREFIX = 'articlePractice_clozeHints:';

async function readAll(): Promise<SavedArticle[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedArticle[];
}

async function writeAll(articles: SavedArticle[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

/** 按时间倒序获取全部文章 */
export async function getArticles(): Promise<SavedArticle[]> {
    const list = await readAll();
    list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
}

/** 按 id 获取单篇文章，未找到返回 null */
export async function getArticleById(id: string): Promise<SavedArticle | null> {
    const list = await readAll();
    return list.find(a => a.id === id) ?? null;
}

/**
 * 保存文章到练习库（自动去重：标题 + 正文完全相同视为重复）。
 * 返回 'saved' | 'duplicate'。
 */
export async function saveArticle(article: SavedArticle): Promise<'saved' | 'duplicate'> {
    const list = await readAll();
    const isDuplicate = list.some(
        a => a.thaiText === article.thaiText && a.title === article.title,
    );
    if (isDuplicate) return 'duplicate';

    list.unshift(article);
    await writeAll(list);
    return 'saved';
}

/** 按 id 删除文章 */
export async function deleteArticle(id: string): Promise<void> {
    const list = await readAll();
    const filtered = list.filter(a => a.id !== id);
    await writeAll(filtered);
    await AsyncStorage.removeItem(CLOZE_HINTS_PREFIX + id);
}

/** 获取文章的半挖空提示词缓存，未命中返回 null */
export async function getClozeHints(articleId: string): Promise<string[] | null> {
    const raw = await AsyncStorage.getItem(CLOZE_HINTS_PREFIX + articleId);
    if (!raw) return null;
    try {
        const arr = JSON.parse(raw) as string[];
        return Array.isArray(arr) ? arr : null;
    } catch {
        return null;
    }
}

/** 缓存文章的半挖空提示词 */
export async function setClozeHints(articleId: string, keywords: string[]): Promise<void> {
    await AsyncStorage.setItem(CLOZE_HINTS_PREFIX + articleId, JSON.stringify(keywords));
}
