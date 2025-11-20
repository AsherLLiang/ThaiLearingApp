import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Card from '../../src/components/common/Card';
import { Level } from '../../src/types/entities';

/**
 * 课程列表页面
 * 显示所有可用课程
 */
export default function CoursesPage() {
    const { t } = useTranslation();

    // 模拟课程数据
    const courses = [
        {
            id: '1',
            name: '泰语字母入门',
            level: Level.BEGINNER_A,
            progress: 30,
        },
        {
            id: '2',
            name: '日常词汇 100',
            level: Level.BEGINNER_A,
            progress: 50,
        },
        {
            id: '3',
            name: '简单句型',
            level: Level.BEGINNER_B,
            progress: 0,
        },
    ];

    const renderCourse = ({ item }: { item: any }) => (
        <Card style={styles.courseCard}>
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.courseLevel}>
                {t(`courses.levels.${item.level}`)}
            </Text>

            {/* 进度条 */}
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${item.progress}%` },
                    ]}
                />
            </View>
            <Text style={styles.progressText}>{item.progress}% 完成</Text>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('courses.title')}</Text>

            <FlatList
                data={courses}
                renderItem={renderCourse}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 16,
    },
    courseCard: {
        marginBottom: 12,
    },
    courseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    courseLevel: {
        fontSize: 12,
        color: '#4A90E2',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4A90E2',
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});