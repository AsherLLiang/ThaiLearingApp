// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/src/stores/userStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import Button from '@/src/components/common/Button';
import GlassCard from '@/src/components/common/GlassCard';

/**
 * 登录页面组件
 * 设计：冬季背景 + 毛玻璃卡片 + 语言切换
 */
export default function LoginPage() {
  // ===== Hooks =====
  const { t } = useTranslation();
  const router = useRouter();
  const { currentLanguage, changeLanguage } = useLanguageStore();
  const { login } = useUserStore();

  // ===== 本地状态 =====
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  /**
   * 验证表单
   */
  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = t('auth.validation.emailRequired', '邮箱不能为空');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('auth.validation.emailInvalid', '邮箱格式不正确');
      isValid = false;
    }

    // 验证密码
    if (!password) {
      newErrors.password = t('auth.validation.passwordRequired', '密码不能为空');
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = t('auth.validation.passwordTooShort', '密码至少8个字符');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * 处理登录
   */
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          t('common.error', '错误'),
          t('auth.errors.loginFailed', '登录失败，请检查邮箱和密码')
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        t('common.error', '错误'),
        t('auth.errors.loginFailed', '登录失败')
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 切换语言
   */
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'zh' ? 'en' : 'zh';
    changeLanguage(newLang);
  };

  // 🔥 背景图片
  const backgroundImage = {
    uri: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?q=80&w=1000&auto=format&fit=crop'
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* 🔥 语言切换按钮 */}
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageText}>
              {currentLanguage === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}
            </Text>
          </TouchableOpacity>

          <View style={styles.content}>
            {/* 🔥 标题卡片 */}
            <GlassCard style={styles.titleCard}>
              <Text style={styles.title}>{t('auth.login', '登录')}</Text>
              <Text style={styles.subtitle}>
                {t('home.subtitle', '继续你的泰语学习之旅')}
              </Text>
            </GlassCard>

            {/* 🔥 表单卡片 */}
            <GlassCard style={styles.formCard}>
              {/* 邮箱输入 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.email', '邮箱')}</Text>
                <TextInput
                  style={[styles.input, errors.email ? styles.inputError : null]}
                  placeholder={t('auth.emailPlaceholder', '请输入邮箱')}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors({ ...errors, email: '' });
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#999"
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* 密码输入 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.password', '密码')}</Text>
                <TextInput
                  style={[styles.input, errors.password ? styles.inputError : null]}
                  placeholder={t('auth.passwordPlaceholder', '请输入密码')}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors({ ...errors, password: '' });
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {/* 登录按钮 */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? t('auth.loggingIn', '登录中...') : t('auth.loginButton', '登录')}
                </Text>
              </TouchableOpacity>

              {/* 注册提示 */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  {t('auth.noAccount', '还没有账号？')}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.registerLink}>
                    {t('auth.register', '注册')}
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

// ===== 样式 =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  languageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titleCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
  },
  formCard: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3748',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: '#718096',
    fontSize: 14,
  },
  registerLink: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});