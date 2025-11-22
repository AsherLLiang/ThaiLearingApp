// src/components/LanguageSwitcher.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react-native';
import { useLanguageStore, Language } from '@/src/stores/languageStore';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'full';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'compact' }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguageStore();

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'zh', label: t('profile.chinese'), flag: '🇨🇳' },
    { code: 'en', label: t('profile.english'), flag: '🇺🇸' },
  ];

  if (variant === 'compact') {
    return (
      <Pressable
        style={styles.compactButton}
        onPress={() => changeLanguage(currentLanguage === 'zh' ? 'en' : 'zh')}
      >
        <Globe size={20} color={Colors.ink} />
        <Text style={styles.compactText}>
          {currentLanguage === 'zh' ? 'EN' : '中'}
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Text style={styles.fullTitle}>{t('profile.selectLanguage')}</Text>
      {languages.map((lang) => (
        <Pressable
          key={lang.code}
          style={[
            styles.languageOption,
            currentLanguage === lang.code && styles.languageOptionActive,
          ]}
          onPress={() => changeLanguage(lang.code)}
        >
          <View style={styles.languageLeft}>
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text style={[
              styles.languageLabel,
              currentLanguage === lang.code && styles.languageLabelActive,
            ]}>
              {lang.label}
            </Text>
          </View>
          {currentLanguage === lang.code && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  compactText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
  },
  fullContainer: {
    width: '100%',
  },
  fullTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: 12,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: 12,
  },
  languageOptionActive: {
    borderColor: Colors.thaiGold,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 24,
  },
  languageLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  languageLabelActive: {
    fontFamily: Typography.notoSerifBold,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: Colors.thaiGold,
  },
});