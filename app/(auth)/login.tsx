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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '@/src/stores/userStore';
import { useLanguageStore } from '@/src/stores/languageStore';
import { GlassCard } from '@/src/components/common/GlassCard';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentLanguage, changeLanguage } = useLanguageStore();
  const { login } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = t('auth.validation.emailRequired', '邮箱不能为空');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('auth.validation.emailInvalid', '邮箱格式不正确');
      isValid = false;
    }

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

  const handleLogin = async () => {
    if (!validateForm()) return;

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
      Alert.alert(t('common.error', '错误'), t('auth.errors.loginFailed', '登录失败'));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    changeLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
  };

  const backgroundImage = {
    uri: 'https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?q=80&w=1000&auto=format&fit=crop'
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.container} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <ThaiPatternBackground opacity={0.15} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* 语言切换按钮 */}
          <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
            <Text style={styles.languageText}>
              {currentLanguage === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}
            </Text>
          </TouchableOpacity>

          <View style={styles.content}>
            {/* 标题卡片 */}
            <GlassCard style={styles.titleCard}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{t('auth.login', '登录')}</Text>
                <Text style={styles.subtitle}>
                  {t('home.subtitle', '继续你的泰语学习之旅')}
                </Text>
              </View>
            </GlassCard>

            {/* 表单卡片 */}
            <GlassCard>
              {/* 邮箱输入 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.email', '邮箱')}</Text>
                <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                  <Ionicons name="mail-outline" size={20} color={Colors.taupe} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.emailPlaceholder', '请输入邮箱')}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      setErrors({ ...errors, email: '' });
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor={Colors.taupe}
                  />
                </View>
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>

              {/* 密码输入 */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>{t('auth.password', '密码')}</Text>
                <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.taupe} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.passwordPlaceholder', '请输入密码')}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setErrors({ ...errors, password: '' });
                    }}
                    secureTextEntry
                    autoCapitalize="none"
                    placeholderTextColor={Colors.taupe}
                  />
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              {/* 登录按钮 */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.gradientButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? t('auth.loggingIn', '登录中...') : t('auth.loginButton', '登录')}
                  </Text>
                </LinearGradient>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  languageButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.glassWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageText: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    color: Colors.ink,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titleCard: {
    marginBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.h1,
    fontWeight: Typography.bold,
    color: Colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.caption,
    color: Colors.taupe,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    color: Colors.ink,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Typography.body,
    color: Colors.ink,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.small,
    marginTop: 4,
  },
  loginButton: {
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: Typography.body,
    fontWeight: Typography.bold,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    color: Colors.taupe,
    fontSize: Typography.caption,
  },
  registerLink: {
    color: Colors.accent,
    fontSize: Typography.caption,
    fontWeight: Typography.semibold,
    marginLeft: 4,
  },
});