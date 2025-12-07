// src/utils/ModuleGuard.tsx

/**
 * 模块访问守卫组件
 * 
 * 功能：
 * 1. 在进入学习页面前检查权限
 * 2. 显示加载状态
 * 3. 权限不足时显示锁定页面
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';
import ModuleLockedScreen from '@/src/components/learning/ModuleLockedScreen';

// ==================== 类型定义 ====================

interface ModuleGuardProps {
    moduleType: ModuleType;
    children: React.ReactNode;
}

// ==================== 组件 ====================

/**
 * 模块访问守卫
 * 
 * @param moduleType 模块类型
 * @param children 子组件（学习页面）
 */
export default function ModuleGuard({ moduleType, children }: ModuleGuardProps) {
    const { checkAccess, getUserProgress } = useModuleAccessStore();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkModuleAccess = async () => {
            try {
                setIsChecking(true);

                // 先获取用户进度数据
                await getUserProgress();

                // 检查访问权限
                const allowed = await checkAccess(moduleType);
                setHasAccess(allowed);
            } catch (error) {
                console.error('❌ ModuleGuard: 权限检查失败', error);
                // 如果检查失败，默认不允许访问（除了字母模块）
                setHasAccess(moduleType === 'letter');
            } finally {
                setIsChecking(false);
            }
        };

        checkModuleAccess();
    }, [moduleType]);

    // ===== 加载状态 =====
    if (isChecking || hasAccess === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    // ===== 权限不足 =====
    if (!hasAccess) {
        return <ModuleLockedScreen moduleType={moduleType} />;
    }

    // ===== 权限通过，渲染子组件 =====
    return <>{children}</>;
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F9FF',
    },
});
