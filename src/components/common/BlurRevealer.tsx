import { View, StyleSheet, ViewProps } from 'react-native';
import { BlurView, BlurTint } from 'expo-blur';

interface BlurRevealerProps extends ViewProps {
    /** 是否揭示内容 (true: 显示内容, false: 显示模糊遮罩) */
    isRevealed: boolean;
    /** 模糊强度 (默认: 20) */
    intensity?: number;
    /** 模糊色调 (默认: 'light') */
    tint?: BlurTint;
    /** 遮罩层的背景颜色 (用于增加遮盖效果) */
    overlayColor?: string;
    children: React.ReactNode;
}

export const BlurRevealer: React.FC<BlurRevealerProps> = ({
    isRevealed,
    intensity = 20,
    tint = 'light',
    overlayColor = 'rgba(255, 255, 255, 0.8)',
    children,
    style,
    ...rest
}) =>{
    return (
          <View style={[styles.container, style]} {...rest}>
            {/* 原始内容 */}
            {children}
            
            {/* 模糊遮罩层 - 仅在未揭示时渲染 */}
            {!isRevealed && (
                <BlurView 
                    intensity={intensity} 
                    style={StyleSheet.absoluteFill} 
                    tint={tint}
                >
                    <View style={[styles.overlay, { backgroundColor: overlayColor }]} />
                </BlurView>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // 关键样式：确保绝对定位的遮罩层限制在父容器内
        position: 'relative',
        overflow: 'hidden',
    },
    overlay: {
        flex: 1,
    }
});
    