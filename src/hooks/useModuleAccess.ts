// src/hooks/useModuleAccess.ts

import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';
import { useTranslation } from 'react-i18next';

export function useModuleAccess(
  requiredModule: ModuleType
) {
  const router = useRouter();
  const { t } = useTranslation();
  const { checkAccess, userProgress, isLoading } = useModuleAccessStore();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    verifyAccess();
  }, [requiredModule]);

  const verifyAccess = async () => {
    setChecking(true);
    const hasAccess = await checkAccess(requiredModule);
    setAllowed(hasAccess);
    setChecking(false);

    if (!hasAccess && !isLoading) {
      // Optional: Auto-show alert if needed, but usually controlled by UI
      // showAccessDeniedAlert(); 
    }
  };

  const showAccessDeniedAlert = () => {
    if (!userProgress) return;

    const messages: Record<string, string> = {
      word: t('moduleAccess.prerequisite.word'),
      sentence: t('moduleAccess.prerequisite.sentence'),
      article: t('moduleAccess.prerequisite.article'),
    };

    Alert.alert(
      t('moduleAccess.locked'),
      messages[requiredModule] || t('moduleAccess.lockedMessage', { module: requiredModule }),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
          onPress: () => {
            // Optional: Navigate back
            router.back();
          }
        },
        {
          text: t('moduleAccess.goBack'), // Or "Go to Learning"
          onPress: () => {
            const redirectMap: Record<string, string> = {
              word: '/(tabs)/courses', // Redirect to courses or alphabet
              sentence: '/(tabs)/courses',
              article: '/(tabs)/courses',
            };
            // router.replace(redirectMap[requiredModule] || '/(tabs)/courses');
            router.back();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return {
    allowed,
    loading: checking || isLoading,
    progress: userProgress,
    checkAccess: verifyAccess,
    showAccessDeniedAlert
  };
}
