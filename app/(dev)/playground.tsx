import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COMPONENT_REGISTRY } from '@/src/dev/registry';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ChevronRight, FlaskConical, ChevronLeft } from 'lucide-react-native';

export default function PlaygroundScreen() {
    const router = useRouter();

    if (!__DEV__) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginRight: 12, padding: 4 }}
                    >
                        <ChevronLeft size={24} color={Colors.ink} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: Typography.notoSerifBold, fontSize: 24, color: Colors.ink }}>
                        Dev Playground
                    </Text>
                </View>
                <Text style={styles.description}>
                    UI 组件隔离开发环境。此处列出的组件使用 Mock 数据独立运行，不触发真实业务逻辑。
                </Text>
            </View>

            {/* Tools Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Tools</Text>
                    <Text style={styles.categoryBadge}>Utility</Text>
                </View>
                <View style={styles.card}>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/(dev)/audio-cache-test')}
                    >
                        <View style={styles.itemIcon}>
                            <FlaskConical size={16} color={Colors.thaiGold} />
                        </View>
                        <Text style={styles.itemText}>Audio Cache Test</Text>
                        <ChevronRight size={16} color={Colors.taupe} />
                    </TouchableOpacity>
                    <View style={styles.borderBottom} />
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => router.push('/(dev)/audio-migration-test')}
                    >
                        <View style={styles.itemIcon}>
                            <FlaskConical size={16} color={Colors.thaiGold} />
                        </View>
                        <Text style={styles.itemText}>Audio Migration Test (New Lib)</Text>
                        <ChevronRight size={16} color={Colors.taupe} />
                    </TouchableOpacity>
                </View>
            </View>

            {COMPONENT_REGISTRY.map((component) => (
                <View key={component.id} style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{component.name}</Text>
                        <Text style={styles.categoryBadge}>{component.category}</Text>
                    </View>

                    <View style={styles.card}>
                        {component.variants.map((variant, index) => (
                            <TouchableOpacity
                                key={variant.id}
                                style={[
                                    styles.item,
                                    index < component.variants.length - 1 && styles.borderBottom,
                                ]}
                                onPress={() => {
                                    router.push({
                                        pathname: '/(dev)/viewer',
                                        params: {
                                            componentId: component.id,
                                            variantId: variant.id,
                                            mockId: variant.mockId,
                                        },
                                    });
                                }}
                            >
                                <View style={styles.itemIcon}>
                                    <FlaskConical size={16} color={Colors.thaiGold} />
                                </View>
                                <Text style={styles.itemText}>{variant.name}</Text>
                                <ChevronRight size={16} color={Colors.taupe} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7', // iOS Grouped Background color
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 24,
    },
    description: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        lineHeight: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 4,
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 13,
        color: '#666',
        textTransform: 'uppercase',
    },
    categoryBadge: {
        fontSize: 10,
        color: Colors.white,
        backgroundColor: Colors.taupe,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: Colors.white,
    },
    borderBottom: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#C6C6C8',
        marginLeft: 16, // iOS style separator inset
    },
    itemIcon: {
        marginRight: 12,
    },
    itemText: {
        flex: 1,
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
    },
});
