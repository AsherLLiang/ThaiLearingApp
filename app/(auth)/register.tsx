// app/(auth)/register.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';
import { useUserStore } from '@/src/stores/userStore';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { validateRegistrationForm } from '@/src/utils/validation';
import { AppLogo } from '@/src/components/common/AppLogo';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register, isLoading, error, clearError } = useUserStore();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  // 清理错误
  useEffect(() => {
    return () => clearError();
  }, []);

  // 显示错误提示
  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error);
    }
  }, [error]);

  const handleRegister = async () => {

    const validation = validateRegistrationForm({
      email,
      password,
      confirmPassword: confirmPwd,
      displayName
    });
    // 验证格式是否正确
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return; // 阻止发送请求
    }

    const success = await register({
      displayName: displayName.trim(),
      email: email.toLowerCase().trim(),
      password,
    })

    if (success) {
      Alert.alert(
        t('auth.registerSuccess'),
        'Your account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    }


  };

  return (
    <SafeAreaView style={styles.container}>

      {/* 背景 */}
      <ThaiPatternBackground opacity={0.08} />

      {/* 语言选择器 */}
      <View style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo & Title */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.headerSection}
          >
            <AppLogo />
            <Text style={styles.title}>{t('auth.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.register')}</Text>
          </Animated.View>

          {/* Register Form */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.formSection}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.displayName') || 'Display Name'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.displayNamePlaceholder') || 'Enter your name'}
                placeholderTextColor={Colors.taupe}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.email')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={Colors.taupe}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={Colors.taupe}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.confirmPassword') || 'Confirm Password'}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.confirmPasswordPlaceholder') || 'Re-enter your password'}
                placeholderTextColor={Colors.taupe}
                value={confirmPwd}
                onChangeText={setConfirmPwd}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <Pressable
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? t('common.loading') : t('auth.register')}
              </Text>
            </Pressable>

            <View style={styles.registerSection}>
              <Text style={styles.registerText}>{t('auth.alreadyHaveAccount') || 'Already have an account?'}</Text>
              <Pressable onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.registerLink}>{t('auth.login')}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  languageSwitcherContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 8,
  },
  input: {
    fontFamily: Typography.notoSerifRegular,
    height: 56,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: Colors.ink,
  },
  loginButton: {
    height: 56,
    backgroundColor: Colors.ink,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  registerText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  registerLink: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.thaiGold,
    fontWeight: '600',
  },
});
