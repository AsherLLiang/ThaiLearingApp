// src/components/common/Button.tsx
import React from 'react';
import { 
  TouchableOpacity,   // 可点击组件
  Text,               // 文本组件
  StyleSheet,         // 样式表
  ActivityIndicator,  // 加载动画
  ViewStyle,          // 样式类型
  TextStyle           // 文本样式类型
} from 'react-native';

// 【接口】定义组件接收的属性
interface ButtonProps {
  title: string;                              // 按钮文字
  onPress: () => void;                        // 点击事件
  loading?: boolean;                          // 是否加载中(可选)
  disabled?: boolean;                         // 是否禁用(可选)
  variant?: 'primary' | 'secondary';          // 样式变体(可选)
  style?: ViewStyle;                          // 自定义样式(可选)
}

// 【组件】Button
export default function Button({ 
  title, 
  onPress, 
  loading = false,      // 默认值
  disabled = false, 
  variant = 'primary',
  style
}: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[  // 【数组样式】后面的会覆盖前面的
        styles.button,                                  // 基础样式
        variant === 'secondary' && styles.buttonSecondary,  // 次要按钮样式
        disabled && styles.buttonDisabled,              // 禁用样式
        style  // 自定义样式(最高优先级)
      ]}
      onPress={onPress}
      disabled={disabled || loading}  // 加载时也禁用
      activeOpacity={0.7}  // 点击时透明度
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#4A90E2'} />
      ) : (
        <Text style={[
          styles.buttonText,
          variant === 'secondary' && styles.buttonTextSecondary
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// 【样式表】
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',  // 蓝色背景
    paddingVertical: 15,         // 上下内边距
    borderRadius: 8,             // 圆角
    alignItems: 'center',        // 水平居中
  },
  buttonSecondary: {
    backgroundColor: '#fff',     // 白色背景
    borderWidth: 1,              // 边框宽度
    borderColor: '#4A90E2',      // 边框颜色
  },
  buttonDisabled: {
    opacity: 0.5,                // 半透明
  },
  buttonText: {
    color: '#fff',               // 白色文字
    fontSize: 16,
    fontWeight: '600',           // 加粗
  },
  buttonTextSecondary: {
    color: '#4A90E2',            // 蓝色文字
  },
});