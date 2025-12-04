// app/(auth)/login.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';
import { useUserStore } from '@/src/stores/userStore';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isLoading, error, clearError } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, []);

  // Show error alert if error changes
  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error);
    }
  }, [error]);

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert(t('common.error'), 'Please fill in all fields');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), 'Please enter a valid email address');
      return;
    }

    // Call login action
    const success = await login({ email, password });

    if (success) {
      // Navigate to main app
      router.replace('/(tabs)');
    }
    // Error is handled by useEffect above
  };
  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThaiPatternBackground opacity={0.08} />

      {/* Language Switcher */}
      <View style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo & Title */}
          <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.headerSection}>
            <Text style={styles.logo}>ชา</Text>
            <Text style={styles.title}>Thai Learning</Text>
            <Text style={styles.subtitle}>{t('auth.login')}</Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.formSection}>
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

            <Pressable
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
            </Pressable>

            <Pressable
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? t('auth.logining') : t('auth.loginButton')}
              </Text>
            </Pressable>

            <View style={styles.registerSection}>
              <Text style={styles.registerText}>{t('auth.noAccount')}</Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>{t('auth.register')}</Text>
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
  logo: {
    fontFamily: Typography.sarabunBold,
    fontSize: 72,
    color: Colors.thaiGold,
    marginBottom: 8,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.thaiGold,
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