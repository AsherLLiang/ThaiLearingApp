This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.agent/
  rules/
    code-guide.md
.claude/
  settings.local.json
app/
  (auth)/
    _layout.tsx
    forgot-password.tsx
    login.tsx
    register.tsx
  (dev)/
    _layout.tsx
    audio-cache-test.tsx
    audio-migration-test.tsx
    playground.tsx
    viewer.tsx
  (tabs)/
    _layout.tsx
    courses.tsx
    index.tsx
    profile.tsx
  alphabet/
    [lessonId].tsx
    index.tsx
    test.tsx
  learning/
    _layout.tsx
    article-practice-list.tsx
    article-practice-shadowing.tsx
    article-practice.tsx
    dailyLimit.tsx
    index.tsx
    micro-reading.tsx
    reminder-settings.tsx
    session-summary.tsx
  _layout.tsx
  review-modal.tsx
assets/
  images/
    courses/
      thai_alphabet.png
      ThaiBase_1.png
      ThaiBase_2.png
      ThaiBase_3.png
      ThaiBase_4.png
  adaptive-icon.png
  app-logo.png
  app-logo.svg
  favicon.png
  icon.png
  splash-icon.png
cloudbase/
  functions/
    ai-engine/
      handlers/
        ttsProviders/
          googleTts.js
        analyzePronunciation.js
        explainVocab.js
        extractClozeHints.js
        generateMicroReading.js
        textToSpeech.js
      utils/
        constants.js
        response.js
      index.js
      package.json
      test.js
    alphabet/
      handlers/
        getAllLetters.js
        getLetterTest.js
        passLetterTest.js
        submitLetterTest.js
      utils/
        constants.js
        database.js
        index.js
        memoryEngine.js
        response.js
        sm2.js
        validators.js
      index.js
      package.json
    memory-engine/
      config/
        alphabetLessonConfig.js
      handlers/
        checkModuleAccess.js
        getAlphabetLessons.js
        getTodayMemories.js
        getUserProgress.js
        setDailyLimit.js
        submitMemoryResult.js
        submitRoundEvaluation.js
      utils/
        constants.js
        database.js
        index.js
        memoryEngine.js
        response.js
        sm2.js
        test_sm2.js
        validators.js
      index.js
      package.json
    shared/
      constants.js
      database.js
      index.js
      memoryEngine.js
      package.json
      response.js
      sm2.js
      validators.js
    storage-download/
      index.js
      package.json
    user-login/
      index.js
      package.json
    user-register/
      index.js
      package.json
    user-reset-password/
      index.js
      package.json
    user-update-profile/
      index.js
      package.json
  cloudbaserc.json
  fix-cloud-functions.sh
  package.json
  test-all-apis.sh
  test-comprehensive.sh
scripts/
  export-logo-png.js
  getAudioJsonFromWeb.js
  getVocabJsonFromWeb.js
  verify_vocab_logic.js
  vocab.test.js
src/
  components/
    ai/
      AiExplanationView.tsx
    common/
      AppLogo.tsx
      BlurRevealer.tsx
      Button.tsx
      Card.tsx
      ConfettiEffect.tsx
      FloatingBubbles.tsx
      GlassCard.tsx
      LanguageSwitcher.tsx
      ListContainer.tsx
      ThaiPatternBackground.tsx
    courses/
      AlphabetCourseCard.tsx
      CourseCard.tsx
      CourseSelectionModal.tsx
    learning/
      alphabet/
        AlphabetCompletionView.tsx
        AlphabetLearningEngineView.tsx
        AlphabetLearningView.tsx
        AlphabetReviewView.tsx
        AspiratedContrastQuestion.tsx
        MiniReviewQuestion.tsx
        PhonicsRuleCard.tsx
        RoundCompletionView.tsx
        SessionRecoveryCard.tsx
      vocabulary/
        NewWordView.tsx
        ReviewWordView.tsx
        VocabMultipleQuiz.tsx
        VocabularyDetailView.tsx
        VocabularyQuizView.tsx
        WordCard.tsx
      ModuleLockedScreen.tsx
  config/
    alphabet/
      alphabetQuestionGenerator.ts
      alphabetQuestionTypes.ts
      lessonMetadata.config.ts
      lettersSequence.ts
      phonicsRules.config.ts
    api.endpoints.ts
    backend.config.ts
    constants.ts
  constants/
    colors.ts
    typography.ts
  dev/
    mocks/
      phonicsRule.mock.ts
    registry.ts
  entities/
    enums/
      LearningPhase.enum.ts
      QualityScore.enum.ts
      QuestionType.enum.ts
    types/
      ai.types.ts
      alphabet.types.ts
      alphabetGameTypes.ts
      api.types.ts
      course.ts
      entities.ts
      learning.ts
      letter.types.ts
      memory.types.ts
      phonicsRule.types.ts
      storage.types.ts
      test.types.ts
      user.ts
      vocabulary.types.ts
  hooks/
    useAlphabetLearningEngine.ts
    useModuleAccess.ts
    useTodayStudyTime.ts
    useTtsPlayer.ts
    useVocabularyLearningEngine.ts
  i18n/
    locales/
      en.ts
      zh.ts
    index.ts
  services/
    aiService.ts
  stores/
    alphabetStore.ts
    languageStore.ts
    learningPreferenceStore.ts
    moduleAccessStore.ts
    storageStore.ts
    userStore.ts
    vocabularyStore.ts
  utils/
    alphabet/
      audioHelper.ts
      buildAlphabetQueue.ts
    vocab/
      buildVocabQueue.ts
      vocabAudioHelper.ts
    alphabetQuestionTypeAssigner.ts
    apiClient.ts
    articleStorage.ts
    audioCache.ts
    lettersDistractorEngine.ts
    lettersQuestionGenerator.ts
    ModuleGuard.tsx
    reminderNotification.ts
    validation.ts
.gitignore
.nvmrc
.skip-template
app.json
babel.config.js
CLAUDE.md
cloudbaserc.json
convert-json-to-jsonl-but-keep-json.js
eas.json
global.css
index.ts
package.json
README.md
tailwind.config.js
tsconfig.json
```

# Files

## File: assets/app-logo.svg
````xml
<svg width="100" height="300" viewBox="0 0 100 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradR" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#E60000"/>
      <stop offset="1" stop-color="#FFEA00"/>
    </linearGradient>
  </defs>
  <g transform="translate(50, 50)">
    <circle cx="0" cy="0" r="45" fill="#E60000"/>
    <text x="0" y="26" font-size="80" font-weight="bold" font-family="Helvetica Neue, sans-serif" fill="#FFFFFF" text-anchor="middle">T</text>
  </g>
  <g transform="translate(50, 150)">
    <text x="0" y="35" font-size="100" font-weight="bold" font-family="Helvetica Neue, sans-serif" fill="url(#gradR)" text-anchor="middle">R</text>
  </g>
  <g transform="translate(50, 250)">
    <text x="0" y="35" font-size="100" font-weight="bold" font-family="Helvetica Neue, sans-serif" fill="#7B3FF5" text-anchor="middle">Y</text>
  </g>
</svg>
````

## File: scripts/export-logo-png.js
````javascript
#!/usr/bin/env node
/**
 * 将 assets/app-logo.svg 导出为透明背景 PNG
 * 运行: node scripts/export-logo-png.js
 */
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const svgPath = path.join(__dirname, '../assets/app-logo.svg');
const pngPath = path.join(__dirname, '../assets/app-logo.png');

const svg = fs.readFileSync(svgPath, 'utf-8');
const resvg = new Resvg(svg);
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

fs.writeFileSync(pngPath, pngBuffer);
console.log('✅ 已导出:', pngPath);
````

## File: app/(dev)/audio-cache-test.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { getCachedAudioUri, downloadAudioBatch } from '@/src/utils/audioCache';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';
import * as FileSystem from 'expo-file-system/legacy';

export default function AudioCacheTest() {
    const [logs, setLogs] = useState<string[]>([]);
    const [lastUri, setLastUri] = useState<string | null>(null);
    // Keep track of sound object to unload it
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    React.useEffect(() => {
        return sound
            ? () => {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
        console.log(msg);
    };

    const handleSingleTest = async () => {
        addLog('--- Start Single Audio Test ---');
        try {
            // A sample audio file (you might want to use a real one from your project)
            const sampleUrl = 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/ka-kai.mp3';

            addLog(`Fetching: ${sampleUrl}`);
            const uri = await getCachedAudioUri(sampleUrl);
            addLog(`Result URI: ${uri}`);
            setLastUri(uri);
        } catch (e: any) {
            addLog(`Error: ${e.message}`);
        }
        addLog('--- End Single Audio Test ---');
    };

    const handlePlayAudio = async () => {
        if (!lastUri) return;
        addLog(`Playing: ${lastUri}`);

        try {
            // Unload previous sound if exists
            if (sound) {
                addLog('Unloading previous sound...');
                await sound.unloadAsync();
                setSound(null);
            }

            addLog('Configuring audio mode...');
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            // Verify file exists and has size
            if (lastUri.startsWith('file://')) {
                const fileInfo = await FileSystem.getInfoAsync(lastUri);
                if (fileInfo.exists) {
                    addLog(`File info: size=${fileInfo.size}b, isDirectory=${fileInfo.isDirectory}`);
                    if (fileInfo.size < 100) {
                        addLog('⚠️ Warning: File size is suspiciously small. Download might have failed or is 404.');
                    }
                } else {
                    addLog('❌ Error: File not found at URI!');
                    return;
                }
            }

            addLog('Loading sound...');
            const { sound: newSound, status } = await Audio.Sound.createAsync(
                { uri: lastUri },
                { shouldPlay: true }
            );

            setSound(newSound);
            addLog(`Sound loaded. Status: ${JSON.stringify(status)}`);

            // Explicitly play if not playing (redundant with shouldPlay but safe)
            if (!(status as any).isPlaying) {
                addLog('Starting playback...');
                await newSound.playAsync();
            }

            addLog('Playback started successfully.');

            // Setup callback for finish
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded && status.didJustFinish) {
                    addLog('Playback finished.');
                }
            });

        } catch (e: any) {
            addLog(`Playback Error: ${e}`);
            console.error(e);
        }
    };

    const handleBatchTest = async () => {
        addLog('--- Start Batch Audio Test ---');
        try {
            // Sample URLs - replace with valid ones if these fail
            const sampleUrls = [
                'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/ka-kai.mp3',
                'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/kha-khai.mp3',
                'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/kha-khuat.mp3',
            ];

            addLog(`Batch downloading ${sampleUrls.length} files...`);
            await downloadAudioBatch(sampleUrls);
            addLog('Batch download completed.');
        } catch (e: any) {
            addLog(`Batch Error: ${e.message}`);
        }
        addLog('--- End Batch Audio Test ---');
    };

    const handleVocabTest = async () => {
        addLog('--- Start Vocab Audio Strategy Test ---');
        try {
            // Mock Vocabulary object
            const mockVocab = {
                _id: 'test_id',
                vocabularyId: 'TEST_001',
                thaiWord: 'ทดสอบ',
                pronunciation: 'thot-sop',
                meaning: 'Test',
                partOfSpeech: 'n.',
                level: 'BEGINNER',
                lessonNumber: '1',
                startingLetter: 'T',
                source: 'Mock',
                audioPath: 'alphabet/ka-kai.mp3' // Using a known path relative to BASE_URL
            } as any; // Cast to any to avoid filling all fields

            addLog(`Mock Vocab Audio Path: ${mockVocab.audioPath}`);

            const uri = await getVocabAudioUrl(mockVocab);
            addLog(`Strategy Result URI: ${uri}`);

            if (uri.startsWith('file://')) {
                addLog('✅ Success: Returned local file URI');
            } else if (uri.startsWith('http')) {
                addLog('⚠️ Notice: Returned remote URL (File might not be cached yet)');
            }

            setLastUri(uri);
        } catch (e: any) {
            addLog(`Vocab Strategy Error: ${e.message}`);
        }
        addLog('--- End Vocab Audio Strategy Test ---');
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Audio Cache Test</Text>

            <View style={styles.buttonContainer}>
                <Button title="Test Single Download" onPress={handleSingleTest} />
                <Button
                    title="Test Play Audio"
                    onPress={handlePlayAudio}
                    disabled={!lastUri}
                />
                <Button title="Test Batch Download" onPress={handleBatchTest} />
                <Button title="Test Vocab Strategy" onPress={handleVocabTest} />
                <Button title="Clear Logs" onPress={() => setLogs([])} color="red" />
            </View>

            <ScrollView style={styles.logContainer}>
                {logs.map((log, index) => (
                    <Text key={index} style={styles.logText}>{log}</Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        gap: 10,
        marginBottom: 20,
    },
    logContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
    },
    logText: {
        fontSize: 12,
        fontFamily: 'Menlo',
        marginBottom: 5,
        color: '#333',
    },
});
````

## File: app/(dev)/audio-migration-test.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { Colors } from '@/src/constants/colors';

const SAMPLE_URL = 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/ka-kai.mp3';

export default function AudioMigrationTest() {
    const [logs, setLogs] = useState<string[]>([]);

    // Initialize player with the sample URL
    const player = useAudioPlayer(SAMPLE_URL);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
        console.log(msg);
    };

    const handlePlay = () => {
        try {
            addLog('Attempting to play...');
            player.play();
            addLog('Play command sent.');
        } catch (e: any) {
            addLog(`Error: ${e.message}`);
        }
    };

    const handlePause = () => {
        player.pause();
        addLog('Paused.');
    };

    const handleSeek = () => {
        player.seekTo(0);
        addLog('Seek to start.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Expo Audio Migration Test</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Source URL:</Text>
                <Text style={styles.url}>{SAMPLE_URL}</Text>

                <Text style={styles.label}>Status:</Text>
                <Text style={styles.status}>
                    {player.playing ? '▶️ Playing' : '⏸️ Paused'} | Duration: {Math.round(player.duration / 1000)}s
                </Text>

                <View style={styles.controls}>
                    <Button title="Play" onPress={handlePlay} />
                    <Button title="Pause" onPress={handlePause} />
                    <Button title="Restart" onPress={handleSeek} />
                </View>
            </View>


            <Text style={styles.label}>Logs:</Text>
            <ScrollView style={styles.logContainer}>
                {logs.map((log, index) => (
                    <Text key={index} style={styles.logText}>{log}</Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 20,
        textAlign: 'center',
        color: Colors.ink,
    },
    card: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 4,
        marginTop: 12,
        color: '#666',
    },
    url: {
        fontSize: 12,
        color: '#888',
        marginBottom: 8,
    },
    status: {
        fontSize: 16,
        marginBottom: 16,
        color: Colors.thaiGold,
        fontWeight: 'bold',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    logContainer: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
    },
    logText: {
        fontSize: 12,
        fontFamily: 'Menlo',
        marginBottom: 4,
        color: '#333',
    },
});
````

## File: app/(dev)/viewer.tsx
````typescript
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// Components
import { PhonicsRuleCard } from '@/src/components/learning/alphabet/PhonicsRuleCard';

// Mocks
import { MOCK_PHONICS_RULES } from '@/src/dev/mocks/phonicsRule.mock';

export default function ComponentViewer() {
    const { componentId, variantId, mockId } = useLocalSearchParams<{
        componentId: string;
        variantId: string;
        mockId: string;
    }>();

    if (!__DEV__) return null;

    const renderContent = () => {
        switch (componentId) {
            case 'PhonicsRuleCard': {
                const rule = MOCK_PHONICS_RULES[mockId];
                if (!rule) return <ErrorState message={`Mock ID not found: ${mockId}`} />;

                return (
                    <PhonicsRuleCard
                        rule={rule}
                        onComplete={() => console.log('✅ [Dev] onComplete triggered')}
                        showCloseButton={true}
                        onClose={() => console.log('❌ [Dev] onClose triggered')}
                    />
                );
            }
            default:
                return <ErrorState message={`Component ID not found: ${componentId}`} />;
        }
    };

    return (
        <View style={styles.container}>
            {/* 居中容器，模拟 Modal 效果 */}
            <View style={styles.stage}>
                {renderContent()}
            </View>

            <View style={styles.debugPanel}>
                <Text style={styles.debugText}>Component: {componentId}</Text>
                <Text style={styles.debugText}>Variant: {variantId}</Text>
                <Text style={styles.debugText}>Mock Data: {mockId}</Text>
            </View>
        </View>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333', // 深色背景突出组件
    },
    stage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    debugPanel: {
        backgroundColor: '#000',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#444',
    },
    debugText: {
        color: '#0F0',
        fontFamily: 'Menlo',
        fontSize: 12,
        marginBottom: 4,
    },
    errorContainer: {
        padding: 20,
        backgroundColor: Colors.error,
        borderRadius: 8,
    },
    errorText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
    },
});
````

## File: app/learning/_layout.tsx
````typescript
import { Stack } from "expo-router";

export default function LearningLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
````

## File: app/learning/article-practice-list.tsx
````typescript
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, BookOpen, Trash2 } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getArticles, deleteArticle } from '@/src/utils/articleStorage';
import type { SavedArticle } from '@/src/entities/types/ai.types';

export default function ArticlePracticeListScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const [articles, setArticles] = useState<SavedArticle[]>([]);
    const [loading, setLoading] = useState(true);

    const loadArticles = useCallback(async () => {
        try {
            setLoading(true);
            setArticles(await getArticles());
        } catch {
            setArticles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadArticles();
        }, [loadArticles])
    );

    const handleDelete = (article: SavedArticle) => {
        Alert.alert(
            t('articlePractice.deleteConfirmTitle'),
            t('articlePractice.deleteConfirmMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        const updated = articles.filter(a => a.id !== article.id);
                        setArticles(updated);
                        await deleteArticle(article.id);
                    },
                },
            ]
        );
    };

    const formatDate = (ts: number) => {
        const d = new Date(ts);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const renderItem = ({ item }: { item: SavedArticle }) => (
        <Pressable
            style={styles.articleCard}
            onPress={() =>
                router.push({
                    pathname: '/learning/article-practice',
                    params: { articleId: item.id },
                })
            }
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <Text style={styles.cardPreview} numberOfLines={2}>
                    {item.thaiText}
                </Text>
                <View style={styles.cardMeta}>
                    <Text style={styles.cardMetaText}>{formatDate(item.createdAt)}</Text>
                    <Text style={styles.cardMetaDot}>·</Text>
                    <Text style={styles.cardMetaText}>
                        {t('articlePractice.wordCount', { count: item.wordCount })}
                    </Text>
                </View>
            </View>
            <Pressable
                style={styles.deleteBtn}
                onPress={() => handleDelete(item)}
                hitSlop={8}
            >
                <Trash2 size={16} color={Colors.taupe} />
            </Pressable>
        </Pressable>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <BookOpen size={48} color={Colors.sand} />
            <Text style={styles.emptyTitle}>{t('articlePractice.emptyTitle')}</Text>
            <Text style={styles.emptyMessage}>{t('articlePractice.emptyMessage')}</Text>
        </View>
    );

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('articlePractice.listTitle')}</Text>
                <View style={styles.backButton} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.thaiGold} />
                </View>
            ) : (
                <FlatList
                    data={articles}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={renderEmpty}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
        flexGrow: 1,
    },
    articleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    cardContent: {
        flex: 1,
        gap: 6,
    },
    cardTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.ink,
    },
    cardPreview: {
        fontFamily: Typography.sarabunRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
        lineHeight: 20,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    cardMetaText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    cardMetaDot: {
        fontSize: Typography.small,
        color: Colors.sand,
    },
    deleteBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        gap: 12,
        paddingTop: 80,
    },
    emptyTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
        marginTop: 8,
    },
    emptyMessage: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
        textAlign: 'center',
        lineHeight: 22,
    },
});
````

## File: app/learning/article-practice-shadowing.tsx
````typescript
import { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Layers, Mic, Square, Play, Pause, Volume2, VolumeX, MessageSquareText } from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { getArticleById, getClozeHints, setClozeHints } from '@/src/utils/articleStorage';
import { useTtsPlayer } from '@/src/hooks/useTtsPlayer';
import { AiService } from '@/src/services/aiService';
import type { SavedArticle, PronunciationFeedbackResponse } from '@/src/entities/types/ai.types';
import i18n from '@/src/i18n';

type ClozeLevel = 'full' | 'partial' | 'blind';

export default function ArticlePracticeShadowingScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { articleId } = useLocalSearchParams<{ articleId: string }>();

    const [article, setArticle] = useState<SavedArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [clozeLevel, setClozeLevel] = useState<ClozeLevel>('full');
    /** AI 返回的半挖空提示词，null 表示未获取或失败，使用规则兜底 */
    const [aiClozeKeywords, setAiClozeKeywords] = useState<string[] | null>(null);

    // Recording state
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingUri, setRecordingUri] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const soundRef = useRef<Audio.Sound | null>(null);

    // AI feedback
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [feedbackData, setFeedbackData] = useState<PronunciationFeedbackResponse | null>(null);
    const [feedbackError, setFeedbackError] = useState<string | null>(null);

    const { ttsLoading, isPlaying: ttsPlaying, playTts, stopTts } = useTtsPlayer();

    useEffect(() => {
        (async () => {
            try {
                setArticle(await getArticleById(articleId!));
            } catch { /* noop */ }
            setLoading(false);
        })();

        return () => {
            soundRef.current?.unloadAsync();
        };
    }, [articleId]);

    /** 半挖空模式：优先从缓存/AI 获取提示词，失败则用规则兜底 */
    useEffect(() => {
        if (!article || clozeLevel !== 'partial') {
            setAiClozeKeywords(null);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const cached = await getClozeHints(article.id);
                if (cancelled) return;
                if (cached && cached.length > 0) {
                    setAiClozeKeywords(cached);
                    return;
                }
                const res = await AiService.extractClozeHints(article.thaiText);
                if (cancelled) return;
                if (res.success && res.data?.keywords?.length) {
                    setAiClozeKeywords(res.data.keywords);
                    await setClozeHints(article.id, res.data.keywords);
                } else {
                    setAiClozeKeywords(null);
                }
            } catch {
                if (!cancelled) setAiClozeKeywords(null);
            }
        })();
        return () => { cancelled = true; };
    }, [article?.id, article?.thaiText, clozeLevel]);

    const thaiWords = useMemo(() => {
        if (!article) return [];
        return article.thaiText.split(/(\s+)/);
    }, [article]);

    /** 半挖空时保留的提示词索引：AI 关键词优先，否则每 4 个内容词保留 1 个 */
    const partialHintIndices = useMemo(() => {
        const indices = new Set<number>();
        const keywordsSet = aiClozeKeywords && aiClozeKeywords.length > 0
            ? new Set(aiClozeKeywords)
            : null;

        let contentIdx = 0;
        thaiWords.forEach((w, i) => {
            const cleaned = w.trim();
            if (!cleaned || /^\s+$/.test(w)) return;
            if (keywordsSet) {
                if (keywordsSet.has(cleaned)) indices.add(i);
            } else {
                if (contentIdx % 4 === 0) indices.add(i);
            }
            contentIdx++;
        });
        return indices;
    }, [thaiWords, aiClozeKeywords]);

    const shouldMask = (word: string, level: ClozeLevel, wordIdx: number): boolean => {
        const cleaned = word.trim();
        if (!cleaned || /^\s+$/.test(word)) return false;
        if (level === 'full') return false;
        if (level === 'blind') return true;
        if (level === 'partial') return !partialHintIndices.has(wordIdx);
        return false;
    };

    const renderMaskedWord = (word: string, idx: number) => {
        if (/^\s+$/.test(word)) {
            return <Text key={idx}>{word}</Text>;
        }
        const masked = shouldMask(word, clozeLevel, idx);
        if (masked) {
            const placeholder = '_'.repeat(Math.min(word.length, 8));
            return (
                <Text
                    key={idx}
                    style={[styles.thaiWord, styles.maskedPlaceholderText]}
                >
                    {placeholder}
                </Text>
            );
        }
        return (
            <Text key={idx} style={styles.thaiWord}>
                {word}
            </Text>
        );
    };

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(t('common.error'), 'Microphone permission is required');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording: rec } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            setRecording(rec);
            setIsRecording(true);
            setRecordingUri(null);
            setFeedbackData(null);
            setFeedbackError(null);
        } catch {
            Alert.alert(t('common.error'), 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        if (!recording) return;
        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordingUri(uri);
            setRecording(null);

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
            });
        } catch {
            setIsRecording(false);
            setRecording(null);
        }
    };

    const playRecording = async () => {
        if (!recordingUri) return;
        try {
            if (soundRef.current) {
                await soundRef.current.unloadAsync();
            }
            const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
            soundRef.current = sound;
            setIsPlaying(true);
            sound.setOnPlaybackStatusUpdate(status => {
                if (status.isLoaded && status.didJustFinish) {
                    setIsPlaying(false);
                }
            });
            await sound.playAsync();
        } catch {
            setIsPlaying(false);
        }
    };

    const stopPlayback = async () => {
        try {
            await soundRef.current?.stopAsync();
            setIsPlaying(false);
        } catch {
            setIsPlaying(false);
        }
    };

    const getAiFeedback = async () => {
        if (!article || !recordingUri) return;
        setFeedbackLoading(true);
        setFeedbackData(null);
        setFeedbackError(null);
        try {
            const base64 = await FileSystem.readAsStringAsync(recordingUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const response = await AiService.analyzePronunciation(
                base64,
                article.thaiText,
                i18n.language
            );

            if (!response.success || !response.data) {
                setFeedbackError(response.error || t('articlePractice.analyzeError'));
                return;
            }
            setFeedbackData(response.data);
        } catch {
            setFeedbackError(t('articlePractice.analyzeError'));
        } finally {
            setFeedbackLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerFull}>
                    <ActivityIndicator size="large" color={Colors.thaiGold} />
                </View>
            </SafeAreaView>
        );
    }

    if (!article) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={22} color={Colors.ink} />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t('articlePractice.shadowingTitle')}</Text>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.centerFull}>
                    <Text style={styles.errorText}>{t('sessionSummary.errorMessage')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {t('articlePractice.shadowingTitle')}
                </Text>
                <View style={styles.backButton} />
            </View>

            {/* Cloze Mode */}
            <View style={styles.controlBar}>
                <Layers size={14} color={Colors.taupe} />
                {(['full', 'partial', 'blind'] as ClozeLevel[]).map(level => (
                    <Pressable
                        key={level}
                        style={[
                            styles.clozePill,
                            clozeLevel === level && styles.clozePillActive,
                        ]}
                        onPress={() => setClozeLevel(level)}
                    >
                        <Text
                            style={[
                                styles.clozePillText,
                                clozeLevel === level && styles.clozePillTextActive,
                            ]}
                        >
                            {t(`articlePractice.cloze${level.charAt(0).toUpperCase() + level.slice(1)}` as any)}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Reference Text */}
                <View style={styles.textCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardLabel}>{article.title}</Text>
                        <Pressable
                            style={[styles.ttsBtn, ttsPlaying && styles.ttsBtnActive]}
                            onPress={() => ttsPlaying ? stopTts() : playTts(article.thaiText)}
                            disabled={ttsLoading}
                        >
                            {ttsLoading ? (
                                <ActivityIndicator size={14} color={Colors.thaiGold} />
                            ) : ttsPlaying ? (
                                <VolumeX size={16} color={Colors.thaiGold} />
                            ) : (
                                <Volume2 size={16} color={Colors.taupe} />
                            )}
                        </Pressable>
                    </View>
                    <View style={styles.wordsContainer}>
                        {thaiWords.map((word, idx) => renderMaskedWord(word, idx))}
                    </View>
                </View>

                {/* Recording Controls */}
                <View style={styles.recordSection}>
                    {!isRecording && !recordingUri && (
                        <Pressable style={styles.recordButton} onPress={startRecording}>
                            <Mic size={28} color={Colors.white} />
                            <Text style={styles.recordButtonText}>
                                {t('articlePractice.startRecording')}
                            </Text>
                        </Pressable>
                    )}

                    {isRecording && (
                        <Pressable style={styles.stopButton} onPress={stopRecording}>
                            <Square size={24} color={Colors.white} />
                            <Text style={styles.recordButtonText}>
                                {t('articlePractice.stopRecording')}
                            </Text>
                        </Pressable>
                    )}

                    {recordingUri && !isRecording && (
                        <View style={styles.playbackRow}>
                            <Pressable
                                style={styles.playbackBtn}
                                onPress={isPlaying ? stopPlayback : playRecording}
                            >
                                {isPlaying ? (
                                    <Pause size={20} color={Colors.ink} />
                                ) : (
                                    <Play size={20} fill={Colors.ink} color={Colors.ink} />
                                )}
                                <Text style={styles.playbackBtnText}>
                                    {t('articlePractice.playback')}
                                </Text>
                            </Pressable>

                            <Pressable style={styles.reRecordBtn} onPress={startRecording}>
                                <Mic size={18} color={Colors.thaiGold} />
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* AI Feedback — 已屏蔽 */}
                {false && recordingUri && (
                    <Pressable
                        style={styles.feedbackButton}
                        onPress={getAiFeedback}
                        disabled={feedbackLoading}
                    >
                        {feedbackLoading ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                            <MessageSquareText size={18} color={Colors.white} />
                        )}
                        <Text style={styles.feedbackButtonText}>
                            {feedbackLoading
                                ? t('articlePractice.analyzing')
                                : t('articlePractice.getAiFeedback')}
                        </Text>
                    </Pressable>
                )}

                {false && feedbackError && (
                    <View style={styles.feedbackCard}>
                        <Text style={styles.feedbackErrorText}>{feedbackError}</Text>
                    </View>
                )}

                {false && feedbackData && (
                    <View style={styles.feedbackCard}>
                        {/* Overall Score */}
                        <View style={styles.scoreRow}>
                            <Text style={styles.scoreLabel}>{t('articlePractice.overallScore')}</Text>
                            <Text style={styles.scoreValue}>{feedbackData.overallScore}/10</Text>
                        </View>

                        {/* Dimensions */}
                        {feedbackData.dimensions.map((dim, idx) => (
                            <View key={idx} style={styles.dimensionRow}>
                                <View style={styles.dimensionHeader}>
                                    <Text style={styles.dimensionName}>{dim.name}</Text>
                                    <Text style={styles.dimensionScore}>{dim.score}/10</Text>
                                </View>
                                <View style={styles.scoreBarBg}>
                                    <View style={[styles.scoreBarFill, { width: `${dim.score * 10}%` }]} />
                                </View>
                                <Text style={styles.dimensionComment}>{dim.comment}</Text>
                            </View>
                        ))}

                        {/* Transcription */}
                        {feedbackData.transcription ? (
                            <View style={styles.transcriptionSection}>
                                <Text style={styles.sectionLabel}>
                                    {i18n.language === 'zh' ? 'AI 听到的内容' : 'What AI heard'}
                                </Text>
                                <Text style={styles.transcriptionText}>{feedbackData.transcription}</Text>
                            </View>
                        ) : null}

                        {/* Suggestions */}
                        {feedbackData.suggestions.length > 0 && (
                            <View style={styles.suggestionsSection}>
                                <Text style={styles.sectionLabel}>{t('articlePractice.pronunciationSuggestions')}</Text>
                                {feedbackData.suggestions.map((s, idx) => (
                                    <Text key={idx} style={styles.suggestionItem}>• {s}</Text>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    centerFull: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
        textAlign: 'center',
    },
    controlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
        gap: 8,
    },
    clozePill: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    clozePillActive: {
        backgroundColor: Colors.ink,
    },
    clozePillText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 11,
        color: Colors.taupe,
    },
    clozePillTextActive: {
        color: Colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    textCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        gap: 12,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardLabel: {
        flex: 1,
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.ink,
    },
    ttsBtn: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    ttsBtnActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    thaiWord: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 20,
        color: Colors.ink,
        lineHeight: 34,
    },
    maskedPlaceholderText: {
        color: Colors.taupe,
        textDecorationLine: 'underline',
        textDecorationStyle: 'dashed',
        textDecorationColor: Colors.ink,
    },
    recordSection: {
        alignItems: 'center',
        gap: 12,
    },
    recordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.thaiGold,
        borderRadius: 28,
        paddingVertical: 16,
        paddingHorizontal: 32,
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.error,
        borderRadius: 28,
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    recordButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
    playbackRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    playbackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    playbackBtnText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        color: Colors.ink,
    },
    reRecordBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 14,
    },
    feedbackButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        color: Colors.white,
    },
    feedbackCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        gap: 16,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    feedbackErrorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.error,
        textAlign: 'center',
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    scoreLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.ink,
    },
    scoreValue: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h2,
        color: Colors.thaiGold,
    },
    dimensionRow: {
        gap: 4,
    },
    dimensionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dimensionName: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.ink,
    },
    dimensionScore: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    scoreBarBg: {
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.sand,
        overflow: 'hidden',
    },
    scoreBarFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: Colors.thaiGold,
    },
    dimensionComment: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
        lineHeight: 18,
    },
    transcriptionSection: {
        gap: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    transcriptionText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: Typography.caption,
        color: Colors.ink,
        lineHeight: 24,
    },
    suggestionsSection: {
        gap: 6,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    sectionLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    suggestionItem: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.ink,
        lineHeight: 22,
    },
    errorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
        textAlign: 'center',
    },
});
````

## File: app/learning/article-practice.tsx
````typescript
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    ChevronLeft,
    Eye,
    EyeOff,
    Mic,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { AiService } from '@/src/services/aiService';
import { AiExplanationView } from '@/src/components/ai/AiExplanationView';
import { getArticleById } from '@/src/utils/articleStorage';
import { useTtsPlayer } from '@/src/hooks/useTtsPlayer';
import type { SavedArticle, ExplainVocabularyResponse } from '@/src/entities/types/ai.types';
import { useUserStore } from '@/src/stores/userStore';
import i18n from '@/src/i18n';

type ClozeLevel = 'full' | 'partial' | 'blind';

export default function ArticlePracticeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { articleId } = useLocalSearchParams<{ articleId: string }>();

    const [article, setArticle] = useState<SavedArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBlind, setIsBlind] = useState(true);
    const [clozeLevel, setClozeLevel] = useState<ClozeLevel>('full');

    // Word lookup state
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [wordLoading, setWordLoading] = useState(false);
    const [wordResult, setWordResult] = useState<ExplainVocabularyResponse | null>(null);
    const [wordError, setWordError] = useState<string | null>(null);
    const [showWordModal, setShowWordModal] = useState(false);

    const { currentUser } = useUserStore();
    const { ttsLoading, isPlaying: ttsPlaying, playTts, stopTts } = useTtsPlayer();

    useEffect(() => {
        (async () => {
            try {
                setArticle(await getArticleById(articleId!));
            } catch { /* noop */ }
            setLoading(false);
        })();
    }, [articleId]);

    const thaiWords = useMemo(() => {
        if (!article) return [];
        return article.thaiText.split(/(\s+)/);
    }, [article]);

    const handleWordTap = useCallback(async (word: string) => {
        const cleaned = word.trim().replace(/[.,;:!?'"()[\]{}]/g, '');
        if (!cleaned) return;

        setSelectedWord(cleaned);
        setWordLoading(true);
        setWordError(null);
        setWordResult(null);
        setShowWordModal(true);

        const response = await AiService.explainVocabulary(
            cleaned,
            currentUser?.userId || 'guest',
            i18n.language
        );

        setWordLoading(false);
        if (!response.success || !response.data) {
            setWordError(response.error || t('home.aiError'));
            return;
        }
        setWordResult(response.data);
    }, [currentUser, t]);

    const closeWordModal = () => {
        setShowWordModal(false);
        setSelectedWord(null);
        setWordResult(null);
        setWordError(null);
    };

    const shouldMask = (word: string, level: ClozeLevel): boolean => {
        const cleaned = word.trim();
        if (!cleaned || /^\s+$/.test(word)) return false;
        if (level === 'full') return false;
        if (level === 'blind') return true;
        // partial: mask longer content words, keep short function words
        return cleaned.length > 2;
    };

    const renderMaskedWord = (word: string, idx: number) => {
        if (/^\s+$/.test(word)) {
            return <Text key={idx}>{word}</Text>;
        }

        const masked = shouldMask(word, clozeLevel);

        return (
            <Pressable key={idx} onPress={() => !isBlind && handleWordTap(word)}>
                <Text
                    style={[
                        styles.thaiWord,
                        masked && styles.maskedWord,
                        !isBlind && styles.tappableWord,
                    ]}
                >
                    {masked ? '▁'.repeat(Math.min(word.length, 6)) : word}
                </Text>
            </Pressable>
        );
    };

    const handleTtsToggle = () => {
        if (ttsPlaying) {
            stopTts();
        } else if (article) {
            playTts(article.thaiText);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerFull}>
                    <ActivityIndicator size="large" color={Colors.thaiGold} />
                </View>
            </SafeAreaView>
        );
    }

    if (!article) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={22} color={Colors.ink} />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t('articlePractice.practiceTitle')}</Text>
                    <View style={styles.backButton} />
                </View>
                <View style={styles.centerFull}>
                    <Text style={styles.errorText}>{t('sessionSummary.errorMessage')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {article.title}
                </Text>
                <View style={styles.backButton} />
            </View>

            {/* Mode Controls */}
            <View style={styles.controlBar}>
                <Pressable
                    style={[styles.controlBtn, !isBlind && styles.controlBtnActive]}
                    onPress={() => setIsBlind(!isBlind)}
                >
                    {isBlind ? (
                        <EyeOff size={16} color={Colors.taupe} />
                    ) : (
                        <Eye size={16} color={Colors.thaiGold} />
                    )}
                    <Text style={[styles.controlBtnText, !isBlind && styles.controlBtnTextActive]}>
                        {isBlind ? t('articlePractice.blindMode') : t('articlePractice.revealMode')}
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.controlBtn, ttsPlaying && styles.controlBtnActive]}
                    onPress={handleTtsToggle}
                    disabled={ttsLoading}
                >
                    {ttsLoading ? (
                        <ActivityIndicator size={14} color={Colors.thaiGold} />
                    ) : ttsPlaying ? (
                        <VolumeX size={16} color={Colors.thaiGold} />
                    ) : (
                        <Volume2 size={16} color={Colors.taupe} />
                    )}
                    <Text style={[styles.controlBtnText, ttsPlaying && styles.controlBtnTextActive]}>
                        {ttsLoading
                            ? t('articlePractice.ttsLoading')
                            : ttsPlaying
                            ? t('articlePractice.stopPlaying')
                            : t('articlePractice.playOriginal')}
                    </Text>
                </Pressable>

            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Thai Text */}
                <View style={[styles.textCard, isBlind && styles.textCardBlind]}>
                    {isBlind ? (
                        <>
                            <Text style={styles.thaiTextBlock}>
                                {article.thaiText}
                            </Text>
                            <BlurView
                                intensity={10}
                                tint="light"
                                style={[StyleSheet.absoluteFill, styles.blurOverlay]}
                            />
                        </>
                    ) : (
                        <>
                            <View style={styles.wordsContainer}>
                                {thaiWords.map((word, idx) => renderMaskedWord(word, idx))}
                            </View>
                            {clozeLevel === 'full' && (
                                <Text style={styles.tapHint}>{t('articlePractice.tapWordHint')}</Text>
                            )}
                        </>
                    )}
                </View>

                {/* Translation */}
                {!isBlind && (
                    <View style={styles.translationCard}>
                        <Text style={styles.translationLabel}>
                            {t('microReading.translationLabel')}
                        </Text>
                        <Text style={styles.translationText}>{article.translation}</Text>
                    </View>
                )}

                {/* Words Used */}
                {!isBlind && article.wordsUsed.length > 0 && (
                    <View style={styles.wordsUsedCard}>
                        <Text style={styles.wordsUsedLabel}>{t('microReading.wordsUsed')}</Text>
                        <View style={styles.wordsUsedRow}>
                            {article.wordsUsed.map((word, idx) => (
                                <Pressable
                                    key={idx}
                                    style={styles.wordChip}
                                    onPress={() => handleWordTap(word)}
                                >
                                    <Text style={styles.wordChipText}>{word}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* Shadowing Entry */}
                <Pressable
                    style={styles.shadowingEntry}
                    onPress={() =>
                        router.push({
                            pathname: '/learning/article-practice-shadowing',
                            params: { articleId: article.id },
                        })
                    }
                >
                    <Mic size={18} color={Colors.thaiGold} />
                    <Text style={styles.shadowingEntryText}>
                        {t('articlePractice.shadowingTitle')}
                    </Text>
                </Pressable>

                <View style={{ height: 32 }} />
            </ScrollView>

            {/* Word Lookup Modal */}
            <Modal
                visible={showWordModal}
                transparent
                animationType="slide"
                onRequestClose={closeWordModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {selectedWord || t('ai.title')}
                            </Text>
                            <Pressable onPress={closeWordModal} style={styles.modalClose}>
                                <X size={22} color={Colors.ink} />
                            </Pressable>
                        </View>

                        {wordLoading ? (
                            <View style={styles.modalCenter}>
                                <ActivityIndicator size="large" color={Colors.thaiGold} />
                                <Text style={styles.modalLoadingText}>{t('common.loading')}</Text>
                            </View>
                        ) : wordError ? (
                            <View style={styles.modalCenter}>
                                <Text style={styles.modalErrorText}>{wordError}</Text>
                            </View>
                        ) : wordResult ? (
                            <View style={styles.modalResultWrapper}>
                                <AiExplanationView data={wordResult} />
                            </View>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    centerFull: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
        textAlign: 'center',
    },
    controlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
        flexWrap: 'wrap',
        gap: 8,
    },
    controlBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    controlBtnActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.12)',
    },
    controlBtnText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    controlBtnTextActive: {
        color: Colors.accent,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    textCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    thaiTextBlock: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 22,
        color: Colors.ink,
        lineHeight: 38,
    },
    textCardBlind: {
        overflow: 'hidden',
    },
    blurOverlay: {
        borderRadius: 16,
    },
    wordsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    thaiWord: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 22,
        color: Colors.ink,
        lineHeight: 38,
    },
    maskedWord: {
        color: Colors.sand,
        backgroundColor: Colors.sand,
        borderRadius: 4,
        overflow: 'hidden',
    },
    tappableWord: {
        textDecorationLine: 'underline',
        textDecorationColor: 'rgba(212, 175, 55, 0.3)',
        textDecorationStyle: 'dotted',
    },
    tapHint: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
        marginTop: 12,
        textAlign: 'center',
    },
    translationCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        gap: 10,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    translationLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    translationText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.ink,
        lineHeight: 28,
    },
    wordsUsedCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        gap: 10,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    wordsUsedLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    wordsUsedRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    wordChip: {
        backgroundColor: Colors.thaiGold + '20',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    wordChipText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: Typography.caption,
        color: Colors.accent,
    },
    shadowingEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 16,
    },
    shadowingEntryText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
    errorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
        textAlign: 'center',
    },
    // Word modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.paper,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '70%',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    modalTitle: {
        fontFamily: Typography.sarabunBold,
        fontSize: Typography.h2,
        color: Colors.ink,
    },
    modalClose: {
        padding: 4,
    },
    modalCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    modalLoadingText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
    },
    modalErrorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.error,
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    modalResultWrapper: {
        flex: 1,
        paddingTop: 12,
    },
});
````

## File: app/learning/reminder-settings.tsx
````typescript
import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import {
  scheduleDailyReminder,
  cancelDailyReminder,
  requestReminderPermission,
  isReminderSupported,
} from '@/src/utils/reminderNotification';

/** 将 HH:mm 解析为 Date（今日） */
function parseTimeToDate(timeStr: string): Date {
  const [hour, minute] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
}

/** 将 Date 格式化为 HH:mm */
function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function ReminderSettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    dailyReminderEnabled,
    dailyReminderTime,
    setDailyReminder,
  } = useLearningPreferenceStore();

  const [enabled, setEnabled] = useState(dailyReminderEnabled);
  const [time, setTime] = useState(() => parseTimeToDate(dailyReminderTime));
  const [showPicker, setShowPicker] = useState(false);

  const timeStr = useMemo(() => formatTime(time), [time]);

  // 进入页面时，若已启用则确保提醒已调度（应对应用重启等场景）
  useEffect(() => {
    if (!dailyReminderEnabled) return;
    scheduleDailyReminder(
      dailyReminderTime,
      t('profile.reminder.notificationTitle'),
      t('profile.reminder.notificationBody')
    ).catch(console.warn);
  }, [dailyReminderEnabled, dailyReminderTime, t]);

  const handleToggle = async (value: boolean) => {
    if (value) {
      if (!isReminderSupported()) {
        Alert.alert(
          t('profile.reminder.title'),
          t('profile.reminder.unsupportedEnv')
        );
        return;
      }
      const hasPermission = await requestReminderPermission();
      if (!hasPermission) {
        Alert.alert(
          t('profile.reminder.permissionTitle'),
          t('profile.reminder.permissionMessage')
        );
        return;
      }
      setEnabled(true);
      setDailyReminder(true, formatTime(time));
      try {
        await scheduleDailyReminder(
          formatTime(time),
          t('profile.reminder.notificationTitle'),
          t('profile.reminder.notificationBody')
        );
      } catch (e) {
        console.warn('Schedule reminder failed:', e);
        setEnabled(false);
        setDailyReminder(false);
      }
    } else {
      setEnabled(false);
      setDailyReminder(false);
      await cancelDailyReminder();
    }
  };

  const handleTimeChange = (_: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (selectedDate != null) {
      setTime(selectedDate);
      const newTimeStr = formatTime(selectedDate);
      setDailyReminder(enabled, newTimeStr);
      if (enabled) {
        scheduleDailyReminder(
          newTimeStr,
          t('profile.reminder.notificationTitle'),
          t('profile.reminder.notificationBody')
        ).catch(console.warn);
      }
    }
  };

  const handleConfirm = async () => {
    setDailyReminder(enabled, timeStr);
    if (enabled) {
      try {
        await scheduleDailyReminder(
          timeStr,
          t('profile.reminder.notificationTitle'),
          t('profile.reminder.notificationBody')
        );
      } catch (e) {
        console.warn('Schedule reminder failed:', e);
      }
    } else {
      await cancelDailyReminder();
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThaiPatternBackground opacity={0.1} />
      <View style={styles.header}>
        <Text style={styles.title}>{t('profile.reminder.title')}</Text>
        <Text style={styles.subtitle}>{t('profile.reminder.subtitle')}</Text>
      </View>

      <View style={styles.card}>
        {/* 开关 */}
        <View style={styles.row}>
          <Text style={styles.label}>{t('profile.dailyReminder')}</Text>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ false: Colors.sand, true: Colors.ink }}
            thumbColor={Colors.white}
          />
        </View>

        {/* 时间选择 */}
        {enabled && (
          <View style={styles.timeSection}>
            <Text style={styles.label}>{t('profile.reminder.timeLabel')}</Text>
            <Pressable
              style={styles.timeButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.timeText}>{timeStr}</Text>
            </Pressable>
            {showPicker && (
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={time}
                  mode="time"
                  is24Hour
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleTimeChange}
                />
                {Platform.OS === 'ios' && (
                  <Pressable
                    style={styles.doneButton}
                    onPress={() => setShowPicker(false)}
                  >
                    <Text style={styles.doneButtonText}>{t('common.confirm')}</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>{t('common.save')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 26,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  timeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
  },
  timeButton: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.paper,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  timeText: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
  },
  confirmButton: {
    marginTop: 24,
    backgroundColor: Colors.ink,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.white,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
  },
  pickerContainer: {
    marginTop: 8,
  },
  doneButton: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
});
````

## File: app/learning/session-summary.tsx
````typescript
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Square, ChevronRight, AlertCircle } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { AiService } from '@/src/services/aiService';
import type { SessionWord } from '@/src/entities/types/vocabulary.types';
import type { MicroReadingWord } from '@/src/entities/types/ai.types';

// 每个可勾选词条的本地状态
interface SelectableWord {
    sessionWord: SessionWord;
    checked: boolean;
}

export default function SessionSummaryScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    // ── 从 Store 快照数据（仅在 mount 时读取一次，防止 resetSession 后丢失）──
    const [wrongWords, setWrongWords] = useState<SelectableWord[]>([]);
    const [newWords, setNewWords] = useState<SelectableWord[]>([]);
    const [skippedWords, setSkippedWords] = useState<SelectableWord[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const { recentWrongWords, sessionPool, skippedIds } = useVocabularyStore.getState();

        // 错词：默认全选（finishSession 内已去重）
        setWrongWords(
            recentWrongWords.map(w => ({ sessionWord: w, checked: true }))
        );

        // 新学词：isNew === true，按 entity._id 去重（sessionPool 中同一词可能有多条 source）
        const seenNew = new Set<string>();
        const newWordItems = sessionPool.filter(w => {
            if (!w.isNew) return false;
            if (seenNew.has(w.entity._id)) return false;
            seenNew.add(w.entity._id);
            return true;
        });
        setNewWords(newWordItems.map(w => ({ sessionWord: w, checked: false })));

        // 跳过词：skippedIds 存储 entity._id（即 SessionWord.id），按 id 去重后关联 sessionPool
        const seenSkip = new Set<string>();
        const skippedItems = sessionPool.filter(w => {
            if (!skippedIds.includes(w.id)) return false;
            if (seenSkip.has(w.id)) return false;
            seenSkip.add(w.id);
            return true;
        });
        setSkippedWords(skippedItems.map(w => ({ sessionWord: w, checked: false })));
    }, []);

    // ── 勾选/取消勾选 ──────────────────────────────────────────────────────────
    const toggleWrong = useCallback((index: number) => {
        setWrongWords(prev =>
            prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item)
        );
    }, []);

    const toggleNew = useCallback((index: number) => {
        setNewWords(prev =>
            prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item)
        );
    }, []);

    const toggleSkipped = useCallback((index: number) => {
        setSkippedWords(prev =>
            prev.map((item, i) => i === index ? { ...item, checked: !item.checked } : item)
        );
    }, []);

    // 取消跳过：从跳过列表中移除该词条（本地 state 操作，不写回 Store）
    const cancelSkip = useCallback((index: number) => {
        setSkippedWords(prev => prev.filter((_, i) => i !== index));
    }, []);

    // ── 计算已选词汇 ───────────────────────────────────────────────────────────
    const selectedWords: MicroReadingWord[] = [
        ...wrongWords.filter(item => item.checked),
        ...newWords.filter(item => item.checked),
        ...skippedWords.filter(item => item.checked),
    ].map(item => ({
        thaiWord: item.sessionWord.entity.thaiWord,
        meaning: item.sessionWord.entity.meaning,
    }));

    const selectedCount = selectedWords.length;

    // ── 生成微阅读 ─────────────────────────────────────────────────────────────
    const handleGenerate = async () => {
        if (selectedCount === 0) return;

        setIsGenerating(true);
        try {
            const response = await AiService.generateMicroReading(
                selectedWords,
                i18n.language
            );

            if (response.success && response.data) {
                router.push({
                    pathname: '/learning/micro-reading',
                    params: { result: JSON.stringify(response.data) },
                });
            } else {
                Alert.alert(
                    t('sessionSummary.errorTitle'),
                    response.error || t('sessionSummary.errorMessage'),
                    [{ text: t('sessionSummary.retry'), onPress: () => setIsGenerating(false) }]
                );
                return;
            }
        } catch {
            Alert.alert(
                t('sessionSummary.errorTitle'),
                t('sessionSummary.errorMessage'),
                [{ text: t('sessionSummary.retry'), onPress: () => setIsGenerating(false) }]
            );
            return;
        }
        setIsGenerating(false);
    };

    // ── 判断是否有任何词可展示 ─────────────────────────────────────────────────
    const hasAnyWords =
        wrongWords.length > 0 || newWords.length > 0 || skippedWords.length > 0;

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* 标题栏 */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{t('sessionSummary.title')}</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {!hasAnyWords && (
                    <View style={styles.emptyContainer}>
                        <AlertCircle size={40} color={Colors.taupe} />
                        <Text style={styles.emptyText}>{t('sessionSummary.noWords')}</Text>
                    </View>
                )}

                {/* 错词区（置顶，默认全选） */}
                {wrongWords.length > 0 && (
                    <SectionBlock
                        label={t('sessionSummary.wrongWords')}
                        accentColor={Colors.error}
                        badgeText="×"
                    >
                        {wrongWords.map((item, index) => (
                            <WordRow
                                key={item.sessionWord.entity._id + '-wrong'}
                                thaiWord={item.sessionWord.entity.thaiWord}
                                meaning={item.sessionWord.entity.meaning}
                                badge={`×${item.sessionWord.mistakeCount}`}
                                badgeColor={Colors.error}
                                checked={item.checked}
                                onToggle={() => toggleWrong(index)}
                            />
                        ))}
                    </SectionBlock>
                )}

                {/* 新学词区 */}
                {newWords.length > 0 && (
                    <SectionBlock
                        label={t('sessionSummary.newWords')}
                        accentColor={Colors.success}
                    >
                        {newWords.map((item, index) => (
                            <WordRow
                                key={item.sessionWord.entity._id + '-new'}
                                thaiWord={item.sessionWord.entity.thaiWord}
                                meaning={item.sessionWord.entity.meaning}
                                badge="新"
                                badgeColor={Colors.success}
                                checked={item.checked}
                                onToggle={() => toggleNew(index)}
                            />
                        ))}
                    </SectionBlock>
                )}

                {/* 跳过词区 */}
                {skippedWords.length > 0 && (
                    <SectionBlock
                        label={t('sessionSummary.skippedWords')}
                        accentColor={Colors.taupe}
                    >
                        {skippedWords.map((item, index) => (
                            <WordRow
                                key={item.sessionWord.entity._id + '-skip'}
                                thaiWord={item.sessionWord.entity.thaiWord}
                                meaning={item.sessionWord.entity.meaning}
                                badge="跳"
                                badgeColor={Colors.taupe}
                                checked={item.checked}
                                onToggle={() => toggleSkipped(index)}
                                actionLabel={t('sessionSummary.cancelSkip')}
                                onAction={() => cancelSkip(index)}
                            />
                        ))}
                    </SectionBlock>
                )}

                {/* 底部占位，防止按钮遮挡最后一行 */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* 底部按钮区（固定）*/}
            <View style={styles.footer}>
                <Pressable
                    style={[
                        styles.generateButton,
                        (selectedCount === 0 || isGenerating) && styles.generateButtonDisabled,
                    ]}
                    onPress={handleGenerate}
                    disabled={selectedCount === 0 || isGenerating}
                >
                    {isGenerating ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <>
                            <Text style={styles.generateButtonText}>
                                {t('sessionSummary.generateBtn', { count: selectedCount })}
                            </Text>
                            <ChevronRight size={18} color={Colors.white} />
                        </>
                    )}
                </Pressable>
                <Pressable
                    style={styles.homeButton}
                    onPress={() => router.dismissAll()}
                    disabled={isGenerating}
                >
                    <Text style={styles.homeButtonText}>{t('microReading.backToHome')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

// ── 子组件：分区容器 ──────────────────────────────────────────────────────────
interface SectionBlockProps {
    label: string;
    accentColor: string;
    badgeText?: string;
    children: React.ReactNode;
}

function SectionBlock({ label, accentColor, children }: SectionBlockProps) {
    return (
        <View style={styles.section}>
            <View style={[styles.sectionLabelBar, { borderLeftColor: accentColor }]}>
                <Text style={[styles.sectionLabel, { color: accentColor }]}>{label}</Text>
            </View>
            <View style={styles.sectionBody}>{children}</View>
        </View>
    );
}

// ── 子组件：单词行 ─────────────────────────────────────────────────────────────
interface WordRowProps {
    thaiWord: string;
    meaning: string;
    badge: string;
    badgeColor: string;
    checked: boolean;
    onToggle: () => void;
    actionLabel?: string;
    onAction?: () => void;
}

function WordRow({
    thaiWord,
    meaning,
    badge,
    badgeColor,
    checked,
    onToggle,
    actionLabel,
    onAction,
}: WordRowProps) {
    return (
        <View style={styles.wordRow}>
            {/* 勾选框 */}
            <Pressable onPress={onToggle} style={styles.checkboxArea} hitSlop={8}>
                {checked ? (
                    <CheckSquare size={22} color={Colors.ink} />
                ) : (
                    <Square size={22} color={Colors.taupe} />
                )}
            </Pressable>

            {/* 词语内容 */}
            <Pressable onPress={onToggle} style={styles.wordContent}>
                <Text style={styles.thaiWord}>{thaiWord}</Text>
                <Text style={styles.meaning}>{meaning}</Text>
            </Pressable>

            {/* 错误次数徽章 / 分类标签 */}
            <View style={[styles.badge, { backgroundColor: badgeColor + '20' }]}>
                <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
            </View>

            {/* 取消跳过操作（仅跳过词区有） */}
            {actionLabel && onAction && (
                <Pressable onPress={onAction} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    headerTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h2,
        color: Colors.ink,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
    },
    section: {
        marginBottom: 20,
        backgroundColor: Colors.white,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionLabelBar: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderLeftWidth: 4,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    sectionLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        letterSpacing: 0.5,
    },
    sectionBody: {
        paddingHorizontal: 4,
        paddingBottom: 4,
    },
    wordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
        gap: 10,
    },
    checkboxArea: {
        width: 28,
        alignItems: 'center',
    },
    wordContent: {
        flex: 1,
        gap: 2,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 18,
        color: Colors.ink,
    },
    meaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        minWidth: 32,
        alignItems: 'center',
    },
    badgeText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
    },
    actionButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: Colors.sand,
        borderRadius: 8,
    },
    actionButtonText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.small,
        color: Colors.taupe,
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
        backgroundColor: Colors.paper,
    },
    generateButton: {
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    generateButtonDisabled: {
        backgroundColor: Colors.taupe,
        opacity: 0.5,
    },
    generateButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
    homeButton: {
        marginTop: 10,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeButtonText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.caption,
        color: Colors.taupe,
    },
});
````

## File: cloudbase/functions/ai-engine/handlers/ttsProviders/googleTts.js
````javascript
/**
 * Google Cloud TTS Provider（API Key + REST 方式）
 *
 * 使用 v1beta1 REST API + SSML <mark> 标签获取逐字时间戳。
 * 无需 SDK，通过 Node.js 内置 https 模块直接调用。
 *
 * 环境变量：
 *   GOOGLE_TTS_API_KEY — Google Cloud API Key（在 CloudBase 控制台配置）
 */

const https = require('https');

const DEFAULT_VOICE = 'th-TH-Neural2-C';
const TTS_ENDPOINT = 'texttospeech.googleapis.com';
const TTS_PATH = '/v1beta1/text:synthesize';

function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * 在每个字符前插入 <mark name="index"/>，
 * 用于让 Google TTS 返回逐字时间戳。
 */
function buildSsmlWithMarks(text) {
    const chars = [...text];
    let ssml = '<speak>';
    for (let i = 0; i < chars.length; i++) {
        ssml += `<mark name="${i}"/>${escapeXml(chars[i])}`;
    }
    ssml += '</speak>';
    return { ssml, chars };
}

function postJson(hostname, path, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = https.request({
            hostname,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
            },
        }, (res) => {
            let chunks = '';
            res.on('data', (d) => { chunks += d; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(chunks);
                    if (res.statusCode >= 400) {
                        const msg = parsed.error?.message || `HTTP ${res.statusCode}`;
                        reject(new Error(msg));
                    } else {
                        resolve(parsed);
                    }
                } catch {
                    reject(new Error(`JSON 解析失败: ${chunks.substring(0, 200)}`));
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

/**
 * Provider 接口：
 * @param {string} text       — 待合成纯文本
 * @param {object} [options]
 * @param {string} [options.voiceName] — Google 语音名称（如 th-TH-Neural2-C）
 * @returns {Promise<{ audio: string, subtitles: Array }>}
 */
async function synthesize(text, options = {}) {
    const { voiceName = DEFAULT_VOICE } = options;

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
        throw new Error('缺少 GOOGLE_TTS_API_KEY 环境变量');
    }

    const { ssml, chars } = buildSsmlWithMarks(text);

    const response = await postJson(TTS_ENDPOINT, `${TTS_PATH}?key=${apiKey}`, {
        input: { ssml },
        voice: {
            languageCode: 'th-TH',
            name: voiceName,
        },
        audioConfig: { audioEncoding: 'MP3' },
        enableTimePointing: ['SSML_MARK'],
    });

    const audio = response.audioContent;
    const timepoints = response.timepoints || [];

    const subtitles = timepoints.map((tp, i) => {
        const charIdx = parseInt(tp.markName, 10);
        return {
            Text: chars[charIdx] || '',
            BeginTime: Math.round(tp.timeSeconds * 1000),
            EndTime: i < timepoints.length - 1
                ? Math.round(timepoints[i + 1].timeSeconds * 1000)
                : Math.round(tp.timeSeconds * 1000) + 200,
            BeginIndex: charIdx,
            EndIndex: charIdx + 1,
            Phoneme: null,
        };
    });

    return { audio, subtitles };
}

module.exports = { synthesize };
````

## File: cloudbase/functions/ai-engine/handlers/analyzePronunciation.js
````javascript
/**
 * 发音分析 handler
 *
 * Action: analyzePronunciation
 *
 * 使用 Qwen2-Audio (DashScope) 分析用户录音，对比参考原文给出发音反馈。
 * 通过 OpenAI 兼容接口调用，复用已安装的 openai SDK。
 *
 * 环境变量：
 *   DASHSCOPE_API_KEY — 阿里云百炼平台 API Key
 */

const { OpenAI } = require('openai');
const { createResponse } = require('../utils/response');

const DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const MODEL = 'qwen2-audio-instruct';

function buildDashScopeClient() {
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
        throw new Error('缺少 DASHSCOPE_API_KEY 环境变量');
    }
    return new OpenAI({ apiKey, baseURL: DASHSCOPE_BASE_URL });
}

function buildPrompt(referenceText, language) {
    const lang = language === 'en' ? 'English' : '中文';

    return `You are a professional Thai language pronunciation coach.

The student is practicing reading the following Thai text aloud:

"""
${referenceText}
"""

Listen to the student's recording and evaluate their pronunciation.
Respond in ${lang}.

Return ONLY valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "overallScore": <number 1-10>,
  "dimensions": [
    { "name": "<dimension name>", "score": <number 1-10>, "comment": "<brief feedback>" }
  ],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...],
  "transcription": "<what you heard the student say>"
}

Evaluate these 4 dimensions:
1. Tone accuracy (声调准确性)
2. Consonant & vowel clarity (辅音元音清晰度)
3. Speaking pace & rhythm (语速节奏)
4. Fluency & linking (流利度与连读)

Keep each comment under 30 words. Provide 2-4 actionable suggestions.`;
}

async function analyzePronunciation(client, data) {
    const { audioBase64, referenceText, language = 'zh' } = data;

    if (!audioBase64 || !audioBase64.trim()) {
        return createResponse(false, null, '缺少录音数据', 'ERR_NO_AUDIO');
    }
    if (!referenceText || !referenceText.trim()) {
        return createResponse(false, null, '缺少参考原文', 'ERR_NO_TEXT');
    }

    const audioDataUri = audioBase64.startsWith('data:')
        ? audioBase64
        : `data:audio/m4a;base64,${audioBase64}`;

    try {
        const dashScope = buildDashScopeClient();
        const prompt = buildPrompt(referenceText.trim(), language);

        const completion = await dashScope.chat.completions.create({
            model: MODEL,
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'input_audio', input_audio: { data: audioDataUri } },
                        { type: 'text', text: prompt },
                    ],
                },
            ],
        });

        const raw = completion.choices?.[0]?.message?.content || '';

        let parsed;
        try {
            const jsonMatch = raw.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('AI 未返回 JSON');
            parsed = JSON.parse(jsonMatch[0]);
        } catch {
            console.warn('[analyzePronunciation] JSON 解析失败，返回原始文本:', raw.substring(0, 300));
            parsed = {
                overallScore: 0,
                dimensions: [],
                suggestions: [raw.substring(0, 500)],
                transcription: '',
            };
        }

        return createResponse(true, parsed, '发音分析完成');
    } catch (err) {
        console.error('[analyzePronunciation] 分析失败:', err.message || err);
        return createResponse(false, null,
            `发音分析失败: ${err.message || '未知错误'}`, 'ERR_ANALYZE_FAILED');
    }
}

module.exports = analyzePronunciation;
````

## File: cloudbase/functions/ai-engine/handlers/extractClozeHints.js
````javascript
/**
 * 半挖空提示词提取
 *
 * Action: extractClozeHints
 *
 * 从泰语文章中提取 20-30% 的提示性关键词（主题词、关键名词/动词），
 * 用于半挖空模式：这些词保留可见，其余遮盖。
 */

const { createResponse } = require('../utils/response');

const PROMPT = `你是一位泰语教学专家。请分析下面的泰语文章，选出 50% 的「提示性关键词」。

选词原则：
- 优先保留：主题词、关键名词、重要动词、能帮助回忆整句的锚点词
- 避免保留：虚词、助词、连词（如 กับ ที่ มี คือ นี้ เป็น 等，除非在句中有关键语义）

请将原文按空格拆分为词，从这些词中选出应保留的提示词,至少保留原文 50% 的词作为提示词。
返回格式：仅返回一个 JSON 数组，元素为要保留的泰语词（字符串），与原文中出现的完全一致。

示例：若原文有 "เช้าวันเสาร์กับน้า" 拆成 ["เช้า","วันเสาร์","กับ","น้า"]，可返回 ["เช้า","วันเสาร์","น้า"]

原文：
"""
{{THAI_TEXT}}
"""

直接返回 JSON 数组，不要其他说明。`;

async function extractClozeHints(client, data) {
    const { thaiText } = data;

    if (!thaiText || !thaiText.trim()) {
        return createResponse(false, null, '缺少泰语原文', 'ERR_NO_TEXT');
    }

    const text = thaiText.trim();
    if (text.length > 8000) {
        return createResponse(false, null, '文章过长', 'ERR_TEXT_TOO_LONG');
    }

    try {
        const prompt = PROMPT.replace('{{THAI_TEXT}}', text);

        const completion = await client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: '你只返回有效的 JSON 数组，不包含任何其他文字。' },
                { role: 'user', content: prompt },
            ],
            temperature: 0.3,
        });

        const raw = completion.choices?.[0]?.message?.content || '';

        let keywords = [];
        try {
            const jsonMatch = raw.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('AI 未返回数组');
            keywords = JSON.parse(jsonMatch[0]);
            if (!Array.isArray(keywords)) keywords = [];
            keywords = keywords.filter((k) => typeof k === 'string' && k.trim()).map((k) => k.trim());
        } catch {
            console.warn('[extractClozeHints] JSON 解析失败，返回空数组:', raw.substring(0, 200));
        }

        return createResponse(true, { keywords }, '提示词提取完成');
    } catch (err) {
        console.error('[extractClozeHints] 提取失败:', err.message || err);
        return createResponse(false, null, `提取失败: ${err.message || '未知错误'}`, 'ERR_EXTRACT_FAILED');
    }
}

module.exports = extractClozeHints;
````

## File: cloudbase/functions/ai-engine/handlers/textToSpeech.js
````javascript
/**
 * TTS 语音合成 handler（provider 无关）
 *
 * Action: textToSpeech
 *
 * 职责：参数校验 → 委托给当前 provider → 统一响应格式。
 * 切换 TTS 服务商只需修改下方 provider 引用。
 *
 * Provider 接口约定：
 *   synthesize(text, options?) → { audio: string, subtitles: TtsSubtitle[] }
 */

const { createResponse } = require('../utils/response');

// ─── 切换 TTS 服务商只改这一行 ───
const provider = require('./ttsProviders/googleTts');
// ─────────────────────────────────

async function textToSpeech(data) {
    const { text, voiceName } = data;

    if (!text || text.trim().length === 0) {
        return createResponse(false, null, '缺少合成文本', 'ERR_NO_TEXT');
    }

    try {
        const result = await provider.synthesize(text.trim(), { voiceName });
        return createResponse(true, result, '语音合成成功');
    } catch (err) {
        console.error('[textToSpeech] 合成失败:', err.message || err);
        return createResponse(false, null,
            `语音合成失败: ${err.message || '未知错误'}`, 'ERR_TTS_FAILED');
    }
}

module.exports = textToSpeech;
````

## File: cloudbase/functions/ai-engine/utils/constants.js
````javascript
/**
 * 常量定义模块
 * 
 * 与前端 src/config/constants.ts 保持一致的设计风格
 * 集中管理所有云函数常量
 */

'use strict';

// ==================== 数据库集合名称 ====================
// 与前端 COLLECTIONS 保持一致
const COLLECTIONS = {
  USERS: 'users',
  VOCABULARY: 'vocabulary',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',
  LETTERS: 'letters',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  LETTER_TEST_BANK: 'letter_test_bank',
  COURSES: 'courses',
  LESSONS: 'lessons',
  PROGRESS: 'progress',
};

// ==================== 掌握程度 ====================
// 使用中文值，便于前端直接显示
const MasteryLevel = Object.freeze({
  UNFAMILIAR: '陌生',
  FUZZY: '模糊',
  REMEMBERED: '记得',
});

// ==================== 学习等级 ====================
// 与前端 LEVELS 保持一致
const LEVELS = Object.freeze({
  BEGINNER_A: 'BEGINNER_A',
  BEGINNER_B: 'BEGINNER_B',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
});

// ==================== SM-2 算法参数 ====================
// 优化版参数，基于艾宾浩斯遗忘曲线
const SM2_PARAMS = Object.freeze({
  INITIAL_EASINESS_FACTOR: 2.5,   // 初始简易度
  MIN_EASINESS_FACTOR: 1.3,       // 最小简易度
  MAX_INTERVAL_DAYS: 180,         // 最大间隔（天）
  FUZZY_MULTIPLIER: 0.8,          // "模糊"时间隔缩短比例
});

// ==================== 早期复习间隔序列 ====================
// 基于艾宾浩斯遗忘曲线优化: 1→2→4→7→14 天
const EARLY_INTERVALS = Object.freeze([1, 2, 4, 7, 14]);

// ==================== 每日学习配置 ====================
const DAILY_LEARNING_CONFIG = Object.freeze({
  MAX_NEW_WORDS: 10,              // 每日新词上限
  MAX_REVIEW_WORDS: 20,           // 每日复习上限
  TOTAL_WORDS_LIMIT: 30,          // 每日总词数上限
});

// ==================== 错误码 ====================
// 统一错误码定义
const ErrorCodes = Object.freeze({
  SUCCESS: 'SUCCESS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VOCABULARY_NOT_FOUND: 'VOCABULARY_NOT_FOUND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  INVALID_MASTERY: 'INVALID_MASTERY',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  SERVER_ERROR: 'SERVER_ERROR',
});

// ==================== 错误消息 ====================
// 与前端 ERROR_MESSAGES 风格一致
const ERROR_MESSAGES = Object.freeze({
  USER_NOT_FOUND: '用户不存在，请检查用户ID或重新登录',
  VOCABULARY_NOT_FOUND: '词汇不存在，请检查词汇ID',
  INVALID_PARAMS: '参数格式错误，请检查输入',
  INVALID_MASTERY: '无效的掌握程度，允许值: 陌生/模糊/记得',
  UNKNOWN_ACTION: '未知操作类型',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
});

// ==================== 支持的 Actions ====================
const SUPPORTED_ACTIONS = Object.freeze([
  'getTodayWords',
  'updateMastery',
  'toggleSkipWord',
  'getVocabularyDetail',
  'getReviewStatistics',
  'getVocabularyList',
  'getSkippedWords',
  'getLetterTest',
  'submitLetterTest',
  'passLetterTest',
  'getTodayMemories',
  'submitMemoryResult',
  'checkModuleAccess',
  'getUserProgress'
]);

module.exports = {
  // 集合
  COLLECTIONS,

  // 枚举
  MasteryLevel,
  LEVELS,
  ErrorCodes,

  // 算法参数
  SM2_PARAMS,
  EARLY_INTERVALS,

  // 配置
  DAILY_LEARNING_CONFIG,

  // 消息
  ERROR_MESSAGES,
  SUPPORTED_ACTIONS,
};
````

## File: cloudbase/functions/ai-engine/utils/response.js
````javascript
/**
 * 响应格式化模块
 * 
 * 统一 API 响应格式
 * 与前端 ApiResponse<T> 类型定义保持一致
 */

'use strict';

const { ErrorCodes, ERROR_MESSAGES } = require('./constants');

/**
 * 创建标准化 API 响应
 * 
 * 对应前端类型:
 * interface ApiResponse<T> {
 *   success: boolean;
 *   data?: T;
 *   message?: string;
 *   errorCode?: string;
 *   timestamp: string;
 * }
 * 
 * @param {boolean} success - 是否成功
 * @param {Object} data - 返回数据
 * @param {string} message - 提示消息
 * @param {string} errorCode - 错误码
 * @returns {Object} 标准化响应对象
 */
function createResponse(success, data = null, message = '', errorCode = null) {
  return {
    success,
    data,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建成功响应
 * 
 * @param {Object} data - 返回数据
 * @param {string} message - 成功消息
 * @returns {Object} 成功响应对象
 */
function successResponse(data, message = '操作成功') {
  return createResponse(true, data, message, null);
}

/**
 * 创建错误响应
 * 
 * @param {string} errorCode - 错误码 (来自 ErrorCodes)
 * @param {string} customMessage - 自定义消息 (可选)
 * @returns {Object} 错误响应对象
 */
function errorResponse(errorCode, customMessage = null) {
  const message = customMessage || ERROR_MESSAGES[errorCode] || '未知错误';
  return createResponse(false, null, message, errorCode);
}

/**
 * 创建参数错误响应
 * 
 * @param {string} detail - 错误详情
 * @returns {Object} 错误响应对象
 */
function invalidParamsResponse(detail) {
  return errorResponse(ErrorCodes.INVALID_PARAMS, detail);
}

/**
 * 创建用户不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function userNotFoundResponse() {
  return errorResponse(ErrorCodes.USER_NOT_FOUND);
}

/**
 * 创建词汇不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function vocabularyNotFoundResponse() {
  return errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
}

/**
 * 创建服务器错误响应
 * 
 * @param {Error} error - 错误对象
 * @returns {Object} 错误响应对象
 */
function serverErrorResponse(error) {
  // 生产环境不暴露错误详情
  const message = process.env.NODE_ENV === 'development' 
    ? `服务器错误: ${error.message}`
    : ERROR_MESSAGES.SERVER_ERROR;
  
  return errorResponse(ErrorCodes.SERVER_ERROR, message);
}

/**
 * 创建 AI 错误响应
 * 
 * @param {Error} error - 错误对象
 * @returns {Object} 错误响应对象
 */
function aiErrorResponse(error) {
  const message = `AI 错误: ${error.message}`;
  return errorResponse(ErrorCodes.AI_ERROR || 'AI_ERROR', message);
}

module.exports = {
  createResponse,
  successResponse,
  errorResponse,
  invalidParamsResponse,
  userNotFoundResponse,
  vocabularyNotFoundResponse,
  serverErrorResponse,
  aiErrorResponse,
};
````

## File: cloudbase/functions/ai-engine/test.js
````javascript
// /Users/liangjianyu/LearnOnThailand/ThaiLearningApp/cloudbase/functions/ai-engine/test.js

/**
 * 这是一个仅供本地开发使用的“脱水测试脚本”。
 * 目的：在不部署云端的情况下，直接验证大模型返回的数据结构是否符合我们的 JSON 规范。
 */

// 1. 挂载真实环境变量（⚠️ 注意：不要把写了真实 Key 的此文件提交到 Git）
// 你需要把下面这行的 sk-xxxx 替换为你真实的 DeepSeek API Key
process.env.DEEPSEEK_API_KEY = "REDACTED_PURGED_FROM_GIT_HISTORY"; 

// 2. 将云函数的主入口引进来
const { main } = require('./index.js');

// 3. 捏造一个假的前端请求体 (event)
const mockEvent = {
    action: 'explainVocab',
    data: {
        userId: 'test-user-123',
        vocabularyId: 'mock-vocab-1',
        thaiWord: 'สวัสดี'  // 我们测一个最经典的泰语词汇：“你好”
    }
};

// 4. 执行调用并打印结果
async function runTest() {
    console.log("🚀 开始本地模拟调用 AI Engine (Action: explainVocab)...");
    
    // 假装这个空对象是腾讯云的上下文（因为我们的代码里没用到它，传空对象即可）
    const mockContext = {}; 

    try {
        console.time("⏱️ AI 调用耗时"); // 顺便测一下 DeepSeek 返回这段内容要多久
        
        // 直接执行云函数的逻辑
        const result = await main(mockEvent, mockContext);
        
        console.timeEnd("⏱️ AI 调用耗时");
        console.log("\n✅ 调用完成，前端最终会拿到的对象结构：\n");
        
        // 用 null, 2 让 JSON 打印得带有缩进和换行，方便人类阅读
        console.log(JSON.stringify(result, null, 2)); 
        
    } catch (err) {
        console.timeEnd("⏱️ AI 调用耗时");
        console.error("\n❌ 调用在这个环节崩溃了：", err);
    }
}

// 跑起来
runTest();
````

## File: cloudbase/functions/alphabet/handlers/getAllLetters.js
````javascript
// ✅ 获取所有字母（用于前端生成测试题）
const { createResponse } = require('../utils/response');

/**
 * 获取所有字母数据
 * @param {Object} db - 数据库实例
 * @returns {Promise} 返回所有字母数据
 */
async function getAllLetters(db) {
    try {
        // 从 letters 集合获取所有字母
        const res = await db.collection('letters')
            .limit(1000) // 设置一个足够大的限制（字母总数约 80 个）
            .get();

        return createResponse(true, {
            total: res.data.length,
            letters: res.data
        }, '获取字母成功');
    } catch (error) {
        console.error('[getAllLetters] 查询失败:', error);
        return createResponse(false, null, '获取字母失败', 'DB_ERROR');
    }
}

module.exports = getAllLetters;
````

## File: cloudbase/functions/alphabet/utils/database.js
````javascript
const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

const collections = {
    users: db.collection('users'),
    vocabulary: db.collection('vocabulary'),
    letters: db.collection('letters'),
    sentences: db.collection('sentences'),
    memory_status: db.collection('memory_status'),
    user_progress: db.collection('user_progress'),
    user_vocabulary_progress: db.collection('user_vocabulary_progress')
};

module.exports = {
    db,
    _,
    userCollection: collections.users,
    vocabularyCollection: collections.vocabulary,
    letterCollection: collections.letters,
    sentenceCollection: collections.sentences,
    memoryStatusCollection: collections.memory_status,
    userProgressCollection: collections.user_progress,
    progressCollection: collections.user_vocabulary_progress,
    collections
};
````

## File: cloudbase/functions/alphabet/utils/index.js
````javascript
/**
 * Shared Utilities Package Entry Point
 * 
 * 统一导出所有共享模块
 * 使用方式: const { response, constants, sm2 } = require('@thai-app/shared');
 */

'use strict';

module.exports = {
    // 响应格式化模块
    response: require('./response'),

    // 常量定义模块
    constants: require('./constants'),

    // SM-2 算法模块
    sm2: require('./sm2'),

    // 参数验证模块
    validators: require('./validators'),

    // 统一记忆引擎模块
    memoryEngine: require('./memoryEngine'),

    // 数据库连接模块
    database: require('./database')
};
````

## File: cloudbase/functions/alphabet/utils/validators.js
````javascript
/**
 * 参数验证模块
 * 
 * 用户、词汇验证及通用验证工具
 */

'use strict';

const { userCollection, vocabularyCollection } = require('./database');
const { MasteryLevel } = require('./constants');

/**
 * 验证用户是否存在
 * 
 * @param {string} userId - 用户ID
 * @returns {Promise<Object|null>} 用户对象或 null
 */
async function validateUser(userId) {
    if (!userId || typeof userId !== 'string') {
        return null;
    }

    try {
        const { data } = await userCollection
            .where({ userId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateUser] Error:', error);
        return null;
    }
}

/**
 * 验证词汇是否存在
 * 
 * @param {string} vocabularyId - 词汇ID
 * @returns {Promise<Object|null>} 词汇对象或 null
 */
async function validateVocabulary(vocabularyId) {
    if (!vocabularyId || typeof vocabularyId !== 'string') {
        return null;
    }

    try {
        const { data } = await vocabularyCollection
            .where({ vocabularyId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateVocabulary] Error:', error);
        return null;
    }
}

/**
 * 验证掌握程度是否有效
 * 
 * @param {string} mastery - 掌握程度
 * @returns {boolean} 是否有效
 */
function isValidMastery(mastery) {
    const validValues = Object.values(MasteryLevel);
    return validValues.includes(mastery);
}

/**
 * 验证并规范化分页参数
 * 
 * @param {number} limit - 限制数量
 * @param {number} offset - 偏移量
 * @param {number} maxLimit - 最大限制 (默认100)
 * @returns {Object} 验证后的分页参数
 */
function validatePagination(limit, offset, maxLimit = 100) {
    return {
        limit: Math.min(Math.max(1, parseInt(limit) || 20), maxLimit),
        offset: Math.max(0, parseInt(offset) || 0),
    };
}

/**
 * 验证必填字符串参数
 * 
 * @param {string} value - 参数值
 * @param {string} name - 参数名 (用于错误消息)
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateRequiredString(value, name) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
        return {
            valid: false,
            error: `${name} 是必填参数且不能为空`,
        };
    }
    return { valid: true };
}

/**
 * 验证布尔参数
 * 
 * @param {any} value - 参数值
 * @param {string} name - 参数名
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateBoolean(value, name) {
    if (typeof value !== 'boolean') {
        return {
            valid: false,
            error: `${name} 必须是布尔值`,
        };
    }
    return { valid: true };
}
/**
 * 通用参数验证函数
 * 
 * @param {Object} params - 需要验证的参数对象
 * @param {Array<string>} requiredFields - 必需字段列表
 * @returns {Object} { isValid: boolean, message?: string }
 */
function validateParams(params, requiredFields) {
    const missing = [];

    for (const field of requiredFields) {
        if (params[field] === undefined || params[field] === null || params[field] === '') {
            missing.push(field);
        }
    }

    if (missing.length > 0) {
        return {
            isValid: false,
            message: `缺少必填参数: ${missing.join(', ')}`
        };
    }

    return { isValid: true };
}

module.exports = {
    validateUser,
    validateVocabulary,
    isValidMastery,
    validatePagination,
    validateRequiredString,
    validateBoolean,
    validateParams,
};
````

## File: cloudbase/functions/memory-engine/config/alphabetLessonConfig.js
````javascript
'use strict';

/**
 * Alphabet lesson & phonics rule config for backend.
 *
 * 注意：
 * - LESSON_METADATA / PHONICS_RULES 作为本地 fallback；
 * - 优先从 DB 集合 alphabet_lessons / phonics_rules 中读取，
 *   读不到或出错时再退回本地常量，避免前后端数据漂移。
 */

// ==================== Lesson Metadata (7 课) - 本地备份 ====================

const LESSON_METADATA = {
  lesson1: {
    lessonId: 'lesson1',
    title: '第一课:基础拼读能力',
    description: '掌握最基础的中辅音和常见元音,建立CV拼读概念',
    consonants: ['ก', 'ด', 'ต', 'น', 'ม'],
    vowels: ['า', 'ะ', 'ิ'],
    tones: [],
    phonicsRuleId: 'rule_1_cv_structure',
    totalCount: 8,
    minPassRate: 0.95,
    miniReviewInterval: 3,
    order: 1,
  },

  lesson2: {
    lessonId: 'lesson2',
    title: '第二课:前置元音系统',
    description: '学习前置元音(เ แ โ)和更多高频辅音',
    consonants: ['บ', 'ป', 'ร', 'ล', 'ว', 'ย'],
    vowels: ['เ', 'แ', 'โ', 'อ'],
    tones: [],
    phonicsRuleId: 'rule_2_leading_vowel',
    totalCount: 10,
    minPassRate: 0.9,
    miniReviewInterval: 3,
    order: 2,
  },

  lesson3: {
    lessonId: 'lesson3',
    title: '第三课:声调入门',
    description: '掌握送气/不送气对比,引入基础声调系统',
    consonants: ['ข', 'ถ', 'ผ', 'ส', 'ห'],
    vowels: ['ะ', 'ุ', 'ู'],
    tones: ['่', '้'],
    phonicsRuleId: 'rule_3_tone_basics',
    totalCount: 10,
    minPassRate: 0.9,
    miniReviewInterval: 3,
    order: 3,
  },

  lesson4: {
    lessonId: 'lesson4',
    title: '第四课:辅音类与声调',
    description: '理解高/中/低辅音对声调的影响,掌握完整声调系统',
    consonants: ['ค', 'ท', 'พ', 'ช', 'จ', 'ง'],
    vowels: ['ไ', 'ใ', 'เอา', 'อำ'],
    tones: ['๊', '๋'],
    phonicsRuleId: 'rule_4_consonant_class_tones',
    totalCount: 12,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 4,
  },

  lesson5: {
    lessonId: 'lesson5',
    title: '第五课:复合元音系统',
    description: '掌握三合元音(เอีย เอือ อัว)等复杂元音组合',
    consonants: ['ซ', 'ฉ', 'ฝ', 'ฟ', 'ศ', 'ษ', 'ฮ', 'อ'],
    vowels: ['เอีย', 'เอือ', 'อัว', 'เออ', 'ื', 'ึ'],
    tones: [],
    phonicsRuleId: 'rule_5_compound_vowels',
    totalCount: 14,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 5,
  },

  lesson6: {
    lessonId: 'lesson6',
    title: '第六课:完整覆盖(常用进阶)',
    description: '补充常用进阶辅音与复合元音,掌握特殊规则(如 ห นำ 等)',
    consonants: ['ฑ', 'ฒ', 'ณ', 'ภ', 'ธ', 'ฌ', 'ญ', 'ฬ', 'ฎ', 'ฏ', 'ฐ'],
    vowels: ['อาย', 'อุย', 'เอย', 'โอย', 'ออย'],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 19,
    minPassRate: 0.9,
    miniReviewInterval: 4,
    order: 6,
  },

  lesson7: {
    lessonId: 'lesson7',
    title: '第七课:罕用字母与特殊元音',
    description: '集中学习现代泰语中较少使用的辅音与复杂元音,用于阅读古文与特殊专有名词',
    consonants: ['ฃ', 'ฅ'],
    vowels: ['ฤ', 'ฤๅ', 'ฦ', 'ฦๅ', 'แอะ', 'โอะ', 'เอะ', 'เอาะ'],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 10,
    minPassRate: 0.8,
    miniReviewInterval: 4,
    order: 7,
  },
};

// ==================== Phonics Rules (6 条) - 本地备份 ====================

const PHONICS_RULES = {
  rule_1_cv_structure: {
    id: 'rule_1_cv_structure',
    lessonId: 'lesson1',
    title: '拼读规则 1: 辅音+元音',
    content: [
      '✅ 泰语音节 = 辅音(C) + 元音(V)',
      '✅ 元音可在辅音前/后/上/下',
      '✅ 例: ก + า = กา [ka:] (乌鸦)',
      '',
      '🎯 记忆口诀: 先读辅音,再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'า',
      syllable: 'กา',
      pronunciation: 'ka:',
      audioUrl:
        'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3',
    },
    duration: 30,
    order: 1,
  },

  rule_2_leading_vowel: {
    id: 'rule_2_leading_vowel',
    lessonId: 'lesson2',
    title: '拼读规则 2: 前置元音',
    content: [
      '⚠️ 写在辅音前,读在辅音后',
      '',
      '✅ เก = [ke:] 不是 [ek]',
      '✅ แม = [mɛ:] 不是 [ɛm]',
      '✅ โร = [ro:] 不是 [or]',
      '',
      '🎯 记忆口诀: 看到 เ แ โ,先读辅音再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'เ',
      syllable: 'เก',
      pronunciation: 'ke:',
      audioUrl:
        'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/syllable-ke.mp3',
    },
    duration: 30,
    order: 2,
  },

  rule_3_tone_basics: {
    id: 'rule_3_tone_basics',
    lessonId: 'lesson3',
    title: '拼读规则 3: 声调入门',
    content: [
      '🎵 泰语5个声调:',
      '  1. 中平调 ¯ (如: กา [ka:¯])',
      '  2. 低降调 ` (如: ก่า [kà:])',
      '  3. 降调 ˆ (如: ก้า [kâ:])',
      '  4. 高调 ´ (如: ก๊า [ká:])',
      '  5. 升调 ˇ (如: ก๋า [kǎ:])',
      '',
      '📌 声调由4个因素决定:',
      '  • 辅音类(高/中/低)',
      '  • 元音长短',
      '  • 声调符号(่ ้ ๊ ๋)',
      '  • 音节类型(Live/Dead)',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ'],
        ['高辅音', '´', '`', '`', 'ˆ'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 3,
  },

  rule_4_consonant_class_tones: {
    id: 'rule_4_consonant_class_tones',
    lessonId: 'lesson4',
    title: '拼读规则 4: 辅音类与声调',
    content: [
      '🔑 核心概念: 同样的元音+符号,不同辅音类 → 不同声调',
      '',
      '例: า + 无符号',
      '  • ก + า = กา [中平¯] (中辅音)',
      '  • ข + า = ขา [升调´] (高辅音)',
      '  • ค + า = คา [中平¯] (低辅音)',
      '',
      '🎯 学习策略:',
      '  1. 先记辅音类(高/中/低)',
      '  2. 再查声调表',
      '  3. 多听多练,形成直觉',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้', '๊', '๋'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ', '´', 'ˇ'],
        ['高辅音', '´', '`', '`', 'ˆ', '-', '-'],
        ['低辅音', '¯', '´', 'ˆ', '´', '-', '-'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 4,
  },

  rule_5_compound_vowels: {
    id: 'rule_5_compound_vowels',
    lessonId: 'lesson5',
    title: '拼读规则 5: 复合元音',
    content: [
      '🔗 复合元音 = 2-3个元音符号组合',
      '',
      '✅ เอีย [ia]: เ + ี + ย',
      '   例: เมีย [mia] (妻子)',
      '',
      '✅ เอือ [ɯa]: เ + ื + อ',
      '   例: เมือง [mɯaŋ] (城市)',
      '',
      '✅ อัว [ua]: ั + ว',
      '   例: ควาย [khwaːy] (水牛)',
      '',
      '📌 拼读技巧: 先读辅音,再滑过整个复合元音',
    ],
    interactiveExample: {
      consonant: 'ม',
      vowel: 'เอีย',
      syllable: 'เมีย',
      pronunciation: 'mia',
      audioUrl:
        'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-mia.mp3',
    },
    duration: 30,
    order: 5,
  },

  rule_6_special_cases: {
    id: 'rule_6_special_cases',
    lessonId: 'lesson6',
    title: '拼读规则 6: 特殊规则',
    content: [
      '🔸 ญ: 作声母读 [y],作尾音读 [n]',
      '   例: ญาติ [yâːt] (亲戚), หญิง [yǐŋ] (女人)',
      '',
      '🔸 ฤ/ฦ: 梵文专用,现代泰语少见',
      '   例: ฤดู [rɯ́dùː] (季节)',
      '',
      '🔸 ห + 低辅音: 变高调规则',
      '   例: หนู [nǔː] = ห(静音) + นู (变高调)',
      '',
      '🔸 ไ/ใ: 同音不同形,ใ仅28个词',
      '   例: ใกล้ [klây] (近), ไกล [klay] (远)',
    ],
    duration: 40,
    order: 6,
  },
};

/**
 * 从 DB 读取课程元数据，失败时回退到本地 LESSON_METADATA。
 * @param {object} db - cloud.database() 实例
 * @param {string} lessonId
 * @returns {Promise<object|null>}
 */
async function getLessonMetadataFromDb(db, lessonId) {
  if (!lessonId) return null;

  try {
    const col = db.collection('alphabet_lessons');
    const res = await col.doc(lessonId).get();
    if (res && res.data && res.data.length > 0) {
      return res.data[0];
    }
  } catch (err) {
    console.warn(
      '[alphabetLessonConfig] getLessonMetadataFromDb error:',
      lessonId,
      err && err.message,
    );
  }

  return LESSON_METADATA[lessonId] || null;
}

/**
 * 从 DB 读取某课对应的拼读规则，失败时回退到本地 PHONICS_RULES。
 * @param {object} db - cloud.database() 实例
 * @param {string} lessonId
 * @returns {Promise<object|null>}
 */
async function getPhonicsRuleByLessonFromDb(db, lessonId) {
  if (!lessonId) return null;

  try {
    const col = db.collection('phonics_rules');
    const res = await col
      .where({ lessonId })
      .limit(1)
      .get();

    if (res && res.data && res.data.length > 0) {
      return res.data[0];
    }
  } catch (err) {
    console.warn(
      '[alphabetLessonConfig] getPhonicsRuleByLessonFromDb error:',
      lessonId,
      err && err.message,
    );
  }

  const fallback = Object.values(PHONICS_RULES).find(
    (r) => r.lessonId === lessonId,
  );
  return fallback || null;
}

module.exports = {
  LESSON_METADATA,
  PHONICS_RULES,
  getLessonMetadataFromDb,
  getPhonicsRuleByLessonFromDb,
};
````

## File: cloudbase/functions/memory-engine/handlers/getAlphabetLessons.js
````javascript
'use strict';

/**
 * 获取字母课程元数据列表
 *
 * 设计目标：
 * - 作为前端「字母课程总览」页的数据源；
 * - 优先从 DB 集合 alphabet_lessons 读取，失败时回退到本地 LESSON_METADATA；
 * - 返回结构与前端 LessonMetadata 类型兼容。
 */

const { createResponse } = require('../utils/response');
const { LESSON_METADATA } = require('../config/alphabetLessonConfig');

/**
 * @param {object} db    cloud.database()
 * @param {object} params 目前未使用，预留过滤/分页
 */
async function getAlphabetLessons(db, params) {
  try {
    let lessons = [];

    try {
      const col = db.collection('alphabet_lessons');
      const res = await col.orderBy('order', 'asc').get();
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        lessons = res.data;
      }
    } catch (err) {
      console.warn('[getAlphabetLessons] DB 查询失败，将使用本地 LESSON_METADATA 作为回退:', err.message);
    }

    if (!lessons.length) {
      lessons = Object.values(LESSON_METADATA).sort(
        (a, b) => (a.order || 0) - (b.order || 0),
      );
    }

    return createResponse(true, { lessons }, '获取字母课程列表成功');
  } catch (error) {
    console.error('[getAlphabetLessons] error:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}

module.exports = getAlphabetLessons;
````

## File: cloudbase/functions/memory-engine/handlers/setDailyLimit.js
````javascript
const { createResponse } = require('../utils/response');

async function setDailyLimit(db, params) {
    const { userId, dailyLimit } = params;

    if (!userId || !dailyLimit) {
        return createResponse(false, null, '缺失userID或dailyLimit', 'MISSING_PARAMS');
    }

    try {
        const result = await db.collection('user_progress')
        .where({ userId })
        .update({
            data:{
                dailyLimit: Number(dailyLimit),
                updatedAt: new Date().toISOString()
            }
        });
        return createResponse(true, result, '设置每日学习上限成功');
    } catch (error) {
        console.error('设置每日学习上限失败:', error);
        return createResponse(false, null, '设置每日学习上限失败', 'SERVER_ERROR');
    }
}
module.exports = setDailyLimit;
````

## File: cloudbase/functions/memory-engine/utils/index.js
````javascript
/**
 * Shared Utilities Package Entry Point
 * 
 * 统一导出所有共享模块
 * 使用方式: const { response, constants, sm2 } = require('@thai-app/shared');
 */

'use strict';

module.exports = {
    // 响应格式化模块
    response: require('./response'),

    // 常量定义模块
    constants: require('./constants'),

    // SM-2 算法模块
    sm2: require('./sm2'),

    // 参数验证模块
    validators: require('./validators'),

    // 统一记忆引擎模块
    memoryEngine: require('./memoryEngine'),

    // 数据库连接模块
    database: require('./database')
};
````

## File: cloudbase/functions/shared/constants.js
````javascript
/**
 * 常量定义模块
 * 
 * 与前端 src/config/constants.ts 保持一致的设计风格
 * 集中管理所有云函数常量
 */

'use strict';

// ==================== 数据库集合名称 ====================
// 与前端 COLLECTIONS 保持一致
const COLLECTIONS = {
  USERS: 'users',
  VOCABULARY: 'vocabulary',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',
  LETTERS: 'letters',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  LETTER_TEST_BANK: 'letter_test_bank',
  COURSES: 'courses',
  LESSONS: 'lessons',
  PROGRESS: 'progress',
};

// ==================== 掌握程度 ====================
// 使用中文值，便于前端直接显示
const MasteryLevel = Object.freeze({
  UNFAMILIAR: '陌生',
  FUZZY: '模糊',
  REMEMBERED: '记得',
});

// ==================== 学习等级 ====================
// 与前端 LEVELS 保持一致
const LEVELS = Object.freeze({
  BEGINNER_A: 'BEGINNER_A',
  BEGINNER_B: 'BEGINNER_B',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
});

// ==================== SM-2 算法参数 ====================
// 优化版参数，基于艾宾浩斯遗忘曲线
const SM2_PARAMS = Object.freeze({
  INITIAL_EASINESS_FACTOR: 2.5,   // 初始简易度
  MIN_EASINESS_FACTOR: 1.3,       // 最小简易度
  MAX_INTERVAL_DAYS: 180,         // 最大间隔（天）
  FUZZY_MULTIPLIER: 0.8,          // "模糊"时间隔缩短比例
});

// ==================== 早期复习间隔序列 ====================
// 基于艾宾浩斯遗忘曲线优化: 1→2→4→7→14 天
const EARLY_INTERVALS = Object.freeze([1, 2, 4, 7, 14]);

// ==================== 每日学习配置 ====================
const DAILY_LEARNING_CONFIG = Object.freeze({
  MAX_NEW_WORDS: 10,              // 每日新词上限
  MAX_REVIEW_WORDS: 20,           // 每日复习上限
  TOTAL_WORDS_LIMIT: 30,          // 每日总词数上限
});

// ==================== 错误码 ====================
// 统一错误码定义
const ErrorCodes = Object.freeze({
  SUCCESS: 'SUCCESS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VOCABULARY_NOT_FOUND: 'VOCABULARY_NOT_FOUND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  INVALID_MASTERY: 'INVALID_MASTERY',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  SERVER_ERROR: 'SERVER_ERROR',
});

// ==================== 错误消息 ====================
// 与前端 ERROR_MESSAGES 风格一致
const ERROR_MESSAGES = Object.freeze({
  USER_NOT_FOUND: '用户不存在，请检查用户ID或重新登录',
  VOCABULARY_NOT_FOUND: '词汇不存在，请检查词汇ID',
  INVALID_PARAMS: '参数格式错误，请检查输入',
  INVALID_MASTERY: '无效的掌握程度，允许值: 陌生/模糊/记得',
  UNKNOWN_ACTION: '未知操作类型',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
});

// ==================== 支持的 Actions ====================
const SUPPORTED_ACTIONS = Object.freeze([
  'getTodayWords',
  'updateMastery',
  'toggleSkipWord',
  'getVocabularyDetail',
  'getReviewStatistics',
  'getVocabularyList',
  'getSkippedWords',
  'getLetterTest',
  'submitLetterTest',
  'passLetterTest',
  'getTodayMemories',
  'submitMemoryResult',
  'checkModuleAccess',
  'getUserProgress'
]);

module.exports = {
  // 集合
  COLLECTIONS,

  // 枚举
  MasteryLevel,
  LEVELS,
  ErrorCodes,

  // 算法参数
  SM2_PARAMS,
  EARLY_INTERVALS,

  // 配置
  DAILY_LEARNING_CONFIG,

  // 消息
  ERROR_MESSAGES,
  SUPPORTED_ACTIONS,
};
````

## File: cloudbase/functions/shared/database.js
````javascript
const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

const collections = {
    users: db.collection('users'),
    vocabulary: db.collection('vocabulary'),
    letters: db.collection('letters'),
    sentences: db.collection('sentences'),
    memory_status: db.collection('memory_status'),
    user_progress: db.collection('user_progress'),
    user_vocabulary_progress: db.collection('user_vocabulary_progress')
};

module.exports = {
    db,
    _,
    userCollection: collections.users,
    vocabularyCollection: collections.vocabulary,
    letterCollection: collections.letters,
    sentenceCollection: collections.sentences,
    memoryStatusCollection: collections.memory_status,
    userProgressCollection: collections.user_progress,
    progressCollection: collections.user_vocabulary_progress,
    collections
};
````

## File: cloudbase/functions/shared/index.js
````javascript
/**
 * Shared Utilities Package Entry Point
 * 
 * 统一导出所有共享模块
 * 使用方式: const { response, constants, sm2 } = require('@thai-app/shared');
 */

'use strict';

module.exports = {
    // 响应格式化模块
    response: require('./response'),

    // 常量定义模块
    constants: require('./constants'),

    // SM-2 算法模块
    sm2: require('./sm2'),

    // 参数验证模块
    validators: require('./validators'),

    // 统一记忆引擎模块
    memoryEngine: require('./memoryEngine'),

    // 数据库连接模块
    database: require('./database')
};
````

## File: cloudbase/functions/shared/response.js
````javascript
/**
 * 响应格式化模块
 * 
 * 统一 API 响应格式
 * 与前端 ApiResponse<T> 类型定义保持一致
 */

'use strict';

const { ErrorCodes, ERROR_MESSAGES } = require('./constants');

/**
 * 创建标准化 API 响应
 * 
 * 对应前端类型:
 * interface ApiResponse<T> {
 *   success: boolean;
 *   data?: T;
 *   message?: string;
 *   errorCode?: string;
 *   timestamp: string;
 * }
 * 
 * @param {boolean} success - 是否成功
 * @param {Object} data - 返回数据
 * @param {string} message - 提示消息
 * @param {string} errorCode - 错误码
 * @returns {Object} 标准化响应对象
 */
function createResponse(success, data = null, message = '', errorCode = null) {
  return {
    success,
    data,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建成功响应
 * 
 * @param {Object} data - 返回数据
 * @param {string} message - 成功消息
 * @returns {Object} 成功响应对象
 */
function successResponse(data, message = '操作成功') {
  return createResponse(true, data, message, null);
}

/**
 * 创建错误响应
 * 
 * @param {string} errorCode - 错误码 (来自 ErrorCodes)
 * @param {string} customMessage - 自定义消息 (可选)
 * @returns {Object} 错误响应对象
 */
function errorResponse(errorCode, customMessage = null) {
  const message = customMessage || ERROR_MESSAGES[errorCode] || '未知错误';
  return createResponse(false, null, message, errorCode);
}

/**
 * 创建参数错误响应
 * 
 * @param {string} detail - 错误详情
 * @returns {Object} 错误响应对象
 */
function invalidParamsResponse(detail) {
  return errorResponse(ErrorCodes.INVALID_PARAMS, detail);
}

/**
 * 创建用户不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function userNotFoundResponse() {
  return errorResponse(ErrorCodes.USER_NOT_FOUND);
}

/**
 * 创建词汇不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function vocabularyNotFoundResponse() {
  return errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
}

/**
 * 创建服务器错误响应
 * 
 * @param {Error} error - 错误对象
 * @returns {Object} 错误响应对象
 */
function serverErrorResponse(error) {
  // 生产环境不暴露错误详情
  const message = process.env.NODE_ENV === 'development' 
    ? `服务器错误: ${error.message}`
    : ERROR_MESSAGES.SERVER_ERROR;
  
  return errorResponse(ErrorCodes.SERVER_ERROR, message);
}

module.exports = {
  createResponse,
  successResponse,
  errorResponse,
  invalidParamsResponse,
  userNotFoundResponse,
  vocabularyNotFoundResponse,
  serverErrorResponse,
};
````

## File: cloudbase/functions/shared/validators.js
````javascript
/**
 * 参数验证模块
 * 
 * 用户、词汇验证及通用验证工具
 */

'use strict';

const { userCollection, vocabularyCollection } = require('./database');
const { MasteryLevel } = require('./constants');

/**
 * 验证用户是否存在
 * 
 * @param {string} userId - 用户ID
 * @returns {Promise<Object|null>} 用户对象或 null
 */
async function validateUser(userId) {
    if (!userId || typeof userId !== 'string') {
        return null;
    }

    try {
        const { data } = await userCollection
            .where({ userId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateUser] Error:', error);
        return null;
    }
}

/**
 * 验证词汇是否存在
 * 
 * @param {string} vocabularyId - 词汇ID
 * @returns {Promise<Object|null>} 词汇对象或 null
 */
async function validateVocabulary(vocabularyId) {
    if (!vocabularyId || typeof vocabularyId !== 'string') {
        return null;
    }

    try {
        const { data } = await vocabularyCollection
            .where({ vocabularyId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateVocabulary] Error:', error);
        return null;
    }
}

/**
 * 验证掌握程度是否有效
 * 
 * @param {string} mastery - 掌握程度
 * @returns {boolean} 是否有效
 */
function isValidMastery(mastery) {
    const validValues = Object.values(MasteryLevel);
    return validValues.includes(mastery);
}

/**
 * 验证并规范化分页参数
 * 
 * @param {number} limit - 限制数量
 * @param {number} offset - 偏移量
 * @param {number} maxLimit - 最大限制 (默认100)
 * @returns {Object} 验证后的分页参数
 */
function validatePagination(limit, offset, maxLimit = 100) {
    return {
        limit: Math.min(Math.max(1, parseInt(limit) || 20), maxLimit),
        offset: Math.max(0, parseInt(offset) || 0),
    };
}

/**
 * 验证必填字符串参数
 * 
 * @param {string} value - 参数值
 * @param {string} name - 参数名 (用于错误消息)
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateRequiredString(value, name) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
        return {
            valid: false,
            error: `${name} 是必填参数且不能为空`,
        };
    }
    return { valid: true };
}

/**
 * 验证布尔参数
 * 
 * @param {any} value - 参数值
 * @param {string} name - 参数名
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateBoolean(value, name) {
    if (typeof value !== 'boolean') {
        return {
            valid: false,
            error: `${name} 必须是布尔值`,
        };
    }
    return { valid: true };
}
/**
 * 通用参数验证函数
 * 
 * @param {Object} params - 需要验证的参数对象
 * @param {Array<string>} requiredFields - 必需字段列表
 * @returns {Object} { isValid: boolean, message?: string }
 */
function validateParams(params, requiredFields) {
    const missing = [];

    for (const field of requiredFields) {
        if (params[field] === undefined || params[field] === null || params[field] === '') {
            missing.push(field);
        }
    }

    if (missing.length > 0) {
        return {
            isValid: false,
            message: `缺少必填参数: ${missing.join(', ')}`
        };
    }

    return { isValid: true };
}

module.exports = {
    validateUser,
    validateVocabulary,
    isValidMastery,
    validatePagination,
    validateRequiredString,
    validateBoolean,
    validateParams,
};
````

## File: cloudbase/functions/storage-download/index.js
````javascript
// functions/storage-download/index.js
'use strict';

const cloud = require('wx-server-sdk');
const { createResponse } = require('../shared/response'); // 复用已有工具

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

/**
 * HTTP 入口
 * event.body 可能是 string / object
 */
exports.main = async (event, context) => {
  let body;

  try {
    body =
      typeof event.body === 'string'
        ? JSON.parse(event.body)
        : event.body || {};
  } catch (err) {
    console.error('[storage-download] 解析 body 失败:', err);
    return createResponse(false, null, '请求体解析失败', 'PARSE_ERROR');
  }

  const { action } = body || {};
  if (!action) {
    return createResponse(false, null, '缺少 action 参数', 'MISSING_ACTION');
  }

  try {
    switch (action) {
      case 'getDownloadUrl':
        return await getDownloadUrl(body);
      case 'batchGetDownloadUrls':
        return await batchGetDownloadUrls(body);
      default:
        return createResponse(
          false,
          null,
          `不支持的操作: ${action}`,
          'UNSUPPORTED_ACTION',
        );
    }
  } catch (error) {
    console.error('[storage-download] 未捕获错误:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
};

/**
 * 单文件：获取临时下载链接
 * data.fileId 需是 CloudBase 的 fileID（cloud:// 开头）
 */
async function getDownloadUrl(data) {
  const { fileId, maxAge = 7200 } = data || {};

  if (!fileId) {
    return createResponse(false, null, '缺少 fileId 参数', 'INVALID_PARAMS');
  }

  try {
    const result = await cloud.getTempFileURL({
      fileList: [fileId],
      maxAge,
    });

    if (!result.fileList || result.fileList.length === 0) {
      return createResponse(false, null, '文件不存在', 'FILE_NOT_FOUND');
    }

    const fileInfo = result.fileList[0];

    if (fileInfo.status !== 0) {
      return createResponse(
        false,
        null,
        fileInfo.errmsg || '获取下载链接失败',
        'DOWNLOAD_URL_ERROR',
      );
    }

    const now = Date.now();
    return createResponse(
      true,
      {
        fileId: fileInfo.fileID,
        downloadUrl: fileInfo.tempFileURL,
        maxAge,
        expiresAt: new Date(now + maxAge * 1000).toISOString(),
      },
      '获取下载链接成功',
    );
  } catch (error) {
    console.error('[getDownloadUrl] error:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}

/**
 * 批量：获取临时下载链接（最多 50 个）
 */
async function batchGetDownloadUrls(data) {
  const { fileIds, maxAge = 7200 } = data || {};

  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    return createResponse(
      false,
      null,
      'fileIds 必须是非空数组',
      'INVALID_PARAMS',
    );
  }

  if (fileIds.length > 50) {
    return createResponse(
      false,
      null,
      '单次最多支持 50 个文件',
      'TOO_MANY_FILES',
    );
  }

  try {
    const result = await cloud.getTempFileURL({
      fileList: fileIds,
      maxAge,
    });

    const files = (result.fileList || []).map((f) => ({
      fileId: f.fileID,
      downloadUrl: f.status === 0 ? f.tempFileURL : null,
      status: f.status === 0 ? 'success' : 'failed',
      error: f.status === 0 ? null : f.errmsg,
    }));

    const success = files.filter((f) => f.status === 'success').length;
    const now = Date.now();

    return createResponse(
      true,
      {
        files,
        summary: {
          total: files.length,
          success,
          failed: files.length - success,
        },
        maxAge,
        expiresAt: new Date(now + maxAge * 1000).toISOString(),
      },
      `获取 ${success}/${files.length} 个文件下载链接成功`,
    );
  } catch (error) {
    console.error('[batchGetDownloadUrls] error:', error);
    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}
````

## File: cloudbase/functions/storage-download/package.json
````json
{
  "name": "storage-download",
  "version": "1.0.0",
  "description": "Storage download cloud function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
````

## File: cloudbase/functions/user-register/package.json
````json
{
  "name": "user-register",
  "version": "1.0.0",
  "description": "User registration cloud function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
````

## File: cloudbase/functions/user-reset-password/package.json
````json
{
  "name": "user-reset-password",
  "version": "1.0.0",
  "description": "User password reset cloud function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
````

## File: cloudbase/functions/user-update-profile/package.json
````json
{
  "name": "user-update-profile",
  "version": "1.0.0",
  "description": "User profile update cloud function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
````

## File: cloudbase/fix-cloud-functions.sh
````bash
#!/bin/bash
set -e

echo "========================================="
echo "🚀 Cloud Functions Automatic Cleanup Tool"
echo "========================================="

BASE_DIR="./cloudbase/functions"

echo ""
echo "📌 Step 1: 删除所有 node_modules 文件夹..."
find $BASE_DIR -type d -name "node_modules" -prune -exec rm -rf {} +

echo "✔ 已删除本地 node_modules"

echo ""
echo "📌 Step 2: 删除不应该上传的文件（.DS_Store、构建产物）"
find $BASE_DIR -name ".DS_Store" -delete
find $BASE_DIR -name "*.log" -delete
find $BASE_DIR -name "*.tmp" -delete
find $BASE_DIR -name "dist" -prune -exec rm -rf {} +
find $BASE_DIR -name ".turbo" -prune -exec rm -rf {} +

echo "✔ 清理完成"

echo ""
echo "📌 Step 3: 自动为每个云函数生成 package.json"

FUNCTIONS=$(find $BASE_DIR -maxdepth 1 -mindepth 1 -type d)

for FN in $FUNCTIONS; do
  if [ ! -f "$FN/index.js" ]; then
    echo "⚠️ 警告: $FN 缺少 index.js，跳过 package.json 生成"
    continue
  fi

  PKG="$FN/package.json"

  echo "📦 生成 package.json → $PKG"

  cat > "$PKG" <<EOF
{
  "name": "$(basename $FN)",
  "version": "1.0.0",
  "description": "CloudBase Function: $(basename $FN)",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "^2.10.0"
  }
}
EOF

done

echo "✔ package.json 创建完成"

echo ""
echo "📌 Step 4: 修复 cloudbaserc.json（设置 runtime & 安装依赖）"

cat > cloudbaserc.json <<EOF
{
  "functions": [
    {
      "name": "alphabet",
      "timeout": 10,
      "runtime": "Nodejs18.15",
      "installDependency": true
    },
    {
      "name": "learn-vocab",
      "timeout": 10,
      "runtime": "Nodejs18.15",
      "installDependency": true
    },
    {
      "name": "memory-engine",
      "timeout": 10,
      "runtime": "Nodejs18.15",
      "installDependency": true
    }
  ]
}
EOF

echo "✔ cloudbaserc.json 已更新"

echo ""
echo "📌 Step 5: 检查错误 require 路径（跨函数 require 会导致部署失败）"

BAD_IMPORTS=$(grep -R "\.\./shared" -n $BASE_DIR || true)

if [ -n "$BAD_IMPORTS" ]; then
  echo "❌ 检测到跨函数 require 错误:"
  echo "$BAD_IMPORTS"
  echo "❗ 请将 shared 代码复制到每个函数 utils/ 下"
else
  echo "✔ 未检测到跨函数 require"
fi

echo ""
echo "========================================="
echo "🎉  Cloud Functions Cleanup Completed!"
echo "========================================="
````

## File: cloudbase/package.json
````json
{
  "name": "cloudbase",
  "version": "1.0.0",
  "description": "",
  "main": "initAlphabetLessonsAndRules.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "wx-server-sdk": "^3.0.1"
  }
}
````

## File: scripts/getAudioJsonFromWeb.js
````javascript
(function() {
    // 1. 加载 JSZip
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.head.appendChild(script);

    setTimeout(() => {
        if (typeof JSZip === 'undefined') return alert("库加载失败");
        console.log("%c🚀 开始抓取全量音频数据...", "color: blue; font-weight: bold;");
        startScraping();
    }, 3000);

    async function startScraping() {
        const BASE_URL = "https://cdn.langeek.cn/thaik/corpus/thai/rv/BaseThai_4";
        const CATALOG_URL = `${BASE_URL}/p/O5G1e3lD7B0I2o6C9f8A4L1`;

        // A. 获取目录
        const catalogResp = await fetch(CATALOG_URL);
        const catalogData = await catalogResp.json();
        const uniqueLessons = [...new Set(catalogData.words.map(w => w.lessonNumber).filter(l => l))];
        uniqueLessons.sort((a, b) => parseFloat(a) - parseFloat(b));

        const zip = new JSZip();
        const folder = zip.folder("Audio_JSONL_Full");
        let count = 0;

        // B. 遍历课程
        for (const lessonId of uniqueLessons) {
            const bUrl = `${BASE_URL}/b/${lessonId}`;
            console.log(`⬇️ 下载第 ${lessonId} 课音频...`);

            try {
                const res = await fetch(bUrl);
                if (res.ok) {
                    const rawData = await res.json();
                    let lines = [];

                    // --- 🔥 核心修改：遍历所有分类 ---
                    // categories: words(单词), sentences(例句), dialogue(对话), cognates(同源词)
                    const categories = ['words', 'sentences', 'dialogue', 'cognates'];

                    categories.forEach(cat => {
                        const mapData = rawData[cat] || {};
                        Object.entries(mapData).forEach(([key, base64Str]) => {
                            if (typeof base64Str === 'string' && base64Str.startsWith('data:audio')) {
                                lines.push(JSON.stringify({
                                    category: cat,   // 标记分类：words, sentences...
                                    originalKey: key, // 原始Key：7_sentence_实用场景1...
                                    content: base64Str // 音频数据
                                }));
                            }
                        });
                    });
                    // -------------------------------

                    if (lines.length > 0) {
                        folder.file(`${lessonId}.json`, lines.join('\n'));
                        count++;
                    }
                }
            } catch (e) {
                console.error(e);
            }
            await new Promise(r => setTimeout(r, 200));
        }

        // C. 下载
        const content = await zip.generateAsync({type: "blob"});
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "Thai_4_Audio.zip";
        link.click();
        console.log("✅ 下载完成");
    }
})();
````

## File: scripts/getVocabJsonFromWeb.js
````javascript
//该脚本仅适用于浏览器控制台
//该脚本用于爬取网站上的json文件

(function() {
    // 1. 动态加载 JSZip 库
    console.log("%c⏳ 正在加载 JSZip 库...", "color: blue; font-weight: bold;");
    var script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    document.head.appendChild(script);

    // 2. 设置定时器，3秒后执行主逻辑
    setTimeout(function() {
        if (typeof JSZip === 'undefined') {
            console.error("❌ JSZip 加载失败，请检查网络或重新运行代码。");
            return;
        }
        console.log("%c✅ 库加载成功！3秒已到，开始执行爬取任务...", "color: green; font-weight: bold; font-size: 14px;");
        startScrapingTask();
    }, 3000);

    // 3. 主任务逻辑
    async function startScrapingTask() {
        // ================= 配置区域 =================
        const BASE_URL = "https://cdn.langeek.cn/thaik/corpus/thai/rv/BaseThai_4";
        const CATALOG_URL = `${BASE_URL}/p/O5G1e3lD7B0I2o6C9f8A4L1`;
        // ===========================================

        try {
            // A. 获取总表
            console.log("1️⃣ 正在获取课程目录...");
            const catalogResp = await fetch(CATALOG_URL);
            if (!catalogResp.ok) throw new Error(`总表获取失败: ${catalogResp.status}`);
            const catalogData = await catalogResp.json();

            // B. 提取章节号
            const rawLessons = catalogData.words.map(w => w.lessonNumber).filter(l => l);
            const uniqueLessons = [...new Set(rawLessons)];
            uniqueLessons.sort((a, b) => parseFloat(a) - parseFloat(b));

            console.log(`✅ 目录获取成功！共发现 ${uniqueLessons.length} 个课程章节。`);

            // C. 准备 ZIP
            const zip = new JSZip();
            const folder = zip.folder("Thai_Vocab_JSONL");

            // D. 循环下载并转换格式
            let successCount = 0;
            
            for (let i = 0; i < uniqueLessons.length; i++) {
                const lessonId = uniqueLessons[i];
                const jUrl = `${BASE_URL}/j/${lessonId}`;
                
                console.log(`⬇️ [${i + 1}/${uniqueLessons.length}] 正在处理第 ${lessonId} 课...`);

                try {
                    const jResp = await fetch(jUrl);
                    if (jResp.ok) {
                        const rawContent = await jResp.json(); // 先解析为对象/数组
                        
                        let jsonlContent = "";

                        // --- 核心转换逻辑：转为 JSONL (NDJSON) ---
                        if (Array.isArray(rawContent)) {
                            // 如果是数组，把每一项转为字符串，用换行符连接
                            // 效果：
                            // {"id":1, ...}
                            // {"id":2, ...}
                            jsonlContent = rawContent.map(item => JSON.stringify(item)).join('\n');
                        } else if (typeof rawContent === 'object') {
                            // 如果是单个对象，直接转字符串（或者检查是否有内部 list）
                            // 有些结构可能是 { words: [...] }，这里做个兼容
                            if (rawContent.words && Array.isArray(rawContent.words)) {
                                jsonlContent = rawContent.words.map(item => JSON.stringify(item)).join('\n');
                            } else {
                                jsonlContent = JSON.stringify(rawContent);
                            }
                        } else {
                            // 纯文本或其他
                            jsonlContent = String(rawContent);
                        }
                        // ----------------------------------------

                        // 保存文件，虽然内容是 JSONL，但后缀保持 .json (方便编辑器识别)
                        folder.file(`${lessonId}.json`, jsonlContent);
                        successCount++;
                    } else {
                        console.warn(`⚠️ 课程 ${lessonId} 下载失败 (Status: ${jResp.status})`);
                    }
                } catch (err) {
                    console.error(`❌ 课程 ${lessonId} 处理出错:`, err);
                }

                // 稍微延时，防止请求过快
                await new Promise(r => setTimeout(r, 200));
            }

            // E. 打包下载
            console.log("📦 正在打包为 ZIP...");
            const content = await zip.generateAsync({type: "blob"});
            
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "Thai_4_Vocab.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`%c🎉 全部完成！已下载 ${successCount} 个 JSONL 格式的文件。`, "color: green; font-size: 16px; font-weight: bold;");

        } catch (e) {
            console.error("❌ 发生严重错误:", e);
        }
    }
})();
````

## File: scripts/verify_vocab_logic.js
````javascript
const assert = require('assert');
const path = require('path');

// =============================================================================
// Mock Framework
// =============================================================================

// Mock DB Collection
class MockCollection {
    constructor(data = []) {
        this.data = data;
        this.filters = {};
        this.ops = [];
    }

    where(conditions) {
        this.filters = { ...this.filters, ...conditions };
        return this;
    }

    orderBy(field, order) {
        this.ops.push({ type: 'orderBy', field, order });
        return this;
    }

    limit(n) {
        this.ops.push({ type: 'limit', n });
        return this;
    }

    async get() {
        let results = [...this.data];

        // Simple filtering simulation
        if (this.filters._id && this.filters._id.$nin) {
            results = results.filter(item => !this.filters._id.$nin.includes(item._id));
        }

        if (this.filters.nextReviewAt && this.filters.nextReviewAt.$lte) {
            const now = new Date(this.filters.nextReviewAt.$lte);
            results = results.filter(item => new Date(item.nextReviewAt) <= now);
        }

        const limitOp = this.ops.find(op => op.type === 'limit');
        if (limitOp) {
            results = results.slice(0, limitOp.n);
        }

        return { data: results };
    }

    async add(doc) { return { _id: 'mock_id_' + Date.now() }; }
    async update(doc) { return { updated: 1 }; }
}

// Mock DB
const mockDb = {
    collections: {},
    command: {
        in: (arr) => ({ $in: arr }),
        nin: (arr) => ({ $nin: arr }),
        lte: (val) => ({ $lte: val }),
    },
    collection: (name) => {
        if (!mockDb.collections[name]) {
            mockDb.collections[name] = new MockCollection([]);
        }
        return mockDb.collections[name];
    },
};

// =============================================================================
// Dependency Mocks context
// =============================================================================

const Module = require('module');
const originalRequire = Module.prototype.require;

const MOCK_MEMORY_ENGINE = {
    getTodayReviewEntities: async (db, userId, entityType, limit) => {
        console.log(`[Mock] getTodayReviewEntities called with limit: ${limit}`);
        const col = db.collection('memory_status');
        const now = new Date();
        const results = col.data.filter(m =>
            m.userId === userId &&
            m.entityType === entityType &&
            new Date(m.nextReviewAt) <= now
        );
        return results.slice(0, limit);
    },
    getOrCreateMemory: async (db, userId, entityType, entityId) => {
        return {
            entityId, userId, entityType, reviewStage: 0, masteryLevel: 0
        };
    },
    checkModuleAccess: async () => ({ allowed: true, progress: { dailyLimit: 20 } })
};

const MOCK_RESPONSE = {
    createResponse: (success, data, msg) => ({ success, data, msg })
};

const MOCK_ALPHABET_CONFIG = {
    getLessonMetadataFromDb: async () => null,
    getPhonicsRuleByLessonFromDb: async () => null
};

Module.prototype.require = function (path) {
    if (path.includes('memoryEngine')) return MOCK_MEMORY_ENGINE;
    if (path.includes('response')) return MOCK_RESPONSE;
    if (path.includes('alphabetLessonConfig')) return MOCK_ALPHABET_CONFIG;
    return originalRequire.apply(this, arguments);
};

const TARGET_PATH = '/Users/liangjianyu/LearnOnThailand/ThaiLearningApp/cloudbase/functions/memory-engine/handlers/getTodayMemories.js';
const getTodayMemories = require(TARGET_PATH);

// =============================================================================
// Test Scenarios
// =============================================================================

async function runTests() {
    console.log('🧪 Starting Vocab Logic Verification...\n');

    const USER_ID = 'test_user';

    // Setup Mock Data
    const words = Array.from({ length: 50 }, (_, i) => ({
        _id: `word_${i}`,
        word: `Word ${i}`,
        meaning: `Meaning ${i}`,
        lessonNumber: i + 1
    }));

    mockDb.collections['vocabulary'] = new MockCollection(words);

    // --- Scenario 1: New Words Only (No Reviews) ---
    console.log('▶️  Test 1: New Words Only (Limit 10)');
    mockDb.collections['memory_status'] = new MockCollection([]);

    let res = await getTodayMemories(mockDb, { userId: USER_ID, entityType: 'word', limit: 10 });

    assert.strictEqual(res.success, true, 'Should succeed');

    // Logic: 10 unique items. (Interleaving may result in length > 10, that is fine)
    const uniqueIds1 = new Set(res.data.items.map(i => i._id));
    assert.strictEqual(uniqueIds1.size, 10, 'Should return exactly 10 UNIQUE items');
    assert.strictEqual(res.data.summary.newCount, 10, 'Summary newCount should be 10');
    assert.strictEqual(res.data.summary.reviewCount, 0, 'Summary reviewCount should be 0');

    console.log('✅ Passed\n');


    // --- Scenario 2: Reviews + New Words (Mixed) ---
    console.log('▶️  Test 2: Reviews (5) + New Words (Limit 10)');
    console.log('   Goal: Total Unique should be 15 (10 New + 5 Review), NOT capped at 10.');

    // Setup 5 pending reviews
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const reviews = Array.from({ length: 5 }, (_, i) => ({
        _id: `mem_${i}`,
        userId: USER_ID,
        entityType: 'word',
        entityId: `word_${i}`,
        nextReviewAt: yesterday,
        reviewStage: 1
    }));
    mockDb.collections['memory_status'] = new MockCollection(reviews);

    res = await getTodayMemories(mockDb, { userId: USER_ID, entityType: 'word', limit: 10 });

    console.log(`   Result Summary: New=${res.data.summary.newCount}, Review=${res.data.summary.reviewCount}`);

    // Verification
    if (res.data.summary.newCount === 10 && res.data.summary.reviewCount === 5) {
        console.log('✅ Logic is FIXED!');
    } else {
        console.log('❌ Logic needs fix: New Count is ' + res.data.summary.newCount + ' (Expected 10)');
    }

    console.log('\n---------------------------------------------------');
    console.log('🏁 Verification Script Complete');
}

runTests().catch(err => {
    console.error('❌ Test Suit Failed:', err);
});
````

## File: scripts/vocab.test.js
````javascript
// scripts/vocab.test.js

// Mock setup must happen before imports
// We need to handle the '@' alias if Jest doesn't pick it up automatically, 
// but assuming babel-jest with expo preset handles it. 
// If it fails, we might need a jest.config.js.

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
}));

// Mock zustand persistence
jest.mock('zustand/middleware', () => ({
    persist: (config) => (set, get, api) => config(set, get, api),
    createJSONStorage: () => ({}),
}));

// Mock Dependencies
jest.mock('../src/utils/apiClient', () => ({
    callCloudFunction: jest.fn(),
}));

jest.mock('../src/utils/audioCache', () => ({
    downloadAudioBatch: jest.fn().mockResolvedValue(undefined),
}));

// Mock vocabAudioHelper to avoid issues with platform specific code if any
jest.mock('../src/utils/vocab/vocabAudioHelper', () => ({
    resolveVocabPath: (path) => path,
}));

// Mock UserStore to provide userId
jest.mock('../src/stores/userStore', () => ({
    useUserStore: {
        getState: () => ({
            currentUser: { userId: 'mock-user-123' }
        })
    }
}));

// Imports
const { useVocabularyStore } = require('../src/stores/vocabularyStore');
const { buildVocabQueue } = require('../src/utils/vocab/buildVocabQueue');
const { callCloudFunction } = require('../src/utils/apiClient');

// Helper
const createMockItem = (id, isNew) => ({
    _id: id,
    vocabularyId: id,
    thaiWord: 'Thai ' + id,
    memoryState: { isNew, masteryLevel: 0 },
    audioPath: id + '.mp3'
});

describe('VocabularyStore Hybrid Scoring Logic (JS)', () => {
    let store;

    beforeEach(() => {
        // Reset Store State
        useVocabularyStore.setState({
            queue: [],
            currentIndex: 0,
            phase: 'IDLE',
            pendingResults: [],
            completedCount: 0,
        });
        store = useVocabularyStore.getState();
        callCloudFunction.mockClear();
    });

    test('Batching Logic: Should structure queue as Learn(5) -> Quiz(5)', () => {
        const items = Array.from({ length: 10 }, (_, i) => createMockItem(`W${i}`, false));
        // Mock response wrapper
        const response = { items, summary: { total: 10 } };
        const queue = buildVocabQueue(response);

        // Expecting 20 items total (10 Learn + 10 Quiz)
        // Batch 1 (Items 0-4):
        // 0-4 should be 'vocab-review'
        // 5-9 should be 'vocab-rev-quiz'

        expect(queue.length).toBe(20);

        const batch1Learn = queue.slice(0, 5);
        const batch1Quiz = queue.slice(5, 10);

        expect(batch1Learn.every(i => i.source === 'vocab-review')).toBe(true);
        expect(batch1Quiz.every(i => i.source === 'vocab-rev-quiz')).toBe(true);

        // Check IDs match within batch (Learn W0 -> Quiz W0)
        expect(batch1Learn[0].id).toBe('W0');
        expect(batch1Quiz[0].id).toBe('W0');
    });

    test('State Sync: markSelfRating should sync to corresponding Quiz item', () => {
        const item = createMockItem('W1', false);
        const queue = buildVocabQueue({ items: [item] }); // [Review, Quiz]
        useVocabularyStore.setState({ queue, currentIndex: 0 });

        // Mark rating
        useVocabularyStore.getState().markSelfRating(5);

        const updatedQueue = useVocabularyStore.getState().queue;
        // Current index should NOT advance immediately? 
        // Wait, implementation says "get().next()".
        expect(useVocabularyStore.getState().currentIndex).toBe(1);

        // Quiz Item (Index 1) should have selfRating=5
        expect(updatedQueue[1].selfRating).toBe(5);
    });

    // --- Scoring Matrix Scenarios ---
    const runScenario = async (mode, rating, mistakes, expectedQuality) => {
        const isNew = mode === 'New';
        const item = createMockItem('W1', isNew);
        const queue = buildVocabQueue({ items: [item] });

        // Setup: Index 1 is the Quiz item
        queue[1].selfRating = rating;

        useVocabularyStore.setState({ queue, currentIndex: 1, pendingResults: [] });

        // Simulate Mistakes
        for (let i = 0; i < mistakes; i++) {
            await useVocabularyStore.getState().submitResult(false);
        }

        // Simulate Correct
        await useVocabularyStore.getState().submitResult(true);

        const pending = useVocabularyStore.getState().pendingResults;
        expect(pending).toHaveLength(1);
        expect(pending[0].quality).toBe(expectedQuality);
    };

    test('Review: Remembered(5) + 0 Mistakes -> Perfect(5)', () => runScenario('Review', 5, 0, 5));
    test('Review: Remembered(5) + 1 Mistake  -> Good(4)', () => runScenario('Review', 5, 1, 4));
    test('Review: Remembered(5) + 2 Mistakes -> Pass(3)', () => runScenario('Review', 5, 2, 3));

    test('Review: Fuzzy(3)      + 0 Mistakes -> Pass(3)', () => runScenario('Review', 3, 0, 3));
    test('Review: Fuzzy(3)      + 1 Mistake  -> Weak(2)', () => runScenario('Review', 3, 1, 2));

    test('Review: Forgot(1)     + 0 Mistakes -> Fail(1)', () => runScenario('Review', 1, 0, 1));

    test('New: Know(5)          + 0 Mistakes -> Perfect(5)', () => runScenario('New', 5, 0, 5));
    test('New: Know(5)          + 1 Mistake  -> Good(4)', () => runScenario('New', 5, 1, 4));
    test('New: Know(5)          + 2 Mistakes -> Pass(3)', () => runScenario('New', 5, 2, 3));

    test('New: DontKnow(3)      + 0 Mistakes -> Pass(3)', () => runScenario('New', 3, 0, 3));
    test('New: DontKnow(3)      + 1 Mistake  -> Weak(2)', () => runScenario('New', 3, 1, 2));

    test('Retry Phase Logic: Errors in retry phase should NOT increment mistakeCount', async () => {
        const item = createMockItem('W1', false);
        const queue = buildVocabQueue({ items: [item] });

        // Simulate existing retry item
        const retryItem = {
            ...queue[1],
            source: 'vocab-error-retry',
            mistakeCount: 1
        };

        queue.push(retryItem);
        // Index 2 is Retry Item
        useVocabularyStore.setState({ queue, currentIndex: 2 });

        // Fail 3 times
        await useVocabularyStore.getState().submitResult(false);
        await useVocabularyStore.getState().submitResult(false);

        const currentItem = useVocabularyStore.getState().queue[2];
        expect(currentItem.mistakeCount).toBe(1); // Should stay 1
    });

    test('Deferred Submission: flushResults triggered at end of session', async () => {
        const item = createMockItem('W1', false);
        const queue = buildVocabQueue({ items: [item] });
        // Index 1 = Quiz
        useVocabularyStore.setState({ queue, currentIndex: 1, pendingResults: [] });

        await useVocabularyStore.getState().submitResult(true);

        // Expect flush
        expect(callCloudFunction).toHaveBeenCalledTimes(1);
        // Arg verification
        const callArgs = callCloudFunction.mock.calls[0];
        expect(callArgs[0]).toBe("submitMemoryResult");
        expect(callArgs[1].quality).toBeDefined();
    });

});
````

## File: src/components/common/AppLogo.tsx
````typescript
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, { Circle, Text as SvgText, Defs, LinearGradient, Stop, G } from 'react-native-svg';

export const AppLogo = () => {
    return (
        <View style={styles.logoContainer}>
            {/* 原尺寸宽高为 80x230，现缩小 50% => 40x115，viewBox 保持不变 */}
            <Svg width="40" height="115" viewBox="0 0 100 300">
                <Defs>
                    <LinearGradient id="gradR" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0.5" stopColor="#E60000" />
                        <Stop offset="0.5" stopColor="#FFEA00" />
                    </LinearGradient>
                </Defs>

                {/* T in Red Circle */}
                <G transform="translate(50, 50)">
                    <Circle cx="0" cy="0" r="45" fill="#E60000" />
                    <SvgText
                        x="0"
                        y="26"
                        fontSize="80"
                        fontWeight="bold"
                        fontFamily={Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif'}
                        fill="#FFFFFF"
                        textAnchor="middle"
                    >
                        T
                    </SvgText>
                </G>

                {/* R with split color */}
                <G transform="translate(50, 150)">
                    <SvgText
                        x="0"
                        y="35"
                        fontSize="100"
                        fontWeight="bold"
                        fontFamily={Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif'}
                        fill="url(#gradR)"
                        textAnchor="middle"
                    >
                        R
                    </SvgText>
                </G>

                {/* Y in Purple */}
                <G transform="translate(50, 250)">
                    <SvgText
                        x="0"
                        y="35"
                        fontSize="100"
                        fontWeight="bold"
                        fontFamily={Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif'}
                        fill="#7B3FF5"
                        textAnchor="middle"
                    >
                        Y
                    </SvgText>
                </G>
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
});
````

## File: src/components/common/BlurRevealer.tsx
````typescript
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
````

## File: src/components/common/Card.tsx
````typescript
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
````

## File: src/components/common/ConfettiEffect.tsx
````typescript
import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
    runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface ConfettiProps {
    onAnimationEnd?: () => void;
    x?: number;
    y?: number;
}

const PARTICLE_COUNT = 30;
const COLORS = ['#FFD700', '#FF6347', '#00CED1', '#9ACD32', '#FF69B4', '#FFA500'];

const Particle = ({ delay, onEnd, index }: { delay: number; onEnd: (i: number) => void; index: number }) => {
    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(Math.random() * 0.5 + 0.5);
    const rotation = useSharedValue(0);

    // Random destination
    const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + (Math.random() * 0.5) - 0.25;
    const distance = Math.random() * 150 + 50;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    useEffect(() => {
        x.value = withDelay(delay, withTiming(destX, { duration: 800, easing: Easing.out(Easing.exp) }));
        y.value = withDelay(delay, withTiming(destY, { duration: 800, easing: Easing.out(Easing.exp) }));
        opacity.value = withDelay(delay + 400, withTiming(0, { duration: 400 }));
        rotation.value = withDelay(delay, withTiming(Math.random() * 360, { duration: 800 }));

        // Notify completion after last particle finishes
        if (index === PARTICLE_COUNT - 1) {
            setTimeout(() => {
                runOnJS(onEnd)(index);
            }, delay + 800);
        }
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: x.value },
            { translateY: y.value },
            { scale: scale.value },
            { rotate: `${rotation.value}deg` }
        ],
        opacity: opacity.value,
        backgroundColor: COLORS[index % COLORS.length],
    }));

    return <Animated.View style={[styles.particle, animatedStyle]} />;
};

export const ConfettiEffect: React.FC<ConfettiProps> = ({ onAnimationEnd, x = width / 2, y = height / 2 }) => {
    const [finishedParticles, setFinishedParticles] = useState(0);

    const handleParticleEnd = () => {
        onAnimationEnd?.();
    };

    return (
        <Animated.View style={[styles.container, { left: x, top: y }]} pointerEvents="none">
            {[...Array(PARTICLE_COUNT)].map((_, i) => (
                <Particle
                    key={i}
                    index={i}
                    delay={Math.random() * 100}
                    onEnd={handleParticleEnd}
                />
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 0,
        height: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    particle: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});
````

## File: src/components/common/LanguageSwitcher.tsx
````typescript
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
````

## File: src/components/common/ListContainer.tsx
````typescript
import { View, Text } from "react-native";

export default function ListContainer() {
    return (
        <View>
            <Text>列表容器</Text>
        </View>
    )
}
````

## File: src/components/common/ThaiPatternBackground.tsx
````typescript
// src/components/ThaiPatternBackground.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Pattern, Rect, G, Path } from 'react-native-svg';

interface ThaiPatternBackgroundProps {
  opacity?: number;
}

export const ThaiPatternBackground: React.FC<ThaiPatternBackgroundProps> = ({
  opacity = 0.15,
}) => {
  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id="thaiElephantPattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <G transform="scale(0.4) translate(10, 10)" opacity={opacity}>
              {/* Head and Trunk */}
              <Path
                d="M 20 20 Q 10 20 10 30 Q 10 45 25 45 L 25 55 Q 20 50 15 55"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="2.5"
              />
              {/* Ear */}
              <Path
                d="M 25 25 Q 35 15 40 25 Q 40 35 30 35"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="2.5"
              />
              {/* Back and Body */}
              <Path
                d="M 25 20 Q 40 10 55 25 Q 60 40 55 50 L 55 60"
                fill="none"
                stroke="#1A1A1A"
                strokeWidth="2.5"
              />
              {/* Legs */}
              <Path d="M 25 45 L 25 60" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
              <Path d="M 45 50 L 45 60" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
            </G>
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#thaiElephantPattern)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    overflow: 'hidden',
  },
});
````

## File: src/components/learning/alphabet/AlphabetCompletionView.tsx
````typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CheckCircle, Trophy, Home } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import type { RoundEvaluationState } from '@/src/entities/types/phonicsRule.types';

interface AlphabetCompletionViewProps {
    roundEvaluation?: RoundEvaluationState;
    onFinish: () => void;
}

export function AlphabetCompletionView({
    roundEvaluation,
    onFinish,
}: AlphabetCompletionViewProps) {
    const rounds = roundEvaluation?.rounds ?? [];
    const averageAccuracy =
        rounds.reduce((acc, r) => acc + r.accuracy, 0) / (rounds.length || 1);
    const isAllPassed = rounds.every((r) => r.passed);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header / Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.iconContainer}>
                        {isAllPassed ? (
                            <Trophy size={64} color={Colors.thaiGold} strokeWidth={1.5} />
                        ) : (
                            <CheckCircle size={64} color={Colors.success} strokeWidth={1.5} />
                        )}
                    </View>

                    <Text style={styles.title}>Lesson Complete!</Text>
                    <Text style={styles.subtitle}>
                        {isAllPassed
                            ? 'Excellent work! You mastered this letter.'
                            : 'Good effort! Keep practicing to improve.'}
                    </Text>
                </View>

                {/* Stats Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Session Summary</Text>

                    {rounds.map((round) => (
                        <View key={round.roundNumber} style={styles.roundRow}>
                            <Text style={styles.roundLabel}>Round {round.roundNumber}</Text>
                            <View style={styles.statContainer}>
                                <Text
                                    style={[
                                        styles.accuracyText,
                                        { color: round.passed ? '#2A9D8F' : '#E63946' },
                                    ]}
                                >
                                    {(round.accuracy * 100).toFixed(0)}%
                                </Text>
                                <Text style={styles.statusLabel}>
                                    {round.passed ? 'PASSED' : 'RETRY'}
                                </Text>
                            </View>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Average Accuracy</Text>
                        <Text style={styles.totalValue}>{(averageAccuracy * 100).toFixed(0)}%</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Action */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.primaryButton} onPress={onFinish}>
                    <Text style={styles.primaryButtonText}>Finish Lesson</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    content: {
        padding: 24,
        paddingTop: 60,
        alignItems: 'center',
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#FFF9E6', // Light gold bg
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontFamily: Typography.playfairBold,
        fontSize: 32,
        color: Colors.ink,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 24,
    },
    card: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    cardTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.ink,
        marginBottom: 16,
        textAlign: 'left',
    },
    roundRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    roundLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
    },
    statContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    accuracyText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
    },
    statusLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 12,
        color: Colors.taupe,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
    },
    totalValue: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.thaiGold,
    },
    footer: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: Colors.paper,
    },
    primaryButton: {
        backgroundColor: Colors.ink,
        height: 56,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.white,
    },
});
````

## File: src/config/alphabet/alphabetQuestionTypes.ts
````typescript
// src/components/alphabet/alphabetQuestionTypes.ts

export type AlphabetQuestionType =
  | 'soundToLetter'   // 听音 → 选字母
  | 'letterToSound'   // 看字母 → 选发音
  | 'reading';        // 看音节/词 → 选读音（拼读）

export interface AlphabetQuestionOption {
  id: string;
  label: string;        // 展示给用户的文字（字母 or 发音）
  helper?: string;      // 可选辅助说明（如 IPA / 中文提示）
}

export interface AlphabetReviewQuestion {
  id: string;
  type: AlphabetQuestionType;
  prompt: string;
  audioUrl?: string;    // 听音题用
  mainText?: string;    // 主体展示（字母/音节/词）
  options: AlphabetQuestionOption[];
  correctOptionId: string;
  explanation?: string; // 回答后显示的拼读规则说明
}
````

## File: src/config/alphabet/phonicsRules.config.ts
````typescript
// src/config/alphabet/phonicsRules.config.ts

import type { PhonicsRule, PhonicsRuleId } from '@/src/entities/types/phonicsRule.types';

/**
 * 6课拼读规则完整配置
 * 
 * 每课一个拼读规则,在Today Learning首次进入时显示
 * 
 * @version 1.0.0
 * @see PhonicsRuleCard.tsx
 */
export const PHONICS_RULES: Record<PhonicsRuleId, PhonicsRule> = {
  /**
   * Lesson 1: 基础拼读 - CV结构
   */
  rule_1_cv_structure: {
    id: 'rule_1_cv_structure',
    lessonId: 'lesson1',
    title: '拼读规则 1: 辅音+元音',
    content: [
      '✅ 泰语音节 = 辅音(C) + 元音(V)',
      '✅ 元音可在辅音前/后/上/下',
      '✅ 例: ก + า = กา [ka:] (乌鸦)',
      '',
      '🎯 记忆口诀: 先读辅音,再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'า',
      syllable: 'กา',
      pronunciation: 'ka:',
      audioUrl: 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3',
    },
    duration: 30,
    order: 1,
  },

  /**
   * Lesson 2: 前置元音系统
   */
  rule_2_leading_vowel: {
    id: 'rule_2_leading_vowel',
    lessonId: 'lesson2',
    title: '拼读规则 2: 前置元音',
    content: [
      '⚠️ 写在辅音前,读在辅音后',
      '',
      '✅ เก = [ke:] 不是 [ek]',
      '✅ แม = [mɛ:] 不是 [ɛm]',
      '✅ โร = [ro:] 不是 [or]',
      '',
      '🎯 记忆口诀: 看到 เ แ โ,先读辅音再读元音',
    ],
    interactiveExample: {
      consonant: 'ก',
      vowel: 'เ',
      syllable: 'เก',
      pronunciation: 'ke:',
      audioUrl: 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/syllable-ke.mp3',
    },
    duration: 30,
    order: 2,
  },

  /**
   * Lesson 3: 声调系统入门
   */
  rule_3_tone_basics: {
    id: 'rule_3_tone_basics',
    lessonId: 'lesson3',
    title: '拼读规则 3: 声调入门',
    content: [
      '🎵 泰语5个声调:',
      '  1. 中平调 ¯ (如: กา [ka:¯])',
      '  2. 低降调 ` (如: ก่า [kà:])',
      '  3. 降调 ˆ (如: ก้า [kâ:])',
      '  4. 高调 ´ (如: ก๊า [ká:])',
      '  5. 升调 ˇ (如: ก๋า [kǎ:])',
      '',
      '📌 声调由4个因素决定:',
      '  • 辅音类(高/中/低)',
      '  • 元音长短',
      '  • 声调符号(่ ้ ๊ ๋)',
      '  • 音节类型(Live/Dead)',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ'],
        ['高辅音', '´', '`', '`', 'ˆ'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 3,
  },

  /**
   * Lesson 4: 辅音类与声调规则
   */
  rule_4_consonant_class_tones: {
    id: 'rule_4_consonant_class_tones',
    lessonId: 'lesson4',
    title: '拼读规则 4: 辅音类与声调',
    content: [
      '🔑 核心概念: 同样的元音+符号,不同辅音类 → 不同声调',
      '',
      '例: า + 无符号',
      '  • ก + า = กา [中平¯] (中辅音)',
      '  • ข + า = ขา [升调´] (高辅音)',
      '  • ค + า = คา [中平¯] (低辅音)',
      '',
      '🎯 学习策略:',
      '  1. 先记辅音类(高/中/低)',
      '  2. 再查声调表',
      '  3. 多听多练,形成直觉',
    ],
    visualChart: {
      columns: ['辅音类', '长+无', '短+无', '่', '้', '๊', '๋'],
      rows: [
        ['中辅音', '¯', '`', '`', 'ˆ', '´', 'ˇ'],
        ['高辅音', '´', '`', '`', 'ˆ', '-', '-'],
        ['低辅音', '¯', '´', 'ˆ', '´', '-', '-'],
      ],
      interactive: true,
    },
    duration: 45,
    order: 4,
  },

  /**
   * Lesson 5: 复合元音拼读
   */
  rule_5_compound_vowels: {
    id: 'rule_5_compound_vowels',
    lessonId: 'lesson5',
    title: '拼读规则 5: 复合元音',
    content: [
      '🔗 复合元音 = 2-3个元音符号组合',
      '',
      '✅ เอีย [ia]: เ + ี + ย',
      '   例: เมีย [mia] (妻子)',
      '',
      '✅ เอือ [ɯa]: เ + ื + อ',
      '   例: เมือง [mɯaŋ] (城市)',
      '',
      '✅ อัว [ua]: ั + ว',
      '   例: ควาย [khwaːy] (水牛)',
      '',
      '📌 拼读技巧: 先读辅音,再滑过整个复合元音',
    ],
    interactiveExample: {
      consonant: 'ม',
      vowel: 'เอีย',
      syllable: 'เมีย',
      pronunciation: 'mia',
      audioUrl: 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-mia.mp3',
    },
    duration: 30,
    order: 5,
  },

  /**
   * Lesson 6: 特殊规则汇总
   */
  rule_6_special_cases: {
    id: 'rule_6_special_cases',
    lessonId: 'lesson6',
    title: '拼读规则 6: 特殊规则',
    content: [
      '🔸 ญ: 作声母读 [y],作尾音读 [n]',
      '   例: ญาติ [yâːt] (亲戚), หญิง [yǐŋ] (女人)',
      '',
      '🔸 ฤ/ฦ: 梵文专用,现代泰语少见',
      '   例: ฤดู [rɯ́dùː] (季节)',
      '',
      '🔸 ห + 低辅音: 变高调规则',
      '   例: หนู [nǔː] = ห(静音) + นู (变高调)',
      '',
      '🔸 ไ/ใ: 同音不同形,ใ仅28个词',
      '   例: ใกล้ [klây] (近), ไกล [klay] (远)',
    ],
    duration: 40,
    order: 6,
  },
};

/**
 * 根据课程ID获取拼读规则
 */
export function getPhonicsRuleByLesson(lessonId: string): PhonicsRule | null {
  const ruleId = `rule_${lessonId.replace('lesson', '')}_` as PhonicsRuleId;
  
  const ruleMap: Record<string, PhonicsRuleId> = {
    lesson1: 'rule_1_cv_structure',
    lesson2: 'rule_2_leading_vowel',
    lesson3: 'rule_3_tone_basics',
    lesson4: 'rule_4_consonant_class_tones',
    lesson5: 'rule_5_compound_vowels',
    lesson6: 'rule_6_special_cases',
  };
  
  const actualRuleId = ruleMap[lessonId];
  return actualRuleId ? PHONICS_RULES[actualRuleId] : null;
}

/**
 * 获取所有拼读规则(按顺序)
 */
export function getAllPhonicsRules(): PhonicsRule[] {
  return Object.values(PHONICS_RULES).sort((a, b) => a.order - b.order);
}
````

## File: src/config/backend.config.ts
````typescript
// src/config/backend.config.ts

import { BackendType } from './api.endpoints';

/**
 * 后端配置
 * 
 * 🔧 切换后端只需要修改 CURRENT_BACKEND
 */

// ==================== 🔧 切换后端的地方 ====================
export const CURRENT_BACKEND: BackendType = 
  (process.env.EXPO_PUBLIC_BACKEND as BackendType) || 'cloudbase';

// 提示：在 .env 文件中设置 EXPO_PUBLIC_BACKEND=cloudbase 或 java

// ==================== 后端配置 ====================
export const BACKEND_CONFIG = {
  // CloudBase 云函数
  cloudbase: {
    name: 'CloudBase_CloudFunction',
    env: process.env.EXPO_PUBLIC_CLOUDBASE_ENV || 
         'cloud1-1gjcyrdd7ab927c6-1387301748',
    region: process.env.EXPO_PUBLIC_CLOUDBASE_REGION || 'ap-shanghai',
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 
                'https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com',
  },
  
  // Java Spring Boot
  java: {
    name: 'Java_SpringBoot',
    apiBaseUrl: process.env.EXPO_PUBLIC_JAVA_API_URL || 
                'http://localhost:8080',
    // 未来生产环境：'https://api.thailearning.com'
  },
};

// ==================== 获取当前后端配置 ====================
export function getCurrentBackendConfig() {
  return BACKEND_CONFIG[CURRENT_BACKEND];
}

// ==================== 获取 API 基础地址 ====================
export function getApiBaseUrl(): string {
  return getCurrentBackendConfig().apiBaseUrl;
}

// ==================== 获取后端名称 ====================
export function getBackendName(): string {
  return getCurrentBackendConfig().name;
}

// ==================== 判断是否为 CloudBase ====================
export function isCloudBase(): boolean {
  return CURRENT_BACKEND === 'cloudbase';
}

// ==================== 判断是否为 Java ====================
export function isJava(): boolean {
  return CURRENT_BACKEND === 'java';
}

// ==================== 打印当前配置（开发用）====================
export function logBackendInfo() {
  if (__DEV__) {
    console.log('='.repeat(50));
    console.log('🔧 当前后端配置:');
    console.log('后端类型:', CURRENT_BACKEND);
    console.log('后端名称:', getBackendName());
    console.log('API 地址:', getApiBaseUrl());
    console.log('='.repeat(50));
  }
}
````

## File: src/constants/typography.ts
````typescript
// src/constants/typography.ts
export const Typography = {
    playfairRegular: 'PlayfairDisplay_400Regular',
    playfairBold: 'PlayfairDisplay_700Bold',
    notoSerifRegular: 'NotoSerifSC_400Regular',
    notoSerifBold: 'NotoSerifSC_700Bold',
    sarabunRegular: 'Sarabun_400Regular',
    sarabunBold: 'Sarabun_700Bold',
    // Font sizes
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
    // Font weights (as string for fontWeight property)
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  } as const;
````

## File: src/dev/mocks/phonicsRule.mock.ts
````typescript
// src/dev/mocks/phonicsRule.mock.ts

import { PhonicsRule, PhonicsRuleId } from "@/src/entities/types/phonicsRule.types";

/**
 * 拼读规则 Mock 工厂
 * 包含多种场景的测试数据
 */
export const MOCK_PHONICS_RULES: Record<string, PhonicsRule> = {
    // 1. 标准场景
    standard: {
        id: "mock_rule_standard" as PhonicsRuleId,
        lessonId: "mock_lesson_1",
        title: "拼读规则 1: 辅音+元音",
        content: [
            "✅ 泰语音节 = 辅音(C) + 元音(V)",
            "✅ 元音可在辅音前/后/上/下",
            "✅ 例: ก + า = กา [ka:] (乌鸦)",
            "",
            "🎯 记忆口诀: 先读辅音,再读元音"
        ],
        interactiveExample: {
            consonant: "ก",
            vowel: "า",
            syllable: "กา",
            pronunciation: "ka:",
            audioUrl: "https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3"
        },
        duration: 30,
        order: 1
    },

    // 2. 超长文本场景 (测试 ScrollView)
    long_text: {
        id: "mock_rule_long" as PhonicsRuleId,
        lessonId: "mock_lesson_2",
        title: "非常长的规则标题测试非常长的规则标题测试非常长的规则标题测试",
        content: [
            "✅ 第一行内容",
            "✅ 第二行内容非常非常长，用来测试当文字超过一行时是否会自动换行，以及对布局的影响。",
            "✅ 第三行内容",
            "",
            "✅ 以下是重复内容，用于撑开高度测试滚动：",
            ...Array(20).fill("📝 重复的测试文本行，用于验证 ScrollView 的滚动能力是否正常工作。"),
            "",
            "🎯 结束行"
        ],
        interactiveExample: {
            consonant: "ก",
            vowel: "า",
            syllable: "กา",
            pronunciation: "ka:",
            audioUrl: "https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/word-ka.mp3"
        },
        duration: 60,
        order: 2
    },

    // 3. 无交互示例场景
    no_interactive: {
        id: "mock_rule_simple" as PhonicsRuleId,
        lessonId: "mock_lesson_3",
        title: "纯文本规则",
        content: [
            "这是一个没有下方交互按钮的规则。",
            "仅包含文本说明。",
            "用来测试布局收缩是否正常。"
        ],
        duration: 15,
        order: 3
    },

    // 4. 带有复杂图表的场景
    with_chart: {
        id: "mock_rule_chart" as PhonicsRuleId,
        lessonId: "mock_lesson_4",
        title: "声调图表规则",
        content: [
            "这也是之前引起 Crash 的复杂情况。",
            "请检查图表渲染。"
        ],
        visualChart: {
            columns: ["", "平", "二", "三", "四", "五"],
            rows: [
                ["中辅音", "-", "\\", "^", "/", "v"],
                ["高辅音", "v", "\\", "^", "(N/A)", "(N/A)"]
            ],
            interactive: true
        },
        duration: 45,
        order: 4
    }
};
````

## File: src/dev/registry.ts
````typescript
// src/dev/registry.ts

export interface PlaygroundComponent {
    id: string;
    name: string;
    category: string;
    variants: {
        id: string;
        name: string;
        mockId: string; // 对应 Mock 数据的 key
    }[];
}

export const COMPONENT_REGISTRY: PlaygroundComponent[] = [
    {
        id: 'PhonicsRuleCard',
        name: 'Phonics Rule Card',
        category: 'Learning',
        variants: [
            { id: 'standard', name: '标准场景', mockId: 'standard' },
            { id: 'long_text', name: '超长文本测试', mockId: 'long_text' },
            { id: 'no_interactive', name: '无交互示例', mockId: 'no_interactive' },
            { id: 'with_chart', name: '带图表', mockId: 'with_chart' },
        ],
    },
    // 将来可以在这里添加更多组件，如 RecoveryModal, RoundCompletionView 等
];
````

## File: src/entities/types/alphabetGameTypes.ts
````typescript
// src/entities/enum/alphabetGameTypes.ts

/**
 * Alphabet Game Type Enum
 *
 * 定义字母模块的统一题型协议
 * 按照 alphabet-module-spec.md 第6章和 PROJECT_OVERVIEW_SPEC.md 4.3节 Phase 2 要求
 *
 * 题型分为两类:
 * - 基础题型(LIGHT_GAME_TYPES): 用于三新一复(THREE_NEW_ONE_REVIEW)阶段
 * - 进阶题型(ADVANCED_GAME_TYPES): 用于 Final Review 阶段
 */
export enum AlphabetGameType {
  // ===== 基础题型 (用于三新一复) =====

  /** 听音选字 - 播放字母发音,用户从选项中选择正确的泰文字母 */
  SOUND_TO_LETTER = 'SOUND_TO_LETTER',

  /** 看字选音 - 显示泰文字母,用户从选项中选择正确的发音 */
  LETTER_TO_SOUND = 'LETTER_TO_SOUND',

  // ===== 进阶题型 (用于 Final Review) =====

  /** 辅音类别判断 - 判断字母属于高/中/低辅音 */
  CONSONANT_CLASS = 'CONSONANT_CLASS',

  /** 首辅音判断 - 判断字母的首辅音发音 */
  INITIAL_SOUND = 'INITIAL_SOUND',

  /** 尾辅音判断 - 判断字母作为尾音时的发音 */
  FINAL_SOUND = 'FINAL_SOUND',

  /** 声调计算 - 根据辅音类别+元音+声调符号计算最终声调 (占位实现) */
  TONE_CALCULATION = 'TONE_CALCULATION',

  /** 拼读数学 - 辅音+元音的拼读组合练习 (占位实现) */
  PHONICS_MATH = 'PHONICS_MATH',
}

/**
 * 题型显示名称映射
 */
export const ALPHABET_GAME_TYPE_LABELS: Record<AlphabetGameType, string> = {
  [AlphabetGameType.SOUND_TO_LETTER]: '听音选字',
  [AlphabetGameType.LETTER_TO_SOUND]: '看字选音',
  [AlphabetGameType.CONSONANT_CLASS]: '辅音类别',
  [AlphabetGameType.INITIAL_SOUND]: '首音判断',
  [AlphabetGameType.FINAL_SOUND]: '尾音判断',
  [AlphabetGameType.TONE_CALCULATION]: '声调计算',
  [AlphabetGameType.PHONICS_MATH]: '拼读数学',
};

/**
 * 题型难度等级 (1-5)
 */
export const ALPHABET_GAME_TYPE_DIFFICULTY: Record<AlphabetGameType, number> = {
  [AlphabetGameType.SOUND_TO_LETTER]: 1,
  [AlphabetGameType.LETTER_TO_SOUND]: 1,
  [AlphabetGameType.CONSONANT_CLASS]: 2,
  [AlphabetGameType.INITIAL_SOUND]: 2,
  [AlphabetGameType.FINAL_SOUND]: 3,
  [AlphabetGameType.TONE_CALCULATION]: 4,
  [AlphabetGameType.PHONICS_MATH]: 4,
};
````

## File: src/entities/types/api.types.ts
````typescript
//src/entities/types/api.types.ts
//用于API接口的类型定义，使 API 响应统一格式

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// ==================== 认证相关 ====================

//登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

//注册请求
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

//登录响应
export interface LoginResponse {
  user: {
    userId: string;
    email: string;
    displayName: string;
    role: string;
    registrationDate: string;
    avatar?: string;
  };
  token: string;
  expiresIn: number;  // Token 过期时间（秒）
}

//注册响应
export interface RegisterResponse extends LoginResponse { }

//更新用户信息请求
export interface UpdateProfileRequest {
  displayName?: string;
  avatar?: string;
  // Add other fields if needed
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message?: string;
}

// ==================== 课程相关 ====================

//获取课程列表响应
export interface GetCoursesResponse {
  courses: Array<{
    courseId: string;
    name: string;
    nameZh: string;
    description: string;
    level: string;
    isActive: boolean;
  }>;
}

//获取课程内容请求
export interface GetCourseContentRequest {
  courseId: string;
  contentType: 'alphabet' | 'vocabulary' | 'sentence' | 'article';
}

//获取课程内容响应
export interface GetCourseContentResponse {
  content: any[];  // 根据 contentType 返回不同结构
}

// ==================== 学习相关 ====================

//获取词汇请求
export interface GetVocabularyRequest {
  courseId: string;
  difficulty?: string;
}

//获取词汇响应
export interface GetVocabularyResponse {
  vocabulary: Array<{
    vocabId: string;
    thai: string;
    chinese: string;
    pronunciation: string;
    example: string;
    audioUrl?: string;
    difficulty: string;
  }>;
}

//记录学习请求
export interface RecordLearningRequest {
  contentType: 'alphabet' | 'vocabulary' | 'sentence' | 'article';
  contentId: string;
  isCorrect: boolean;
  score?: number;
}

// ==================== 进度相关 ====================

//获取进度响应
export interface GetProgressResponse {
  progressId: string;
  userId: string;
  courseId: string;
  currentLevel: string;
  completedAlphabets: number;
  completedVocabulary: number;
  completedSentences: number;
  completedArticles: number;
  totalScore: number;
  studyTime: number;
  streakDays: number;
}

// ==================== 发音评估 ====================

//发音评估请求
export interface AssessPronunciationRequest {
  audioData: string;  // Base64 编码的音频
  targetText: string;
  language: string;  // 'th' for Thai
}

//发音评估响应
export interface AssessPronunciationResponse {
  overallScore: number;
  toneScore: number;
  phonemeScore: number;
  fluencyScore: number;
  feedback: string;
  pitchData?: number[];
}

// ==================== 复习相关 ====================

//获取待复习响应
export interface GetDueReviewsResponse {
  reviews: Array<{
    scheduleId: string;
    contentType: string;
    contentId: string;
    nextReviewDate: string;
  }>;
}

//更新复习请求
export interface UpdateReviewRequest {
  scheduleId: string;
  quality: number;  // 1-5
}
````

## File: src/entities/types/course.ts
````typescript
export enum Level {
    BEGINNER_A = 'Beginner A',
    BEGINNER_B = 'Beginner B',
    INTERMEDIATE = 'Intermediate',
    ADVANCED = 'Advanced'
}

export interface Course {
    courseId: string;
    name: string;
    nameZh: string;
    level: Level;
    progress: number;
}
````

## File: src/entities/types/learning.ts
````typescript
import { Level } from './course';

export interface ReviewItem {
    id: string;
    char: string;
    phonetic: string;
    type: 'New' | 'Review' | 'Hard';
    dueIn: string;
    meaning?: string;
    category?: string;
}

export interface LearningProgress {
    progressId: string;
    userId: string;
    courseId: string;
    currentLevel: Level;
    completedAlphabets: number;
    completedVocabulary: number;
    completedSentences: number;
    completedArticles: number;
    totalScore: number;
    totalStudyTime: number;
    streakDays: number;
    lastUpdated: Date;
}
````

## File: src/entities/types/phonicsRule.types.ts
````typescript
// src/entities/types/phonicsRule.types.ts

/**
 * 拼读规则类型定义
 * 
 * 用于V3.0课程方案的拼读规则卡片系统
 * 对应PhonicsRuleCard组件
 * 
 * @version 1.0.0
 * @see thai_letter_curriculum_SRS_integrated.md
 */

import type { QuestionType } from '../enums/QuestionType.enum';

/**
 * 拼读规则ID (对应6课)
 */
export type PhonicsRuleId = 
  | 'rule_1_cv_structure'
  | 'rule_2_leading_vowel'
  | 'rule_3_tone_basics'
  | 'rule_4_consonant_class_tones'
  | 'rule_5_compound_vowels'
  | 'rule_6_special_cases';

/**
 * 拼读规则完整定义
 */
export interface PhonicsRule {
  /** 规则ID */
  id: PhonicsRuleId;
  
  /** 对应课程ID */
  lessonId: string;
  
  /** 规则标题 */
  title: string;
  
  /** 规则内容(数组,每项为一行文本) */
  content: string[];
  
  /** 交互式示例(可选) */
  interactiveExample?: {
    /** 辅音 */
    consonant: string;
    /** 元音 */
    vowel: string;
    /** 组合后的音节 */
    syllable: string;
    /** 发音 */
    pronunciation: string;
    /** 音频URL */
    audioUrl: string;
  };
  
  /** 可视化图表(可选,用于声调规则等) */
  visualChart?: {
    /** 表头 */
    columns: string[];
    /** 数据行 */
    rows: string[][];
    /** 是否可交互(点击播放音频) */
    interactive?: boolean;
  };
  
  /** 显示时长(秒) */
  duration: number;
  
  /** 排序序号 */
  order: number;
}

/**
 * 课程元数据(含拼读规则关联)
 */
export interface LessonMetadata {
  /** 课程ID */
  lessonId: string;
  
  /** 课程标题 */
  title: string;
  
  /** 课程描述 */
  description: string;
  
  /** 辅音列表 */
  consonants: string[];
  
  /** 元音列表 */
  vowels: string[];
  
  /** 声调符号列表 */
  tones: string[];
  
  /** 关联的拼读规则ID */
  phonicsRuleId: PhonicsRuleId;
  
  /** 总字母数 */
  totalCount: number;
  
  /** 最低通过率(0-1) */
  minPassRate: number;
  
  /** Mini Review触发间隔(每N个字母) */
  miniReviewInterval: number;
  
  /** 排序序号 */
  order: number;
}

/**
 * Mini Review 题目定义
 */
export interface MiniReviewQuestion {
  /** 题目ID */
  id: string;
  
  /** 题型 */
  type: QuestionType;
  
  /** 题干 */
  question: string;
  
  /** 副标题(可选) */
  subtitle?: string;
  
  /** 选项 */
  options: Array<{
    /** 选项文本 */
    label: string;
    /** 选项值 */
    value: string;
    /** 示例(可选) */
    example?: string;
  }>;
  
  /** 正确答案 */
  correct: string;
  
  /** 解释(答题后显示) */
  explanation?: string;
  
  /** 音频URL(可选) */
  audioUrl?: string;
  
  /** 声学提示(用于送气音对比等) */
  acousticHint?: {
    /** 是否送气 */
    aspirated?: boolean;
    /** 是否清音 */
    voiceless?: boolean;
    /** 辅音类 */
    class?: 'high' | 'mid' | 'low';
  };
  
  /** 音高可视化(用于声调题) */
  pitchVisualization?: {
    /** 是否启用 */
    enable: boolean;
    /** 答题后显示 */
    showAfterAnswer: boolean;
    /** 音高曲线数据 */
    curve: number[];
  };
}

/**
 * 三轮评估配置
 */
export interface RoundConfig {
  /** 总轮数 */
  totalRounds: 3;
  
  /** 通过率要求(0-1) */
  passRate: 0.90;
  
  /** 每轮最多允许的错误次数 */
  maxErrors: number;
}

/**
 * 三轮评估状态
 */
export interface RoundEvaluationState {
  /** 当前轮数(1/2/3) */
  currentRound: 1 | 2 | 3;
  
  /** 每轮的统计 */
  rounds: Array<{
    /** 轮次编号 */
    roundNumber: number;
    /** 总题数 */
    totalQuestions: number;
    /** 正确数 */
    correctCount: number;
    /** 准确率(0-1) */
    accuracy: number;
    /** 是否通过 */
    passed: boolean;
  }>;
  
  /** 是否完成所有轮次 */
  allRoundsPassed: boolean;
}

/**
 * getTodayMemories 返回的扩展数据
 * (后端需新增此字段)
 */
export interface TodayMemoriesWithMetadata {
  /** 字母列表 */
  items: any[];
  
  /** 统计信息 */
  summary: {
    total: number;
    newCount: number;
    reviewCount: number;
    entityType: string;
  };
  
  /** 新增: 课程元数据 */
  lessonMetadata?: LessonMetadata;
  
  /** 新增: 拼读规则 */
  phonicsRule?: PhonicsRule;
}

/**
 * 最小对立组(Minimal Pair)定义
 * 用于送气音对比题型
 */
export interface MinimalPairGroup {
  /** 核心字母 */
  target: string;
  
  /** 对比字母组 */
  contrasts: Array<{
    /** 字母 */
    char: string;
    /** 对比维度 */
    dimension: 'aspiration' | 'class' | 'voicing';
    /** 说明 */
    label: string;
  }>;
}

/**
 * 元音长短对(Vowel Length Pair)定义
 */
export interface VowelLengthPair {
  /** 短元音 */
  short: {
    char: string;
    duration: number; // ms
    example: string;
  };
  
  /** 长元音 */
  long: {
    char: string;
    duration: number; // ms
    example: string;
  };
}
````

## File: src/entities/types/storage.types.ts
````typescript
// src/entities/types/storage.types.ts

export interface StorageDownloadUrlRequest {
  action: 'getDownloadUrl';
  fileId: string;
  maxAge?: number;
}

export interface StorageBatchDownloadUrlRequest {
  action: 'batchGetDownloadUrls';
  fileIds: string[];
  maxAge?: number;
}

export interface StorageFileInfo {
  fileId: string;
  downloadUrl: string | null;
  status: 'success' | 'failed';
  error?: string | null;
}

export interface StorageDownloadUrlResponse {
  fileId: string;
  downloadUrl: string;
  maxAge: number;
  expiresAt: string;
}

export interface StorageBatchDownloadUrlResponse {
  files: StorageFileInfo[];
  summary: {
    total: number;
    success: number;
    failed: number;
  };
  maxAge: number;
  expiresAt: string;
}
````

## File: src/entities/types/test.types.ts
````typescript
// src/entities/types/test.types.ts

export interface TestQuestion {
  questionId: string;
  type: 'multiple_choice' | 'audio_match' | 'sequence';
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface AlphabetTest {
  testId: string;
  type: 'skip_test' | 'progress_test';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  questions: TestQuestion[];
  passingScore: number;
  timeLimit: number;
}

export interface TestResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  results: {
    questionId: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  unlocked: boolean;
  message: string;
}
````

## File: src/entities/types/user.ts
````typescript
export interface User {
    userId: string;
    email: string;
    displayName: string;
    role: 'LEARNER' | 'ADMIN';
    registrationDate: string;
    avatar?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
}

export interface ResetPasswordRequest {
    email: string;
}
````

## File: src/hooks/useModuleAccess.ts
````typescript
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
````

## File: src/hooks/useTodayStudyTime.ts
````typescript
import { useState, useEffect } from 'react';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';

/**
 * 当日学习时长（秒）→ 展示用文案
 * - < 60 分钟：显示 "X min"
 * - >= 60 分钟：显示 "X.X hrs"
 */
export function formatStudyTimeDisplay(seconds: number): { value: string; unit: string } {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) {
    return { value: String(mins), unit: 'min' };
  }
  const hrs = mins / 60;
  return { value: hrs.toFixed(1), unit: 'hrs' };
}

/**
 * 返回当日学习时长，支持实时刷新（当用户在学习页时每秒更新）
 */
export function useTodayStudyTime() {
  const getTodayStudyTimeSeconds = useLearningPreferenceStore((s) => s.getTodayStudyTimeSeconds);
  const activeSessionStart = useLearningPreferenceStore((s) => s.activeSessionStart);
  useLearningPreferenceStore((s) => s.dailyStudyTimeByDate); // 订阅：离开学习页时触发重渲染

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (activeSessionStart == null) return;
    const id = setInterval(() => forceUpdate((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [activeSessionStart]);

  const seconds = getTodayStudyTimeSeconds();
  return { seconds, ...formatStudyTimeDisplay(seconds) };
}
````

## File: src/hooks/useTtsPlayer.ts
````typescript
/**
 * TTS 播放 hook — 设备本地 expo-speech 版本
 *
 * 光标跟随（云端 TTS + 逐字时间戳）已封存，参见 git 历史。
 * 待未来有可用的国内 TTS 服务后可恢复。
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';

interface UseTtsPlayerReturn {
    ttsLoading: boolean;
    isPlaying: boolean;
    playTts: (text: string) => Promise<void>;
    stopTts: () => Promise<void>;
}

export function useTtsPlayer(): UseTtsPlayerReturn {
    const [ttsLoading, setTtsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            Speech.stop();
        };
    }, []);

    const stopTts = useCallback(async () => {
        Speech.stop();
        if (mountedRef.current) {
            setIsPlaying(false);
        }
    }, []);

    const playTts = useCallback(async (text: string) => {
        if (ttsLoading || isPlaying) {
            await stopTts();
        }

        setTtsLoading(true);

        try {
            const isSpeaking = await Speech.isSpeakingAsync();
            if (isSpeaking) Speech.stop();
        } catch { /* noop */ }

        Speech.speak(text, {
            language: 'th',
            onStart: () => {
                if (mountedRef.current) {
                    setTtsLoading(false);
                    setIsPlaying(true);
                }
            },
            onDone: () => {
                if (mountedRef.current) {
                    setIsPlaying(false);
                }
            },
            onError: () => {
                if (mountedRef.current) {
                    setTtsLoading(false);
                    setIsPlaying(false);
                }
            },
        });
    }, [ttsLoading, isPlaying, stopTts]);

    return {
        ttsLoading,
        isPlaying,
        playTts,
        stopTts,
    };
}
````

## File: src/hooks/useVocabularyLearningEngine.ts
````typescript
// src/hooks/useVocabularyLearningEngine.ts
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { VocabQueueSource } from '@/src/entities/types/vocabulary.types';
export function useVocabularyLearningEngine() {
    const { 
        queue, 
        currentIndex, 
        submitResult, 
        phase,
        totalSessionWords,
        completedCount 
    } = useVocabularyStore();
    const currentItem = queue[currentIndex] || null;
    // 计算当前应该渲染哪个组件
    const getComponentType = (): VocabQueueSource | 'loading' | 'completed' | 'idle' => {
        if (phase === 'vocab-loading') return 'loading';
        if (phase === 'vocab-completed') return 'completed';
        if (!currentItem) return 'idle';
        return currentItem.source;
    };
    return {
        // 数据
        currentItem,
        currentIndex,
        queueLength: queue.length,
        progress: totalSessionWords > 0 ? completedCount / totalSessionWords : 0,
        
        // 状态标识
        componentType: getComponentType(),
        isReview: currentItem?.source === 'vocab-review',
        isQuiz: ['vocab-rev-quiz', 'vocab-new-quiz', 'vocab-error-retry'].includes(currentItem?.source || ''),
        isNew: currentItem?.source === 'vocab-new',
        // 操作转换
        handleAnswer: (isCorrect: boolean, score?: number) => {
            submitResult(isCorrect, score);
        }
    };
}
````

## File: src/stores/storageStore.ts
````typescript
// src/stores/storageStore.ts

import { create } from 'zustand';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import type {
  StorageDownloadUrlResponse,
  StorageBatchDownloadUrlResponse,
} from '@/src/entities/types/storage.types';

interface StorageStoreState {
  isLoading: boolean;
  error: string | null;

  getDownloadUrl: (fileId: string, maxAge?: number) => Promise<string | null>;
  batchGetDownloadUrls: (
    fileIds: string[],
    maxAge?: number,
  ) => Promise<StorageBatchDownloadUrlResponse | null>;
  clearError: () => void;
}

export const useStorageStore = create<StorageStoreState>((set, get) => ({
  isLoading: false,
  error: null,

  getDownloadUrl: async (fileId: string, maxAge: number = 7200) => {
    set({ isLoading: true, error: null });
    try {
      const res = await callCloudFunction<StorageDownloadUrlResponse>(
        'getDownloadUrl',
        {
          action: 'getDownloadUrl',
          fileId,
          maxAge,
        },
        {
          endpoint: API_ENDPOINTS.STORAGE.GET_DOWNLOAD_URL.cloudbase,
        },
      );

      if (!res.success || !res.data) {
        throw new Error(res.error ?? '获取下载链接失败');
      }

      set({ isLoading: false });
      return res.data.downloadUrl;
    } catch (e: any) {
      console.error('[storageStore.getDownloadUrl] error:', e);
      set({ isLoading: false, error: e?.message ?? '获取下载链接失败' });
      return null;
    }
  },

  batchGetDownloadUrls: async (
    fileIds: string[],
    maxAge: number = 7200,
  ) => {
    set({ isLoading: true, error: null });

    if (fileIds.length > 50) {
      set({
        isLoading: false,
        error: '单次最多支持 50 个文件',
      });
      return null;
    }

    try {
      const res = await callCloudFunction<StorageBatchDownloadUrlResponse>(
        'batchGetDownloadUrls',
        {
          action: 'batchGetDownloadUrls',
          fileIds,
          maxAge,
        },
        {
          endpoint: API_ENDPOINTS.STORAGE.BATCH_GET_DOWNLOAD_URLS.cloudbase,
        },
      );

      if (!res.success || !res.data) {
        throw new Error(res.error ?? '批量获取下载链接失败');
      }

      set({ isLoading: false });
      return res.data;
    } catch (e: any) {
      console.error('[storageStore.batchGetDownloadUrls] error:', e);
      set({ isLoading: false, error: e?.message ?? '批量获取下载链接失败' });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
````

## File: src/utils/articleStorage.ts
````typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SavedArticle } from '@/src/entities/types/ai.types';

const STORAGE_KEY = 'articlePracticeList';
const CLOZE_HINTS_PREFIX = 'articlePractice_clozeHints:';

async function readAll(): Promise<SavedArticle[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedArticle[];
}

async function writeAll(articles: SavedArticle[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

/** 按时间倒序获取全部文章 */
export async function getArticles(): Promise<SavedArticle[]> {
    const list = await readAll();
    list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
}

/** 按 id 获取单篇文章，未找到返回 null */
export async function getArticleById(id: string): Promise<SavedArticle | null> {
    const list = await readAll();
    return list.find(a => a.id === id) ?? null;
}

/**
 * 保存文章到练习库（自动去重：标题 + 正文完全相同视为重复）。
 * 返回 'saved' | 'duplicate'。
 */
export async function saveArticle(article: SavedArticle): Promise<'saved' | 'duplicate'> {
    const list = await readAll();
    const isDuplicate = list.some(
        a => a.thaiText === article.thaiText && a.title === article.title,
    );
    if (isDuplicate) return 'duplicate';

    list.unshift(article);
    await writeAll(list);
    return 'saved';
}

/** 按 id 删除文章 */
export async function deleteArticle(id: string): Promise<void> {
    const list = await readAll();
    const filtered = list.filter(a => a.id !== id);
    await writeAll(filtered);
    await AsyncStorage.removeItem(CLOZE_HINTS_PREFIX + id);
}

/** 获取文章的半挖空提示词缓存，未命中返回 null */
export async function getClozeHints(articleId: string): Promise<string[] | null> {
    const raw = await AsyncStorage.getItem(CLOZE_HINTS_PREFIX + articleId);
    if (!raw) return null;
    try {
        const arr = JSON.parse(raw) as string[];
        return Array.isArray(arr) ? arr : null;
    } catch {
        return null;
    }
}

/** 缓存文章的半挖空提示词 */
export async function setClozeHints(articleId: string, keywords: string[]): Promise<void> {
    await AsyncStorage.setItem(CLOZE_HINTS_PREFIX + articleId, JSON.stringify(keywords));
}
````

## File: src/utils/lettersDistractorEngine.ts
````typescript
// src/utils/alphabet/distractorEngine.ts

import type { Letter } from '@/src/entities/types/letter.types';

export interface DistractorOptions {
  count: number;      // 干扰项数量
  pool: Letter[];     // 可用字母池（从 store 或父组件传入）
  correct: Letter;    // 正确字母
}

/**
 * 按优先级生成干扰项：
 * 1. 与正确字母 class 相同（高/中/低辅音）
 * 2. 与正确字母 initialSound 相同
 * 3. 其余字母
 */
export function generateLetterDistractors(opts: DistractorOptions): Letter[] {
  const { pool, correct, count } = opts;

  if (!pool || pool.length === 0) return [];

  const sameClass = pool.filter(
    (l) => l.class === correct.class && l._id !== correct._id,
  );

  const sameSound = pool.filter(
    (l) => l.initialSound === correct.initialSound && l._id !== correct._id,
  );

  const others = pool.filter((l) => l._id !== correct._id);

  const merged: Letter[] = [...sameClass, ...sameSound, ...others];

  // 去重
  const uniqueMap = new Map<string, Letter>();
  merged.forEach((l) => uniqueMap.set(l._id, l));

  const unique = Array.from(uniqueMap.values());

  return unique.slice(0, count);
}
````

## File: src/utils/reminderNotification.ts
````typescript
/**
 * 每日提醒通知服务（基于 Notifee）
 * 用于在指定时间弹出学习提醒
 * 注：Notifee 需 development build，Expo Go 下会静默降级
 */
import { Platform } from 'react-native';

/** 每日提醒通知固定 ID，用于更新/取消 */
export const DAILY_REMINDER_NOTIFICATION_ID = 'daily-learning-reminder';

/** 获取 Notifee 实例，Expo Go 下返回 null */
function getNotifee(): typeof import('@notifee/react-native').default | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@notifee/react-native').default;
  } catch {
    return null;
  }
}

/** 当前环境是否支持 Notifee（需 development build，Expo Go 下为 false） */
export function isReminderSupported(): boolean {
  return getNotifee() != null;
}

/**
 * 请求通知权限（iOS 必需）
 */
export async function requestReminderPermission(): Promise<boolean> {
  const notifee = getNotifee();
  if (!notifee) return false;
  if (Platform.OS !== 'ios') return true;
  try {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 2; // 2 = authorized
  } catch {
    return false;
  }
}

/**
 * 创建/更新每日定时提醒
 * @param time 提醒时间 HH:mm
 * @param title 通知标题
 * @param body 通知正文
 */
export async function scheduleDailyReminder(
  time: string,
  title: string,
  body: string
): Promise<void> {
  const notifee = getNotifee();
  if (!notifee) return;

  try {
    const { TimestampTrigger, TriggerType, RepeatFrequency, AndroidImportance } =
      require('@notifee/react-native');

    await notifee.createChannel({
      id: 'daily-reminder',
      name: '学习提醒',
      importance: AndroidImportance.HIGH,
    });

    const hasPermission = await requestReminderPermission();
    if (!hasPermission) {
      throw new Error('未获得通知权限');
    }

    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    let triggerTimestamp = date.getTime();
    if (triggerTimestamp <= Date.now()) {
      date.setDate(date.getDate() + 1);
      triggerTimestamp = date.getTime();
    }

    const trigger: typeof TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerTimestamp,
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        id: DAILY_REMINDER_NOTIFICATION_ID,
        title,
        body,
        android: {
          channelId: 'daily-reminder',
          pressAction: { id: 'default' },
        },
      },
      trigger
    );
  } catch (e) {
    if (String(e).includes('native module not found')) return;
    throw e;
  }
}

/**
 * 取消每日提醒
 */
export async function cancelDailyReminder(): Promise<void> {
  const notifee = getNotifee();
  if (!notifee) return;
  try {
    await notifee.cancelNotification(DAILY_REMINDER_NOTIFICATION_ID);
  } catch {
    // 静默忽略（如 Expo Go 下无原生模块）
  }
}
````

## File: src/utils/validation.ts
````typescript
// src/utils/validation.ts
/**
 * Frontend Validation Utilities
 * 
 * Purpose: Centralized validation logic for forms
 * Used by: All form components (Login, Register, etc.)
 * 
 * Philosophy: 
 * - Frontend validation for UX (instant feedback)
 * - Backend validation for security (trust nothing from client)
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters',
    };
  }

  // Optional: Check for password strength
  // const hasNumber = /\d/.test(password);
  // const hasLetter = /[a-zA-Z]/.test(password);
  // if (!hasNumber || !hasLetter) {
  //   return {
  //     isValid: false,
  //     error: 'Password must contain letters and numbers',
  //   };
  // }

  return { isValid: true };
}

/**
 * Validate display name
 */
export function validateDisplayName(name: string): ValidationResult {
  if (!name) {
    return {
      isValid: false,
      error: 'Display name is required',
    };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      error: 'Display name must be at least 2 characters',
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: 'Display name must be less than 50 characters',
    };
  }

  return { isValid: true };
}

/**
 * Validate password confirmation
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return { isValid: true };
}

/**
 * Validate registration form
 */
export function validateRegistrationForm(data: {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}): ValidationResult {
  // Validate display name
  const nameResult = validateDisplayName(data.displayName);
  if (!nameResult.isValid) return nameResult;

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) return emailResult;

  // Validate password
  const passwordResult = validatePassword(data.password);
  if (!passwordResult.isValid) return passwordResult;

  // Validate password match
  const matchResult = validatePasswordMatch(data.password, data.confirmPassword);
  if (!matchResult.isValid) return matchResult;

  return { isValid: true };
}

/**
 * Validate login form
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.isValid) return emailResult;

  // Validate password exists
  if (!data.password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  return { isValid: true };
}

/**
 * Real-time validation helpers for form inputs
 * Use these with onChange handlers for instant feedback
 */
export const realtimeValidators = {
  email: (email: string): string | undefined => {
    if (!email) return undefined; // Don't show error for empty field
    const result = validateEmail(email);
    return result.isValid ? undefined : result.error;
  },

  password: (password: string): string | undefined => {
    if (!password) return undefined;
    const result = validatePassword(password);
    return result.isValid ? undefined : result.error;
  },

  displayName: (name: string): string | undefined => {
    if (!name) return undefined;
    const result = validateDisplayName(name);
    return result.isValid ? undefined : result.error;
  },

  confirmPassword: (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return undefined;
    const result = validatePasswordMatch(password, confirmPassword);
    return result.isValid ? undefined : result.error;
  },
};
````

## File: .skip-template
````
2026-01-04T11:03:56.683Z
````

## File: CLAUDE.md
````markdown
# Project Development Rules (Mandatory)

This is an existing, production-oriented project with frozen specifications.
You are NOT working on a greenfield project.

Your primary responsibility is to maintain consistency and prevent structural entropy.

---
## Language Rule (Mandatory)

- All responses MUST be written in **Simplified Chinese**.
- This includes:
  - Explanations
  - Code comments
  - Commit-style summaries
  - Error analysis
- Do NOT switch languages unless explicitly requested.

## 1. Absolute Rules

- Always read and follow all Project Freeze Documents before making any change.
- Treat the current running behavior of the codebase as the source of truth.
- Do NOT design or implement features that are not explicitly requested.

---

## 2. Single Source of Truth

- Every concept must have exactly ONE authoritative definition.
- If multiple definitions exist:
  - Identify which one is currently effective
  - Mark others as deprecated
  - Do NOT create parallel systems

---

## 3. File Creation Rules

Do NOT create new files, enums, configs, or abstractions if:
- A similar concept already exists
- The task can be completed by extending an existing file

File placement rules:
- Constants → src/config/constants.ts
- API endpoints → src/config/api.endpoints.ts
- Enums → src/entities/enums/
- Types / Interfaces → src/entities/types/
- Business logic / generators → src/utils/

---

## 4. Forbidden Behaviors

- Inventing new enums when one already exists
- Duplicating configs between frontend and backend without stating authority
- Implementing future phases not active in the current release
- Refactoring by addition instead of alignment

---

## 5. Documentation Synchronization

Any change that affects:
- behavior
- data flow
- source of truth

MUST be reflected in the Project Freeze Document,
or explicitly noted as a known deviation.

---

## 6. Development Philosophy

Your goal is NOT to make the code perfect.
Your goal is to make it predictable, traceable, and consistent.

When in doubt, do less, not more.

## Mandatory Self-Check

Before writing code, you must silently verify:
- The change complies with all rules above
- No new parallel abstractions are introduced
- The change aligns with the current frozen behavior

If any rule would be violated, you must refuse and explain why.
````

## File: cloudbaserc.json
````json
{
  "envId": "{{env.ENV_ID}}",
  "functionRoot": "./functions",
  "functions": [],
  "ai": {
    "defaultAgent": "{{env.AI_DEFAULT_AGENT}}",
    "agents": {
      "codex": {
        "type": "custom",
        "baseUrl": "{{env.AI_CODEX_BASE_URL}}",
        "apiKey": "{{env.AI_CODEX_API_KEY}}",
        "model": "{{env.AI_CODEX_MODEL}}"
      }
    }
  }
}
````

## File: convert-json-to-jsonl-but-keep-json.js
````javascript
const fs = require('fs');

// ✅ 你的原始题库文件（数组格式）
const inputFile = './.json';

// ✅ 读取并解析
const raw = fs.readFileSync(inputFile, 'utf-8');
const data = JSON.parse(raw);

// ✅ 转换为 JSON Lines，但仍然输出为 .json 后缀
const output = data.map(item => JSON.stringify(item)).join('\n');

// ✅ 覆盖写回原文件（后缀不变！）
fs.writeFileSync(inputFile, output, 'utf-8');

console.log('✅ 已转换为 JSON Lines 格式（后缀仍为 .json）');
console.log('✅ 现在可以直接上传到 CloudBase 导入');
````

## File: eas.json
````json
{
  "cli": {
    "version": ">= 16.24.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
````

## File: global.css
````css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
````

## File: tailwind.config.js
````javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,jsx,ts,tsx}",
      "./src/components/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          paper: '#FAF9F6',
          ink: '#1A1A1A',
          sand: '#E5E2DB',
          taupe: '#8E8B82',
          thaiGold: '#D4AF37',
          accent: '#B8956A',
        },
      },
    },
    plugins: [],
  }
````

## File: .agent/rules/code-guide.md
````markdown
---
trigger: always_on
globs: global coding guide
---

AI Coding 协作训练规则（长期生效）】

目标：在实际项目开发中，AI 以“工程导师 + 高级代码审查者”的角色协作，持续训练用户的工程能力，而非替代其思考与决策。

一、角色定位（强制）
	•	AI 不是最终决策者、不是权威答案源
	•	AI 的默认身份是：工程导师 / 架构复盘者 / 代码审查者
	•	用户是唯一的系统设计者与最终责任人

二、协作顺序约束（强制）
	•	任何非琐碎代码任务，必须遵循：
1）用户先给出设计意图 / 约束 / 假设
2）AI 才能给出实现、方案或建议
	•	若用户直接要求“写代码”，AI 必须先反问设计与约束，或给出多方案对比而非直接实现

三、可替代与不可替代边界（强制）
	•	AI 允许直接产出的内容：
	•	样板代码、工具函数、重复性逻辑
	•	测试用例草稿
	•	已明确接口下的模块内部实现
	•	AI 不得主导的内容：
	•	架构选型
	•	模块边界划分
	•	核心状态模型
	•	性能取舍与优化决策

四、复杂度显式化规则（强制）
	•	遇到复杂问题，AI 必须主动提示并拆解复杂度来源：
	•	业务复杂度
	•	状态复杂度
	•	并发 / 性能复杂度
	•	演进复杂度
	•	不允许直接“隐藏复杂度”给出看似简洁但不可演进的方案

五、方案输出规范（强制）
	•	涉及设计或架构时，AI 至少提供 2 种方案，并明确：
	•	适用前提
	•	优点
	•	风险
	•	长期技术债

六、反依赖机制（强制）
	•	AI 需定期（或在关键模块）提示：
	•	“如果不使用 AI，你的实现思路会是什么？”
	•	“这个设计在未来变化下最脆弱的点是什么？”
	•	鼓励用户先实现，再由 AI 做 Review 与改进建议

七、性能与优化协作规则（强制）
	•	AI 只能提出性能假设与可能手段
	•	未经数据（profiling / 压测 / 指标）验证，不得直接给出“优化结论”

八、演进与复盘机制（强制）
	•	在阶段性完成后，AI 应协助进行：
	•	架构复盘
	•	技术债识别
	•	如果重来一次的设计反思

九、长期目标锚点
	•	所有协作以“提升用户在复杂约束下的工程判断与系统演进能力”为最高优先级
	•	明确目标不是写得更快，而是设计得更稳、系统跑得更久

该规则为长期有效工程协作准则，适用于用户所有项目开发场景。.
````

## File: app/(auth)/forgot-password.tsx
````typescript
// app/(auth)/forgot-password.tsx
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
import { Ionicons } from '@expo/vector-icons';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';
import { useUserStore } from '@/src/stores/userStore';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { requestPasswordReset, isLoading, error, clearError } = useUserStore();

  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

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

  const handleResetPassword = async () => {
    // Validate email
    if (!email) {
      Alert.alert(t('common.error'), 'Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t('common.error'), 'Please enter a valid email address');
      return;
    }

    // Call password reset action
    const success = await requestPasswordReset({ email: email.toLowerCase().trim() });

    if (success) {
      setIsEmailSent(true);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  // If email sent successfully, show success screen
  if (isEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <ThaiPatternBackground opacity={0.08} />

        <View style={styles.languageSwitcherContainer}>
          <LanguageSwitcher />
        </View>

        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.successSection}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={64} color={Colors.thaiGold} />
            </View>

            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              If an account exists for {email}, you will receive password reset instructions shortly.
            </Text>

            <Text style={styles.infoText}>
              Didn't receive the email? Check your spam folder or try again.
            </Text>

            <Pressable style={styles.backButton} onPress={handleBackToLogin}>
              <Text style={styles.backButtonText}>Back to Login</Text>
            </Pressable>

            <Pressable
              style={styles.resendButton}
              onPress={() => {
                setIsEmailSent(false);
                setEmail('');
              }}
            >
              <Text style={styles.resendButtonText}>Try Another Email</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // Default screen - email input
  return (
    <SafeAreaView style={styles.container}>
      <ThaiPatternBackground opacity={0.08} />

      <View style={styles.languageSwitcherContainer}>
        <LanguageSwitcher />
      </View>

      {/* Back Button */}
      <Pressable style={styles.headerBackButton} onPress={handleBackToLogin}>
        <Ionicons name="arrow-back" size={24} color={Colors.ink} />
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(500)}
            style={styles.headerSection}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed-outline" size={64} color={Colors.thaiGold} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.formSection}
          >
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
                editable={!isLoading}
              />
            </View>

            <Pressable
              style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? t('common.loading') : 'Send Reset Link'}
              </Text>
            </Pressable>

            <Pressable
              style={styles.backTextButton}
              onPress={handleBackToLogin}
              disabled={isLoading}
            >
              <Ionicons name="arrow-back" size={16} color={Colors.thaiGold} />
              <Text style={styles.backTextButtonText}>Back to Login</Text>
            </Pressable>
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
  headerBackButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
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
  resetButton: {
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
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  backTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  backTextButtonText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.thaiGold,
  },
  // Success screen styles
  successSection: {
    alignItems: 'center',
  },
  successTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  infoText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  backButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.ink,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
  },
  resendButton: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
    fontWeight: '600',
  },
});
````

## File: app/(dev)/_layout.tsx
````typescript
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';

export default function DevLayout() {
    // 🛡️ 核心安全网：生产环境直接返回 null，确保路由不可达
    if (!__DEV__) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#F5F5F5',
                },
                headerTintColor: '#333',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="playground"
                options={{
                    title: '🛠️ Playground',
                    headerLargeTitle: true,
                }}
            />
            <Stack.Screen
                name="viewer"
                options={{
                    title: 'Component Viewer',
                    presentation: 'modal', // 模态展示感觉更像独立的 Debug 环境
                }}
            />
            <Stack.Screen
                name="audio-cache-test"
                options={{
                    title: 'Audio Cache Test',
                }}
            />
        </Stack>
    );
}
````

## File: cloudbase/functions/ai-engine/handlers/explainVocab.js
````javascript
/**
 * 解释词汇
 * 
 * Action: explainVocab
 */

const { createResponse } = require('../utils/response');

async function explainVocab(client, data) {
    const { userId, vocabularyId, thaiWord, language = 'zh' } = data;

    // 将前端语言代码映射为 AI 可识别的语言名称
    const languageMap = { zh: '中文', en: 'English' };
    const targetLanguage = languageMap[language] || '中文';

    // 一句话搞定语言切换：AI 会用 targetLanguage 回应所有内容
    const systemPrompt = `You are a senior linguistics professor specializing in Thai and ${targetLanguage}. Always respond in ${targetLanguage}.`;

    const userPrompt = `
    Analyze the Thai word: "${thaiWord}"

    === STEP 1: SYLLABLE TONE ANALYSIS (do this first, silently) ===
    For EACH syllable, strictly apply the tone_determination_matrix below (derived from full_rule.json):

    A) Consonant class:
       Mid:  ก จ ฎ ฏ ด ต บ ป อ
       High: ข ฃ ฉ ฐ ถ ผ ฝ ศ ษ ส ห
       Low:  all others (ค ง ช ซ ท ธ น พ ฟ ม ย ร ล ว ฮ etc.)
       SPECIAL RULE: ห before Low Unpaired consonant (ง ญ ณ น ม ย ร ล ฬ ว) → treat as HIGH class

    B) Vowel length: SHORT (-ะ -ิ -ึ -ุ เ-ะ etc. and contracted forms -ั -็) vs LONG (-า -ี -ื etc.)

    C) Syllable type:
       Open = long vowel alone, or sonorant final (ง น ม ย ว). Sonorant finals follow OPEN rules.
       Closed(short) = short vowel with no final consonant → use SHORT column of Open matrix
       Closed(stop) = ends in stop final (ก ด บ or any letter mapped to k/t/p stop)

    D) Tone matrix — NO tone mark present:
       | Class | Open, LONG vowel | Open, SHORT vowel | Stop-final, LONG | Stop-final, SHORT |
       |-------|------------------|-------------------|------------------|-------------------|
       | Mid   | T1               | T2                | T2               | T2                |
       | High  | T5               | T2                | T2               | T2                |
       | Low   | T1               | T4                | T3               | T4                |

    E) Tone matrix — WITH tone mark (mark overrides the default above):
       | Class | ่ (mai ek) | ้ (mai tho) | ๊ (mai tri) | ๋ (mai jattawa) |
       |-------|-----------|------------|------------|----------------|
       | Mid   | T2        | T3         | T4         | T5             |
       | High  | T2        | T3         | INVALID    | INVALID        |
       | Low   | T2*       | T3         | INVALID    | INVALID        |
       (*Low + ่ valid with LONG vowels only; INVALID with short)

    === STEP 2: WRITE EXPLICIT PHONETIC SPELLING ===
    Now write each syllable using ONLY base consonants + exact tone needed, using this rule:
    - Drop ALL leading tone helpers (ห นำ, อนำ). Use the raw base consonant only.
    - Apply tone mark of the ACTUAL SPOKEN TONE directly onto the base consonant:
      · Tone 1 (mid/flat): NO mark
      · Tone 2 (falling): ไม้เอก ่
      · Tone 3 (high-falling): ไม้โท ้
      · Tone 4 (high/level): ไม้ตรี ๊
      · Tone 5 (rising): ไม้จัตวา ๋
    - Verified examples (apply the matrix above to check):
      · กา:    Mid + LONG อา + no final → Open LONG → T1 → no mark → กา [gaa1]
      · ขา:    High + LONG อา + no final → Open LONG → T5 → ๋ on ข → ข๋า [khaa5]
      · กะปิ:  ก(Mid+SHORT อะ+no final→Open SHORT→T2) + ปิ(Mid+SHORT อิ+no final→T2) → ก่ะ-ปิ่ [ga2-bi2]
      · หวัง:  ห+ว(LOW Unpaired)→ว treated as HIGH, SHORT อั (contracted อะ), sonorant ง → Open SHORT → T2 → วั่ง [wang2]

    === STEP 3: OUTPUT JSON ===
    IMPORTANT: All text values MUST be in ${targetLanguage}, except Thai word and phonetic fields.

    Return ONLY valid JSON (no Markdown, no code fences):
    {
      "vocabularyId": "${vocabularyId || ''}",
      "thaiWord": "${thaiWord}",
      "pronunciation": "<explicit phonetic spelling> [romanization with tone numbers]",
      "meaning": "<meaning in ${targetLanguage}>",
      "breakdown": "<pronunciation tone reasoning or memory aid, max 25 words, in ${targetLanguage}>",
      "extraExamples": [
        {
          "scene": "<brief scene in ${targetLanguage}>",
          "thai": "<1 Thai example sentence>",
          "chinese": "<${targetLanguage} translation>"
        }
      ]
    }
    `;

    // 发起网络请求并设置硬中断防御机制
    // 注意：JS 软超时必须 < cloudbaserc.json 里配置的函数硬超时（当前 60s）
    try {
        const TIMEOUT_MS = 50000; // 软超时 50 秒，留 10 秒余量给云函数基础设施
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`AI_TIMEOUT: Request timed out after ${TIMEOUT_MS / 1000}s`));
            }, TIMEOUT_MS);
        });

        const aiRequestPromise = client.chat.completions.create({
            model: "deepseek-chat", 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 600,  // 增大 token 上限，确保 JSON 不被截断
            temperature: 0.3  // 降低随机性，提升事实准确度
        });

        // Race: AI 返回 vs 超时，谁先触发就用谁的结果
        const completion = await Promise.race([aiRequestPromise, timeoutPromise]);
        
        const rawResult = completion.choices[0].message.content;

        // 尝试从响应中提取 JSON（防止 AI 意外包了 Markdown 代码块）
        const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error(`AI response did not contain valid JSON: ${rawResult}`);
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonMatch[0]);
        } catch (err) {
            throw new Error(`JSON parse failed: ${jsonMatch[0]}`);
        }

        return createResponse(true, parsedData, '解析成功');
        
    } catch (error) {
        console.error("[explainVocab] 请求失败或超时:", error.message);
        throw error;
    }
}

module.exports = explainVocab;
````

## File: cloudbase/functions/ai-engine/handlers/generateMicroReading.js
````javascript
/**
 * 生成微阅读短文
 *
 * Action: generateMicroReading
 *
 * 接收用户本轮勾选的词汇列表，
 * 让 AI 把这些词自然编织进一段泰文短文，附上中文辅助翻译。
 */

const { createResponse } = require('../utils/response');

async function generateMicroReading(client, data) {
    // ── 1. 解包入参 ──────────────────────────────────────────────────
    // words: [{ thaiWord: "กะปิ", meaning: "虾酱" }, ...]
    // language: 'zh' | 'en'
    const { words = [], language = 'zh' } = data;

    // 防御：没有词就不调 AI，直接报错
    if (!words || words.length === 0) {
        return createResponse(false, null, '没有选中的词汇', 'ERR_NO_WORDS');
    }

    // ── 2. 语言映射（与 explainVocab 保持一致） ───────────────────────
    const languageMap = { zh: '中文', en: 'English' };
    const targetLanguage = languageMap[language] || '中文';

    // ── 3. 把词汇列表格式化成 Prompt 可读的字符串 ──────────────────────
    // 例：["กะปิ（虾酱）", "สวัสดี（你好）"]
    const wordList = words
        .map(w => `${w.thaiWord}（${w.meaning}）`)
        .join('、');

    // ── 4. System Prompt：告诉 AI 它的角色 ────────────────────────────
    const systemPrompt = 
    `
        You are a creative Thai language teacher who writes vivid, engaging,
        natural short stories for language learners. 
        Always respond in JSON format only (no markdown, no code fences).
    `;

    // ── 5. User Prompt：精确描述任务和输出格式 ────────────────────────
    const userPrompt = 
    `
        Create a short Thai reading passage that naturally incorporates ALL of these vocabulary words:
        ${wordList}

        Requirements:
        1. Length: 80-150 Thai words (a full paragraph, NOT just 1-2 sentences, use onlyA1 level Thai vocabulary)
        2. Story type: a vivid everyday scene (market, restaurant, travel, etc.)
        3. ALL vocabulary words listed above MUST appear in the passage naturally
        4. After the Thai passage, provide a ${targetLanguage} translation paragraph by paragraph

        Return ONLY valid JSON in this exact format:
        {
        "title": "<the Thai title of the story here>",
        "thaiText": "<the full Thai passage here>",
        "translation": "<the full ${targetLanguage} translation here>",
        "wordsUsed": ["<thaiWord1>", "<thaiWord2>"]
        }
    `;

    // ── 6. 调用 AI，与 explainVocab 完全相同的防超时机制 ──────────────
    try {
        const TIMEOUT_MS = 200000; // 软超时 200 秒

        // Promise.race：AI 响应 和 倒计时 赛跑，谁先到用谁的结果
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`AI_TIMEOUT: Request timed out after ${TIMEOUT_MS / 1000}s`));
            }, TIMEOUT_MS);
        });

        const aiRequestPromise = client.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            max_tokens: 1200,   // 短文比词汇解析长，需要更多 token
            temperature: 1.3,   // 高随机性：同样的词每次生成不一样的故事
        });

        const completion = await Promise.race([aiRequestPromise, timeoutPromise]);

        const rawResult = completion.choices[0].message.content;

        // 防御：从响应中提取 JSON，防止 AI 偷偷加 Markdown 代码块
        const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error(`AI response did not contain valid JSON: ${rawResult}`);
        }

        let parsedData;
        try {
            parsedData = JSON.parse(jsonMatch[0]);
        } catch (err) {
            throw new Error(`JSON parse failed: ${jsonMatch[0]}`);
        }

        return createResponse(true, parsedData, '微阅读生成成功');

    } catch (error) {
        console.error('[generateMicroReading] 请求失败或超时:', error.message);
        throw error;
    }
}

module.exports = generateMicroReading;
````

## File: cloudbase/functions/ai-engine/package.json
````json
{
    "name": "ai-engine",
    "version": "1.0.0",
    "description": "AI Module for Thai Learning App",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "dependencies": {
        "@cloudbase/node-sdk": "^2.11.0",
        "openai": "^4.28.4"
    },
    "author": "",
    "license": "ISC"
}
````

## File: cloudbase/functions/alphabet/handlers/passLetterTest.js
````javascript
const { createResponse } = require('../utils/response');
/**
 * 标记字母测试通过
 * @param {Object} db - 数据库实例
 * @param {Object} data - 请求数据 { userId }
 */
// ✅ 记录字母测试通过状态
async function passLetterTest(db, data) {
    const { userId } = data || {};

    if (!userId) {
        return createResponse(false, null, 'userId 参数缺失', 'INVALID_PARAMS');
    }

    const now = new Date().toISOString();

    try {
        const updateResult = await db.collection('user_progress')
            .where({ userId })
            .update({
                data: {
                    letterCompleted: true,
                    letterProgress: 1,
                    updatedAt: now
                }
            });
        // 2. 如果 update 返回 0（记录不存在），则 add
        if (updateResult.stats.updated === 0) {
            console.log(`[passLetterTest] 记录不存在，正在创建...`);
            await db.collection('user_progress').add({
                data: {
                    userId,
                    letterCompleted: true,
                    letterProgress: 1,
                    letterMasteredCount: 0,
                    letterTotalCount: 44,
                    wordProgress: 0,
                    wordMasteredCount: 0,
                    wordTotalCount: 0,
                    sentenceProgress: 0,
                    sentenceMasteredCount: 0,
                    sentenceTotalCount: 0,
                    articleProgress: 0,
                    articleMasteredCount: 0,
                    articleTotalCount: 0,
                    wordUnlocked: false,
                    sentenceUnlocked: false,
                    articleUnlocked: false,
                    createdAt: now,
                    updatedAt: now
                }
            });
        }

        return createResponse(true, {
            letterCompleted: true,
            letterProgress: 1,
        }, '字母测试通过，所有模块已解锁')
    } catch (error) {
        console.error('[passLetterTest] 写入进度失败：', error);
        return createResponse(false, null, '写入进度失败', 'DB_ERROR');
    }
}

module.exports = passLetterTest;
````

## File: cloudbase/functions/alphabet/utils/memoryEngine.js
````javascript
/**
 * alphabet/utils/memoryEngine.js
 *
 * 说明：
 *  - 早期 alphabet 模块内复制了一份记忆引擎实现，和 memory-engine 下的 utils/memoryEngine 基本重复。
 *  - 为避免逻辑分叉，这里改为直接复用统一记忆引擎的实现。
 */

module.exports = require('../memory-engine/utils/memoryEngine');
````

## File: cloudbase/functions/alphabet/utils/response.js
````javascript
/**
 * 响应格式化模块
 * 
 * 统一 API 响应格式
 * 与前端 ApiResponse<T> 类型定义保持一致
 */

'use strict';

const { ErrorCodes, ERROR_MESSAGES } = require('./constants');

/**
 * 创建标准化 API 响应
 * 
 * 对应前端类型:
 * interface ApiResponse<T> {
 *   success: boolean;
 *   data?: T;
 *   message?: string;
 *   errorCode?: string;
 *   timestamp: string;
 * }
 * 
 * @param {boolean} success - 是否成功
 * @param {Object} data - 返回数据
 * @param {string} message - 提示消息
 * @param {string} errorCode - 错误码
 * @returns {Object} 标准化响应对象
 */
function createResponse(success, data = null, message = '', errorCode = null) {
  return {
    success,
    data,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建成功响应
 * 
 * @param {Object} data - 返回数据
 * @param {string} message - 成功消息
 * @returns {Object} 成功响应对象
 */
function successResponse(data, message = '操作成功') {
  return createResponse(true, data, message, null);
}

/**
 * 创建错误响应
 * 
 * @param {string} errorCode - 错误码 (来自 ErrorCodes)
 * @param {string} customMessage - 自定义消息 (可选)
 * @returns {Object} 错误响应对象
 */
function errorResponse(errorCode, customMessage = null) {
  const message = customMessage || ERROR_MESSAGES[errorCode] || '未知错误';
  return createResponse(false, null, message, errorCode);
}

/**
 * 创建参数错误响应
 * 
 * @param {string} detail - 错误详情
 * @returns {Object} 错误响应对象
 */
function invalidParamsResponse(detail) {
  return errorResponse(ErrorCodes.INVALID_PARAMS, detail);
}

/**
 * 创建用户不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function userNotFoundResponse() {
  return errorResponse(ErrorCodes.USER_NOT_FOUND);
}

/**
 * 创建词汇不存在响应
 * 
 * @returns {Object} 错误响应对象
 */
function vocabularyNotFoundResponse() {
  return errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
}

/**
 * 创建服务器错误响应
 * 
 * @param {Error} error - 错误对象
 * @returns {Object} 错误响应对象
 */
function serverErrorResponse(error) {
  // 生产环境不暴露错误详情
  const message = process.env.NODE_ENV === 'development' 
    ? `服务器错误: ${error.message}`
    : ERROR_MESSAGES.SERVER_ERROR;
  
  return errorResponse(ErrorCodes.SERVER_ERROR, message);
}

module.exports = {
  createResponse,
  successResponse,
  errorResponse,
  invalidParamsResponse,
  userNotFoundResponse,
  vocabularyNotFoundResponse,
  serverErrorResponse,
};
````

## File: cloudbase/functions/alphabet/utils/sm2.js
````javascript
/**
 * SM-2 间隔重复算法模块（优化版）
 * 
 * 基于艾宾浩斯遗忘曲线优化:
 * - 早期复习间隔更密集: 1→2→4→7→14 天
 * - "模糊"状态缩短间隔而非维持不变
 * - "陌生"状态重置复习进度
 * 
 * 算法论文: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

'use strict';

const { MasteryLevel, SM2_PARAMS, EARLY_INTERVALS } = require('./constants');

/**
 * 将掌握程度映射到 SM-2 Quality 值
 * 
 * SM-2 Quality 定义:
 * 0 - 完全不记得
 * 1 - 错误回答，但看到正确答案后想起
 * 2 - 错误回答，正确答案看起来很熟悉
 * 3 - 正确回答，但困难较大
 * 4 - 正确回答，有些犹豫
 * 5 - 正确回答，毫无困难
 * 
 * @param {string} mastery - 掌握程度
 * @returns {number} Quality值 (1-5)
 */
function masteryToQuality(mastery) {
    switch (mastery) {
        case MasteryLevel.UNFAMILIAR:
            return 1;  // 完全不记得
        case MasteryLevel.FUZZY:
            return 3;  // 有印象但不确定
        case MasteryLevel.REMEMBERED:
            return 5;  // 完全记得
        default:
            return 1;
    }
}

/**
 * 计算下次复习日期（优化版 SM-2 算法）
 * 
 * 改进点:
 * 1. 早期阶段（前5次）使用固定的渐进间隔 [1,2,4,7,14]
 * 2. "模糊"时缩短间隔而非维持不变
 * 3. "陌生"时完全重置复习进度
 * 
 * @param {string} mastery - 掌握程度: 忘记/模糊/认识
 * @param {number} currentInterval - 当前复习间隔（天）
 * @param {number} easinessFactor - 简易度因子（1.3-2.5+）
 * @param {number} reviewCount - 已复习次数
 * @returns {Object} 算法计算结果
 * 
 * @example
 * const result = calculateSM2('认识', 2, 2.5, 1);
 * // {
 * //   nextInterval: 4,
 * //   nextEasinessFactor: 2.6,
 * //   nextReviewDate: "2025-12-01T10:00:00Z",
 * //   shouldResetCount: false
 * // }
 * */
function calculateSM2(
    mastery,
    currentInterval = 1,
    easinessFactor = SM2_PARAMS.INITIAL_EASINESS_FACTOR,
    reviewCount = 0
) {
    let nextInterval = currentInterval;
    let nextEF = easinessFactor;
    let shouldResetCount = false;

    const quality = masteryToQuality(mastery);

    // ==================== 核心算法逻辑 ====================

    if (quality < 3) {
        // ========== 忘记: 完全重置 ==========
        // 用户完全不记得，需要从头开始学习
        nextInterval = 1;
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.2);
        shouldResetCount = true;

    } else if (quality === 3) {
        // ========== 模糊: 缩短间隔，加强复习 ==========
        // 改进: 不是维持不变，而是缩短20%
        nextInterval = Math.max(1, Math.round(currentInterval * SM2_PARAMS.FUZZY_MULTIPLIER));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.1);

    } else {
        // ========== 记得: 使用优化的间隔序列 ==========
        if (reviewCount < EARLY_INTERVALS.length) {
            // 早期阶段: 使用预定义的渐进间隔
            // 这是关键改进: 1→2→4→7→14 而非原版的 1→6
            nextInterval = EARLY_INTERVALS[reviewCount];
        } else {
            // 后期阶段: 使用 EF 计算指数增长
            nextInterval = Math.round(currentInterval * nextEF);
        }

        // 提高简易度 (标准 SM-2 公式)
        nextEF = nextEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF);
    }

    // 限制最大间隔
    nextInterval = Math.min(nextInterval, SM2_PARAMS.MAX_INTERVAL_DAYS);

    // 计算下次复习日期
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    // 计算新的复习次数
    const newRepetitions = shouldResetCount ? 0 : reviewCount + 1;

    return {
        // === 兼容 memoryEngine.js 的旧接口 ===
        interval: nextInterval,
        easinessFactor: parseFloat(nextEF.toFixed(2)),
        repetitions: newRepetitions,

        // === 新接口（保留供未来使用）===
        nextInterval,
        nextEasinessFactor: parseFloat(nextEF.toFixed(2)),
        nextReviewDate: nextReviewDate.toISOString(),
        shouldResetCount,
    };
}

/**
 * 生成预计复习时间线
 * 
 * 用于前端展示未来的复习计划
 * 
 * @param {number} currentReviewCount - 当前复习次数
 * @param {number} maxItems - 返回的时间线项数 (默认5)
 * @returns {Array} 未来复习计划
 * 
 * @example
 * generateReviewTimeline(2);
 * // [
 * //   { reviewNumber: 3, intervalDays: 4 },
 * //   { reviewNumber: 4, intervalDays: 7 },
 * //   { reviewNumber: 5, intervalDays: 14 },
 * //   ...
 * // ]
 */
function generateReviewTimeline(currentReviewCount, maxItems = 5) {
    const timeline = [];
    let interval = 1;
    let ef = SM2_PARAMS.INITIAL_EASINESS_FACTOR;

    for (let i = currentReviewCount; i < currentReviewCount + maxItems; i++) {
        if (i < EARLY_INTERVALS.length) {
            interval = EARLY_INTERVALS[i];
        } else {
            interval = Math.round(interval * ef);
        }
        interval = Math.min(interval, SM2_PARAMS.MAX_INTERVAL_DAYS);

        timeline.push({
            reviewNumber: i + 1,
            intervalDays: interval,
        });
    }

    return timeline;
}

/**
 * 获取今天的时间范围 (UTC)
 * 
 * @returns {Object} { startOfDay, endOfDay, timestamp }
 */
function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
    ));
    const endOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
    ));

    return {
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        timestamp: now.toISOString(),
    };
}

/**
 * 获取算法信息 (用于前端展示)
 * 
 * @returns {Object} 算法元信息
 */
function getAlgorithmInfo() {
    return {
        name: 'Optimized SM-2',
        version: '1.1.0',
        earlyIntervals: EARLY_INTERVALS,
        maxInterval: SM2_PARAMS.MAX_INTERVAL_DAYS,
        description: '基于艾宾浩斯遗忘曲线优化的间隔重复算法',
    };
}

module.exports = {
    calculateSM2,
    generateReviewTimeline,
    getTodayRange,
    getAlgorithmInfo,
    masteryToQuality,
};
````

## File: cloudbase/functions/memory-engine/utils/test_sm2.js
````javascript
/**
 * 验证 SM-2 算法对不同评分输入的处理逻辑
 * 运行方式: node test_sm2.js
 */

const { calculateSM2, masteryToQuality } = require('./sm2');
const { MasteryLevel } = require('./constants');

console.log('=== SM-2 评分逻辑测试 ===\n');

const testCases = [
    { name: '字符串输入 - 记得', input: MasteryLevel.REMEMBERED, expectedQuality: 5 },
    { name: '字符串输入 - 模糊', input: MasteryLevel.FUZZY, expectedQuality: 3 },
    { name: '字符串输入 - 陌生', input: MasteryLevel.UNFAMILIAR, expectedQuality: 1 },
    { name: '数字输入 - 5 (应该直接识别)', input: 5, expectedQuality: 5 },
    { name: '数字输入 - 3 (应该直接识别)', input: 3, expectedQuality: 3 },
    { name: '数字输入 - 1 (应该直接识别)', input: 1, expectedQuality: 1 },
    { name: '数字字符串输入 - "5"', input: "5", expectedQuality: 5 },
    { name: '边界值 - 0 (目前应映射为 1)', input: 0, expectedQuality: 1 },
    { name: '边界值 - 6 (目前应映射为 5)', input: 6, expectedQuality: 5 },
];

let passCount = 0;

testCases.forEach(tc => {
    const quality = masteryToQuality(tc.input);
    const pass = quality === tc.expectedQuality;
    if (pass) passCount++;

    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${tc.name}`);
    console.log(`    输入: ${JSON.stringify(tc.input)} (${typeof tc.input})`);
    console.log(`    输出 Quality: ${quality}`);
    console.log(`    预期 Quality: ${tc.expectedQuality}\n`);
});

console.log(`测试完成: ${passCount}/${testCases.length} 通过`);

if (passCount < testCases.length) {
    console.log('\n❌ 存在逻辑漏洞：当前算法无法正确处理数字评分输入。');
} else {
    console.log('\n✅ 算法逻辑正常。');
}
````

## File: cloudbase/functions/shared/package.json
````json
{
  "name": "@thai-app/shared",
  "version": "1.0.0",
  "description": "Shared utilities for CloudBase cloud functions",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "cloudbase",
    "shared",
    "utilities"
  ],
  "author": "Liang JianYu",
  "license": "MIT",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
````

## File: cloudbase/functions/shared/sm2.js
````javascript
/**
 * SM-2 间隔重复算法模块（优化版）
 * 
 * 基于艾宾浩斯遗忘曲线优化:
 * - 早期复习间隔更密集: 1→2→4→7→14 天
 * - "模糊"状态缩短间隔而非维持不变
 * - "陌生"状态重置复习进度
 * 
 * 算法论文: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

'use strict';

const { MasteryLevel, SM2_PARAMS, EARLY_INTERVALS } = require('./constants');

/**
 * 将掌握程度映射到 SM-2 Quality 值
 * 
 * SM-2 Quality 定义:
 * 0 - 完全不记得
 * 1 - 错误回答，但看到正确答案后想起
 * 2 - 错误回答，正确答案看起来很熟悉
 * 3 - 正确回答，但困难较大
 * 4 - 正确回答，有些犹豫
 * 5 - 正确回答，毫无困难
 * 
 * @param {string} mastery - 掌握程度
 * @returns {number} Quality值 (1-5)
 */
function masteryToQuality(mastery) {
    switch (mastery) {
        case MasteryLevel.UNFAMILIAR:
            return 1;  // 完全不记得
        case MasteryLevel.FUZZY:
            return 3;  // 有印象但不确定
        case MasteryLevel.REMEMBERED:
            return 5;  // 完全记得
        default:
            return 1;
    }
}

/**
 * 计算下次复习日期（优化版 SM-2 算法）
 * 
 * 改进点:
 * 1. 早期阶段（前5次）使用固定的渐进间隔 [1,2,4,7,14]
 * 2. "模糊"时缩短间隔而非维持不变
 * 3. "陌生"时完全重置复习进度
 * 
 * @param {string} mastery - 掌握程度: 忘记/模糊/认识
 * @param {number} currentInterval - 当前复习间隔（天）
 * @param {number} easinessFactor - 简易度因子（1.3-2.5+）
 * @param {number} reviewCount - 已复习次数
 * @returns {Object} 算法计算结果
 * 
 * @example
 * const result = calculateSM2('认识', 2, 2.5, 1);
 * // {
 * //   nextInterval: 4,
 * //   nextEasinessFactor: 2.6,
 * //   nextReviewDate: "2025-12-01T10:00:00Z",
 * //   shouldResetCount: false
 * // }
 * */
function calculateSM2(
    mastery,
    currentInterval = 1,
    easinessFactor = SM2_PARAMS.INITIAL_EASINESS_FACTOR,
    reviewCount = 0
) {
    let nextInterval = currentInterval;
    let nextEF = easinessFactor;
    let shouldResetCount = false;

    const quality = masteryToQuality(mastery);

    // ==================== 核心算法逻辑 ====================

    if (quality < 3) {
        // ========== 忘记: 完全重置 ==========
        // 用户完全不记得，需要从头开始学习
        nextInterval = 1;
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.2);
        shouldResetCount = true;

    } else if (quality === 3) {
        // ========== 模糊: 缩短间隔，加强复习 ==========
        // 改进: 不是维持不变，而是缩短20%
        nextInterval = Math.max(1, Math.round(currentInterval * SM2_PARAMS.FUZZY_MULTIPLIER));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.1);

    } else {
        // ========== 记得: 使用优化的间隔序列 ==========
        if (reviewCount < EARLY_INTERVALS.length) {
            // 早期阶段: 使用预定义的渐进间隔
            // 这是关键改进: 1→2→4→7→14 而非原版的 1→6
            nextInterval = EARLY_INTERVALS[reviewCount];
        } else {
            // 后期阶段: 使用 EF 计算指数增长
            nextInterval = Math.round(currentInterval * nextEF);
        }

        // 提高简易度 (标准 SM-2 公式)
        nextEF = nextEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF);
    }

    // 限制最大间隔
    nextInterval = Math.min(nextInterval, SM2_PARAMS.MAX_INTERVAL_DAYS);

    // 计算下次复习日期
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    // 计算新的复习次数
    const newRepetitions = shouldResetCount ? 0 : reviewCount + 1;

    return {
        // === 兼容 memoryEngine.js 的旧接口 ===
        interval: nextInterval,
        easinessFactor: parseFloat(nextEF.toFixed(2)),
        repetitions: newRepetitions,

        // === 新接口（保留供未来使用）===
        nextInterval,
        nextEasinessFactor: parseFloat(nextEF.toFixed(2)),
        nextReviewDate: nextReviewDate.toISOString(),
        shouldResetCount,
    };
}

/**
 * 生成预计复习时间线
 * 
 * 用于前端展示未来的复习计划
 * 
 * @param {number} currentReviewCount - 当前复习次数
 * @param {number} maxItems - 返回的时间线项数 (默认5)
 * @returns {Array} 未来复习计划
 * 
 * @example
 * generateReviewTimeline(2);
 * // [
 * //   { reviewNumber: 3, intervalDays: 4 },
 * //   { reviewNumber: 4, intervalDays: 7 },
 * //   { reviewNumber: 5, intervalDays: 14 },
 * //   ...
 * // ]
 */
function generateReviewTimeline(currentReviewCount, maxItems = 5) {
    const timeline = [];
    let interval = 1;
    let ef = SM2_PARAMS.INITIAL_EASINESS_FACTOR;

    for (let i = currentReviewCount; i < currentReviewCount + maxItems; i++) {
        if (i < EARLY_INTERVALS.length) {
            interval = EARLY_INTERVALS[i];
        } else {
            interval = Math.round(interval * ef);
        }
        interval = Math.min(interval, SM2_PARAMS.MAX_INTERVAL_DAYS);

        timeline.push({
            reviewNumber: i + 1,
            intervalDays: interval,
        });
    }

    return timeline;
}

/**
 * 获取今天的时间范围 (UTC)
 * 
 * @returns {Object} { startOfDay, endOfDay, timestamp }
 */
function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
    ));
    const endOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
    ));

    return {
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        timestamp: now.toISOString(),
    };
}

/**
 * 获取算法信息 (用于前端展示)
 * 
 * @returns {Object} 算法元信息
 */
function getAlgorithmInfo() {
    return {
        name: 'Optimized SM-2',
        version: '1.1.0',
        earlyIntervals: EARLY_INTERVALS,
        maxInterval: SM2_PARAMS.MAX_INTERVAL_DAYS,
        description: '基于艾宾浩斯遗忘曲线优化的间隔重复算法',
    };
}

module.exports = {
    calculateSM2,
    generateReviewTimeline,
    getTodayRange,
    getAlgorithmInfo,
    masteryToQuality,
};
````

## File: cloudbase/functions/user-login/package.json
````json
{
  "name": "user-login",
  "version": "1.0.0",
  "description": "User login cloud function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
````

## File: cloudbase/functions/user-reset-password/index.js
````javascript
// functions/user-reset-password/index.js
const cloud = require('wx-server-sdk');
const crypto = require('crypto');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // Parse request body if coming from HTTP trigger
    let requestData = event;
    if (typeof event.body === 'string') {
      try {
        requestData = JSON.parse(event.body);
      } catch (e) {
        return {
          success: false,
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON'
        };
      }
    } else if (event.body && typeof event.body === 'object') {
      requestData = event.body;
    }

    const { email } = requestData;

    // ===== Validation =====
    if (!email) {
      return {
        success: false,
        error: 'Email is required',
        code: 'INVALID_INPUT'
      };
    }

    // ===== Find user =====
    const userResult = await db.collection('users')
      .where({
        email: email.toLowerCase()
      })
      .get();

    // For security, always return success even if user not found
    if (userResult.data.length === 0) {
      return {
        success: true,
        data: {
          message: 'If this email is registered, you will receive password reset instructions.'
        }
      };
    }

    const user = userResult.data[0];

    // ===== Generate reset token =====
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // ===== Save reset token =====
    await db.collection('users')
      .doc(user._id)
      .update({
        data: {
          resetToken: resetTokenHash,
          resetTokenExpiry: resetTokenExpiry.toISOString()
        }
      });

    // ===== Send email (pseudo-code) =====
    // In production, integrate with email service like SendGrid, AWS SES, etc.
    const resetLink = `https://your-app.com/reset-password?token=${resetToken}`;
    
    // TODO: Implement actual email sending
    console.log(`Password reset link for ${email}: ${resetLink}`);
    
    // Placeholder for email service integration:
    // await sendEmail({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   body: `Click this link to reset your password: ${resetLink}`
    // });

    return {
      success: true,
      data: {
        message: 'If this email is registered, you will receive password reset instructions.'
      }
    };

  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      error: 'Password reset request failed',
      code: 'SERVER_ERROR'
    };
  }
};
````

## File: cloudbase/functions/user-update-profile/index.js
````javascript
// functions/user-update-profile/index.js
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// Middleware to verify JWT token (simplified)
function verifyToken(event) {
  // In production, verify the JWT token from Authorization header
  // For now, we'll trust the userId from the request
  return event.userId;
}

exports.main = async (event, context) => {
  try {
    // Parse request body if coming from HTTP trigger
    let requestData = event;
    if (typeof event.body === 'string') {
      try {
        requestData = JSON.parse(event.body);
      } catch (e) {
        return {
          success: false,
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON'
        };
      }
    } else if (event.body && typeof event.body === 'object') {
      requestData = event.body;
    }

    // ===== Verify authentication =====
    const userId = verifyToken(requestData);
    if (!userId) {
      return {
        success: false,
        error: 'Unauthorized',
        code: 'UNAUTHORIZED'
      };
    }

    const { displayName, avatar, preferences } = requestData;

    // ===== Build update object =====
    const updateData = {};
    
    // ===== Validate display name =====
    if (displayName !== undefined) {
      if (displayName.length < 2 || displayName.length > 10) {
        return {
          success: false,
          error: 'Display name must be 2-10 characters',
          code: 'INVALID_DISPLAY_NAME'
        };
      }
      updateData.displayName = displayName;
    }

    // ===== Validate avatar =====
    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    // ===== Validate preferences =====
    if (preferences !== undefined) {
      updateData.preferences = preferences;
    }

    if (Object.keys(updateData).length === 0) {
      return {
        success: false,
        error: 'No fields to update',
        code: 'INVALID_INPUT'
      };
    }

    updateData.updatedAt = new Date().toISOString();

    // ===== Update user =====
    const result = await db.collection('users')
      .where({
        userId: userId
      })
      .update({
        data: updateData
      });

    if (result.stats.updated === 0) {
      return {
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      };
    }

    // ===== Get updated user =====
    const userResult = await db.collection('users')
      .where({
        userId: userId
      })
      .get();

    const { passwordHash, _id, ...userResponse } = userResult.data[0];

    return {
      success: true,
      data: userResponse
    };

  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'Profile update failed',
      code: 'SERVER_ERROR'
    };
  }
};
````

## File: cloudbase/test-comprehensive.sh
````bash
#!/bin/bash

echo "======================================"
echo "完整修复: Node.js 版本 + 符号链接"
echo "======================================"
echo ""

cd ~/LearnOnThailand/ThaiLearningApp/cloudbase/functions

# 1. 修复 shared 的 Node.js 版本
echo "1️⃣ 修复 shared 模块..."
cd shared
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.engines = { node: '>=16.0.0' };
if (!pkg.dependencies) pkg.dependencies = {};
pkg.dependencies['wx-server-sdk'] = '~2.6.3';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('✅ shared/package.json 已更新');
"
npm install --production
cd ..

# 2. 修复每个云函数
for func in alphabet learn-vocab memory-engine; do
  echo ""
  echo "2️⃣ 处理 $func..."
  
  cd $func
  
  # 更新 package.json
  node -e "
  const fs = require('fs');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.engines = { node: '18.20.0' };
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  console.log('  ✅ package.json 已更新');
  "
  
  # 删除符号链接,复制真实文件
  rm -rf node_modules/@thai-app
  mkdir -p node_modules/@thai-app/shared
  cp -r ../shared/*.js node_modules/@thai-app/shared/
  cp ../shared/package.json node_modules/@thai-app/shared/
  cp -r ../shared/node_modules node_modules/@thai-app/shared/ 2>/dev/null || true
  
  echo "  ✅ shared 已复制为真实文件"
  
  cd ..
done

echo ""
echo "======================================"
echo "3️⃣ 验证配置..."
echo "======================================"
cd memory-engine
node -e "
try {
  console.log('Node 版本:', process.version);
  const shared = require('@thai-app/shared');
  console.log('✅ shared 模块加载成功');
  console.log('导出:', Object.keys(shared));
} catch(err) {
  console.error('❌', err.message);
  process.exit(1);
}
"
cd ..

echo ""
echo "======================================"
echo "✅ 修复完成! 现在重新部署:"
echo "======================================"
echo "tcb fn deploy memory-engine --runtime Nodejs18.20"
echo "tcb fn deploy alphabet --runtime Nodejs18.20"
echo "tcb fn deploy learn-vocab --runtime Nodejs18.20"
````

## File: src/components/ai/AiExplanationView.tsx
````typescript
// src/components/ai/AiExplanationView.tsx
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';
import { Volume2 } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import type { ExplainVocabularyResponse } from '@/src/entities/types/ai.types';

interface AiExplanationViewProps {
  data: ExplainVocabularyResponse;
}

export const AiExplanationView: React.FC<AiExplanationViewProps> = ({ data }) => {
  const { t } = useTranslation();

  const speakWord = useCallback((text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'th-TH', rate: 0.85 });
  }, []);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 头部区域：单词和释义 */}
      <View style={styles.header}>
        <Pressable onPress={() => speakWord(data.thaiWord)} style={styles.wordRow}>
          <Text style={styles.thaiWord}>{data.thaiWord}</Text>
          <View style={styles.speakerIcon}>
            <Volume2 size={20} color={Colors.thaiGold} />
          </View>
        </Pressable>
        {data.pronunciation ? (
          <View style={styles.pronunciationBadge}>
            <Text style={styles.pronunciationText}>{data.pronunciation}</Text>
          </View>
        ) : null}
      </View>
      
      <Text style={styles.meaningText}>{data.meaning}</Text>

      {/* 记忆卡片区域 */}
      {data.breakdown ? (
         <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('ai.analysis')}</Text>
            <Text style={styles.cardContent}>{data.breakdown}</Text>
         </View>
      ) : null}

      {/* 场景例句区域 */}
      {data.extraExamples && data.extraExamples.length > 0 ? (
         <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('ai.examples')}</Text>
            {data.extraExamples.map((ex, index) => (
              <View key={index} style={styles.exampleItem}>
                 <Text style={styles.exampleScene}>【{ex.scene}】</Text>
                 <Pressable onPress={() => speakWord(ex.thai)} style={styles.exampleThaiRow}>
                   <Text style={styles.exampleThai}>{ex.thai}</Text>
                   <Volume2 size={14} color={Colors.taupe} />
                 </Pressable>
                 <Text style={styles.exampleChinese}>{ex.chinese}</Text>
              </View>
            ))}
         </View>
      ) : null}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thaiWord: {
    fontFamily: Typography.sarabunBold,
    fontSize: 50,
    color: Colors.ink,
  },
  speakerIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  pronunciationBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  pronunciationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 32,
    color: Colors.thaiGold,
  },
  meaningText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.taupe,
    marginBottom: 32,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.thaiGold,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  cardContent: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 15,
    lineHeight: 24,
    color: Colors.ink,
  },
  exampleItem: {
    marginBottom: 16,
  },
  exampleScene: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    marginBottom: 4,
  },
  exampleThaiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  exampleThai: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 18,
    color: Colors.ink,
  },
  exampleChinese: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  }
});
````

## File: src/components/common/Button.tsx
````typescript
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
````

## File: src/components/common/GlassCard.tsx
````typescript
// src/components/common/GlassCard.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(229, 226, 219, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
});
````

## File: src/components/courses/CourseSelectionModal.tsx
````typescript
import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useTranslation } from 'react-i18next';

interface CourseSelectionModalProps {
    visible: boolean;
    courseTitle: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function CourseSelectionModal({
    visible,
    courseTitle,
    onConfirm,
    onCancel,
}: CourseSelectionModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{t('courses.switchCourseTitle', 'Switch Course?')}</Text>
                    <Text style={styles.message}>
                        {t('courses.switchCourseMessage', '切换到 {{course}} 会先保存当前课程的进度，再开始新的课程。是否继续？', { course: courseTitle })}
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
                            <Text style={styles.cancelButtonText}>{t('common.cancel', 'Cancel')}</Text>
                        </Pressable>
                        <Pressable style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                            <Text style={styles.confirmButtonText}>{t('common.confirm', 'Confirm')}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 20,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.paper,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    confirmButton: {
        backgroundColor: Colors.thaiGold,
    },
    cancelButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.taupe,
    },
    confirmButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.white,
    },
});
````

## File: src/components/learning/alphabet/AspiratedContrastQuestion.tsx
````typescript
// src/components/learning/alphabet/AspiratedContrastQuestion.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { Wind } from 'lucide-react-native';

import type { Letter } from '@/src/entities/types/letter.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// ==================== Props 接口 ====================

interface AspiratedContrastQuestionProps {
  /** 目标字母 */
  target: Letter;

  /** 对比字母组(最小对立组) */
  contrasts: Letter[];

  /** 答题回调 */
  onAnswer: (isCorrect: boolean) => void;

  /** 下一题回调 */
  onNext: () => void;
}

// ==================== 主组件 ====================

export function AspiratedContrastQuestion({
  target,
  contrasts,
  onAnswer,
  onNext,
}: AspiratedContrastQuestionProps) {
  const { t } = useTranslation();
  const [answered, setAnswered] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isPlayingTarget, setIsPlayingTarget] = useState(false);
  const [isPlayingContrast, setIsPlayingContrast] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);

  // 所有选项(目标字母+对比字母)
  const allOptions = [target, ...contrasts];

  // ===== 清理音频 =====
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }
    };
  }, []);

  // ===== 播放音频 =====
  const playAudio = useCallback(async (audioUrl: string, letterId: string) => {
    try {
      if (letterId === target._id) {
        setIsPlayingTarget(true);
      } else {
        setIsPlayingContrast(letterId);
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlayingTarget(false);
          setIsPlayingContrast(null);
        }
      });
    } catch (error) {
      console.warn('[AspiratedContrast] 播放失败:', error);
      setIsPlayingTarget(false);
      setIsPlayingContrast(null);
    }
  }, [target._id]);

  // ===== 选择答案 =====
  const handleSelectLetter = useCallback(
    (letter: Letter) => {
      if (answered) return;

      setSelectedLetter(letter._id);
      setAnswered(true);

      const isCorrect = letter._id === target._id;
      onAnswer(isCorrect);
    },
    [answered, target._id, onAnswer]
  );

  // ===== 判断是否送气 =====
  const isAspirated = (letter: Letter): boolean => {
    return letter.initialSound.includes('h');
  };

  return (
    <View style={styles.container}>
      {/* 题型标题 */}
      <View style={styles.header}>
        <Wind size={24} color={Colors.thaiGold} />
        <Text style={styles.title}>{t('components.aspirated.title', '送气音对比训练')}</Text>
      </View>

      {/* 说明 */}
      <Text style={styles.instruction}>
        {t('components.aspirated.instruction', '🔊 先播放目标音频,然后从下方选项中选择对应的字母')}
      </Text>

      {/* 目标音频播放 */}
      <TouchableOpacity
        style={styles.targetAudioButton}
        onPress={() => {
          const audioUrl =
            target.fullSoundUrl ||
            target.letterPronunciationUrl ||
            target.audioPath ||
            '';
          playAudio(audioUrl, target._id);
        }}
        disabled={isPlayingTarget}
        accessibilityRole="button"
        accessibilityLabel={t('components.aspirated.playTarget', '播放目标发音')}
      >
        {isPlayingTarget ? (
          <ActivityIndicator size="small" color={Colors.white} />
        ) : (
          <>
            <Text style={styles.targetAudioIcon}>🔊</Text>
            <Text style={styles.targetAudioText}>{t('components.aspirated.playTarget', '播放目标发音')}</Text>
          </>
        )}
      </TouchableOpacity>

      {/* 提示卡片 */}
      <View style={styles.hintCard}>
        <Text style={styles.hintTitle}>{t('components.aspirated.tipsTitle', '💡 区分技巧')}</Text>
        <Text style={styles.hintText}>
          • {t('components.aspirated.aspiratedDesc', '送气音: 发音时有明显气流')} (如 ข ถ ผ)
        </Text>
        <Text style={styles.hintText}>
          • {t('components.aspirated.unaspiratedDesc', '不送气音: 发音时气流较弱')} (如 ก ด บ)
        </Text>
        <Text style={styles.hintText}>
          • 用手放在嘴前感受气流强度!
        </Text>
      </View>

      {/* 选项(最小对立组) */}
      <View style={styles.optionsContainer}>
        {allOptions.map((letter) => {
          const isSelected = selectedLetter === letter._id;
          const isCorrect = answered && letter._id === target._id;
          const isWrong = answered && isSelected && letter._id !== target._id;
          const isPlaying = isPlayingContrast === letter._id;

          return (
            <View key={letter._id} style={styles.optionWrapper}>
              {/* 字母卡片 */}
              <TouchableOpacity
                style={[
                  styles.optionCard,
                  isSelected && styles.optionSelected,
                  isCorrect && styles.optionCorrect,
                  isWrong && styles.optionWrong,
                ]}
                onPress={() => handleSelectLetter(letter)}
                disabled={answered}
                accessibilityRole="radio"
                accessibilityLabel={`字母 ${letter.thaiChar}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.optionChar}>{letter.thaiChar}</Text>
                <Text style={styles.optionName}>{letter.nameThai}</Text>

                {/* 送气标识 */}
                {isAspirated(letter) && (
                  <View style={styles.aspiratedBadge}>
                    <Wind size={12} color={Colors.thaiGold} />
                    <Text style={styles.aspiratedText}>{t('components.aspirated.aspirated', '送气')}</Text>
                  </View>
                )}

                {/* 反馈图标 */}
                {answered && (
                  <View style={styles.feedbackIcon}>
                    {isCorrect && <Text style={styles.correctIcon}>✓</Text>}
                    {isWrong && <Text style={styles.wrongIcon}>✗</Text>}
                  </View>
                )}
              </TouchableOpacity>

              {/* 播放对比音频按钮 */}
              <TouchableOpacity
                style={styles.playContrastButton}
                onPress={() => {
                  const audioUrl =
                    letter.fullSoundUrl ||
                    letter.letterPronunciationUrl ||
                    letter.audioPath ||
                    '';
                  playAudio(audioUrl, letter._id);
                }}
                disabled={isPlaying}
                accessibilityRole="button"
                accessibilityLabel={`播放 ${letter.thaiChar} 的发音`}
              >
                {isPlaying ? (
                  <ActivityIndicator size="small" color={Colors.thaiGold} />
                ) : (
                  <Text style={styles.playContrastIcon}>▶</Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* 解释(答题后) */}
      {answered && (
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>
            {t('components.aspirated.correctAns', '✅ 正确答案')}: {target.thaiChar} ({target.nameThai})
            {'\n'}
            {isAspirated(target)
              ? t('components.aspirated.aspiratedDesc', '这是一个送气音,发音时有明显气流')
              : t('components.aspirated.unaspiratedDesc', '这是一个不送气音,发音时气流较弱')}
          </Text>
        </View>
      )}

      {/* 下一题按钮 */}
      {answered && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel={t('alphabet.nextQuestion', '下一题 →')}
        >
          <Text style={styles.nextButtonText}>{t('alphabet.nextQuestion', '下一题 →')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.paper,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 22,
    color: Colors.ink,
    marginLeft: 12,
  },
  instruction: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    textAlign: 'center',
    marginBottom: 20,
  },
  targetAudioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    minHeight: 56,
  },
  targetAudioIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  targetAudioText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
  hintCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  hintTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 8,
  },
  hintText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.taupe,
    marginBottom: 4,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 20,
  },
  optionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.sand,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
  },
  optionSelected: {
    borderColor: Colors.thaiGold,
    backgroundColor: '#FFF9E6',
  },
  optionCorrect: {
    borderColor: '#2A9D8F',
    backgroundColor: '#E8F5F3',
  },
  optionWrong: {
    borderColor: '#E63946',
    backgroundColor: '#FFE8EA',
  },
  optionChar: {
    fontFamily: Typography.playfairBold,
    fontSize: 48,
    color: Colors.ink,
    marginBottom: 8,
  },
  optionName: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  aspiratedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  aspiratedText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    color: Colors.thaiGold,
    marginLeft: 4,
  },
  feedbackIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  correctIcon: {
    fontSize: 24,
    color: '#2A9D8F',
  },
  wrongIcon: {
    fontSize: 24,
    color: '#E63946',
  },
  playContrastButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.thaiGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playContrastIcon: {
    fontSize: 16,
    color: Colors.thaiGold,
  },
  explanationCard: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  explanationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.ink,
  },
  nextButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
````

## File: src/components/learning/alphabet/RoundCompletionView.tsx
````typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { CheckCircle2 } from 'lucide-react-native';

interface RoundCompletionViewProps {
    roundNumber: number;
    onFinish: () => void;
}

export function RoundCompletionView({
    roundNumber,
    onFinish,
}: RoundCompletionViewProps) {
    const { t } = useTranslation();
    const isFinal = roundNumber >= 3;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <CheckCircle2 size={80} color={Colors.thaiGold} style={styles.icon} />

                <Text style={styles.title}>
                    {isFinal
                        ? t('components.completion.courseDone', '课程完成！')
                        : t('components.completion.roundDone', { round: roundNumber, defaultValue: `Round ${roundNumber} 完成` })}
                </Text>

                <Text style={styles.subtitle}>
                    {isFinal
                        ? t('components.completion.courseDoneMsg', '恭喜你完成了本节课程的所有学习内容！')
                        : t('components.completion.roundDoneMsg', '休息一下，准备进入下一轮学习\n每节课需完成3轮学习')}
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onFinish}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {isFinal
                            ? t('components.completion.finishCourse', '完成课程')
                            : t('components.completion.backToCourses', '返回选课')}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: 32,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    icon: {
        marginBottom: 24,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        marginBottom: 32,
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 100,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});
````

## File: src/components/learning/alphabet/SessionRecoveryCard.tsx
````typescript
// src/components/learning/alphabet/SessionRecoveryCard.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface SessionRecoveryCardProps {
    onContinue: () => void;
    onRestart: () => void;
}

export function SessionRecoveryCard({
    onContinue,
    onRestart,
}: SessionRecoveryCardProps) {
    const { t } = useTranslation();

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <Text style={styles.title}>{t('components.recovery.title', '继续上次学习？')}</Text>
                <Text style={styles.description}>
                    {t('components.recovery.message', '检测到您在该课程存在未完成的轮次，是否继续之前的阶段？')}
                </Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.button, styles.restartButton]}
                        onPress={onRestart}
                    >
                        <Text style={styles.restartText}>{t('components.recovery.restart', '重新开始本轮')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.continueButton]}
                        onPress={onContinue}
                    >
                        <Text style={styles.continueText}>{t('components.recovery.continue', '继续学习')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    card: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: Colors.paper, // slightly off-white like the Phonics card
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 20,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 15,
        color: Colors.taupe,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        paddingTop: 16,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    restartButton: {
        backgroundColor: '#F5F5F5',
    },
    continueButton: {
        backgroundColor: '#F0F8FF', // Light blueish/interaction hint
    },
    restartText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 15,
        color: '#E63946', // Red destructive color
    },
    continueText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 15,
        color: '#007AFF', // Standard action blue, or we can use another brand color
    },
});
````

## File: src/components/learning/ModuleLockedScreen.tsx
````typescript
// src/components/learning/ModuleLockedScreen.tsx

/**
 * 模块锁定界面
 * 
 * 功能：
 * 1. 显示模块被锁定的提示
 * 2. 显示当前进度和解锁要求
 * 3. 提供返回按钮
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Lock, ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';

// ==================== 类型定义 ====================

interface ModuleLockedScreenProps {
    moduleType: ModuleType;
}

// ==================== 辅助函数 ====================

/**
 * 获取模块的显示名称
 */
const getModuleName = (moduleType: ModuleType, t: any): string => {
    const moduleNames: Record<ModuleType, string> = {
        letter: t('modules.alphabet'),
        word: t('modules.word'),
        sentence: t('modules.sentence'),
        article: t('modules.article'),
    };
    return moduleNames[moduleType];
};

/**
 * 获取锁定原因和解锁要求
 */
const getUnlockRequirement = (
    moduleType: ModuleType,
    userProgress: any,
    t: any
): { prerequisite: string; currentProgress: number; requiredProgress: number } => {
    if (!userProgress) {
        return {
            prerequisite: t('moduleAccess.noProgress'),
            currentProgress: 0,
            requiredProgress: 95,
        };
    }

    switch (moduleType) {
        case 'word':
            return {
                prerequisite: t('moduleAccess.prerequisite.word'),
                // 后端 letterProgress 为 0-1，展示时转为 0-100
                currentProgress: (userProgress.letterProgress || 0) * 100,
                requiredProgress: 80,
            };
        case 'sentence':
            return {
                prerequisite: t('moduleAccess.prerequisite.sentence'),
                currentProgress: userProgress.wordProgress || 0,
                requiredProgress: 80,
            };
        case 'article':
            return {
                prerequisite: t('moduleAccess.prerequisite.article'),
                currentProgress: userProgress.sentenceProgress || 0,
                requiredProgress: 80,
            };
        default:
            return {
                prerequisite: t('moduleAccess.unknownModule'),
                currentProgress: 0,
                requiredProgress: 100,
            };
    }
};

// ==================== 组件 ====================

export default function ModuleLockedScreen({ moduleType }: ModuleLockedScreenProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const { userProgress } = useModuleAccessStore();

    const moduleName = getModuleName(moduleType, t);
    const { prerequisite, currentProgress, requiredProgress } = getUnlockRequirement(
        moduleType,
        userProgress,
        t
    );

    const progressPercentage = Math.min(currentProgress, requiredProgress);

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            {/* 锁定图标 */}
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Lock size={64} color={Colors.taupe} strokeWidth={1.5} />
                </View>
            </View>

            {/* 标题 */}
            <Text style={styles.title}>{t('moduleAccess.locked')}</Text>

            {/* 提示文字 */}
            <Text style={styles.message}>
                {t('moduleAccess.lockedMessage', { module: moduleName })}
            </Text>

            {/* 前置要求 */}
            <View style={styles.requirementCard}>
                <Text style={styles.requirementTitle}>{t('moduleAccess.requirement')}</Text>
                <Text style={styles.requirementText}>{prerequisite}</Text>
            </View>

            {/* 进度条 */}
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>{t('moduleAccess.currentProgress')}</Text>
                    <Text style={styles.progressValue}>
                        {currentProgress}% / {requiredProgress}%
                    </Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: `${(progressPercentage / requiredProgress) * 100}%`,
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* 进度提示 */}
                {currentProgress < requiredProgress ? (
                    <Text style={styles.progressHint}>
                        {t('moduleAccess.remainingProgress', {
                            remaining: requiredProgress - currentProgress,
                        })}
                    </Text>
                ) : (
                    <Text style={styles.progressComplete}>
                        {t('moduleAccess.progressComplete')}
                    </Text>
                )}
            </View>

            {/* 返回按钮 */}
            <Pressable style={styles.backButton} onPress={handleBack}>
                <ArrowLeft size={20} color={Colors.white} />
                <Text style={styles.backButtonText}>{t('moduleAccess.goBack')}</Text>
            </Pressable>
        </View>
    );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 32,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.sand,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.taupe,
        opacity: 0.8,
    },
    title: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 28,
        color: Colors.ink,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.taupe,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    requirementCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    requirementTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.thaiGold,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    requirementText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 16,
        color: Colors.ink,
        lineHeight: 24,
    },
    progressContainer: {
        width: '100%',
        marginBottom: 40,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    progressValue: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.ink,
    },
    progressBarContainer: {
        marginBottom: 8,
    },
    progressBarBackground: {
        width: '100%',
        height: 12,
        backgroundColor: Colors.sand,
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 6,
    },
    progressHint: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 13,
        color: Colors.taupe,
        fontStyle: 'italic',
    },
    progressComplete: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 13,
        color: Colors.thaiGold,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    backButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});
````

## File: src/config/alphabet/alphabetQuestionGenerator.ts
````typescript
// src/components/alphabet/alphabetQuestionGenerator.ts

import { AlphabetLearningState } from '@/src/stores/alphabetStore';
import {
  AlphabetQuestionType,
  AlphabetReviewQuestion,
  AlphabetQuestionOption,
} from '@/src/config/alphabet/alphabetQuestionTypes';

// 可选：让外层控制题型比例
export interface QuestionGenerationOptions {
  preferredType?: AlphabetQuestionType;
  // 题目 ID 前缀，方便调试 / 日志
  idPrefix?: string;
  // 选项数量（3~6 比较合理）
  optionCount?: number;
}

export interface QuestionGenerationContext {
  current: AlphabetLearningState;          // 当前要复习的字母
  pool: AlphabetLearningState[];          // 今日 session 的所有字母
  options?: QuestionGenerationOptions;
}

// 工具函数：从数组中取随机若干个不同元素
function pickRandomDistinct<T>(items: T[], count: number, exclude?: T): T[] {
  const pool = exclude ? items.filter((i) => i !== exclude) : [...items];
  const result: T[] = [];
  const max = Math.min(count, pool.length);

  while (result.length < max && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    const [picked] = pool.splice(index, 1);
    result.push(picked);
  }

  return result;
}

// 决定题型：如果外层不传，就做一个简单轮盘（不做复杂 stage 逻辑）
function decideQuestionType(
  preferredType?: AlphabetQuestionType,
): AlphabetQuestionType {
  if (preferredType) return preferredType;

  const r = Math.random();
  if (r < 0.33) return 'soundToLetter';
  if (r < 0.66) return 'letterToSound';
  return 'reading';
}

// 构造选项：字母→选项对象
function buildLetterOptions(
  correct: AlphabetLearningState,
  distractors: AlphabetLearningState[],
): AlphabetQuestionOption[] {
  const all = [correct, ...distractors];
  return all.map((letter, idx) => ({
    id: letter._id ?? letter.thaiChar ?? String(idx),
    label: letter.thaiChar,
  }));
}

// 构造选项：发音→选项对象（使用 syllableSoundName / initialSound / pronunciation）
function buildSoundOptions(
  correct: AlphabetLearningState,
  distractors: AlphabetLearningState[],
): AlphabetQuestionOption[] {
  const getSoundLabel = (item: AlphabetLearningState): string => {
    return (
      item.syllableSoundName ||
      item.initialSound ||
      item.pronunciation ||
      item.thaiChar
    );
  };

  const all = [correct, ...distractors];
  return all.map((item, idx) => ({
    id: item._id ?? `${getSoundLabel(item)}-${idx}`,
    label: getSoundLabel(item),
  }));
}

// 轻量解释文案（不实现完整规则，只做友好提示）
function buildPhonicsExplanation(
  questionType: AlphabetQuestionType,
  current: AlphabetLearningState,
): string | undefined {
  const baseChar = current.thaiChar;
  const example = current.example;

  if (questionType === 'soundToLetter') {
    return example
      ? `你听到的发音来自字母「${baseChar}」及其在单词「${example}」中的读法。`
      : `你听到的发音来自字母「${baseChar}」的读音。`;
  }

  if (questionType === 'letterToSound') {
    return `注意字母「${baseChar}」的起始音（initial sound），在不同元音组合中会保持相同的辅音音值。`;
  }

  if (questionType === 'reading') {
    return example
      ? `尝试将单词拆成「辅音 + 元音」再合成发音，例如：${example}。`
      : `尝试在脑中先读出辅音，再加上元音，最后合成一个整体音节。`;
  }

  return undefined;
}

// 👇 核心导出函数：根据当前字母 + 今日字母池生成一道题
export function generateAlphabetQuestion(
  ctx: QuestionGenerationContext,
): AlphabetReviewQuestion {
  const { current, pool, options } = ctx;
  const {
    preferredType,
    idPrefix = 'qa',
    optionCount = 4,
  } = options || {};
  const type = decideQuestionType(preferredType);

  // 为了避免拿不到字段时崩掉，做一些兜底
  const mainChar = current.thaiChar ?? '';
  const example = current.example ?? '';
  // 统一优先使用 AlphabetLearningState 中已经解析好的 audioUrl
  const audioUrl =
    current.audioUrl ||
    current.syllableSoundUrl ||
    current.letterPronunciationUrl ||
    current.audioPath;

  const distractorCount = Math.max(optionCount - 1, 1);
  const otherLetters = pool.filter((l) => l !== current);

  let question: AlphabetReviewQuestion;

  if (type === 'soundToLetter') {
    // 听音 → 选字母
    const distractors = pickRandomDistinct(otherLetters, distractorCount);
    const optionsArr = buildLetterOptions(current, distractors);

    question = {
      id: `${idPrefix}-sound-${current._id ?? mainChar}`,
      type: 'soundToLetter',
      prompt: '听发音，选择对应的泰文字母。',
      audioUrl: audioUrl,
      options: optionsArr,
      correctOptionId: optionsArr[0].id, // 第一个是正确项（buildLetterOptions 保证）
      explanation: buildPhonicsExplanation('soundToLetter', current),
    };
  } else if (type === 'letterToSound') {
    // 看字母 → 选发音
    const distractors = pickRandomDistinct(otherLetters, distractorCount);
    const optionsArr = buildSoundOptions(current, distractors);

    question = {
      id: `${idPrefix}-letter-${current._id ?? mainChar}`,
      type: 'letterToSound',
      prompt: '观察这个字母，选择它的读音。',
      mainText: mainChar,
      options: optionsArr,
      correctOptionId: optionsArr[0].id,
      explanation: buildPhonicsExplanation('letterToSound', current),
    };
  } else {
    // reading：拼读题（尽量使用例词，不生成新音节）
    const distractors = pickRandomDistinct(otherLetters, distractorCount);
    const optionsArr = buildSoundOptions(current, distractors);

    question = {
      id: `${idPrefix}-reading-${current._id ?? mainChar}`,
      type: 'reading',
      prompt: example
        ? '尝试读出这个词的发音。'
        : '尝试读出这个音节/字母的发音。',
      mainText: example || mainChar,
      audioUrl: audioUrl,
      options: optionsArr,
      correctOptionId: optionsArr[0].id,
      explanation: buildPhonicsExplanation('reading', current),
    };
  }

  // 打乱选项顺序（避免正确项一直在第一位）
  const shuffledOptions = [...question.options];
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [
      shuffledOptions[j],
      shuffledOptions[i],
    ];
  }

  // 找到打乱后正确选项的 id
  const correct = question.options[0];
  const correctInShuffled = shuffledOptions.find(
    (opt) => opt.id === correct.id,
  )!;
  question.options = shuffledOptions;
  question.correctOptionId = correctInShuffled.id;

  return question;
}
````

## File: src/config/alphabet/lettersSequence.ts
````typescript
// LetterSequence.ts
// 混合式最优泰语字母学习序列（辅音 + 元音 + 声调）
// ✅ 覆盖：44 个辅音 + 32 个元音 + 4 个声调（共 80 个）
// ✅ 已对照 letters_final.json，确认无遗漏、无多余、无重复

/**
 * 字母学习最优顺序（仅包含数据库实际存在的 thaiChar）
 * 修复点：
 * - 删除 tone marks（่้๊๋）
 * - 删除数据库不存在的复合元音（เอะ แอะ โอะ 等）
 * - 删除 ฤ ฤๅ ฦ ฦๅ ฃ ฅ（数据库中不存在）
 * - 保留辅音 + 基础元音
 */

export const LETTER_SEQUENCE: readonly string[] = [
  // ------------------------------------------
  // Stage 1 — 基础拼读能力（辅音 + 基础元音）
  // ------------------------------------------
  "ก", "น", "ม", "ป", "ต", "บ", "ค", "ง", "อ",
  "ะ", "า", "ิ", "ี", "ุ", "ู",

  // ------------------------------------------
  // Stage 2 — 扩展拼读（前置元音 + 高频辅音）
  // ------------------------------------------
  "ด", "ท", "พ", "ฟ", "ย", "ว", "ล", "ร",
  "เ", "แ", "โ", "ไ", "ใ",

  // ------------------------------------------
  // Stage 3 — 送气对比 + 特殊读音
  // ------------------------------------------
  "ข", "ช", "ซ", "จ", "ฉ", "ผ", "ฝ", "ฮ",
  "ื", // 长元音扩展

  // ------------------------------------------
  // Stage 4 — 高频辅音扩展
  // ------------------------------------------
  "ถ", "ธ", "ภ", "ศ", "ษ", "ส", "ห", "ฎ", "ฏ", "ฐ",

  // ------------------------------------------
  // Stage 5 — 复杂辅音与少量特殊组合（仅保留数据库存在）
  // ------------------------------------------
  "ฑ", "ฒ", "ฆ", "ญ", "ฌ", "ณ", "ฬ",
];

/**
 * 预生成字符 → 排序序号映射
 */
export const LETTER_INDEX_MAP = new Map<string, number>(
  LETTER_SEQUENCE.map((char, index) => [char, index]),
);

/**
 * 按最优顺序排序（items 必须有 thaiChar 字段）
 */
export function sortByLetterSequence<T extends { thaiChar: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const ia = LETTER_INDEX_MAP.get(a.thaiChar) ?? Number.MAX_SAFE_INTEGER;
    const ib = LETTER_INDEX_MAP.get(b.thaiChar) ?? Number.MAX_SAFE_INTEGER;
    return ia - ib;
  });
}

/**
 * 将 sequence 按 Lesson 分组（5 课）
 * 供 AlphabetCoursesScreen 与 Lesson orchestrator 使用
 */
export const SEQUENCE_LESSONS = {
  lesson1: LETTER_SEQUENCE.slice(0, 15),
  lesson2: LETTER_SEQUENCE.slice(15, 15 + 12),
  lesson3: LETTER_SEQUENCE.slice(27, 27 + 9),
  lesson4: LETTER_SEQUENCE.slice(36, 36 + 9),
  lesson5: LETTER_SEQUENCE.slice(45),
};
````

## File: src/entities/types/entities.ts
````typescript
export * from './user';
export * from './course';
export * from './learning';
````

## File: src/stores/languageStore.ts
````typescript
// src/stores/languageStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/src/i18n';

export type Language = 'zh' | 'en';

interface LanguageState {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: 'zh',
      changeLanguage: async (lang: Language) => {
        try {
          await i18n.changeLanguage(lang);
          set({ currentLanguage: lang });
        } catch (error) {
          console.error('Failed to change language:', error);
        }
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
````

## File: src/utils/vocab/buildVocabQueue.ts
````typescript
import {
    VocabularyResponse,
    VocabQueueSource,
    SessionWord
} from "@/src/entities/types/vocabulary.types";
/**
 * 构建平铺的单词学习队列
 * 策略：复习词 -> 复习测验 -> 新词 -> 新词测验
 * 目标：将复习词和新词都拆分成两个阶段：精讲和测验
 * @param data 单词响应数据
 * @returns queue:平铺的vocabs队列
 */
export function buildVocabQueue(data: VocabularyResponse): SessionWord[] {
    //1.初始化队列
    const queue: SessionWord[] = [];
    //2.获取单词数据
    const items = data.items || [];
    //3.从 items 中 extract 复习词
    const reviewWords = items.filter(item => item.memoryState.isNew === false);
    //4.从 items 中 extract 新词
    const newWords = items.filter(item => item.memoryState.isNew === true);
    //5.遍历复习词,为每个复习词生成2个记录
    // Helper function to process batches
    const processBatch = (items: VocabularyResponse['items'], isNew: boolean) => {
        const BATCH_SIZE = 5;
        for (let i = 0; i < items.length; i += BATCH_SIZE) {
            const chunk = items.slice(i, i + BATCH_SIZE);

            // 1. Push Learning/Review Phase Items (The whole batch)
            chunk.forEach(item => {
                const base: SessionWord = {
                    id: item._id,
                    entity: item,
                    isNew: isNew,
                    masteryLevel: item.memoryState.masteryLevel || 0,
                    mistakeCount: 0,
                    source: isNew ? 'vocab-new' : 'vocab-review',
                    // Initialize selfRating as undefined
                };
                queue.push(base);
            });

            // 2. Push Quiz Phase Items (The whole batch)
            chunk.forEach(item => {
                const base: SessionWord = {
                    id: item._id,
                    entity: item,
                    isNew: isNew,
                    masteryLevel: item.memoryState.masteryLevel || 0,
                    mistakeCount: 0,
                    source: isNew ? 'vocab-new-quiz' : 'vocab-rev-quiz',
                };
                queue.push(base);
            });
        }
    };

    // 5. Process Review Words (Batch: 5 Review -> 5 Quiz)
    processBatch(reviewWords, false);

    // 6. Process New Words (Batch: 5 Learn -> 5 Quiz)
    processBatch(newWords, true);
    return queue;
}
````

## File: src/utils/alphabetQuestionTypeAssigner.ts
````typescript
// src/utils/alphabetQuestionTypeAssigner.ts

/**
 * Alphabet Question Type Assigner
 *
 * 题型分配器 - 根据学习阶段(Phase)分配合适的题型
 * 按照 alphabet-module-spec.md 第6章要求实现
 *
 * 核心策略:
 * - 三新一复阶段: 使用轻量题型(听音选字、看字选音)
 * - Final Review 阶段: 使用整合题型(辅音类别、首音、尾音、声调、拼读)
 */

import { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';

/**
 * 三新一复阶段使用的轻量题型
 *
 * 这些题型专注于基础的字母识别,不涉及复杂的语音学规则
 */
export const LIGHT_GAME_TYPES: AlphabetGameType[] = [
  AlphabetGameType.SOUND_TO_LETTER,
  AlphabetGameType.LETTER_TO_SOUND,
];

/**
 * Final Review 阶段使用的整合题型
 *
 * 这些题型要求学生综合运用辅音类别、发音规则等知识
 */
export const ADVANCED_GAME_TYPES: AlphabetGameType[] = [
  AlphabetGameType.CONSONANT_CLASS,
  AlphabetGameType.INITIAL_SOUND,
  AlphabetGameType.FINAL_SOUND,
  AlphabetGameType.TONE_CALCULATION,
  AlphabetGameType.PHONICS_MATH,
];

/**
 * 学习阶段类型
 */
export type LearningPhase = 'THREE_NEW_ONE_REVIEW' | 'FINAL_REVIEW';

/**
 * 根据学习阶段分配题型
 *
 * @param phase - 学习阶段 ('THREE_NEW_ONE_REVIEW' 或 'FINAL_REVIEW')
 * @returns 随机选择的题型
 *
 * @example
 * // 三新一复阶段
 * const gameType = assignGameTypeForPhase('THREE_NEW_ONE_REVIEW');
 * // 返回 SOUND_TO_LETTER 或 LETTER_TO_SOUND
 *
 * @example
 * // Final Review 阶段
 * const gameType = assignGameTypeForPhase('FINAL_REVIEW');
 * // 返回 CONSONANT_CLASS, INITIAL_SOUND, FINAL_SOUND, TONE_CALCULATION, 或 PHONICS_MATH
 */
export function assignGameTypeForPhase(
  phase: LearningPhase
): AlphabetGameType {
  const pool =
    phase === 'THREE_NEW_ONE_REVIEW' ? LIGHT_GAME_TYPES : ADVANCED_GAME_TYPES;

  // 从题型池中随机选择
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 根据学习阶段和权重分配题型
 *
 * @param phase - 学习阶段
 * @param weights - 可选的题型权重映射,用于微调题型分布
 * @returns 根据权重随机选择的题型
 *
 * @example
 * // 指定权重: 70% SOUND_TO_LETTER, 30% LETTER_TO_SOUND
 * const gameType = assignGameTypeWithWeights('THREE_NEW_ONE_REVIEW', {
 *   [AlphabetGameType.SOUND_TO_LETTER]: 0.7,
 *   [AlphabetGameType.LETTER_TO_SOUND]: 0.3,
 * });
 */
export function assignGameTypeWithWeights(
  phase: LearningPhase,
  weights?: Partial<Record<AlphabetGameType, number>>
): AlphabetGameType {
  // 如果没有提供权重,使用默认均匀分布
  if (!weights || Object.keys(weights).length === 0) {
    return assignGameTypeForPhase(phase);
  }

  const pool =
    phase === 'THREE_NEW_ONE_REVIEW' ? LIGHT_GAME_TYPES : ADVANCED_GAME_TYPES;

  // 只保留属于当前阶段题型池的权重
  const filteredWeights: Record<AlphabetGameType, number> = {} as any;
  let totalWeight = 0;

  for (const gameType of pool) {
    const weight = weights[gameType] ?? 1; // 默认权重为 1
    filteredWeights[gameType] = weight;
    totalWeight += weight;
  }

  // 归一化权重并根据随机数选择
  const random = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const gameType of pool) {
    cumulativeWeight += filteredWeights[gameType];
    if (random <= cumulativeWeight) {
      return gameType;
    }
  }

  // 兜底: 返回池中第一个题型
  return pool[0];
}
````

## File: src/utils/audioCache.ts
````typescript
import * as FileSystem from 'expo-file-system/legacy';

const CACHE_FOLDER = `${FileSystem.cacheDirectory}audio/`;

/**
 * 确保缓存目录存在
 */
async function ensureCacheFolderExists() {
    const dirInfo = await FileSystem.getInfoAsync(CACHE_FOLDER);
    if (!dirInfo.exists) {
        console.log('Cache folder does not exist, creating...');
        await FileSystem.makeDirectoryAsync(
            CACHE_FOLDER,
            { intermediates: true }
        );
    }
}

/**
* 获取缓存的音频 URI (Get Cached Audio URI)
* 逻辑：检查本地 -> 无则下载 -> 返回本地 URI
* @param remoteUrl 腾讯云的音频链接
* @returns 本地 URI (file://) | 网络 URI (https://)
*/
export async function getCachedAudioUri(remoteUrl: string): Promise<string> {
    await ensureCacheFolderExists();
    try {
        const fileName = remoteUrl.split('/').pop() || `temp_${Date.now()}.mp3`;
        const localUri = `${CACHE_FOLDER}${fileName}`;

        // 检查本地缓存是否存在且有效（大于 1KB 排除错误页面）
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists && fileInfo.size && fileInfo.size > 1024) {
            return localUri;
        }

        // 如果文件存在但过小（可能是损坏文件），先删除
        if (fileInfo.exists) {
            console.warn(`⚠️ [AudioCache] Removing corrupted file: ${fileName} (${fileInfo.size} bytes)`);
            await FileSystem.deleteAsync(localUri, { idempotent: true });
        }

        // 下载并验证
        console.log(`[Downloading] Fetching from cloud: ${fileName}`);
        const downloadRes = await FileSystem.downloadAsync(remoteUrl, localUri);

        // 验证 HTTP 状态码
        if (downloadRes.status !== 200) {
            console.warn(`⚠️ [AudioCache] Download failed for ${fileName}: HTTP ${downloadRes.status}`);
            await FileSystem.deleteAsync(localUri, { idempotent: true });
            return remoteUrl;
        }

        // 验证文件大小（有效 MP3 应该 > 1KB）
        const downloadedInfo = await FileSystem.getInfoAsync(localUri);
        if (!downloadedInfo.exists || (downloadedInfo.exists && downloadedInfo.size < 1024)) {
            console.warn(`⚠️ [AudioCache] Downloaded file too small: ${fileName} (${downloadedInfo.exists ? downloadedInfo.size : 0} bytes)`);
            await FileSystem.deleteAsync(localUri, { idempotent: true });
            return remoteUrl;
        }

        return downloadRes.uri;

    } catch (error) {
        console.error("Error in getCachedAudioUri:", error);
        return remoteUrl;
    }
}

/**
 * 批量下载音频 (Batch Download)
 * 控制并发数 (Concurrency Control)
 * @param urls 音频 URL 列表
 * @param batchSize 每批次下载数量，默认为 5
 */
export async function downloadAudioBatch(urls: string[], batchSize: number = 5) {
    if (!urls || urls.length === 0) {
        console.log('⚠️ [AudioCache] downloadAudioBatch called with empty URLs');
        return;
    }

    console.log(`🚀 [AudioCache] Starting batch download for ${urls.length} files...`);
    await ensureCacheFolderExists();
    // 将 URL 数组分成小块 (Chunking)
    // [1,2,3,4,5,6,7] -> [[1,2,3,4,5], [6,7]]
    for (let i = 0; i < urls.length; i += batchSize) {
        const chunk = urls.slice(i, i + batchSize);

        // Promise.all 会等待这一批的 5 个全部完成，再进行下一批（这是最简单的并发控制方法）
        await Promise.all(chunk.map(url => getCachedAudioUri(url)));
        console.log(`Processing batch ${i / batchSize + 1}...`);
    }
}
````

## File: src/utils/ModuleGuard.tsx
````typescript
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
````

## File: .nvmrc
````
20.19.4
````

## File: .claude/settings.local.json
````json
{
  "permissions": {
    "allow": [
      "Bash(cat:*)",
      "Bash(npx tsc:*)",
      "Bash(grep:*)"
    ],
    "deny": [],
    "ask": []
  }
}
````

## File: app/(auth)/_layout.tsx
````typescript
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/src/stores/userStore';

export default function AuthLayout() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
````

## File: app/(auth)/register.tsx
````typescript
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
````

## File: app/(dev)/playground.tsx
````typescript
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
````

## File: app/learning/micro-reading.tsx
````typescript
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, BookmarkPlus, Check } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { saveArticle } from '@/src/utils/articleStorage';
import type { MicroReadingResponse, SavedArticle } from '@/src/entities/types/ai.types';


export default function MicroReadingScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams<{ result: string }>();

    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    // 从 Expo Router params 解析 AI 返回结果
    const reading = useMemo<MicroReadingResponse | null>(() => {
        try {
            return params.result ? JSON.parse(params.result) : null;
        } catch {
            return null;
        }
    }, [params.result]);

    const handleSaveArticle = async () => {
        if (!reading || saveState === 'saving' || saveState === 'saved') return;

        setSaveState('saving');
        try {
            const thaiWords = reading.thaiText.trim().split(/\s+/);
            const newArticle: SavedArticle = {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                title: reading.title,
                thaiText: reading.thaiText,
                translation: reading.translation,
                wordsUsed: reading.wordsUsed || [],
                createdAt: Date.now(),
                wordCount: thaiWords.length,
            };

            await saveArticle(newArticle);
            setSaveState('saved');
        } catch {
            setSaveState('error');
        }
    };

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            {/* 顶部导航栏 */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={22} color={Colors.ink} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('microReading.title')}</Text>
                {/* 占位，使标题居中 */}
                <View style={styles.backButton} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {reading ? (
                    <>
                        {/* 泰文短文主体 */}
                        <View style={styles.thaiCard}>
                            <Text style={styles.thaiTitle}>{reading.title}</Text> 
                            <View style={styles.thaiTitleLine} />
                            <Text style={styles.thaiText}>{reading.thaiText}</Text>
                        </View>

                        {/* 保存到练习库 */}
                        <Pressable
                            style={[
                                styles.saveArticleButton,
                                saveState === 'saved' && styles.saveArticleButtonDone,
                            ]}
                            onPress={handleSaveArticle}
                            disabled={saveState === 'saving' || saveState === 'saved'}
                        >
                            {saveState === 'saving' ? (
                                <ActivityIndicator size="small" color={Colors.thaiGold} />
                            ) : saveState === 'saved' ? (
                                <Check size={18} color={Colors.success} />
                            ) : (
                                <BookmarkPlus size={18} color={Colors.thaiGold} />
                            )}
                            <Text
                                style={[
                                    styles.saveArticleText,
                                    saveState === 'saved' && { color: Colors.success },
                                    saveState === 'error' && { color: Colors.error },
                                ]}
                            >
                                {saveState === 'saving'
                                    ? t('microReading.saving')
                                    : saveState === 'saved'
                                    ? t('microReading.saveSuccess')
                                    : saveState === 'error'
                                    ? t('microReading.saveError')
                                    : t('microReading.saveArticle')}
                            </Text>
                        </Pressable>

                        {/* 中文辅助翻译 */}
                        <View style={styles.translationCard}>
                            <Text style={styles.translationLabel}>
                                {t('microReading.translationLabel')}
                            </Text>
                            <Text style={styles.translationText}>{reading.translation}</Text>
                        </View>

                        {/* 涉及词汇标签（可选，仅当云端返回时展示） */}
                        {reading.wordsUsed && reading.wordsUsed.length > 0 && (
                            <View style={styles.wordsUsedCard}>
                                <Text style={styles.wordsUsedLabel}>
                                    {t('microReading.wordsUsed')}
                                </Text>
                                <View style={styles.wordsUsedRow}>
                                    {reading.wordsUsed.map((word, idx) => (
                                        <View key={idx} style={styles.wordChip}>
                                            <Text style={styles.wordChipText}>{word}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{t('sessionSummary.errorMessage')}</Text>
                    </View>
                )}

                <View style={{ height: 24 }} />
            </ScrollView>

            {/* 返回首页按钮 */}
            <View style={styles.footer}>
                <Pressable
                    style={styles.homeButton}
                    onPress={() => router.dismissAll()}
                >
                    <Text style={styles.homeButtonText}>{t('microReading.backToHome')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    backButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: Typography.h3,
        color: Colors.ink,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        gap: 16,
    },
    thaiCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    thaiTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.h1,
        color: Colors.ink,
        marginBottom: 10,
    },
    thaiTitleLine: {
        height: 2,
        backgroundColor: Colors.ink,
        marginBottom: 10,
    },
    thaiText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 22,
        color: Colors.ink,
        lineHeight: 38,
    },
    saveArticleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.25)',
    },
    saveArticleButtonDone: {
        backgroundColor: 'rgba(42, 157, 143, 0.08)',
        borderColor: 'rgba(42, 157, 143, 0.2)',
    },
    saveArticleText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.caption,
        color: Colors.accent,
    },
    translationCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        gap: 10,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    translationLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    translationText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.ink,
        lineHeight: 28,
    },
    wordsUsedCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        gap: 10,
        shadowColor: Colors.ink,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    wordsUsedLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.small,
        color: Colors.taupe,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    wordsUsedRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    wordChip: {
        backgroundColor: Colors.thaiGold + '20',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    wordChipText: {
        fontFamily: Typography.sarabunRegular,
        fontSize: Typography.caption,
        color: Colors.accent,
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    errorText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: Typography.body,
        color: Colors.taupe,
        textAlign: 'center',
    },
    footer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
        backgroundColor: Colors.paper,
    },
    homeButton: {
        backgroundColor: Colors.ink,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: Typography.body,
        color: Colors.white,
    },
});
````

## File: cloudbase/functions/ai-engine/index.js
````javascript
// cloudbase/functions/ai-engine/index.js

/**
 * 云函数的主入口
 * @param {object} event - 包含了客户端（前端）发来的所有数据
 * @param {object} context - 包含了运行环境的信息（如当前用户的鉴权信息等）
 */

const { OpenAI } = require('openai');
const { createResponse, aiErrorResponse } = require('./utils/response');
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1', // 这里的魔法在于，不管是什么模型，只要兼容，改个 URL 即可
});
const explainVocab = require('./handlers/explainVocab');
const generateMicroReading = require('./handlers/generateMicroReading');
const analyzePronunciation = require('./handlers/analyzePronunciation');
const extractClozeHints = require('./handlers/extractClozeHints');
// SHELVED: cursor-tracking TTS — 因 GFW 封存
// const textToSpeech = require('./handlers/textToSpeech');
    

exports.main = async (event, context) => {
    // ===== 解析 HTTP 请求 (API网关触发时数据在 body 里) =====
    let requestData = event;
    if (event.body) {
        if (typeof event.body === 'string') {
            try {
                requestData = JSON.parse(event.body);
            } catch (e) {
                console.error('[ai-engine] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, data } = requestData;

    // 🛡️ 初级防御大门：检查约定的暗号 (AppSecret)
    // 只有正确带上我们前端约定钥匙的请求才能进入，防止别人拿我们的 URL 刷额度
    const EXPECTED_SECRET = 'ThaiApp_2026_Secure';
    if (!data || data.appSecret !== EXPECTED_SECRET) {
        console.warn(`[ai-engine] 🚨 拦截了非法访问尝试! Action: ${action}`);
        return createResponse(false, null, 'Unauthorized access: Invalid App Secret', 'ERR_UNAUTHORIZED');
    }

    // 防御通过，为了安全起见，在打印日志前把密码从包裹里拿掉
    const safeData = { ...data };
    delete safeData.appSecret;
    
    console.log(`[ai-engine] received action: ${action}`, safeData);

    if(!action) {
        return createResponse(false, null, 'Missing action parameter', 'ERR_MISSING_ACTION');
    };

    try{
        switch(action){
            case 'explainVocab':
                return await explainVocab(client, data);
            case 'generateMicroReading':
                return await generateMicroReading(client, data);
            case 'analyzePronunciation':
                return await analyzePronunciation(client, data);
            case 'extractClozeHints':
                return await extractClozeHints(client, data);
            // SHELVED: cursor-tracking TTS
            // case 'textToSpeech':
            //     return await textToSpeech(data);
            default:
                return createResponse(false, null, 'Unknown action', 'ERR_UNKNOWN_ACTION');
        }
    }catch(err){
        console.error('[ai-engine] error:', err);
        return aiErrorResponse(err);
    }
}
````

## File: cloudbase/functions/alphabet/handlers/getLetterTest.js
````javascript
// ✅ 获取固定字母测试题
const { createResponse } = require('../utils/response');

async function getLetterTest(db) {
    const res = await db.collection('letter_test_bank')
        .limit(20) // 你说是固定题，不需要随机
        .get();

    return createResponse(true, {
        total: res.data.length,
        questions: res.data
    }, '获取字母测试题成功');
}

module.exports = getLetterTest;
````

## File: cloudbase/functions/alphabet/utils/constants.js
````javascript
/**
 * 常量定义模块
 * 
 * 与前端 src/config/constants.ts 保持一致的设计风格
 * 集中管理所有云函数常量
 */

'use strict';

// ==================== 数据库集合名称 ====================
// 与前端 COLLECTIONS 保持一致
const COLLECTIONS = {
  USERS: 'users',
  VOCABULARY: 'vocabulary',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',
  LETTERS: 'letters',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  LETTER_TEST_BANK: 'letter_test_bank',
  COURSES: 'courses',
  LESSONS: 'lessons',
  PROGRESS: 'progress',
};

// ==================== 掌握程度 ====================
// 使用中文值，便于前端直接显示
const MasteryLevel = Object.freeze({
  UNFAMILIAR: '陌生',
  FUZZY: '模糊',
  REMEMBERED: '记得',
});

// ==================== 学习等级 ====================
// 与前端 LEVELS 保持一致
const LEVELS = Object.freeze({
  BEGINNER_A: 'BEGINNER_A',
  BEGINNER_B: 'BEGINNER_B',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
});

// ==================== SM-2 算法参数 ====================
// 优化版参数，基于艾宾浩斯遗忘曲线
const SM2_PARAMS = Object.freeze({
  INITIAL_EASINESS_FACTOR: 2.5,   // 初始简易度
  MIN_EASINESS_FACTOR: 1.3,       // 最小简易度
  MAX_INTERVAL_DAYS: 180,         // 最大间隔（天）
  FUZZY_MULTIPLIER: 0.8,          // "模糊"时间隔缩短比例
});

// ==================== 早期复习间隔序列 ====================
// 基于艾宾浩斯遗忘曲线优化: 1→2→4→7→14 天
const EARLY_INTERVALS = Object.freeze([1, 2, 4, 7, 14]);

// ==================== 每日学习配置 ====================
const DAILY_LEARNING_CONFIG = Object.freeze({
  MAX_NEW_WORDS: 10,              // 每日新词上限
  MAX_REVIEW_WORDS: 20,           // 每日复习上限
  TOTAL_WORDS_LIMIT: 30,          // 每日总词数上限
});

// ==================== 错误码 ====================
// 统一错误码定义
const ErrorCodes = Object.freeze({
  SUCCESS: 'SUCCESS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VOCABULARY_NOT_FOUND: 'VOCABULARY_NOT_FOUND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  INVALID_MASTERY: 'INVALID_MASTERY',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  SERVER_ERROR: 'SERVER_ERROR',
});

// ==================== 错误消息 ====================
// 与前端 ERROR_MESSAGES 风格一致
const ERROR_MESSAGES = Object.freeze({
  USER_NOT_FOUND: '用户不存在，请检查用户ID或重新登录',
  VOCABULARY_NOT_FOUND: '词汇不存在，请检查词汇ID',
  INVALID_PARAMS: '参数格式错误，请检查输入',
  INVALID_MASTERY: '无效的掌握程度，允许值: 陌生/模糊/记得',
  UNKNOWN_ACTION: '未知操作类型',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
});

// ==================== 支持的 Actions ====================
const SUPPORTED_ACTIONS = Object.freeze([
  'getTodayWords',
  'updateMastery',
  'toggleSkipWord',
  'getVocabularyDetail',
  'getReviewStatistics',
  'getVocabularyList',
  'getSkippedWords',
  'getLetterTest',
  'submitLetterTest',
  'passLetterTest',
  'getTodayMemories',
  'submitMemoryResult',
  'checkModuleAccess',
  'getUserProgress'
]);

module.exports = {
  // 集合
  COLLECTIONS,

  // 枚举
  MasteryLevel,
  LEVELS,
  ErrorCodes,

  // 算法参数
  SM2_PARAMS,
  EARLY_INTERVALS,

  // 配置
  DAILY_LEARNING_CONFIG,

  // 消息
  ERROR_MESSAGES,
  SUPPORTED_ACTIONS,
};
````

## File: cloudbase/functions/alphabet/package.json
````json
{
  "name": "alphabet",
  "version": "1.0.0",
  "description": "Alphabet learning function",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "latest"
  },
  "engines": {
    "node": "18.20.0"
  }
}
````

## File: cloudbase/functions/memory-engine/handlers/submitRoundEvaluation.js
````javascript
'use strict';

/**
 * 提交字母模块的三轮评估结果（每轮一个总分）
 *
 * 设计目标：
 * - 字母用户前端只有“对/错”按钮，不选择 AGAIN/HARD/GOOD/EASY；
 * - 每轮结束时前端计算整体正确率 accuracy，并上传到此 handler，
 *   仅用于记录到 user_alphabet_progress.roundHistory，不改变 SM-2 记忆算法；
 * - 这样可以在不修改 updateMemoryAfterReview 的前提下，保留轮次级别的统计数据。
 */

const { createResponse } = require('../utils/response');

/**
 * @param {Object} db     - cloud.database()
 * @param {Object} params - { userId, entityType, lessonId, roundNumber, totalQuestions, correctCount, accuracy }
 */
async function submitRoundEvaluation(db, params) {
  const {
    userId,
    entityType,
    lessonId,
    roundNumber,
    totalQuestions,
    correctCount,
    accuracy,
  } = params || {};

  if (!userId || !entityType || !lessonId || !roundNumber) {
    return createResponse(
      false,
      null,
      '缺少必填参数: userId, entityType, lessonId, roundNumber',
      'INVALID_PARAMS',
    );
  }

  if (entityType !== 'letter') {
    return createResponse(
      false,
      null,
      'submitRoundEvaluation 目前仅支持 entityType = letter',
      'INVALID_ENTITY_TYPE',
    );
  }

  const total = typeof totalQuestions === 'number' ? totalQuestions : 0;
  const correct = typeof correctCount === 'number' ? correctCount : 0;
  const acc = typeof accuracy === 'number' && !Number.isNaN(accuracy)
    ? accuracy
    : total > 0
      ? correct / total
      : 0;

  const passed = acc >= 0.9;
  const now = new Date().toISOString();

  const col = db.collection('user_alphabet_progress');

  try {
    const existing = await col.where({ userId }).limit(1).get();

    const roundEntry = {
      lessonId,
      roundNumber,
      totalQuestions: total,
      correctCount: correct,
      accuracy: acc,
      passed,
      updatedAt: now,
    };

    if (!existing.data || existing.data.length === 0) {
      // 🔥 修正：首次创建时的 nextRound 计算（防止跨课污染）
      const nextRound = passed
        ? (roundNumber < 3 ? roundNumber + 1 : 1)
        : 1;

      // 🔥 P0-B: 首次创建时也要判定 completedLessons
      const initialCompletedLessons = (passed && roundNumber === 3 && lessonId)
        ? [lessonId]
        : [];

      console.log(`🔍 [P0-B-init] roundNumber: ${roundNumber}, passed: ${passed}, lessonId: ${lessonId || 'N/A'}, initialCompleted: [${initialCompletedLessons.join(',')}], nextRound: ${nextRound}`);

      // 没有进度记录时，插入一条带有 roundHistory 的默认记录
      await col.add({
        data: {
          userId,
          letterProgress: 0.0,
          letterCompleted: false,
          completedLessons: initialCompletedLessons, // 🔥 P0-B: 初始值
          masteredLetterCount: 0,
          totalLetterCount: 80,
          currentRound: nextRound, // 🔥 使用修正后的 nextRound
          roundHistory: [roundEntry],
          createdAt: now,
          updatedAt: now,
        },
      });
    } else {
      const doc = existing.data[0];
      const docId = doc._id;
      const history = Array.isArray(doc.roundHistory) ? doc.roundHistory : [];

      // 替换同一 lessonId + roundNumber 的旧记录
      const filtered = history.filter(
        (r) => !(r.lessonId === lessonId && r.roundNumber === roundNumber),
      );
      filtered.push(roundEntry);

      // 🔥 P0-B: Round3 passed 时写入 completedLessons
      let updatedCompletedLessons = Array.isArray(doc.completedLessons)
        ? [...doc.completedLessons]
        : [];

      const completedLessonsBefore = [...updatedCompletedLessons];

      if (passed && roundNumber === 3 && lessonId) {
        if (!updatedCompletedLessons.includes(lessonId)) {
          updatedCompletedLessons.push(lessonId);
        }
      }

      console.log(`🔍 [P0-B] roundNumber: ${roundNumber}, passed: ${passed}, lessonId: ${lessonId || 'N/A'}, completedBefore: [${completedLessonsBefore.join(',')}], completedAfter: [${updatedCompletedLessons.join(',')}]`);

      // 🔥 修正：nextRound 重置防止跨课污染
      const nextRound = passed
        ? (roundNumber < 3 ? roundNumber + 1 : 1)
        : 1;

      await col.doc(docId).update({
        data: {
          currentRound: nextRound,
          roundHistory: filtered,
          completedLessons: updatedCompletedLessons, // 🔥 P0-B: 写入 completedLessons
          updatedAt: now,
        },
      });
    }

    return createResponse(true, { round: roundEntry }, '提交轮次评估成功');
  } catch (err) {
    console.error('[submitRoundEvaluation] error:', err);
    return createResponse(
      false,
      null,
      err.message || '服务器内部错误',
      'SERVER_ERROR',
    );
  }
}

module.exports = submitRoundEvaluation;
````

## File: cloudbase/functions/memory-engine/utils/constants.js
````javascript
/**
 * 常量定义模块
 * 
 * 与前端 src/config/constants.ts 保持一致的设计风格
 * 集中管理所有云函数常量
 */

'use strict';

// ==================== 数据库集合名称 ====================
// 与前端 COLLECTIONS 保持一致
const COLLECTIONS = {
  USERS: 'users',
  VOCABULARY: 'vocabulary',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',
  LETTERS: 'letters',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  LETTER_TEST_BANK: 'letter_test_bank',
  COURSES: 'courses',
  LESSONS: 'lessons',
  PROGRESS: 'progress',
};

// ==================== 掌握程度 ====================
// 使用中文值，便于前端直接显示
const MasteryLevel = Object.freeze({
  UNFAMILIAR: '陌生',
  FUZZY: '模糊',
  REMEMBERED: '记得',
});

// ==================== 学习等级 ====================
// 与前端 LEVELS 保持一致
const LEVELS = Object.freeze({
  BEGINNER_A: 'BEGINNER_A',
  BEGINNER_B: 'BEGINNER_B',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
});

// ==================== SM-2 算法参数 ====================
// 优化版参数，基于艾宾浩斯遗忘曲线
const SM2_PARAMS = Object.freeze({
  INITIAL_EASINESS_FACTOR: 2.5,   // 初始简易度
  MIN_EASINESS_FACTOR: 1.3,       // 最小简易度
  MAX_INTERVAL_DAYS: 180,         // 最大间隔（天）
  FUZZY_MULTIPLIER: 0.8,          // "模糊"时间隔缩短比例
});

// ==================== 早期复习间隔序列 ====================
// 基于艾宾浩斯遗忘曲线优化: 1→2→4→7→14 天
const EARLY_INTERVALS = Object.freeze([1, 2, 4, 7, 14]);

// ==================== 每日学习配置 ====================
const DAILY_LEARNING_CONFIG = Object.freeze({
  MAX_NEW_WORDS: 10,              // 每日新词上限
  MAX_REVIEW_WORDS: 20,           // 每日复习上限
  TOTAL_WORDS_LIMIT: 30,          // 每日总词数上限
});

// ==================== 错误码 ====================
// 统一错误码定义
const ErrorCodes = Object.freeze({
  SUCCESS: 'SUCCESS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VOCABULARY_NOT_FOUND: 'VOCABULARY_NOT_FOUND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  INVALID_MASTERY: 'INVALID_MASTERY',
  UNKNOWN_ACTION: 'UNKNOWN_ACTION',
  SERVER_ERROR: 'SERVER_ERROR',
});

// ==================== 错误消息 ====================
// 与前端 ERROR_MESSAGES 风格一致
const ERROR_MESSAGES = Object.freeze({
  USER_NOT_FOUND: '用户不存在，请检查用户ID或重新登录',
  VOCABULARY_NOT_FOUND: '词汇不存在，请检查词汇ID',
  INVALID_PARAMS: '参数格式错误，请检查输入',
  INVALID_MASTERY: '无效的掌握程度，允许值: 陌生/模糊/记得',
  UNKNOWN_ACTION: '未知操作类型',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
});

// ==================== 支持的 Actions ====================
const SUPPORTED_ACTIONS = Object.freeze([
  'getTodayWords',
  'updateMastery',
  'toggleSkipWord',
  'getVocabularyDetail',
  'getReviewStatistics',
  'getVocabularyList',
  'getSkippedWords',
  'getLetterTest',
  'submitLetterTest',
  'passLetterTest',
  'getTodayMemories',
  'submitMemoryResult',
  'submitRoundEvaluation',
  'checkModuleAccess',
  'getUserProgress',
  'getAlphabetLessons',
]);

module.exports = {
  // 集合
  COLLECTIONS,

  // 枚举
  MasteryLevel,
  LEVELS,
  ErrorCodes,

  // 算法参数
  SM2_PARAMS,
  EARLY_INTERVALS,

  // 配置
  DAILY_LEARNING_CONFIG,

  // 消息
  ERROR_MESSAGES,
  SUPPORTED_ACTIONS,
};
````

## File: cloudbase/functions/memory-engine/utils/validators.js
````javascript
/**
 * 参数验证模块
 * 
 * 用户、词汇验证及通用验证工具
 */

'use strict';

const { userCollection, vocabularyCollection } = require('./database');
const { MasteryLevel } = require('./constants');

/**
 * 验证用户是否存在
 * 
 * @param {string} userId - 用户ID
 * @returns {Promise<Object|null>} 用户对象或 null
 */
async function validateUser(userId) {
    if (!userId || typeof userId !== 'string') {
        return null;
    }

    try {
        const { data } = await userCollection
            .where({ userId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateUser] Error:', error);
        return null;
    }
}

/**
 * 验证词汇是否存在
 * 
 * @param {string} vocabularyId - 词汇ID
 * @returns {Promise<Object|null>} 词汇对象或 null
 */
async function validateVocabulary(vocabularyId) {
    if (!vocabularyId || typeof vocabularyId !== 'string') {
        return null;
    }

    try {
        const { data } = await vocabularyCollection
            .where({ vocabularyId })
            .limit(1)
            .get();

        return data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('[validateVocabulary] Error:', error);
        return null;
    }
}

/**
 * 验证掌握程度是否有效
 * 
 * @param {string} mastery - 掌握程度
 * @returns {boolean} 是否有效
 */
function isValidMastery(mastery) {
    const validValues = Object.values(MasteryLevel);
    return validValues.includes(mastery);
}

/**
 * 验证并规范化分页参数
 * 
 * @param {number} limit - 限制数量
 * @param {number} offset - 偏移量
 * @param {number} maxLimit - 最大限制 (默认100)
 * @returns {Object} 验证后的分页参数
 */
function validatePagination(limit, offset, maxLimit = 100) {
    return {
        limit: Math.min(Math.max(1, parseInt(limit) || 20), maxLimit),
        offset: Math.max(0, parseInt(offset) || 0),
    };
}

/**
 * 验证必填字符串参数
 * 
 * @param {string} value - 参数值
 * @param {string} name - 参数名 (用于错误消息)
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateRequiredString(value, name) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
        return {
            valid: false,
            error: `${name} 是必填参数且不能为空`,
        };
    }
    return { valid: true };
}

/**
 * 验证布尔参数
 * 
 * @param {any} value - 参数值
 * @param {string} name - 参数名
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateBoolean(value, name) {
    if (typeof value !== 'boolean') {
        return {
            valid: false,
            error: `${name} 必须是布尔值`,
        };
    }
    return { valid: true };
}
/**
 * 通用参数验证函数
 * 
 * @param {Object} params - 需要验证的参数对象
 * @param {Array<string>} requiredFields - 必需字段列表
 * @returns {Object} { isValid: boolean, message?: string }
 */
function validateParams(params, requiredFields) {
    const missing = [];

    for (const field of requiredFields) {
        if (params[field] === undefined || params[field] === null || params[field] === '') {
            missing.push(field);
        }
    }

    if (missing.length > 0) {
        return {
            isValid: false,
            message: `缺少必填参数: ${missing.join(', ')}`
        };
    }

    return { isValid: true };
}

module.exports = {
    validateUser,
    validateVocabulary,
    isValidMastery,
    validatePagination,
    validateRequiredString,
    validateBoolean,
    validateParams,
};
````

## File: cloudbase/functions/memory-engine/package.json
````json
{
  "name": "memory-engine",
  "version": "1.0.0",
  "description": "Unified Memory Engine Cloud Function",
  "main": "index.js",
  "scripts": {
    "deploy": "tcb fn deploy memory-engine",
    "logs": "tcb fn log memory-engine",
    "test": "tcb fn invoke memory-engine --data '{\"action\":\"checkModuleAccess\",\"data\":{\"userId\":\"test\"}}'"
  },
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  },
  "author": "Liang JianYu",
  "license": "MIT",
  "engines": {
    "node": "18.20.0"
  }
}
````

## File: cloudbase/functions/shared/memoryEngine.js
````javascript
/**
 * 统一记忆引擎核心模块
 * 支持字母/单词/句子的统一记忆管理
 * 
 * 修复：wx-server-sdk 不支持 getOne()，改用 get() + data[0]
 */

const { calculateSM2 } = require('./sm2');

/**
 * 创建新的记忆记录
 */
async function createMemoryRecord(db, userId, entityType, entityId, isLocked = false) {

    // 验证参数
    if (!userId || !entityType || !entityId) {
        console.error('[createMemoryRecord] 参数缺失:', { userId, entityType, entityId });
        throw new Error('userId, entityType, entityId 都是必需参数');
    }

    const now = new Date();
    const nextReviewDate = isLocked ? null : now.getTime() + 24 * 60 * 60 * 1000;

    const memoryRecord = {
        userId,
        entityType,
        entityId,
        masteryLevel: 0.0,
        repetition: 0,
        easinessFactor: 2.5,
        interval: 1,
        lastReviewAt: null,
        nextReviewDate,
        correctCount: 0,
        wrongCount: 0,
        streakCorrect: 0,
        isLocked,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };

    try {
        // 尝试插入
        const result = await db.collection('memory_status').add({ data: memoryRecord });

        console.log('[createMemoryRecord] 创建成功:', { userId, entityType, entityId });

        return {
            _id: result._id,
            ...memoryRecord
        };
    } catch (error) {
        // 如果是重复键错误，查询并返回现有记录
        if (error.errCode === -502001 || error.message.includes('duplicate key')) {
            console.log('[createMemoryRecord] 记录已存在，查询返回:', { userId, entityType, entityId });

            const existingResult = await db.collection('memory_status')
                .where({ userId, entityType, entityId })
                .get();

            if (existingResult.data && existingResult.data.length > 0) {
                return existingResult.data[0];
            }
        }

        // 其他错误继续抛出
        console.error('[createMemoryRecord] 创建失败:', error);
        throw error;
    }
}

/**
 * 获取或创建记忆记录
 * 修复：使用 get() 代替 getOne()
 */
async function getOrCreateMemory(db, userId, entityType, entityId, isLocked = false) {
    // 1. 尝试查询现有记录
    const existingMemory = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            entityId
        })
        .get();

    // 2. 如果存在,直接返回第一条
    if (existingMemory.data && existingMemory.data.length > 0) {
        return existingMemory.data[0];
    }

    // 3. 不存在则创建新记录
    return await createMemoryRecord(db, userId, entityType, entityId, isLocked);
}

/**
 * 更新记忆状态(答题后调用)
 */
async function updateMemoryAfterReview(db, userId, entityType, entityId, quality) {
    console.log('【测试】updateMemoryAfterReview 被调用了！', { userId, quality });
    console.log('=== [updateMemoryAfterReview] 开始 ===');
    console.log('参数:', JSON.stringify({ userId, entityType, entityId, quality }));

    try {
        // 1. 获取当前记忆记录
        console.log('步骤1: 获取记忆记录');
        const memory = await getOrCreateMemory(db, userId, entityType, entityId);
        console.log('记忆记录:', JSON.stringify(memory));

        // 2. 映射质量到SM-2评分
        console.log('步骤2: 映射质量');
        const qualityMap = {
            '陌生': 1,
            '模糊': 3,
            '记得': 5
        };
        const sm2Quality = qualityMap[quality] || 3;
        console.log('SM-2质量:', sm2Quality);

        // 3. 计算新的SM-2参数
        const oldInterval = memory.interval !== undefined ? memory.interval : (memory.intervalDays || 1);
        const oldRepetition = memory.repetition !== undefined ? memory.repetition : (memory.reviewStage || 0);

        console.log('步骤3: 调用 calculateSM2');
        console.log('调用参数:', {
            quality,
            interval: oldInterval,
            easinessFactor: memory.easinessFactor,
            repetition: oldRepetition
        });

        const sm2Result = calculateSM2(
            quality,
            oldInterval,
            memory.easinessFactor,
            oldRepetition
        );

        console.log('SM-2结果:', JSON.stringify(sm2Result));

        // 4. 更新掌握度
        console.log('步骤4: 计算新掌握度');
        let newMasteryLevel = memory.masteryLevel;
        if (quality === '记得') {
            newMasteryLevel = Math.min(1.0, memory.masteryLevel + 0.15);
        } else if (quality === '模糊') {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel + 0.05);
        } else {
            newMasteryLevel = Math.max(0.0, memory.masteryLevel - 0.2);
        }
        console.log('新掌握度:', newMasteryLevel);

        // 5. 更新连胜和计数
        console.log('步骤5: 计算连胜');
        const newStreakCorrect = quality === '记得' ? memory.streakCorrect + 1 : 0;
        const newCorrectCount = quality === '记得' ? memory.correctCount + 1 : memory.correctCount;
        const newWrongCount = quality === '陌生' ? memory.wrongCount + 1 : memory.wrongCount;

        // 6. 计算下次复习时间
        console.log('步骤6: 计算下次复习时间');
        const now = new Date();
        const nextReviewDate = now.getTime() + sm2Result.interval * 24 * 60 * 60 * 1000;
        console.log('下次复习时间:', nextReviewDate);

        // 7. 准备更新数据
        console.log('步骤7: 准备更新数据库');
        const updateData = {
            masteryLevel: newMasteryLevel,
            repetition: sm2Result.repetitions,
            easinessFactor: sm2Result.easinessFactor,
            interval: sm2Result.interval,
            lastReviewAt: now.toISOString(),
            nextReviewDate: nextReviewDate,
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            streakCorrect: newStreakCorrect,
            updatedAt: now.toISOString()
        };

        console.log('更新数据对象:', JSON.stringify(updateData));

        // 检查是否有 undefined
        for (const [key, value] of Object.entries(updateData)) {
            if (value === undefined) {
                console.error(`❌ 发现 undefined 值: ${key}`);
            }
        }

        // 8. 执行更新
        console.log('步骤8: 执行数据库更新');
        await db.collection('memory_status')
            .where({
                userId,
                entityType,
                entityId
            })
            .update({
                data: updateData   // ✅ CloudBase 必须这样写
            });

        console.log('✅ 更新成功');

        return {
            entityId,
            entityType,
            masteryLevel: newMasteryLevel,
            repetition: sm2Result.repetitions,
            easinessFactor: sm2Result.easinessFactor,
            interval: sm2Result.interval,
            nextReviewDate: nextReviewDate,
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            streakCorrect: newStreakCorrect
        };

    } catch (error) {
        console.error('❌ [updateMemoryAfterReview] 错误:', error);
        console.error('错误堆栈:', error.stack);
        throw error;
    }
}

/**
 * 获取今日待复习的实体
 */
async function getTodayReviewEntities(db, userId, entityType, limit = 20) {
    const now = new Date();

    const result = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            isLocked: false,
            nextReviewDate: db.command.lte(now.getTime())
        })
        .orderBy('nextReviewDate', 'asc')
        .limit(limit)
        .get();

    return result.data || [];
}

/**
 * 检查并解锁下一阶段学习
 */
// async function checkAndUnlockNextStage(db, userId) {

//   if (process.env.FORCE_UNLOCK === 'true') {
//     return {
//       allowed: true,
//       progress: 100,
//       stage: "all",
//       message: '【调试模式】强制解锁'
//     };
//   }

//   // 修复：使用 get() + data[0]
//   const progressResult = await db.collection('user_progress')
//     .where({ userId })
//     .get();

//   if (!progressResult.data || progressResult.data.length === 0) {
//     await initUserProgress(db, userId);
//     return {
//       unlocked: false,
//       stage: 'letter',
//       message: '初始化学习进度成功'
//     };
//   }

//   const progress = progressResult.data[0];

//   if (!progress.letterCompleted) {
//     const letterMemories = await db.collection('memory_status')
//       .where({
//         userId,
//         entityType: 'letter'
//       })
//       .get();

//     const totalLetters = 44;
//     const masteredLetters = letterMemories.data.filter(m => m.masteryLevel >= 0.7).length;
//     const letterProgress = masteredLetters / totalLetters;

//     if (letterProgress >= 0.95) {
//       await db.collection('user_progress').where({ userId }).update({
//         data: {
//           letterCompleted: true,
//           letterProgress: 1.0,
//           wordUnlocked: true,
//           currentStage: 'word',
//           updatedAt: new Date().toISOString()
//         }
//       });

//       await db.collection('memory_status')
//         .where({
//           userId,
//           entityType: 'word',
//           isLocked: true
//         })
//         .update({
//           data: {
//             isLocked: false,
//             nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
//           }
//         });

//       return {
//         unlocked: true,
//         stage: 'word',
//         message: '恭喜!字母学习完成,单词学习已解锁!'
//       };
//     }

//     return {
//       unlocked: false,
//       stage: 'letter',
//       progress: letterProgress,
//       remaining: Math.ceil((0.95 - letterProgress) * totalLetters),
//       message: `还需掌握 ${Math.ceil((0.95 - letterProgress) * totalLetters)} 个字母`
//     };
//   }

//   return {
//     unlocked: false,
//     stage: progress.currentStage,
//     message: '继续加油!'
//   };
// }

/**
 * 初始化用户的学习进度记录
 */
async function initUserProgress(db, userId) {
    const now = new Date();

    const progressRecord = {
        userId,
        letterCompleted: false,
        letterProgress: 0.0,
        wordUnlocked: false,
        wordProgress: 0.0,
        sentenceUnlocked: false,
        sentenceProgress: 0.0,
        articleUnlocked: false,
        currentStage: 'letter',
        totalStudyDays: 0,
        streakDays: 0,
        lastStudyDate: null,
        createdAt: now,
        updatedAt: now
    };

    await db.collection('user_progress').add({ data: progressRecord });
    return progressRecord;
}

/**
 * 检查模块访问权限
 * 修复：使用 get() + data[0]
 */
async function checkModuleAccess(db, userId, moduleType) {

    // ✅✅✅【调试总开关：跳过所有学习锁】
    if (process.env.FORCE_UNLOCK === 'true') {
        console.warn('⚠️ FORCE_UNLOCK 已开启, 强制放行模块:', moduleType);
        return {
            allowed: true,
            progress: {
                letterCompleted: true,
                letterProgress: 1,
                wordUnlocked: true,
                sentenceUnlocked: true,
                articleUnlocked: true,
                currentStage: moduleType
            }
        };
    }

    const progressResult = await db.collection('user_progress')
        .where({ userId })
        .get();

    if (!progressResult.data || progressResult.data.length === 0) {
        return {
            allowed: false,
            errorCode: 'USER_PROGRESS_NOT_FOUND',
            message: '用户学习进度不存在,请联系管理员'
        };
    }

    const progress = progressResult.data[0];

    // ✅ 字母模块永远允许访问
    if (moduleType === 'letter') {
        return {
            allowed: true,
            progress
        };
    }

    // ✅ 其他所有模块只依赖 letterCompleted
    if (!progress.letterCompleted) {
        return {
            allowed: false,
            errorCode: 'MODULE_LOCKED',
            message: `请先完成字母学习（当前进度：${Math.round(progress.letterProgress * 100)}%）`,
            progress
        };
    }

    // ✅ 字母完成 → 全部模块放行
    return {
        allowed: true,
        progress
    };
}

module.exports = {
    createMemoryRecord,
    getOrCreateMemory,
    updateMemoryAfterReview,
    getTodayReviewEntities,
    // checkAndUnlockNextStage,
    initUserProgress,
    checkModuleAccess
};
````

## File: cloudbase/functions/user-login/index.js
````javascript
// functions/user-login/index.js
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

exports.main = async (event, context) => {
  try {
    // Parse request body if coming from HTTP trigger
    let requestData = event;
    if (typeof event.body === 'string') {
      try {
        requestData = JSON.parse(event.body);
      } catch (e) {
        return {
          success: false,
          error: 'Invalid JSON in request body',
          code: 'INVALID_JSON'
        };
      }
    } else if (event.body && typeof event.body === 'object') {
      requestData = event.body;
    }

    const { email, password } = requestData;

    // ===== Validation =====
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
        code: 'INVALID_INPUT'
      };
    }

    // ===== Find user by email =====
    const userResult = await db.collection('users')
      .where({
        email: email.toLowerCase()
      })
      .get();
    console.log('User result:', userResult);

    if (userResult.data.length === 0) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
        
      };
    }

    const user = userResult.data[0];

    // ===== Verify password =====
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // ===== Check if account is active =====
    if (!user.isActive) {
      return {
        success: false,
        error: 'Account is deactivated',
        code: 'ACCOUNT_DEACTIVATED'
      };
    }

    // ===== Update last login =====
    await db.collection('users')
      .doc(user._id)
      .update({
        data: {
          lastLogin: new Date().toISOString()
        }
      });

    // ===== Generate JWT token =====
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // ===== Return user data (exclude password hash and _id) =====
    const { passwordHash, _id, ...userResponse } = user;

    return {
      success: true,
      data: {
        user: userResponse,
        token,
        expiresIn: 604800
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Login failed',
      code: 'SERVER_ERROR'
    };
  }
};
````

## File: cloudbase/test-all-apis.sh
````bash
#!/bin/bash

MEMORY_ENGINE_URL="https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/memory-engine"
LEARN_VOCAB_URL="https://cloud1-1gjcyrdd7ab927c6-1387301748.ap-shanghai.app.tcloudbase.com/learn-vocab"
USER_ID="u_1764867682959_dwqxjcjoo"

echo "======================================"
echo "Thai Learning App - 正确的 API 测试"
echo "======================================"
echo ""

# ============ memory-engine 测试 ============
echo "📦 memory-engine 云函数测试"
echo "========================================="
echo ""

echo "1️⃣ submitMemoryResult (✅ 正确端点)"
curl -s -X POST "$MEMORY_ENGINE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"submitMemoryResult\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"results\": [{
        \"entityType\": \"letter\",
        \"entityId\": \"TH_C_02\",
        \"quality\": \"模糊\"
      }]
    }
  }" | jq .
echo ""
echo ""

echo "2️⃣ getTodayMemories (✅ 正确端点)"
curl -s -X POST "$MEMORY_ENGINE_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getTodayMemories\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"entityType\": \"letter\",
      \"limit\": 20
    }
  }" | jq .
echo ""
echo ""

# ============ learn-vocab 测试 ============
echo "📚 learn-vocab 云函数测试"
echo "========================================="
echo ""

echo "3️⃣ getTodayWords"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getTodayWords\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"limit\": 20,
      \"offset\": 0
    }
  }" | jq .
echo ""
echo ""

echo "4️⃣ getReviewStatistics"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getReviewStatistics\",
    \"data\": {
      \"userId\": \"$USER_ID\"
    }
  }" | jq .
echo ""
echo ""

echo "5️⃣ getVocabularyList"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getVocabularyList\",
    \"data\": {
      \"limit\": 5,
      \"offset\": 0
    }
  }" | jq .
echo ""
echo ""

echo "6️⃣ getVocabularyDetail"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getVocabularyDetail\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"vocabularyId\": \"BEGINNER_A_7\"
    }
  }" | jq .
echo ""
echo ""

echo "7️⃣ updateMastery"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"updateMastery\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"vocabularyId\": \"BEGINNER_A_7\",
      \"mastery\": \"记得\"
    }
  }" | jq .
echo ""
echo ""

echo "8️⃣ toggleSkipWord"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"toggleSkipWord\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"vocabularyId\": \"BEGINNER_A_7\",
      \"skipped\": true
    }
  }" | jq .
echo ""
echo ""

echo "9️⃣ getSkippedWords"
curl -s -X POST "$LEARN_VOCAB_URL" \
  -H 'Content-Type: application/json' \
  -d "{
    \"action\": \"getSkippedWords\",
    \"data\": {
      \"userId\": \"$USER_ID\",
      \"limit\": 10,
      \"offset\": 0
    }
  }" | jq .
echo ""
echo ""

echo "======================================"
echo "✅ 测试完成!"
echo "======================================"
````

## File: src/components/common/FloatingBubbles.tsx
````typescript
// src/components/common/FloatingBubbles.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Sparkles, PlayCircle } from 'lucide-react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ReviewItem } from '../../entities/types/entities';

interface FloatingBubblesProps {
  reviews: ReviewItem[];
  onOpenReview: () => void;
}

const { width } = Dimensions.get('window');

export const FloatingBubbles: React.FC<FloatingBubblesProps> = ({
  reviews,
  onOpenReview,
}) => {
  if (reviews.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Floating Title */}
      <View style={styles.titleContainer}>
        <View style={styles.titleBadge}>
          <Sparkles size={12} color={Colors.thaiGold} />
          <Text style={styles.titleText}>待复习内容</Text>
        </View>
      </View>

      {/* Card Stack */}
      <View>
        <Pressable
          onPress={onOpenReview}
          style={styles.cardStackContainer}
        >
          {reviews.slice(0, 3).reverse().map((review, index) => (
            <Card key={review.id} review={review} index={index} />
          ))}

          {/* Notification Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{reviews.length}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

interface CardProps {
  review: ReviewItem;
  index: number;
}

const Card: React.FC<CardProps> = ({ review, index }) => {
  const offsetY = index * 10;
  const scale = 1 - index * 0.04;
  const cardOpacity = 1 - index * 0.1;
  const rotate = index % 2 === 0 ? '-1.5deg' : '1.5deg';

  return (
    <View
      style={[
        styles.card,
        {
          transform: [
            { translateY: offsetY },
            { scale },
            { rotate },
          ],
          zIndex: 30 - index,
          opacity: cardOpacity,
        },
      ]}
    >
      {/* Content */}
      <View style={styles.cardContent}>
        {/* Top Row */}
        <View style={styles.cardTopRow}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>
              {review.type === 'New' ? '新词' : '复习'}
            </Text>
          </View>
          <View style={styles.statusDot} />
        </View>

        {/* Middle */}
        <View style={styles.cardMiddleRow}>
          <View>
            <Text style={styles.charText}>{review.char}</Text>
            <Text style={styles.phoneticText}>{review.phonetic}</Text>
          </View>
          <View style={styles.playButton}>
            <PlayCircle size={20} color={Colors.white} />
          </View>
        </View>

        {/* Bottom Progress */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>
      </View>

      {/* Background Gradient */}
      <View style={styles.backgroundGradient} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 340,
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titleContainer: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.white,
  },
  cardStackContainer: {
    width: Math.min(320, width - 48),
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: 256,
    height: 176,
    backgroundColor: Colors.ink,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  typeTagText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.thaiGold,
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.thaiGold,
  },
  cardMiddleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charText: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 36,
    lineHeight: 40,
    color: Colors.white,
    marginBottom: 4,
  },
  phoneticText: {
    fontFamily: Typography.playfairRegular,
    fontSize: 14,
    fontStyle: 'italic',
    color: 'rgba(229, 226, 219, 0.8)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    width: '66%',
    height: '100%',
    backgroundColor: Colors.thaiGold,
  },
  backgroundGradient: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DC2626',
    borderWidth: 2,
    borderColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});
````

## File: src/components/learning/alphabet/MiniReviewQuestion.tsx
````typescript
// src/components/learning/alphabet/MiniReviewQuestion.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Audio } from 'expo-av';
import { Volume2 } from 'lucide-react-native';

import type { MiniReviewQuestion as MiniReviewQuestionType } from '@/src/entities/types/phonicsRule.types';
import type { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPE_ICONS,
} from '@/src/entities/enums/QuestionType.enum';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// ==================== Props 接口 ====================

interface MiniReviewQuestionProps {
  /** 题目数据 */
  question: MiniReviewQuestionType;

  /** 答题回调(isCorrect, questionType) */
  onAnswer: (isCorrect: boolean, type: QuestionType) => void;

  /** 下一题回调 */
  onNext: () => void;

  /** 返回回调(可选) */
  onBack?: () => void;
}

// ==================== 主组件 ====================

export function MiniReviewQuestion({
  question,
  onAnswer,
  onNext,
  onBack,
}: MiniReviewQuestionProps) {
  const { t } = useTranslation();
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ===== 清理音频资源 =====
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }
    };
  }, [question.id]); // 题目切换时清理

  // ===== 播放音频 =====
  const handlePlayAudio = useCallback(async () => {
    if (!question.audioUrl) return;

    try {
      setIsPlaying(true);

      if (soundRef.current) {
        await soundRef.current.replayAsync();
        setIsPlaying(false);
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: question.audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.warn('[MiniReviewQuestion] 播放音频失败:', error);
      setIsPlaying(false);
    }
  }, [question.audioUrl]);

  // ===== 选择答案 =====
  const handleSelectOption = useCallback(
    (optionValue: string) => {
      if (answered) return;

      setSelectedOption(optionValue);
      setAnswered(true);

      const isCorrect = optionValue === question.correct;
      onAnswer(isCorrect, question.type);
    },
    [answered, question.correct, question.type, onAnswer]
  );

  // ===== 渲染声学提示 =====
  const renderAcousticHint = () => {
    if (!question.acousticHint) return null;

    const { aspirated, voiceless, class: consonantClass } = question.acousticHint;

    return (
      <View style={styles.hintContainer}>
        <Text style={styles.hintTitle}>{t('components.miniReview.hint', '💡 提示:')}</Text>
        {aspirated !== undefined && (
          <Text style={styles.hintText}>
            • {aspirated ? t('components.miniReview.aspirated', '送气音 (aspirated)') : t('components.miniReview.unaspirated', '不送气音 (unaspirated)')}
          </Text>
        )}
        {voiceless !== undefined && (
          <Text style={styles.hintText}>
            • {voiceless ? t('components.miniReview.voiceless', '清音 (voiceless)') : t('components.miniReview.voiced', '浊音 (voiced)')}
          </Text>
        )}
        {consonantClass && (
          <Text style={styles.hintText}>
            • {t('components.miniReview.consonantClass', '辅音类')}: {
              consonantClass === 'high' ? t('components.miniReview.highClass', '高辅音') :
                consonantClass === 'mid' ? t('components.miniReview.midClass', '中辅音') :
                  t('components.miniReview.lowClass', '低辅音')
            }
          </Text>
        )}
      </View>
    );
  };

  // ===== 渲染音高可视化 =====
  const renderPitchVisualization = () => {
    if (!question.pitchVisualization?.enable) return null;
    if (!answered && !question.pitchVisualization.showAfterAnswer) return null;

    const { curve } = question.pitchVisualization;

    return (
      <View style={styles.pitchContainer}>
        <Text style={styles.pitchTitle}>{t('components.miniReview.pitchCurve', '🎵 音高曲线')}</Text>
        <View style={styles.pitchChart}>
          {curve.map((height, index) => (
            <View
              key={index}
              style={[
                styles.pitchBar,
                { height: `${(height / 5) * 100}%` },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  // ===== 判断题型是否需要音频 =====
  const needsAudio = [
    'sound-to-letter',
    'aspirated-contrast',
    'vowel-length-contrast',
    'tone-perception',
  ].includes(question.type);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* 题型标题 */}
      <View style={styles.header}>
        <Text style={styles.typeIcon}>
          {QUESTION_TYPE_ICONS[question.type] || '📝'}
        </Text>
        <Text style={styles.typeLabel}>
          {t(QUESTION_TYPE_LABELS[question.type])}
        </Text>
      </View>

      {/* 题干 */}
      <Text style={styles.question}>{t(question.question)}</Text>

      {/* 副标题 */}
      {question.subtitle && (
        <Text style={styles.subtitle}>{t(question.subtitle)}</Text>
      )}

      {/* 音频播放按钮 */}
      {needsAudio && question.audioUrl && (
        <TouchableOpacity
          style={styles.audioButton}
          onPress={handlePlayAudio}
          disabled={isPlaying}
          accessibilityRole="button"
          accessibilityLabel="播放发音"
        >
          {isPlaying ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Volume2 size={20} color={Colors.white} />
              <Text style={styles.audioButtonText}>{t('components.miniReview.playSound', '播放发音')}</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* 声学提示(答题前显示) */}
      {!answered && renderAcousticHint()}

      {/* 选项 */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option.value;
          const isCorrect = answered && option.value === question.correct;
          const isWrong = answered && isSelected && option.value !== question.correct;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
              ]}
              onPress={() => handleSelectOption(option.value)}
              disabled={answered}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {t(option.label)}
                </Text>
                {option.example && (
                  <Text style={styles.optionExample}>{t(option.example)}</Text>
                )}
              </View>
              {answered && (
                <Text style={styles.feedbackIcon}>
                  {isCorrect ? '✓' : isWrong ? '✗' : ''}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 解释(答题后显示) */}
      {answered && question.explanation && (
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationText}>
            💡 {t(question.explanation)}
          </Text>
        </View>
      )}

      {/* 音高可视化(答题后显示) */}
      {answered && renderPitchVisualization()}

      {/* 下一题按钮 */}
      {answered && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={onNext}
          accessibilityRole="button"
          accessibilityLabel={t('alphabet.nextQuestion', '下一题 →')}
        >
          <Text style={styles.nextButtonText}>{t('alphabet.nextQuestion', '下一题 →')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  typeIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  typeLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
  },
  question: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 20,
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    textAlign: 'center',
    marginBottom: 20,
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    minHeight: 50,
  },
  audioButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
    marginLeft: 8,
  },
  hintContainer: {
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 4,
    borderLeftColor: Colors.thaiGold,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  hintTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 8,
  },
  hintText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.taupe,
    marginBottom: 4,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.sand,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  optionSelected: {
    borderColor: Colors.thaiGold,
    backgroundColor: '#FFF9E6',
  },
  optionCorrect: {
    borderColor: '#2A9D8F',
    backgroundColor: '#E8F5F3',
  },
  optionWrong: {
    borderColor: '#E63946',
    backgroundColor: '#FFE8EA',
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
  },
  optionLabelSelected: {
    color: Colors.thaiGold,
  },
  optionExample: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    marginTop: 4,
  },
  feedbackIcon: {
    fontSize: 24,
    marginLeft: 12,
  },
  explanationContainer: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#457B9D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  explanationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.ink,
  },
  pitchContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  pitchTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
    marginBottom: 12,
    textAlign: 'center',
  },
  pitchChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 100,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
  },
  pitchBar: {
    width: 40,
    backgroundColor: Colors.thaiGold,
    borderRadius: 4,
  },
  nextButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
````

## File: src/components/learning/alphabet/PhonicsRuleCard.tsx
````typescript
// src/components/learning/alphabet/PhonicsRuleCard.tsx

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { X } from 'lucide-react-native';

import type { PhonicsRule } from '@/src/entities/types/phonicsRule.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

// ==================== Props 接口 ====================

interface PhonicsRuleCardProps {
  /** 拼读规则数据 */
  rule: PhonicsRule;

  /** 完成回调(倒计时结束或用户点击继续) */
  onComplete: () => void;

  /** 是否显示关闭按钮(可选,默认false) */
  showCloseButton?: boolean;

  /** 关闭回调(可选) */
  onClose?: () => void;
}

// ==================== 主组件 ====================

export function PhonicsRuleCard({ rule, onComplete, showCloseButton = false, onClose, }: PhonicsRuleCardProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(rule.duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  // ===== 倒计时逻辑 =====
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  // ===== 音频播放 =====
  const handlePlayExample = useCallback(async () => {
    console.log('👆 [PhonicsRuleCard] Interactive Example Clicked');
    console.log('📊 [PhonicsRuleCard] Data:', rule.interactiveExample);
    console.log('🔗 [PhonicsRuleCard] Source Rule:', { id: rule.id, title: rule.title, lessonId: rule.lessonId });

    if (!rule.interactiveExample?.audioUrl) {
      console.warn('⚠️ [PhonicsRuleCard] No audioUrl found in interactiveExample');
      return;
    }

    try {
      setIsPlaying(true);

      // 如果已有音频实例,直接重播
      if (soundRef.current) {
        await soundRef.current.replayAsync();
        setIsPlaying(false);
        return;
      }

      // 创建新音频实例
      const { sound } = await Audio.Sound.createAsync(
        { uri: rule.interactiveExample.audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;

      // 监听播放完成
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.warn('[PhonicsRuleCard] 播放音频失败:', error);
      setIsPlaying(false);
    }
  }, [rule.interactiveExample]);

  // ===== 清理音频资源 =====
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }
    };
  }, []);

  // ===== 渲染可视化图表 =====
  const renderVisualChart = () => {
    if (!rule.visualChart) return null;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{t('components.phonics.title', '声调规则表')}</Text>

        {/* ... */}
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* ... close button and timer ... */}
        {showCloseButton && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={24} color={Colors.taupe} />
          </TouchableOpacity>
        )}

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* 标题 */}
          <Text style={styles.title}>{rule.title}</Text>

          {/* 规则内容 */}
          <View style={styles.contentContainer}>
            {rule.content.map((line, index) => (
              <Text
                key={index}
                style={[
                  styles.contentLine,
                  line === '' && styles.emptyLine,
                ]}
              >
                {line}
              </Text>
            ))}
          </View>

          {/* 交互式示例 */}
          {rule.interactiveExample && (
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleLabel}>{t('components.phonics.interactive', '📌 交互示例')}</Text>
              <Pressable
                style={styles.exampleButton}
                onPress={handlePlayExample}
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <View style={styles.exampleParts}>
                      <Text style={styles.exampleConsonant}>
                        {rule.interactiveExample.consonant}
                      </Text>
                      <Text style={styles.examplePlus}>+</Text>
                      <Text style={styles.exampleVowel}>
                        {rule.interactiveExample.vowel}
                      </Text>
                      <Text style={styles.exampleEquals}>=</Text>
                      <Text style={styles.exampleSyllable}>
                        {rule.interactiveExample.syllable}
                      </Text>
                    </View>
                    <Text style={styles.examplePronunciation}>
                      [{rule.interactiveExample.pronunciation}]
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          )}

          {/* 可视化图表 */}
          {renderVisualChart()}
        </ScrollView>

        {/* 继续按钮 */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onComplete}
        >
          <Text style={styles.continueText}>{t('components.phonics.understood', '明白了,继续学习 →')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  timerContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  timerText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 22,
    color: Colors.thaiGold,
    marginBottom: 20,
    textAlign: 'center',
  },
  contentContainer: {
    marginBottom: 20,
  },
  contentLine: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.ink,
    marginBottom: 4,
  },
  emptyLine: {
    height: 8,
  },
  exampleContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  exampleLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    marginBottom: 12,
  },
  exampleButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
  },
  exampleParts: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  exampleConsonant: {
    fontFamily: Typography.playfairBold,
    fontSize: 32,
    color: Colors.white,
  },
  examplePlus: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 8,
  },
  exampleVowel: {
    fontFamily: Typography.playfairBold,
    fontSize: 32,
    color: Colors.white,
  },
  exampleEquals: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 8,
  },
  exampleSyllable: {
    fontFamily: Typography.playfairBold,
    fontSize: 36,
    color: Colors.white,
  },
  examplePronunciation: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  chartContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.sand,
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
    padding: 12,
    backgroundColor: '#F5F5F5',
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand,
  },
  chartCell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  chartHeaderCell: {
    backgroundColor: '#FFF9E6',
  },
  chartFirstColumn: {
    backgroundColor: '#F5F5F5',
    flex: 1.2,
  },
  chartInteractiveCell: {
    backgroundColor: '#F0F8FF',
  },
  chartHeaderText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
    textAlign: 'center',
  },
  chartCellText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
    textAlign: 'center',
  },
  chartFirstColumnText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.thaiGold,
  },
  chartToneText: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
  },
  continueButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  continueText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
````

## File: src/constants/colors.ts
````typescript
// src/constants/colors.ts
export const Colors = {
    paper: '#FAF9F6',
    ink: '#1A1A1A',
    sand: '#E5E2DB',
    taupe: '#898784ff',
    thaiGold: '#D4AF37',
    accent: '#B8956A',
    white: '#FFFFFF',
    glassWhite: 'rgba(255, 255, 255, 0.85)',
    error: '#DC2626',
    red: {
      50: '#FEF2F2',
      600: '#DC2626',
    },
     success: '#2A9D8F',
  } as const;
````

## File: src/entities/enums/QualityScore.enum.ts
````typescript
// src/entities/enums/QualityScore.enum.ts

export enum QualityScore {
  UNKNOWN = 0,    // 完全陌生
  FORGET = 1,     // 忘了
  DIFFICULT = 2,  // 很难
  FUZZY = 3,      // 模糊
  HESITATE = 4,   // 犹豫
  KNOW = 5        // 记得
}

export enum QualityButton {
  KNOW = '记得',
  FUZZY = '模糊',
  FORGET = '陌生',
}

// 映射：按钮 + 尝试次数 => 分数
export const calculateQualityScore = (button: QualityButton, attempts: number): QualityScore => {
  switch (button) {
    case QualityButton.KNOW:
      return attempts === 1 ? QualityScore.KNOW : QualityScore.HESITATE;
    case QualityButton.FUZZY:
      return attempts === 1 ? QualityScore.FUZZY : QualityScore.DIFFICULT;
    case QualityButton.FORGET:
      return QualityScore.FORGET;
    default:
      return QualityScore.UNKNOWN;
  }
};

export const QUALITY_SCORE_MAP: Record<QualityButton, number> = {
  [QualityButton.KNOW]: 5,
  [QualityButton.FUZZY]: 3,
  [QualityButton.FORGET]: 1,
};

export const ATTEMPTS_INCREMENT_MAP: Record<QualityButton, number> = {
  [QualityButton.KNOW]: 3,
  [QualityButton.FUZZY]: 1,
  [QualityButton.FORGET]: 2,
};
````

## File: src/entities/enums/QuestionType.enum.ts
````typescript
// src/entities/enums/QuestionType.enum.ts

/**
 * 字母复习题型枚举
 * 
 * 基于泰语语音学优化的12种题型系统
 * 包含送气音对比、元音长短对比、声调听辨等核心训练
 * 
 * @version 3.0.0
 * @see lettersQuestionGenerator.ts
 */
export enum QuestionType {
    // ===== 基础题型(Lesson 1-2) =====
    /** 听音选字母 */
    SOUND_TO_LETTER = 'sound-to-letter',
    /** 看字母选发音 */
    LETTER_TO_SOUND = 'letter-to-sound',

    // ===== 拼读题型(Lesson 2-3) =====
    /** 拼读组合: 辅音+元音 */
    SYLLABLE = 'syllable',
    /** 音素分离: 发音→辅音 */
    REVERSE_SYLLABLE = 'reverse-syllable',
    /** 缺字填空 */
    MISSING_LETTER = 'missing-letter',

    // ===== 🔴 核心对比题型(Lesson 2-4) =====
    /** 送气音对比(最小对立组训练) - ก/ข/ค */
    ASPIRATED_CONTRAST = 'aspirated-contrast',
    /** 元音长短对比 - า/ะ */
    VOWEL_LENGTH_CONTRAST = 'vowel-length-contrast',

    // ===== 进阶题型(Lesson 3-5) =====
    /** 尾辅音规则 */
    FINAL_CONSONANT = 'final-consonant',
    /** 声调听辨(含音高可视化) */
    TONE_PERCEPTION = 'tone-perception',

    // ===== 高级题型(Lesson 4-6) =====
    /** 辅音分类(高/中/低) */
    CLASS_CHOICE = 'class-choice',
    /** 字母名称识别 */
    LETTER_NAME = 'letter-name',
    /** 首音判断 */
    INITIAL_SOUND = 'initial-sound',
}

/**
 * 题型显示名称映射
 */
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    [QuestionType.SOUND_TO_LETTER]: 'questionType.soundToLetter',
    [QuestionType.LETTER_TO_SOUND]: 'questionType.letterToSound',
    [QuestionType.SYLLABLE]: 'questionType.syllable',
    [QuestionType.REVERSE_SYLLABLE]: 'questionType.reverseSyllable',
    [QuestionType.MISSING_LETTER]: 'questionType.missingLetter',
    [QuestionType.ASPIRATED_CONTRAST]: 'questionType.aspiratedContrast',
    [QuestionType.VOWEL_LENGTH_CONTRAST]: 'questionType.vowelLengthContrast',
    [QuestionType.FINAL_CONSONANT]: 'questionType.finalConsonant',
    [QuestionType.TONE_PERCEPTION]: 'questionType.tonePerception',
    [QuestionType.CLASS_CHOICE]: 'questionType.classChoice',
    [QuestionType.LETTER_NAME]: 'questionType.letterName',
    [QuestionType.INITIAL_SOUND]: 'questionType.initialSound',
};

/**
 * 题型难度等级(1-5)
 */
export const QUESTION_TYPE_DIFFICULTY: Record<QuestionType, 1 | 2 | 3 | 4 | 5> = {
    [QuestionType.SOUND_TO_LETTER]: 1,
    [QuestionType.LETTER_TO_SOUND]: 1,
    [QuestionType.SYLLABLE]: 2,
    [QuestionType.REVERSE_SYLLABLE]: 3,
    [QuestionType.MISSING_LETTER]: 2,
    [QuestionType.ASPIRATED_CONTRAST]: 3,
    [QuestionType.VOWEL_LENGTH_CONTRAST]: 2,
    [QuestionType.FINAL_CONSONANT]: 4,
    [QuestionType.TONE_PERCEPTION]: 4,
    [QuestionType.CLASS_CHOICE]: 3,
    [QuestionType.LETTER_NAME]: 2,
    [QuestionType.INITIAL_SOUND]: 2,
};

/**
 * 音频需求类型定义
 */
export type AudioRequirementType =
    | 'letter'        // 单字母发音
    | 'syllable'      // 音节发音
    | 'minimal-pair'  // 最小对立组(需动态生成)
    | 'tone-set';     // 5个声调变体(需TTS生成)

/**
 * 题型所需的音频类型
 */
export const QUESTION_TYPE_AUDIO_REQUIREMENTS: Record<
    QuestionType,
    AudioRequirementType
> = {
    [QuestionType.SOUND_TO_LETTER]: 'letter',
    [QuestionType.LETTER_TO_SOUND]: 'letter',
    [QuestionType.SYLLABLE]: 'syllable',
    [QuestionType.REVERSE_SYLLABLE]: 'syllable',
    [QuestionType.MISSING_LETTER]: 'syllable',
    [QuestionType.ASPIRATED_CONTRAST]: 'minimal-pair',
    [QuestionType.VOWEL_LENGTH_CONTRAST]: 'minimal-pair',
    [QuestionType.FINAL_CONSONANT]: 'syllable',
    [QuestionType.TONE_PERCEPTION]: 'tone-set',
    [QuestionType.CLASS_CHOICE]: 'letter',
    [QuestionType.LETTER_NAME]: 'letter',
    [QuestionType.INITIAL_SOUND]: 'letter',
};

/**
 * 根据课程阶段获取推荐题型权重
 * 
 * @param lessonId - 课程ID (lesson1-lesson6)
 * @returns 题型权重映射 (权重总和为1)
 */
export function getQuestionTypeWeights(
    lessonId: string
): Partial<Record<QuestionType, number>> {
    switch (lessonId) {
        case 'lesson1':
            // 基础听辨+拼读
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.4,
                [QuestionType.LETTER_TO_SOUND]: 0.4,
                [QuestionType.SYLLABLE]: 0.2,
            };

        case 'lesson2':
            // 引入元音长短对比
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.25,
                [QuestionType.SYLLABLE]: 0.3,
                [QuestionType.VOWEL_LENGTH_CONTRAST]: 0.25,
                [QuestionType.REVERSE_SYLLABLE]: 0.2,
            };

        case 'lesson3':
            // 🔴 重点:送气音对比训练
            return {
                [QuestionType.ASPIRATED_CONTRAST]: 0.35,
                [QuestionType.SYLLABLE]: 0.25,
                [QuestionType.MISSING_LETTER]: 0.2,
                [QuestionType.VOWEL_LENGTH_CONTRAST]: 0.2,
            };

        case 'lesson4':
            // 🔴 重点:声调系统训练
            return {
                [QuestionType.TONE_PERCEPTION]: 0.4,
                [QuestionType.CLASS_CHOICE]: 0.25,
                [QuestionType.ASPIRATED_CONTRAST]: 0.2,
                [QuestionType.FINAL_CONSONANT]: 0.15,
            };

        case 'lesson5':
            // 综合复习,声调为主
            return {
                [QuestionType.TONE_PERCEPTION]: 0.3,
                [QuestionType.CLASS_CHOICE]: 0.2,
                [QuestionType.REVERSE_SYLLABLE]: 0.25,
                [QuestionType.LETTER_NAME]: 0.15,
                [QuestionType.ASPIRATED_CONTRAST]: 0.1,
            };

        case 'lesson6':
            // 全题型综合测试
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.1,
                [QuestionType.ASPIRATED_CONTRAST]: 0.15,
                [QuestionType.VOWEL_LENGTH_CONTRAST]: 0.15,
                [QuestionType.SYLLABLE]: 0.15,
                [QuestionType.TONE_PERCEPTION]: 0.25,
                [QuestionType.CLASS_CHOICE]: 0.1,
                [QuestionType.LETTER_NAME]: 0.1,
            };

        default:
            // 默认均匀分布(基础题)
            return {
                [QuestionType.SOUND_TO_LETTER]: 0.33,
                [QuestionType.LETTER_TO_SOUND]: 0.33,
                [QuestionType.SYLLABLE]: 0.34,
            };
    }
}

/**
 * 根据权重随机选择题型
 * 
 * @param weights - 题型权重映射
 * @returns 选中的题型
 */
export function selectQuestionTypeByWeight(
    weights: Partial<Record<QuestionType, number>>
): QuestionType {
    const types = Object.keys(weights) as QuestionType[];
    const weightValues = types.map(t => weights[t] || 0);

    // 计算累积权重
    const cumulativeWeights: number[] = [];
    let sum = 0;
    for (const weight of weightValues) {
        sum += weight;
        cumulativeWeights.push(sum);
    }

    // 随机选择
    const random = Math.random() * sum;
    const index = cumulativeWeights.findIndex(w => random <= w);

    return types[index] || types[0];
}

/**
 * 获取题型图标(用于UI显示)
 */
export const QUESTION_TYPE_ICONS: Record<QuestionType, string> = {
    [QuestionType.SOUND_TO_LETTER]: '🔊',
    [QuestionType.LETTER_TO_SOUND]: '👁️',
    [QuestionType.SYLLABLE]: '🔤',
    [QuestionType.REVERSE_SYLLABLE]: '🔄',
    [QuestionType.MISSING_LETTER]: '❓',
    [QuestionType.ASPIRATED_CONTRAST]: '💨',
    [QuestionType.VOWEL_LENGTH_CONTRAST]: '⏱️',
    [QuestionType.FINAL_CONSONANT]: '🔚',
    [QuestionType.TONE_PERCEPTION]: '🎵',
    [QuestionType.CLASS_CHOICE]: '📊',
    [QuestionType.LETTER_NAME]: '📝',
    [QuestionType.INITIAL_SOUND]: '👂',
};
````

## File: src/services/aiService.ts
````typescript
// src/services/aiService.ts

import { callCloudFunction } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api.endpoints';
import { API_TIMEOUT } from '../config/constants';
import type { ExplainVocabularyResponse, MicroReadingResponse, MicroReadingWord, PronunciationFeedbackResponse, ExtractClozeHintsResponse } from '../entities/types/ai.types';
import type { ApiResponse } from '../entities/types/api.types';

/**
 * AI 服务封装类 (类似一个拨号器)
 * 作用：将复杂的网络请求打包，给前端页面直接调用
 */
export class AiService {
  /**
   * 呼叫云端的 explainVocab 动作，获取单词的 AI 解析
   * 
   * @param thaiWord 要查询的泰语单词 (例如: 'สวัสดี')
   * @param vocabularyId (可选) 单词的 ID，如果在系统词库中有的话
   * @param userId 目前用户的 ID
   * @returns 返回一个 Promise，里面装了符合规范的 ApiResponse
   */
  static async explainVocabulary(
    thaiWord: string,
    userId: string,
    language: string = 'zh', // 当前 UI 语言，用于让 AI 返回对应语言的内容
    vocabularyId?: string
  ): Promise<ApiResponse<ExplainVocabularyResponse>> {
    
    // 我们向谁打电话？向我们刚刚配好的 ai-engine 云端地址打。
    const endpoint = API_ENDPOINTS.AI.ENGINE;

    // 我们对云端说什么？我们说：
    // action: "帮我执行解释词汇的任务"
    // data: 包裹我们要查的词语
    try {
      const response = await callCloudFunction<ExplainVocabularyResponse>(
        'explainVocab',  // 这必须和云端 index.js 里的 case 名字一模一样
        {
          userId,
          thaiWord,
          vocabularyId,
          language,             // 将语言传将给云端，让 AI 返回正确语言的解析
          appSecret: 'ThaiApp_2026_Secure' // ✅ 初级防御：我们给云端发送一个约定好的暗号
        },
        { endpoint, timeout: API_TIMEOUT.AI }
      );

      return response;
    } catch (error: any) {
      // 兜底保护：如果手机断网等极端情况，保证程序不崩
      return {
        success: false,
        error: error.message || '查询 AI 失败',
        code: 'AI_SERVICE_ERROR'
      };
    }
  }

  /**
   * 调用云端 generateMicroReading，根据勾选词汇生成一段泰文短文
   *
   * @param words   用户勾选的词汇列表 [{ thaiWord, meaning }]
   * @param language 当前 UI 语言 'zh' | 'en'
   */
  static async generateMicroReading(
    words: MicroReadingWord[],
    language: string = 'zh'
  ): Promise<ApiResponse<MicroReadingResponse>> {
    const endpoint = API_ENDPOINTS.AI.ENGINE;

    try {
      const response = await callCloudFunction<MicroReadingResponse>(
        'generateMicroReading',   // 必须与云端 switch case 名称一致
        {
          words,
          language,
          appSecret: 'ThaiApp_2026_Secure',
        },
        { endpoint, timeout: API_TIMEOUT.AI }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '微阅读生成失败',
        code: 'AI_SERVICE_ERROR',
      };
    }
  }

  /**
   * 调用云端 analyzePronunciation，上传录音 base64 + 参考原文，获取 AI 发音分析
   */
  static async analyzePronunciation(
    audioBase64: string,
    referenceText: string,
    language: string = 'zh'
  ): Promise<ApiResponse<PronunciationFeedbackResponse>> {
    const endpoint = API_ENDPOINTS.AI.ENGINE;

    try {
      const response = await callCloudFunction<PronunciationFeedbackResponse>(
        'analyzePronunciation',
        {
          audioBase64,
          referenceText,
          language,
          appSecret: 'ThaiApp_2026_Secure',
        },
        { endpoint, timeout: API_TIMEOUT.AI }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '发音分析失败',
        code: 'AI_SERVICE_ERROR',
      };
    }
  }

  /**
   * 调用云端 extractClozeHints，从泰语文章中提取半挖空提示性关键词
   */
  static async extractClozeHints(thaiText: string): Promise<ApiResponse<ExtractClozeHintsResponse>> {
    const endpoint = API_ENDPOINTS.AI.ENGINE;

    try {
      const response = await callCloudFunction<ExtractClozeHintsResponse>(
        'extractClozeHints',
        {
          thaiText,
          appSecret: 'ThaiApp_2026_Secure',
        },
        { endpoint, timeout: API_TIMEOUT.AI }
      );
      return response;
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '提示词提取失败',
        code: 'AI_SERVICE_ERROR',
      };
    }
  }

  /* SHELVED: cursor-tracking TTS — 云端 TTS + 逐字时间戳，因 GFW 封存，参见 git 历史
  static async textToSpeech(
    text: string,
    voiceName?: string
  ): Promise<ApiResponse<TtsResponse>> {
    const endpoint = API_ENDPOINTS.AI.ENGINE;
    try {
      const response = await callCloudFunction<TtsResponse>(
        'textToSpeech',
        { text, voiceName, appSecret: 'ThaiApp_2026_Secure' },
        { endpoint, timeout: API_TIMEOUT.AI }
      );
      return response;
    } catch (error: any) {
      return { success: false, error: error.message || '语音合成失败', code: 'AI_SERVICE_ERROR' };
    }
  }
  */
}
````

## File: src/utils/alphabet/audioHelper.ts
````typescript
// src/utils/alphabet/audioHelper.ts

import type { Letter } from '@/src/entities/types/letter.types';
import type { AudioRequirementType } from '@/src/entities/enums/QuestionType.enum';

/**
 * 音频Base URL
 */
const LETTER_AUDIO_BASE =
  'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/';

/**
 * 将可能是「完整 URL」或「相对路径 / key」的音频字段规范化为完整 URL。
 */
function normalizeAudioSource(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('file://')) {
    return path;
  }
  return resolveAudioPath(path);
}

/**
 * 音频优先级策略
 * 
 * @param letter - 字母对象
 * @param type - 音频需求类型
 * @returns 音频URL（始终为完整 HTTP URL 或空字符串）
 */
export function getLetterAudioUrl(
  letter: Letter,
  type: AudioRequirementType = 'letter'
): string {
  // P0-Optimization: 优先使用本地缓存路径
  const getLocalOrRemote = (local?: string, remote?: string) => {
    return normalizeAudioSource(local) || normalizeAudioSource(remote);
  };

  switch (type) {
    case 'letter':
      // 默认使用完整读音:
      // fullSoundLocal > fullSoundUrl > ...
      return (
        getLocalOrRemote(letter.fullSoundLocalPath, letter.fullSoundUrl) ||
        getLocalOrRemote(letter.letterPronunciationLocalPath, letter.letterPronunciationUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    case 'syllable':
      // 音节发音
      return (
        getLocalOrRemote(letter.syllableSoundLocalPath, letter.syllableSoundUrl) ||
        getLocalOrRemote(letter.fullSoundLocalPath, letter.fullSoundUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    case 'minimal-pair':
      // 最小对立组(使用letter类型,由调用方处理对比)
      return (
        getLocalOrRemote(letter.fullSoundLocalPath, letter.fullSoundUrl) ||
        getLocalOrRemote(letter.letterPronunciationLocalPath, letter.letterPronunciationUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    case 'tone-set':
      // 声调变体(需TTS生成,返回基础音频)
      return (
        getLocalOrRemote(letter.syllableSoundLocalPath, letter.syllableSoundUrl) ||
        getLocalOrRemote(letter.fullSoundLocalPath, letter.fullSoundUrl) ||
        resolveAudioPath(letter.audioPath)
      );

    default:
      return (
        getLocalOrRemote(letter.fullSoundLocalPath, letter.fullSoundUrl) ||
        resolveAudioPath(letter.audioPath)
      );
  }
}

/**
 * 解析音频路径
 * 
 * @param path - 音频路径
 * @returns 完整URL
 */
function resolveAudioPath(path?: string | null): string {
  if (!path) return '';

  // 如果已经是完整URL,直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 对类似 "word-kai" / "sound-k" 这类 key 自动补全 .mp3 后缀
  let finalPath = path;
  if (!/\.mp3($|\?)/.test(finalPath)) {
    finalPath = `${finalPath}.mp3`;
  }

  // 拼接Base URL
  return `${LETTER_AUDIO_BASE}${finalPath}`;
}

/**
 * 获取最小对立组的音频URL列表
 * 
 * @param letters - 字母列表(包含目标字母+对比字母)
 * @returns 音频URL数组
 */
export function getMinimalPairAudioUrls(letters: Letter[]): string[] {
  return letters.map(letter => getLetterAudioUrl(letter, 'minimal-pair'));
}

/**
 * 生成声调变体音频URLs
 * 
 * ⚠️ 当前实现:返回基础音频
 * 🔮 未来实现:调用TTS API生成5个声调变体
 * 
 * @param letter - 字母对象
 * @param vowel - 元音(可选)
 * @returns 5个声调音频URL数组
 */
export function getToneVariantAudioUrls(
  letter: Letter,
  vowel?: string
): string[] {
  const baseAudioUrl = getLetterAudioUrl(letter, 'tone-set');

  // 当前策略:返回相同的基础音频(临时方案)
  // 前端可以在UI上标注"需TTS生成"
  return [
    baseAudioUrl, // 中平调
    baseAudioUrl, // 低降调
    baseAudioUrl, // 降调
    baseAudioUrl, // 高调
    baseAudioUrl, // 升调
  ];

  // 🔮 未来实现(需后端TTS服务):
  // return await ttsService.generateToneVariants(letter, vowel);
}

/**
 * 获取某个字母相关的所有音频 URL（去重后）。
 *
 * 设计目的：
 * - 用于课程初始化时，一次性预缓存该字母所有可能会用到的音频；
 * - 包含：
 *   - letterPronunciationUrl（字母标准读音）
 *   - fullSoundUrl（完整读音）
 *   - syllableSoundUrl（音节发音）
 *   - endSyllableSoundUrl（尾音节发音）
 *   - audioPath（旧版路径）
 */
export function getAllLetterAudioUrls(letter: Letter): string[] {
  const rawSources: Array<string | null | undefined> = [
    // 以实际存在的音频为主：fullSoundUrl 与各类 *SoundUrl
    letter.fullSoundUrl,
    letter.syllableSoundUrl,
    letter.endSyllableSoundUrl,
    letter.audioPath,
  ];

  const urls = rawSources
    .map((src) => normalizeAudioSource(src ?? undefined))
    .filter((u): u is string => !!u);

  // 去重
  return Array.from(new Set(urls));
}

/**
 * 检查音频是否可用
 * 
 * @param url - 音频URL
 * @returns 是否可用
 */
export async function checkAudioAvailable(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('[AudioHelper] 音频不可用:', url, error);
    return false;
  }
}
````

## File: src/utils/alphabet/buildAlphabetQueue.ts
````typescript
// 前端权威队列构建器（首发冻结版）
// 仅按课程内三新一复 + mini-review + final-review 生成 deterministic 队列

import type {
  AlphabetLearningMode,
  AlphabetLearningState,
  AlphabetQueueItem,
  AlphabetQueueSource,
} from '@/src/stores/alphabetStore';

interface BuildAlphabetQueueParams {
  lessonLetters: AlphabetLearningState[];
  round: number;
  mode: AlphabetLearningMode;
  previousRoundLetters?: AlphabetLearningState[];
}

const MINI_REVIEW_CHUNK = 3;

export function buildAlphabetQueue(params: BuildAlphabetQueueParams): AlphabetQueueItem[] {
  const { lessonLetters, round, mode, previousRoundLetters = [] } = params;
  const queue: AlphabetQueueItem[] = [];

  const pushWithSource = (item: AlphabetLearningState, source: AlphabetQueueSource) => {
    queue.push({
      ...item,
      source,
      round,
    });
  };

  const previousLetters = mode === 'learning' ? previousRoundLetters : [];

  // Phase 1: 上一轮复习
  // 🔥 TODO-03: 统一使用 'previous-review' 而不是 'previous-round-review'
  previousLetters.forEach((letter) => pushWithSource(letter, 'previous-review'));

  // Phase 2: 今日学习 + mini-review (三新一复)
  for (let i = 0; i < lessonLetters.length; i += 1) {
    const letter = lessonLetters[i];
    // 🔥 TODO-03: 统一使用 'new-learning' 而不是 'new'
    pushWithSource(letter, 'new-learning');

    const hasCompletedChunk = (i + 1) % MINI_REVIEW_CHUNK === 0;
    if (hasCompletedChunk) {
      const chunkStart = i + 1 - MINI_REVIEW_CHUNK;
      const chunk = lessonLetters.slice(chunkStart, i + 1);
      chunk.forEach((l) => pushWithSource(l, 'mini-review'));
    }
  }

  // Phase 3: 总复习（本轮全部字母）
  lessonLetters.forEach((letter) => pushWithSource(letter, 'final-review'));

  return queue;
}
````

## File: src/utils/vocab/vocabAudioHelper.ts
````typescript
import * as FileSystem from 'expo-file-system/legacy';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';

// 腾讯云存储 Base URL
const CLOUD_BASE = 'https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la';
const CACHE_FOLDER = `${FileSystem.cacheDirectory}audio/`;

console.log('📂 [AudioHelper] Cache directory:', FileSystem.cacheDirectory);

/**
 * 拼接完整云端 URL
 * 策略：
 * 如果数据库里存的是完整链接则直接用，否则根据 source 拼接正确的云存储路径
 * 云存储结构：BaseThai_Audio/{source}_Audio/{filename}
 * 例如：BaseThai_Audio/BaseThai_1_Audio/101.mp3
 */
export function resolveVocabPath(path: string | undefined, source?: string): string {
    if (!path) {
        return '';
    }
    if (path.startsWith('http')) {
        return path;
    }
    // 根据 source 构建正确的云存储路径
    const audioFolder = source ? `BaseThai_Audio/${source}_Audio` : 'BaseThai_Audio';
    return `${CLOUD_BASE}/${audioFolder}/${path}`;
}
/**
 * 获取缓存的音频 URI (Get Cached Audio URI)
 * 策略：
 * 1. 调用resolveVocabPath拼接完整远程 URL
 * 2. 预测本地路径
 * 3. 检查本地缓存
 * @param input 传入字符串路径或包含 audioPath 的对象
 * @param source 课程来源，如 'BaseThai_1'
 * @returns localUri | remoteUrl
 */
export async function getVocabAudioUrl(input: string | { audioPath?: string }, source?: string): Promise<string> {
    const path = typeof input === 'string' ? input : input.audioPath;

    if (!path) {
        return '';
    }
    // 1. 拼接完整远程 URL
    const remoteUrl = resolveVocabPath(path, source);
    // 2. 预测本地路径
    const fileName = remoteUrl.split('/').pop() || `temp_${Date.now()}.mp3`;
    const localUri = `${CACHE_FOLDER}${fileName}`;
    // 3. 检查本地缓存
    try {
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        if (fileInfo.exists) {
            return localUri;
        } else {
            return remoteUrl;
        }
    } catch (error) {
        console.warn('Error checking local audio cache:', error);
        // 4. 如果没有缓存，返回远程 URL
        return remoteUrl;
    }
}

/**
 * 获取单词关联的所有音频路径 (用于批量预下载)
 */
export function getAllVocabAudioPaths(vocab: Vocabulary): string[] {
    const paths: string[] = [];

    // 1. 主音频
    if (vocab.audioPath) paths.push(vocab.audioPath);

    // 2. 对话音频
    if (vocab.dialogue?.对话内容) {
        Object.values(vocab.dialogue.对话内容).forEach(item => {
            if (item && item.audioPath) paths.push(item.audioPath);
        });
    }

    // 3. 例句音频
    if (vocab.exampleSentences) {
        Object.values(vocab.exampleSentences).forEach(item => {
            if (item && item.audioPath) paths.push(item.audioPath);
        });
    }

    // 4. 同根词音频
    if (vocab.cognates) {
        vocab.cognates.forEach(item => {
            if (item && item.audioPath) paths.push(item.audioPath);
        });
    }

    return Array.from(new Set(paths)); // 去重
}
````

## File: babel.config.js
````javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
        },
      ],
      'react-native-reanimated/plugin', // 必须在最后
    ],
  };
};
````

## File: index.ts
````typescript
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'expo-router/entry';
````

## File: app/review-modal.tsx
````typescript
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function ReviewModal() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Review',
        }}
      />
      <Text style={styles.text}>Review Modal Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
````

## File: cloudbase/functions/alphabet/handlers/submitLetterTest.js
````javascript
// ✅ 提交字母测试结果（Route A：前端判分）
const { createResponse } = require('../utils/response');
const passLetterTest = require('./passLetterTest');

/**
 * 提交字母测试结果
 * @param {Object} db - 数据库实例
 * @param {Object} data - 请求数据 { userId, passed }
 */
async function submitLetterTest(db, data) {
    // 1. 校验参数
    const { userId, passed } = data || {};

    if (!userId) {
        return createResponse(false, null, 'userId 参数缺失', 'INVALID_PARAMS');
    }

    if (typeof passed !== 'boolean') {
        return createResponse(false, null, 'passed 参数必须为布尔值', 'INVALID_PARAMS');
    }

    // 2. 如果未通过，直接返回（不写数据库）
    if (!passed) {
        return createResponse(true, {
            passed: false,
            message: '未通过测试，不记录进度'
        }, '测试未通过');
    }

    // 3. 如果通过，调用 passLetterTest 写入解锁记录
    try {
        await passLetterTest(db, { userId });

        return createResponse(true, {
            passed: true,
            message: '恭喜通过字母测试！所有模块已解锁。'
        }, '测试通过');
    } catch (error) {
        console.error('[submitLetterTest] passLetterTest 失败：', error);
        return createResponse(false, null, '写入进度失败', 'DB_ERROR');
    }
}

module.exports = submitLetterTest;
````

## File: cloudbase/functions/alphabet/index.js
````javascript
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = cloud.database();


// ✅ 处理函数
const { createResponse } = require('./utils/response');
const getLetterTest = require('./handlers/getLetterTest');
const submitLetterTest = require('./handlers/submitLetterTest');
const passLetterTest = require('./handlers/passLetterTest');
const getAllLetters = require('./handlers/getAllLetters');

exports.main = async (event, context) => {

    // ===== 解析 HTTP 请求 =====
    let requestData = event;

    // HTTP 触发器：body 可能是字符串或对象
    if (event.body) {
        if (typeof event.body === 'string') {
            try {
                requestData = JSON.parse(event.body);
            } catch (e) {
                console.error('[alphabet] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON in request body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, data } = requestData;

    try {
        switch (action) {

            // ✅ 0️⃣ 获取所有字母（用于前端生成测试题）
            case 'getAllLetters':
                return await getAllLetters(db);

            // ✅ 1️⃣ 获取字母测试题（固定题）
            case 'getLetterTest':
                return await getLetterTest(db);

            // ✅ 2️⃣ 提交字母测试并判定
            case 'submitLetterTest':
                return await submitLetterTest(db, data);

            // ✅ 3️⃣ 直接通过字母测试（调试/特殊逻辑用）
            case 'passLetterTest':
                return await passLetterTest(db, data);

            default:
                return createResponse(false, null, '未知 action', 'INVALID_ACTION');
        }
    } catch (err) {
        console.error('learn-alphabet error:', err);
        return createResponse(false, null, err.message || '服务器错误', 'SERVER_ERROR');
    }
};
````

## File: cloudbase/functions/memory-engine/utils/database.js
````javascript
const cloud = require('wx-server-sdk');

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

const collections = {
    users: db.collection('users'),
    vocabulary: db.collection('vocabulary'),
    letters: db.collection('letters'),
    sentences: db.collection('sentences'),
    memory_status: db.collection('memory_status'),
    user_progress: db.collection('user_progress'),
    user_alphabets_progress: db.collection('user_alphabets_progress')
};

module.exports = {
    db,
    _,
    userCollection: collections.users,
    vocabularyCollection: collections.vocabulary,
    letterCollection: collections.letters,
    sentenceCollection: collections.sentences,
    memoryStatusCollection: collections.memory_status,
    userProgressCollection: collections.user_progress,
    progressCollection: collections.user_vocabulary_progress,
    collections
};
````

## File: cloudbase/functions/memory-engine/utils/response.js
````javascript
/**
 * 响应格式化模块
 * 
 * 统一 API 响应格式
 * 与前端 ApiResponse<T> 类型定义保持一致
 */

'use strict';

const { ErrorCodes, ERROR_MESSAGES } = require('./constants');

/**
 * 创建标准化 API 响应
 * 
 * 对应前端类型:
 * interface ApiResponse<T> {
 *   success: boolean;
 *   data?: T;
 *   message?: string;
 *   errorCode?: string;
 *   timestamp: string;
 * }
 * 
 * @param {boolean} success - 是否成功
 * @param {Object} data - 返回数据
 * @param {string} message - 提示消息
 * @param {string} errorCode - 错误码
 * @returns {Object} success, data, message, errorCode,timestamp: new Date().toISOString() 
 */
function createResponse(success, data = null, message = '', errorCode = null) {
  return {
    success,
    data,
    message,
    errorCode,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 创建成功响应
 * 
 * @param {Object} data - 返回数据
 * @param {string} message - 成功消息
 * @returns {Object} -成功相应对象：（调用）createResponse(true, data, message, null);
 */
function successResponse(data, message = '操作成功') {
  return createResponse(true, data, message, null);
}

/**
 * 创建错误响应
 * 
 * @param {string} errorCode - 错误码 (来自 ErrorCodes)
 * @param {string} customMessage - 自定义消息 (可选)
 * @returns {Object} -错误响应对象：（调用）createResponse(false, null, message, errorCode);
 */
function errorResponse(errorCode, customMessage = null) {
  const message = customMessage || ERROR_MESSAGES[errorCode] || '未知错误';
  return createResponse(false, null, message, errorCode);
}

/**
 * 创建参数错误响应
 * 
 * @param {string} detail - 错误详情
 * @returns {Object} -错误响应对象：（调用）errorResponse(ErrorCodes.INVALID_PARAMS, detail);
 */
function invalidParamsResponse(detail) {
  return errorResponse(ErrorCodes.INVALID_PARAMS, detail);
}

/**
 * 创建用户不存在响应
 * 
 * @returns {Object} -错误响应对象：（调用）errorResponse(ErrorCodes.USER_NOT_FOUND);
 */
function userNotFoundResponse() {
  return errorResponse(ErrorCodes.USER_NOT_FOUND);
}

/**
 * 创建词汇不存在响应
 * 
 * @returns {Object} 错误响应对象：（调用）errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
 */
function vocabularyNotFoundResponse() {
  return errorResponse(ErrorCodes.VOCABULARY_NOT_FOUND);
}

/**
 * 创建服务器错误响应
 * 
 * @param {Error} error - 错误对象
 * @returns {Object} -错误响应对象：（调用）errorResponse(ErrorCodes.SERVER_ERROR, message);
 */
function serverErrorResponse(error) {
  // 生产环境不暴露错误详情
  const message = process.env.NODE_ENV === 'development' 
    ? `服务器错误: ${error.message}`
    : ERROR_MESSAGES.SERVER_ERROR;
  
  return errorResponse(ErrorCodes.SERVER_ERROR, message);
}

module.exports = {
  createResponse,
  successResponse,
  errorResponse,
  invalidParamsResponse,
  userNotFoundResponse,
  vocabularyNotFoundResponse,
  serverErrorResponse,
};
````

## File: src/components/learning/vocabulary/ReviewWordView.tsx
````typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { WordCard } from '@/src/components/learning/vocabulary/WordCard';
import { VocabularyDetailView } from '@/src/components/learning/vocabulary/VocabularyDetailView';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';

interface ReviewWordViewProps {
    vocabulary: Vocabulary;
    onNext: () => void;
}

export const ReviewWordView: React.FC<ReviewWordViewProps> = ({ vocabulary, onNext }) => {
    const { t } = useTranslation();
    const [isRevealed, setIsRevealed] = useState(false);
    const markSelfRating = useVocabularyStore(state => state.markSelfRating);

    const handleRate = (score: number) => {
        markSelfRating(score);
        setIsRevealed(true);
    };

    // Extract first example sentence as context hint
    const exampleSentences = vocabulary.exampleSentences || {};
    const firstExample = Object.values(exampleSentences)[0];

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <WordCard vocabulary={vocabulary} autoPlay={true} />

                {/* Context Hint */}
                {firstExample && (
                    <View style={styles.contextContainer}>
                        <Text style={styles.contextThai}>{firstExample.泰语}</Text>
                        <Text style={styles.contextMeaning}>{firstExample.中文}</Text>
                    </View>
                )}

                <VocabularyDetailView
                    vocabulary={vocabulary}
                    blurDetails={!isRevealed}
                />
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    <View style={styles.buttonGrid}>
                        {/* Forgot -> Score 1 */}
                        <Pressable
                            style={[styles.actionButton, styles.btnForgot]}
                            onPress={() => handleRate(1)}
                        >
                            <Text style={[styles.btnText, styles.textForgot]}>{t('learning.forgot')}</Text>
                        </Pressable>

                        {/* Unsure -> Score 3 */}
                        <Pressable
                            style={[styles.actionButton, styles.btnUnsure]}
                            onPress={() => handleRate(3)}
                        >
                            <Text style={[styles.btnText, styles.textUnsure]}>{t('learning.unsure')}</Text>
                        </Pressable>

                        {/* Know -> Score 5 */}
                        <Pressable
                            style={[styles.actionButton, styles.btnKnow]}
                            onPress={() => handleRate(5)}
                        >
                            <Text style={[styles.btnText, styles.textKnow]}>{t('learning.know')}</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable style={styles.nextButton} onPress={onNext}>
                        <Text style={styles.nextButtonText}>{t('learning.next')}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    content: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 20,
    },
    contextContainer: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.sand,
        marginBottom: 16,
    },
    contextThai: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 4,
    },
    contextMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    buttonGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    btnForgot: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5',
    },
    textForgot: {
        color: '#DC2626',
    },
    btnUnsure: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FCD34D',
    },
    textUnsure: {
        color: '#D97706',
    },
    btnKnow: {
        backgroundColor: '#ECFDF5',
        borderColor: '#6EE7B7',
    },
    textKnow: {
        color: '#059669',
    },
    btnText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
    },
    nextButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
    },
});
````

## File: src/components/learning/vocabulary/VocabMultipleQuiz.tsx
````typescript
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, Vibration, Animated, Easing } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';
import { ConfettiEffect } from '@/src/components/common/ConfettiEffect';

export interface QuizOption {
    id: string;
    definition: string;
    isCorrect: boolean;
}

interface VocabMultipleQuizProps {
    vocabulary: Vocabulary;
    options: QuizOption[];
    onCorrect: () => void;
    onWrong: () => void;
}

export const VocabMultipleQuiz: React.FC<VocabMultipleQuizProps> = ({
    vocabulary,
    options,
    onCorrect,
    onWrong
}) => {
    const { t } = useTranslation();
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiPos, setConfettiPos] = useState({ x: 0, y: 0 });
    const soundRef = useRef<Audio.Sound | null>(null);
    const audioModeConfigured = useRef(false);
    const containerRef = useRef<View>(null);
    // 容器在屏幕上的偏移量
    const containerOffset = useRef({ x: 0, y: 0 });

    // Auto-play audio on mount
    useEffect(() => {
        playAudio();
        setShowConfetti(false);
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }
        };
    }, [vocabulary._id]);

    const playAudio = async () => {
        try {
            const url = await getVocabAudioUrl(vocabulary.audioPath || '', vocabulary.source);
            if (!url) return;

            // 配置音频模式（仅一次）
            if (!audioModeConfigured.current) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
                audioModeConfigured.current = true;
            }

            // 清理旧 sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }

            // 创建并播放
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('❌ [Quiz] Playback failed:', error);
        }
    };

    const handleOptionPress = (option: QuizOption, touchPos?: { x: number; y: number }) => {
        if (isProcessing) return; // Prevent double taps during transition

        // 将屏幕绝对坐标转为相对于容器的坐标
        if (touchPos) {
            containerRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
                setConfettiPos({
                    x: touchPos.x - (pageX || 0),
                    y: touchPos.y - (pageY || 0),
                });
            });
        }

        setSelectedOptionId(option.id);
        console.log('[VocabQuiz] Option selected:', { word: vocabulary.thaiWord, optionId: option.id, isCorrect: option.isCorrect });

        if (option.isCorrect) {
            // Correct handling
            setIsProcessing(true); // Lock input
            setShowConfetti(true);
            setTimeout(() => {
                onCorrect();
                setIsProcessing(false);
                setSelectedOptionId(null);
                setShowConfetti(false);
            }, 800);

        } else {
            // Wrong handling
            Vibration.vibrate();
            onWrong();
        }
    };

    return (
        <View ref={containerRef} style={styles.container}>
            {showConfetti && <ConfettiEffect x={confettiPos.x} y={confettiPos.y} />}
            <View style={styles.cardContainer}>
                <View style={styles.wordCard}>
                    <Text style={styles.thaiWord}>{vocabulary.thaiWord}</Text>
                    <View style={styles.phoneticRow}>
                        <Pressable style={styles.audioButton} onPress={playAudio}>
                            <Volume2 size={24} color={Colors.thaiGold} />
                        </Pressable>
                        <Text style={styles.phoneticText}>{vocabulary.pronunciation}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.optionsContainer}>
                <Text style={styles.instructionText}>{t('learning.quizInstruction', '请选择正确的含义')}</Text>
                {options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                        <QuizOptionButton
                            key={option.id}
                            option={option}
                            isSelected={isSelected}
                            onPress={(e) => handleOptionPress(option, e)}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const QuizOptionButton = ({ option, isSelected, onPress }: {
    option: QuizOption,
    isSelected: boolean,
    onPress: (touchPos?: { x: number; y: number }) => void
}) => {
    const shakeAnim = React.useRef(new Animated.Value(0)).current;
    // 用 ref 存储 onPressIn 时的精确触摸坐标
    const touchPosRef = React.useRef<{ x: number; y: number } | undefined>(undefined);

    React.useEffect(() => {
        if (isSelected && !option.isCorrect) {
            shake();
        }
    }, [isSelected, option.isCorrect]);

    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // Style logic
    let backgroundColor: string = Colors.white;
    let borderColor: string = Colors.sand;
    let textColor: string = Colors.ink;

    if (isSelected) {
        if (option.isCorrect) {
            backgroundColor = '#ECFDF5';
            borderColor = '#10B981';
            textColor = '#047857';
        } else {
            backgroundColor = '#FEF2F2';
            borderColor = '#EF4444';
            textColor = '#B91C1C';
        }
    }

    return (
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
            <Pressable
                style={[styles.optionButton, { backgroundColor, borderColor }]}
                onPressIn={(e) => {
                    // onPressIn 在触摸瞬间触发，坐标最精确
                    touchPosRef.current = {
                        x: e.nativeEvent.pageX,
                        y: e.nativeEvent.pageY,
                    };
                }}
                onPress={() => onPress(touchPosRef.current)}
                disabled={isSelected && !option.isCorrect}
            >
                <Text style={[styles.optionText, { color: textColor }]}>{option.definition}</Text>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    wordCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 20,
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 64,
        color: Colors.ink,
        marginBottom: 16,
    },
    phoneticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    audioButton: {
        padding: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 25,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 20,
        color: Colors.taupe,
    },
    optionsContainer: {
        gap: 16,
        width: '100%',
    },
    instructionText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        textAlign: 'center',
        marginBottom: 8,
    },
    optionButton: {
        width: '100%',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 14,
        borderWidth: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    optionText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
        textAlign: 'center',
    },
});
````

## File: src/components/learning/vocabulary/VocabularyDetailView.tsx
````typescript
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { BlurRevealer } from '@/src/components/common/BlurRevealer';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';

interface VocabularyDetailViewProps {
    vocabulary: Vocabulary;
    blurDetails: boolean; // Controls if the details section is blurred
}

type TabType = 'basic' | 'examples' | 'usage';

export const VocabularyDetailView: React.FC<VocabularyDetailViewProps> = ({
    vocabulary,
    blurDetails
}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('basic');

    const analysis = vocabulary.analysis;
    const phoneticAssociation = vocabulary.analysis?.phonetic_association;
    const exampleSentences = vocabulary.exampleSentences || {};
    const examples = Object.values(exampleSentences);
    const dialogue = vocabulary.dialogue;
    const dialogueEntries = dialogue ? Object.entries(dialogue.对话内容) : [];

    // If blurDetails is true, we want IS_REVEALED = false.
    const isRevealed = !blurDetails;

    const soundRef = useRef<Audio.Sound | null>(null);
    const audioModeConfigured = useRef(false);

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }
        };
    }, []);

    const playAudio = async (path?: string) => {
        if (!path) return;
        try {
            const url = await getVocabAudioUrl(path, vocabulary.source);
            if (!url) return;
            console.log('🔊 [DetailView] Playing:', url);

            // 配置音频模式（仅一次）
            if (!audioModeConfigured.current) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
                audioModeConfigured.current = true;
            }

            // 清理旧 sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }

            // 创建并播放
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('❌ [DetailView] Playback failed:', error);
        }
    };

    return (
        <View style={styles.detailsContainer}>
            <BlurRevealer
                style={styles.scrollAreaWrapper}
                isRevealed={isRevealed}
                intensity={60} // Higher intensity for hiding meaning
                tint="light" // Or 'default'
                overlayColor="rgba(255, 255, 255, 0.8)"
            >
                <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Meaning Header - INSIDE BlurRevealer to hide answer */}
                    <View style={styles.meaningHeader}>
                        {/* 后端返回字段: vocabulary.meaning (中文意思) */}
                        <Text style={styles.mainMeaning}>{vocabulary.meaning}</Text>
                        <View style={styles.typeTag}>
                            {/* 后端返回字段: vocabulary.partOfSpeech (词性) */}
                            <Text style={styles.typeText}>{analysis?.part_of_speech}</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabs}>
                        <Pressable
                            style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
                            onPress={() => setActiveTab('basic')}
                        >
                            <Text style={[styles.tabText, activeTab === 'basic' && styles.activeTabText]}>
                                {/* 基本释义 */}
                                {t('learning.basicDefinition')}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'examples' && styles.activeTab]}
                            onPress={() => setActiveTab('examples')}
                        >
                            <Text style={[styles.tabText, activeTab === 'examples' && styles.activeTabText]}>
                                {/* 例句 */}
                                {t('learning.exampleSentences')}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[styles.tab, activeTab === 'usage' && styles.activeTab]}
                            onPress={() => setActiveTab('usage')}
                        >
                            <Text style={[styles.tabText, activeTab === 'usage' && styles.activeTabText]}>
                                {/* 用法 */}
                                {t('learning.usageDetails')}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Tab Content 1: 基本释义 */}
                    {activeTab === 'basic' && (
                        <View style={styles.tabContent}>
                            {vocabulary.cognates && vocabulary.cognates.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>{t('learning.cognates')}</Text>
                                    <View style={styles.cognatesList}>
                                        {vocabulary.cognates.map((item, idx) => (
                                            <Pressable
                                                key={idx}
                                                style={styles.cognateItem}
                                                onPress={() => playAudio(item.audioPath)}
                                            >

                                                <Text style={styles.bodyText}>{item.text}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </>
                            )}

                            {phoneticAssociation && (
                                <>
                                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{t('learning.memoryTips')}</Text>
                                    <View style={styles.memoryItem}>
                                        <Text style={styles.bodyText}>
                                            <Text style={styles.subSectionTitle}>{t('learning.split')}: </Text>
                                            {phoneticAssociation.拆分}
                                        </Text>
                                        <Text style={[styles.bodyText, { marginTop: 4 }]}>
                                            <Text style={styles.subSectionTitle}>{t('learning.memoryPhrase')}: </Text>
                                            {phoneticAssociation.记忆句}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    )}

                    {/* Tab Content 2: 例句 */}
                    {activeTab === 'examples' && (
                        <View style={styles.examplesList}>
                            {dialogue && <Text style={styles.sectionTitle}>{t('learning.dialogueExample')}</Text>}
                            {/* 对话示例 (微信聊天风格) */}
                            {dialogue && (
                                <View style={styles.dialogueContainer}>
                                    {dialogue.场景描述 && (
                                        <Text style={styles.sceneDesc}>— {dialogue.场景描述} —</Text>
                                    )}
                                    {dialogueEntries.map(([speaker, content], index) => {
                                        const isRight = speaker === 'B' || speaker.includes('2') || index % 2 === 1;
                                        return (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.chatRow,
                                                    isRight ? styles.rightRow : styles.leftRow
                                                ]}
                                            >
                                                <Pressable
                                                    style={[
                                                        styles.bubble,
                                                        isRight ? styles.rightBubble : styles.leftBubble,
                                                        styles.dialogueBubble
                                                    ]}
                                                    onPress={() => playAudio(content.audioPath)}
                                                >
                                                    <View style={styles.dialogueHeader}>
                                                        <Text style={styles.exampleThai}>{content.泰语}</Text>
                                                    </View>
                                                    <Text style={styles.exampleMeaning}>{content.中文}</Text>
                                                </Pressable>
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                            {examples.length > 0 && <Text style={styles.sectionTitle}>{t('learning.individualSentences')}</Text>}
                            {/* 普通例句列表 */}
                            {examples.map((ex, index) => (
                                <Pressable
                                    key={index}
                                    style={styles.exampleItem}
                                    onPress={() => playAudio(ex.audioPath)}
                                >
                                    <View style={styles.exampleHeader}>
                                        <Text style={styles.exampleThai}>{ex.泰语}</Text>
                                    </View>
                                    <Text style={styles.exampleMeaning}>{ex.中文}</Text>
                                </Pressable>
                            ))}
                            {(examples.length === 0 && !dialogue) && (
                                <Text style={styles.bodyText}>{t('learning.noExamples')}</Text>
                            )}
                        </View>
                    )}

                    {/* Tab Content 3: 用法 */}
                    {activeTab === 'usage' && (
                        <View style={styles.usageContent}>
                            <View style={styles.exampleItem}>
                                {vocabulary.usage?.语法示例 && (
                                    <>

                                        <Text style={styles.sectionTitle}>{t('learning.grammarExamples')}</Text>
                                        <View style={styles.grammarItem}>
                                            {/* 后端返回字段: vocabulary.usage.语法示例.结构 */}
                                            <Text style={styles.grammarLabel}>
                                                <Text style={{ color: Colors.thaiGold }}>{t('learning.structure')}: </Text>
                                                <Text>{vocabulary.usage.语法示例.结构}</Text>
                                            </Text>
                                            {/* 后端返回字段: vocabulary.usage.语法示例.解释 */}
                                            <Text style={styles.grammarContent}>
                                                <Text style={{ color: Colors.thaiGold }}>
                                                    {t('learning.explain')}:{" "}
                                                </Text>
                                                {vocabulary.usage.语法示例.解释}
                                            </Text>
                                            {/* 后端返回字段: vocabulary.usage.语法示例.使用技巧 */}
                                            {vocabulary.usage.语法示例.使用技巧 && <Text style={styles.grammarExample}>
                                                <Text style={{ color: Colors.thaiGold }}>
                                                    {t('learning.usageTip')}:{" "}
                                                </Text>
                                                {vocabulary.usage.语法示例.使用技巧}
                                            </Text>}
                                        </View>

                                    </>
                                )}

                                {vocabulary.usage?.与中文差异 && (
                                    <>
                                        <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.diffWithChinese')}</Text>
                                        {/* 后端返回字段: vocabulary.usage.与中文差异 */}
                                        <Text style={styles.bodyText}>{vocabulary.usage.与中文差异}</Text>
                                    </>
                                )}
                            </View>
                            <View style={styles.exampleItem}>
                                <Text style={[styles.sectionTitle, styles.mt4]}>{t('learning.commonMistakes')}</Text>
                                {analysis?.common_mistakes?.相似词汇区别 && (
                                    <>
                                        <Text style={styles.subSectionTitle}>{t('learning.similarWordsDiff')}</Text>
                                        {/* 后端返回字段: analysis.common_mistakes.相似词汇区别 */}
                                        <Text style={styles.bodyText}>{analysis.common_mistakes.相似词汇区别}</Text>
                                    </>
                                )}
                                {analysis?.common_mistakes?.发音易错点 && (
                                    <>
                                        <Text style={[styles.subSectionTitle, styles.mt4]}>{t('learning.pronunciationPitfalls')}</Text>
                                        {/* 后端返回字段: analysis.common_mistakes.发音易错点 */}
                                        <Text style={styles.bodyText}>{analysis.common_mistakes.发音易错点}</Text>
                                    </>
                                )}

                                {analysis?.common_mistakes?.使用场合 && (
                                    <>
                                        <Text style={[styles.subSectionTitle, styles.mt4]}>{t('learning.usageScenarios')}</Text>
                                        {/* 后端返回字段: analysis.common_mistakes.使用场合 */}
                                        <Text style={styles.bodyText}>{analysis.common_mistakes.使用场合}</Text>
                                    </>
                                )}
                                {(!vocabulary.usage && !analysis?.common_mistakes) && <Text style={styles.bodyText}>{t('learning.noUsage')}</Text>}
                            </View>
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </BlurRevealer>
        </View>
    );
};

const styles = StyleSheet.create({
    detailsContainer: {
        flex: 1,
        width: '95%',
        alignSelf: 'center',
        // No padding here, assume parent handles
    },
    meaningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
        marginTop: 10,
    },
    mainMeaning: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 24,
        color: Colors.ink,
    },
    typeTag: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.thaiGold,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
    },
    tabText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 13,
        color: Colors.taupe,
    },
    activeTabText: {
        color: Colors.ink,
        fontWeight: '600',
    },
    scrollAreaWrapper: {
        flex: 1,
        position: 'relative',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.white, // Ensure background is white so blur looks correct over it
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: Colors.sand,
    },
    scrollArea: {
        flex: 1,
    },
    scrollContent: {
        padding: 16, // Add padding inside ScrollView
    },
    bodyText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 15,
        lineHeight: 24,
        color: Colors.ink,
    },
    examplesList: {
        gap: 16,
    },
    exampleItem: {
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: Colors.thaiGold,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    exampleThai: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 4,
    },
    exampleMeaning: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    usageContent: {
        gap: 12,
    },
    sectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.thaiGold,
        marginBottom: 8,
    },
    subSectionTitle: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.accent, // Use a slightly different color or shade
        marginBottom: 4,
    },
    grammarItem: {
        marginBottom: 8,
    },
    grammarLabel: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 14,
        color: Colors.ink,
    },
    grammarContent: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.ink,
        marginTop: 2,
    },
    grammarExample: {
        fontFamily: Typography.sarabunRegular,
        fontSize: 14,
        color: Colors.ink,
        marginTop: 2,
        fontStyle: 'italic',
    },
    mt4: {
        marginTop: 16,
    },
    // 对话 (微信风格) 样式
    dialogueContainer: {
        backgroundColor: '#F3F3F3',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
    },
    sceneDesc: {
        textAlign: 'center',
        fontSize: 12,
        color: Colors.taupe,
        marginBottom: 20,
        fontFamily: Typography.notoSerifRegular,
    },
    chatRow: {
        marginBottom: 12,
        maxWidth: '90%',
        flexDirection: 'row',
    },
    leftRow: {
        alignSelf: 'flex-start',
    },
    rightRow: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    bubble: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    leftBubble: {
        backgroundColor: Colors.white,
        borderTopLeftRadius: 2,
    },
    rightBubble: {
        backgroundColor: '#95EC69', // 典型的微信绿
        borderTopRightRadius: 2,
    },
    // Audio specific styles
    tabContent: {
        paddingTop: 8,
    },
    cognatesList: {
        gap: 8,
    },
    cognateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(0,0,0,0.02)',
        padding: 12,
        borderRadius: 10,
    },
    memoryItem: {
        backgroundColor: 'rgba(212, 175, 55, 0.05)',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.1)',
    },
    exampleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    dialogueBubble: {
        minWidth: 80,
    },
    dialogueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        marginBottom: 2,
    },
});
````

## File: src/components/learning/vocabulary/WordCard.tsx
````typescript
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { getVocabAudioUrl } from '@/src/utils/vocab/vocabAudioHelper';

interface WordCardProps {
    vocabulary: Vocabulary;
    autoPlay?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ vocabulary, autoPlay = false }) => {
    const soundRef = useRef<Audio.Sound | null>(null);
    const audioModeConfigured = useRef(false);

    const playAudio = async () => {
        try {
            const url = await getVocabAudioUrl(vocabulary.audioPath || '', vocabulary.source);
            if (!url) return;


            // 配置音频模式（仅一次）
            if (!audioModeConfigured.current) {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
                audioModeConfigured.current = true;
            }

            // 清理旧 sound
            if (soundRef.current) {
                await soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }

            // 创建并播放
            const { sound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );
            soundRef.current = sound;
        } catch (error) {
            console.warn('❌ [WordCard] Playback failed:', error);
        }
    };

    useEffect(() => {
        if (autoPlay) {
            playAudio();
        }
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }
        };
    }, [vocabulary._id, autoPlay]);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.wordCard}>
                <Text style={styles.thaiWord}>{vocabulary.thaiWord}</Text>

                <View style={styles.phoneticRow}>
                    <Pressable style={styles.audioButton} onPress={playAudio}>
                        <Volume2 size={20} color={Colors.thaiGold} />
                    </Pressable>
                    <Text style={styles.phoneticText}>{vocabulary.pronunciation}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 24,
        width: '95%',
    },
    wordCard: {
        width: '100%',
        backgroundColor: Colors.white,
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    thaiWord: {
        fontFamily: Typography.sarabunBold,
        fontSize: 56,
        color: Colors.ink,
        marginBottom: 8,
    },
    phoneticRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    audioButton: {
        padding: 6,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 20,
    },
    phoneticText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 18,
        color: Colors.taupe,
    },
});
````

## File: src/config/alphabet/lessonMetadata.config.ts
````typescript
// src/config/alphabet/lessonMetadata.config.ts

import type { LessonMetadata } from '@/src/entities/types/phonicsRule.types';

/**
 * 6课元数据完整配置
 * 
 * 定义每课的字母组成、拼读规则关联、通过率要求等
 * 
 * @version 1.0.0
 * @see SEQUENCE_LESSONS
 */
export const LESSON_METADATA: Record<string, LessonMetadata> = {
  /**
   * Lesson 1: 基础拼读能力(5辅音+3元音)
   */
  lesson1: {
    lessonId: 'lesson1',
    title: '第一课:基础拼读能力',
    description: '掌握最基础的中辅音和常见长元音,建立CV拼读概念',
    consonants: ['ก', 'ด', 'ต', 'น', 'ม'],
    vowels: ['า', 'ี', 'ู','ี'],
    tones: [],
    phonicsRuleId: 'rule_1_cv_structure',
    totalCount: 9,
    minPassRate: 0.95,
    miniReviewInterval: 3,
    order: 1,
  },

  /**
   * Lesson 2: 前置元音系统(6辅音+4元音)
   */
  lesson2: {
    lessonId: 'lesson2',
    title: '第二课:前置元音系统',
    description: '学习前置元音(เ แ โ)和更多高频辅音',
    consonants: ['บ', 'ป', 'ร', 'ล', 'ว', 'ย'],
    vowels: ['เ', 'แ', 'โ', 'อ'],
    tones: [],
    phonicsRuleId: 'rule_2_leading_vowel',
    totalCount: 10,
    minPassRate: 0.90,
    miniReviewInterval: 3,
    order: 2,
  },

  /**
   * Lesson 3: 声调入门+送气对比(5辅音+3元音+2声调)
   */
  lesson3: {
    lessonId: 'lesson3',
    title: '第三课:声调入门',
    description: '掌握送气/不送气对比,引入基础声调系统',
    consonants: ['ข', 'ถ', 'ผ', 'ส', 'ห'],
    vowels: ['ะ', 'ุ', 'ึ'],
    tones: ['่', '้'],
    phonicsRuleId: 'rule_3_tone_basics',
    totalCount: 10,
    minPassRate: 0.90,
    miniReviewInterval: 3,
    order: 3,
  },

  /**
   * Lesson 4: 辅音类与声调规则(6辅音+4元音+2声调)
   */
  lesson4: {
    lessonId: 'lesson4',
    title: '第四课:辅音类与声调',
    description: '理解高/中/低辅音对声调的影响,掌握完整声调系统',
    consonants: ['ค', 'ท', 'พ', 'ช', 'จ', 'ง'],
    vowels: ['ไ', 'ใ', 'เอา', 'อำ'],
    tones: ['๊', '๋'],
    phonicsRuleId: 'rule_4_consonant_class_tones',
    totalCount: 12,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 4,
  },

  /**
   * Lesson 5: 复合元音系统(8辅音+6元音)
   */
  lesson5: {
    lessonId: 'lesson5',
    title: '第五课:复合元音系统',
    description: '掌握三合元音(เอีย เอือ อัว)等复杂元音组合',
    consonants: ['ซ', 'ฉ', 'ฝ', 'ฟ', 'ศ', 'ษ', 'ฮ', 'อ'],
    vowels: ['เอีย', 'เอือ', 'อัว', 'เออ', 'ื', 'อ'],
    tones: [],
    phonicsRuleId: 'rule_5_compound_vowels',
    totalCount: 14,
    minPassRate: 0.85,
    miniReviewInterval: 3,
    order: 5,
  },

  /**
   * Lesson 6: 完整覆盖+特殊规则(14辅音+12元音)
   * 说明:
   * - 此课元音组用于训练「短元音变形」与 Dead Syllable 规则；
   * - 其中 'อัว' 在这里代表实际拼写模式「ัวะ」(短 ua)，
   *   由于 letters 数据集中不存在独立字形「ัวะ」，故用 'อัว' 作为代表符号。
   */
  lesson6: {
    lessonId: 'lesson6',
    title: '第六课:完整覆盖(常用进阶)',
    description: '补充常用进阶辅音与复合元音,掌握特殊规则(如 ห นำ 等)',
    consonants: [
      // 低辅音清音(梵文借词) + 常用进阶辅音
      'ฑ', 'ฒ', 'ณ', 'ภ', 'ธ', 'ฌ', 'ญ', 'ฬ', 'ฎ', 'ฏ', 'ฐ',
    ],
    vowels: [
      // 核心变形短元音组
      'โอะ', 'เอะ', 'แอะ', 'เอาะ', 'อัว',
    ],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 16,
    minPassRate: 0.90,
    miniReviewInterval: 4,
    order: 6,
  },

  /**
   * Lesson 7: 罕用/古体字母与复杂元音
   * 仅作为补充课程,不参与其他模块解锁
   */
  lesson7: {
    lessonId: 'lesson7',
    title: '第七课:罕用字母与特殊元音',
    description: '集中学习现代泰语中较少使用的辅音与复杂元音,用于阅读古文与特殊专有名词',
    consonants: [
      // 已弃用或极少使用的辅音
      'ฃ', 'ฅ',
    ],
    vowels: [
      // 梵文/巴利借词中的特殊元音
      'ฤ', 'ฤๅ', 'ฦ', 'ฦๅ',
    ],
    tones: [],
    phonicsRuleId: 'rule_6_special_cases',
    totalCount: 6,
    minPassRate: 0.80,
    miniReviewInterval: 4,
    order: 7,
  },
};

/**
 * 根据课程ID获取元数据
 */
export function getLessonMetadata(lessonId: string): LessonMetadata | null {
  return LESSON_METADATA[lessonId] || null;
}

/**
 * 获取所有课程元数据(按顺序)
 */
export function getAllLessons(): LessonMetadata[] {
  return Object.values(LESSON_METADATA).sort((a, b) => a.order - b.order);
}

/**
 * 根据字母获取所属课程
 */
export function getLessonByLetter(thaiChar: string): LessonMetadata | null {
  for (const lesson of Object.values(LESSON_METADATA)) {
    const allLetters = [
      ...lesson.consonants,
      ...lesson.vowels,
      ...lesson.tones,
    ];
    
    if (allLetters.includes(thaiChar)) {
      return lesson;
    }
  }
  
  return null;
}

/**
 * 获取课程统计
 */
export function getLessonStatistics() {
  const lessons = Object.values(LESSON_METADATA);
  
  return {
    totalLessons: lessons.length,
    totalConsonants: lessons.reduce((sum, l) => sum + l.consonants.length, 0),
    totalVowels: lessons.reduce((sum, l) => sum + l.vowels.length, 0),
    totalTones: lessons.reduce((sum, l) => sum + l.tones.length, 0),
    totalLetters: lessons.reduce((sum, l) => sum + l.totalCount, 0),
  };
}
````

## File: src/config/constants.ts
````typescript
// src/config/constants.ts

/**
 * 应用常量配置
 *
 * 目标：
 * 1. 统一管理全局常量（集合名 / 超时 / 文本等），避免在代码中散落硬编码字符串；
 * 2. COLLECTIONS 中只放“真实存在或规划中的集合名”，并通过注释区分「已使用」与「预留/废弃」。
 */

// ==================== 数据库集合名称 ====================
export const COLLECTIONS = {
  // ===== 核心用户与进度集合（CloudBase 已实际使用） =====
  USERS: 'users',
  USER_PROGRESS: 'user_progress',
  USER_ALPHABET_PROGRESS: 'user_alphabet_progress',
  USER_VOCABULARY_PROGRESS: 'user_vocabulary_progress',

  // ===== 学习实体集合（CloudBase 已实际使用） =====
  LETTERS: 'letters',
  VOCABULARY: 'vocabulary',
  VOCABULARIES: 'vocabularies', // 特定 handler（getSkippedWords）使用的词汇集合
  SENTENCES: 'sentences',
  MEMORY_STATUS: 'memory_status',

  // ===== 字母课程与拼读规则（已迁移的课程配置） =====
  ALPHABET_LESSONS: 'alphabet_lessons',
  PHONICS_RULES: 'phonics_rules',

  // ===== 字母测试相关 =====
  LETTER_TEST_BANK: 'letter_test_bank',

  // ===== 预留 / 规划中的集合（当前代码中未实际使用） =====
  COURSES: 'courses',
  LESSONS: 'lessons',
  EXERCISES: 'exercises',
  ARTICLES: 'articles',
  PRONUNCIATION_RECORDS: 'pronunciationRecords',
  PROGRESS: 'progress',
  REVIEW_SCHEDULES: 'reviewSchedules',
  LEARNING_RECORDS: 'learningRecords',

  // ===== 已废弃命名（仅兼容旧版本，不推荐再使用） =====
  // 旧版字母集合，现已统一使用 LETTERS: 'letters'
  ALPHABETS: 'alphabets',
} as const;

// ==================== API 超时配置 ====================
export const API_TIMEOUT = {
  DEFAULT: 10000,   // 10 秒 - 一般请求
  UPLOAD: 30000,    // 30 秒 - 文件上传
  LONG: 60000,      // 60 秒 - 长时间操作（如发音评估）
  AI: 120000,       // 120 秒 - AI 生成（微阅读/词汇解析等，云端上限 200s）
};

// ==================== 错误消息 ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查您的网络。',
  TIMEOUT_ERROR: '请求超时，请稍后重试。',
  AUTH_ERROR: '身份验证失败，请重新登录。',
  TOKEN_EXPIRED: '登录已过期，请重新登录。',
  SERVER_ERROR: '服务器错误，请稍后重试。',
  INVALID_INPUT: '输入信息不完整或格式错误。',
  UNKNOWN_ERROR: '未知错误，请联系客服。',
};

// ==================== 用户角色 ====================
export const USER_ROLES = {
  LEARNER: 'LEARNER',
  ADMIN: 'ADMIN',
} as const;

// ==================== 学习等级 ====================
export const LEVELS = {
  BEGINNER_A: 'BEGINNER_A',
  BEGINNER_B: 'BEGINNER_B',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
} as const;

// ==================== 掌握程度 ====================
export const MASTER_LEVELS = {
  NOT_LEARNED: 'NOT_LEARNED',
  LEARNING: 'LEARNING',
  REVIEWING: 'REVIEWING',
  MASTERED: 'MASTERED',
} as const;

// ==================== 内容类型 ====================
export const CONTENT_TYPES = {
  ALPHABET: 'alphabet',
  VOCABULARY: 'vocabulary',
  SENTENCE: 'sentence',
  ARTICLE: 'article',
} as const;
````

## File: src/entities/enums/LearningPhase.enum.ts
````typescript
// src/entities/enums/LearningPhase.enum.ts

/**
 * 学习阶段枚举
 * 
 * 用于字母学习的7阶段流程 + 测试相关阶段
 * 对应V3.0课程方案的完整流程
 * 
 * @version 2.0.0
 * @see project-snapshot-v2.0.0-V10.md 第7节 学习流程
 */
export enum LearningPhase {
  // ===== 初始状态 =====
  IDLE = 'IDLE',
  LOADING = 'LOADING',

  // ===== 7阶段学习流程 =====
  YESTERDAY_REVIEW = 'yesterday-review',
  YESTERDAY_REMEDY = 'yesterday-remedy',
  TODAY_LEARNING = 'today-learning',
  TODAY_MINI_REVIEW = 'today-mini-review',
  TODAY_FINAL_REVIEW = 'today-final-review',
  TODAY_REMEDY = 'today-remedy',
  ROUND_EVALUATION = 'round-evaluation',

  // ===== 测试相关(用于课程测试) =====
  TEST_PROMPT = 'test-prompt',
  TESTING = 'testing',
  TEST_RESULT = 'test-result',

  // ===== 单词模块专用 =====
  VOCAB_IDLE = 'vocab-idle',
  VOCAB_LOADING = 'vocab-loading',
  VOCAB_LEARNING = 'vocab-learning', // 学习中
  VOCAB_REVIEW = 'vocab-review',     // 复习中  
  VOCAB_COMPLETED = 'vocab-completed',

  // ===== 完成状态 =====
  FINISHED = 'finished',
  COMPLETED = 'COMPLETED',
}

/**
 * Phase 类型(用于类型守卫)
 * 对应AlphabetLearningEngineView中使用的字符串字面量
 */
export type Phase =
  | 'yesterday-review'
  | 'yesterday-remedy'
  | 'today-learning'
  | 'today-mini-review'
  | 'today-final-review'
  | 'today-remedy'
  | 'round-evaluation'
  | 'finished';

/**
 * Phase 显示文案映射
 */
export const PHASE_LABELS: Record<Phase, string> = {
  'yesterday-review': '昨日复习',
  'yesterday-remedy': '昨日补救',
  'today-learning': '今日学习',
  'today-mini-review': '小复习',
  'today-final-review': '末尾复习',
  'today-remedy': '今日补救',
  'round-evaluation': '轮次评估',
  'finished': '完成',
};

/**
 * Phase 图标映射(用于UI显示)
 */
export const PHASE_ICONS: Record<Phase, string> = {
  'yesterday-review': '🔄',
  'yesterday-remedy': '🔧',
  'today-learning': '📚',
  'today-mini-review': '✨',
  'today-final-review': '🎯',
  'today-remedy': '💪',
  'round-evaluation': '📊',
  'finished': '🎉',
};

/**
 * Phase 进度权重(用于进度条计算)
 */
export const PHASE_PROGRESS_WEIGHTS: Record<Phase, number> = {
  'yesterday-review': 0.1,
  'yesterday-remedy': 0.15,
  'today-learning': 0.4,
  'today-mini-review': 0.5,
  'today-final-review': 0.7,
  'today-remedy': 0.85,
  'round-evaluation': 0.95,
  'finished': 1.0,
};

/**
 * 判断是否为复习阶段
 */
export function isReviewPhase(phase: Phase): boolean {
  return [
    'yesterday-review',
    'yesterday-remedy',
    'today-mini-review',
    'today-final-review',
    'today-remedy',
  ].includes(phase);
}

/**
 * 判断是否为学习阶段
 */
export function isLearningPhase(phase: Phase): boolean {
  return phase === 'today-learning';
}

/**
 * 判断是否为补救阶段
 */
export function isRemedyPhase(phase: Phase): boolean {
  return ['yesterday-remedy', 'today-remedy'].includes(phase);
}

/**
 * 获取下一个阶段
 */
export function getNextPhase(currentPhase: Phase): Phase | null {
  const phaseSequence: Phase[] = [
    'yesterday-review',
    'yesterday-remedy',
    'today-learning',
    'today-mini-review',
    'today-final-review',
    'today-remedy',
    'round-evaluation',
    'finished',
  ];

  const currentIndex = phaseSequence.indexOf(currentPhase);
  if (currentIndex === -1 || currentIndex === phaseSequence.length - 1) {
    return null;
  }

  return phaseSequence[currentIndex + 1];
}
````

## File: src/entities/types/ai.types.ts
````typescript
// src/entities/types/ai.types.ts

// 这说明了一句泰语例句长什么样
export interface AiExample {
    scene: string;    // 这个例句的使用场景
    thai: string;     // 泰文句子内容
    chinese: string;  // 中文翻译
}

// 这说明了云端返回的“整个词汇解析报告”长什么样，
// 注意这里所有的字段名字，必须和刚才云端代码里 DeepSeek 吐出来的 JSON 名字一模一样！
export interface ExplainVocabularyResponse {
    vocabularyId: string;
    thaiWord: string;
    pronunciation: string; // ✅新增的发音字段
    meaning: string;
    breakdown: string;
    extraExamples: AiExample[];
}

/**
 * AI 微阅读生成结果
 * 字段名称与 generateMicroReading.js 中 Prompt 要求的 JSON 完全一致
 */
export interface MicroReadingResponse {
    title: string;         // AI 生成的泰文短文标题
    thaiText: string;      // AI 生成的泰文短文（80-150 词）
    translation: string;   // 中文逐段辅助翻译
    wordsUsed: string[];   // AI 确认用到的目标词列表（用于校验）
}

/** 发给 AI 的单个词汇条目 */
export interface MicroReadingWord {
    thaiWord: string;
    meaning: string;
}

/* SHELVED: cursor-tracking TTS — 因 GFW 封存，参见 git 历史
export interface TtsSubtitle {
    Text: string;
    BeginTime: number;
    EndTime: number;
    BeginIndex: number;
    EndIndex: number;
    Phoneme: string | null;
}

export interface TtsResponse {
    audio: string;
    subtitles: TtsSubtitle[];
}
*/

/** 发音分析 — 单维度评分 */
export interface PronunciationDimension {
    name: string;
    score: number;       // 1-10
    comment: string;
}

/** 发音分析 — AI 返回的完整反馈 */
export interface PronunciationFeedbackResponse {
    overallScore: number;
    dimensions: PronunciationDimension[];
    suggestions: string[];
    transcription: string;
}

/** 半挖空提示词提取 — AI 返回的关键词列表 */
export interface ExtractClozeHintsResponse {
    keywords: string[];
}

/** 持久化到 AsyncStorage 的文章对象 */
export interface SavedArticle {
    id: string;
    title: string;
    thaiText: string;
    translation: string;
    wordsUsed: string[];
    createdAt: number;
    wordCount: number;
}
````

## File: src/entities/types/letter.types.ts
````typescript
// src/entities/types/letter.types.ts

/**
 * 字母类型定义
 *
 * 数据源: letters_final.enriched.json (80 个泰语字母/元音/声调)
 * 更新日期: 2025-12-06
 *
 * 说明: 此接口尽量贴近数据库 letters 集合的实际结构。
 * - 部分历史字段 (audioPath/learningLevel/strokeCount/createdAt/lessonNumber)
 *   在最新版本中已从数据源中移除,因此在类型中保留为可选,仅用于兼容旧数据。
 */

// ==================== 基础类型 ====================

/**
 * 字母类型
 */
export type LetterType = 'consonant' | 'vowel' | 'tone';

/**
 * 辅音类别 (仅辅音有效)
 */
export type ConsonantClass = 'mid' | 'high' | 'low';

/**
 * 学习级别
 */
export type LearningLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

/**
 * 字母主类别
 */
export type LetterCategory = 'mid_consonant' | 'high_consonant' | 'low_consonant' | 'vowel' | 'tone';

// ==================== 主要接口 ====================

/**
 * Letter - 完整的字母数据结构
 * 
 * ⭐ 此接口包含letters_final.json的所有字段
 * ⭐ 对应数据库letters集合的文档结构
 */
export interface Letter {
    // ===== 基础字段 (原有数据库字段) =====
    _id: string;                    // 唯一标识 (如: "TH_C_01")
    type: LetterType;               // 类型: consonant | vowel | tone
    thaiChar: string;               // 泰文字符 (如: "ก")
    nameThai: string;               // 泰文名称 (如: "ไก่")
    nameEnglish: string;            // 英文名称 (如: "ko kai")
    initialSound: string;           // 首音 (如: "k")
    finalSound: string;             // 尾音 (如: "k")
    class: ConsonantClass | null;   // 辅音类别 (仅辅音有效,元音/声调为null)
    exampleWord: string;            // 例词 (如: "ไก่")
    exampleMeaning: string;         // 例词含义 (如: "鸡")

    // 以下为历史字段,目前数据源中已移除,保留为可选以兼容旧数据
    audioPath?: string;             // 旧版音频路径 (可能为空,建议使用fullSoundUrl)
    strokeCount?: number;           // 笔画数 (预留字段,暂未使用)
    learningLevel?: LearningLevel;  // 学习级别
    createdAt?: string;             // 创建日期 (ISO格式)
    
    // ===== 新增字段 (来自letters.json合并) =====
    
    // 课程与分类
    lessonId?: string;              // 主课程 ID (如: "lesson1")
    lessonNumber?: number;          // 旧课程编号 (1-7), 已废弃
    category: LetterCategory;       // 主类别 (如: "mid_consonant", "high_consonant")
    subCategory: string;            // 子类别 (如: "lesson1_mid", "lesson4_high")
    
    // 键盘输入
    keyboardKey?: string;           // 键盘按键 (如: "d", "j") - 可选
    
    // 发音系统 (多层级音频)
    fullSound?: string;             // 完整发音标识 (如: "consonant-ko-kai")
    fullSoundUrl?: string;          // ⭐ 完整发音URL (优先使用)
    fullSoundFileId?: string;       // CloudBase 完整发音 fileId (cloud://...)
    fullSoundLocalPath?: string;    // 本地缓存路径（file://）

    syllableSoundName?: string;     // 音节发音名称 (如: "k")
    syllableSound?: string;         // 音节发音标识
    syllableSoundUrl?: string;      // 音节发音URL (用于音节练习)
    syllableSoundFileId?: string;   // CloudBase 音节发音 fileId
    syllableSoundLocalPath?: string;// 本地缓存路径

    endSyllableSoundName?: string;  // 尾音节名称
    endSyllableSound?: string;      // 尾音节发音标识
    endSyllableSoundUrl?: string;   // 尾音节发音URL (用于辅音尾音练习)
    endSyllableSoundFileId?: string;// CloudBase 尾音节发音 fileId
    endSyllableSoundLocalPath?: string;// 本地缓存路径

    letterNamePronunciation?: string; // ⭐ 字母名称发音 (如: "kay`")
    letterPronunciationUrl?: string;  // 字母发音URL
    letterPronunciationFileId?: string; // CloudBase 字母发音 fileId
    letterPronunciationLocalPath?: string; // 本地缓存路径
    
    // 多媒体资源
    letterImageUrl?: string;        // 字母图片URL (预留)
    
    // 描述信息
    description?: string;           // 额外描述信息 (可选)

    // 课程编排（来自 letters_final.enriched.json）
    usageTag?: string;                     // 使用标签: core / rare / supplement 等
    lessonGroup?: string;                  // 课程组别: core / supplement 等
    curriculumLessonIds?: string[];        // 所属课程 ID 列表，例如 ['lesson1', 'lesson3']
    curriculumLessonOrders?: number[];     // 各课程内排序序号
    primaryCurriculumLessonId?: string;    // 主课程 ID，例如 'lesson1'
    primaryCurriculumLessonOrder?: number; // 主课程中的排序
}

/**
 * LetterListItem - 简化版字母数据 (用于列表显示)
 */
export interface LetterListItem {
    _id: string;
    thaiChar: string;
    nameThai: string;
    nameEnglish: string;
    type: LetterType;
    class: ConsonantClass | null;
    lessonId?: string;
    category: LetterCategory;
    isMastered?: boolean;           // 前端添加: 是否已掌握
}

/**
 * LetterProgress - 字母学习进度
 */
export interface LetterProgress {
    masteredCount: number;          // 已掌握数量
    totalCount: number;             // 总数量 (80个)
    accuracy: number;               // 正确率 (0-100)
    masteredIds: string[];          // 已掌握的字母ID列表
}

/**
 * LetterStatistics - 字母统计信息
 */
export interface LetterStatistics {
    total: number;
    consonants: number;
    vowels: number;
    tones: number;
    byLesson: {
        lesson1: number;
        lesson2: number;
        lesson3: number;
        lesson4: number;
        lesson5: number;
        lesson6: number;
        lesson7: number;
    };
    byClass: {
        mid: number;
        high: number;
        low: number;
    };
}

/**
 * LetterFilter - 字母搜索/过滤条件
 */
export interface LetterFilter {
    type?: LetterType;
    lessonId?: string;
    class?: ConsonantClass;
    category?: LetterCategory;
    subCategory?: string;
    excludeIds?: string[];
}

// ==================== 辅助类型 ====================

/**
 * 音频URL优先级类型
 */
export type AudioUrlPriority = {
    primary: string | undefined;    // fullSoundUrl
    secondary: string | undefined;  // letterPronunciationUrl
    fallback: string;               // audioPath
};

/**
 * 字母显示信息 (用于UI组件)
 */
export interface LetterDisplayInfo {
    char: string;                   // 泰文字符
    name: string;                   // 名称 (优先泰文)
    pronunciation: string;          // 发音 (优先letterNamePronunciation)
    example: string;                // 完整例词 (包含中文)
    audioUrl: string;               // 音频URL (已处理优先级)
    keyboardHint?: string;          // 键盘提示
}
````

## File: src/entities/types/memory.types.ts
````typescript
// src/entities/types/memory.types.ts

export interface MemoryStatus {
  userId: string;
  entityType: 'word' | 'sentence' | 'article';
  entityId: string;
  vId?: number; // 词汇ID(可选)
  masteryLevel: number;
  repetition: number;
  easinessFactor: number;
  interval: number;
  lastReviewAt: string;
  nextReviewDate: number;
  correctCount: number;
  wrongCount: number;
  streakCorrect: number;
  updatedAt: string;
  isSkipped: boolean;
}

export interface UnlockInfo {
  unlocked: boolean;
  stage?: 'word' | 'sentence' | 'article';
  message: string;
  letterProgress: number; // 0-1 比例值
}
````

## File: src/stores/learningPreferenceStore.ts
````typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ModuleType } from './moduleAccessStore';

type DailyLimitMap = Partial<Record<ModuleType, number>>;

// 系统默认每日学习上限，与后端 getTodayMemories 默认值保持一致
export const DEFAULT_DAILY_LIMIT = 20;

/** 获取本地日期 YYYY-MM-DD */
function getTodayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 获取昨天本地日期 YYYY-MM-DD */
function getYesterdayLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 每日学习时长（秒），按日期 YYYY-MM-DD 存储 */
type DailyStudyTimeMap = Record<string, number>;

/** 每日提醒时间，格式 HH:mm，默认 09:00 */
export const DEFAULT_DAILY_REMINDER_TIME = '09:00';

interface LearningPreferenceStore {
    streakDays: number;
    lastCheckInDate: string | null; // YYYY-MM-DD，上次打卡日期
    /** 每日提醒开关 */
    dailyReminderEnabled: boolean;
    /** 每日提醒时间 HH:mm */
    dailyReminderTime: string;
    updateStreak: (days: number) => void;
    /** 每日打卡：每天可点击一次，返回 true 表示打卡成功，false 表示今日已打卡 */
    checkIn: () => boolean;
    /** 今日是否已打卡 */
    hasCheckedInToday: () => boolean;
    dailyLimits: DailyLimitMap;
    setDailyLimit: (module: ModuleType, limit: number) => void;
    hasDailyLimit: (module: ModuleType) => boolean;
    /** 当日学习时长（秒），按日期持久化 */
    dailyStudyTimeByDate: DailyStudyTimeMap;
    /** 当前学习会话开始时间戳（毫秒），进入字母/单词学习页时设置，离开时清除 */
    activeSessionStart: number | null;
    /** 进入学习页时调用，开始计时 */
    startStudySession: () => void;
    /** 离开学习页时调用，将本次时长累加到当日 */
    stopStudySession: () => void;
    /** 获取当日学习总时长（秒），含当前进行中的会话 */
    getTodayStudyTimeSeconds: () => number;
    /** 设置每日提醒开关与时间 */
    setDailyReminder: (enabled: boolean, time?: string) => void;
    clearForLogout: () => void; // 登出时清除所有用户专属偏好
}

export const useLearningPreferenceStore = create<LearningPreferenceStore>()(
    persist(
        (set, get) => ({
            streakDays: 0,
            lastCheckInDate: null,
            dailyReminderEnabled: false,
            dailyReminderTime: DEFAULT_DAILY_REMINDER_TIME,
            updateStreak: (days) => set({ streakDays: days }),
            setDailyReminder: (enabled, time) =>
                set((state) => ({
                    dailyReminderEnabled: enabled,
                    dailyReminderTime: time ?? state.dailyReminderTime,
                })),
            checkIn: () => {
                const today = getTodayLocal();
                const yesterday = getYesterdayLocal();
                const { lastCheckInDate, streakDays } = get();
                if (lastCheckInDate === today) return false;
                // 昨日已打卡 → 连续+1；首次打卡 → 1；中断后 → 0
                const newStreak = lastCheckInDate === yesterday
                    ? streakDays + 1
                    : lastCheckInDate == null
                        ? 1
                        : 0;
                set({ lastCheckInDate: today, streakDays: newStreak });
                return true;
            },
            hasCheckedInToday: () => get().lastCheckInDate === getTodayLocal(),
            dailyLimits: {},
            setDailyLimit: (module, limit) =>
                set((state) => ({
                    dailyLimits: {
                        ...state.dailyLimits,
                        [module]: limit,
                    },
                })),
            hasDailyLimit: (module) => get().dailyLimits[module] !== undefined,
            dailyStudyTimeByDate: {},
            activeSessionStart: null,
            startStudySession: () => set({ activeSessionStart: Date.now() }),
            stopStudySession: () => {
                const { activeSessionStart, dailyStudyTimeByDate } = get();
                if (activeSessionStart == null) return;
                const elapsed = Math.floor((Date.now() - activeSessionStart) / 1000);
                const today = getTodayLocal();
                const prev = dailyStudyTimeByDate[today] ?? 0;
                set({
                    activeSessionStart: null,
                    dailyStudyTimeByDate: {
                        ...dailyStudyTimeByDate,
                        [today]: prev + elapsed,
                    },
                });
            },
            getTodayStudyTimeSeconds: () => {
                const { dailyStudyTimeByDate, activeSessionStart } = get();
                const today = getTodayLocal();
                const stored = dailyStudyTimeByDate[today] ?? 0;
                if (activeSessionStart == null) return stored;
                return stored + Math.floor((Date.now() - activeSessionStart) / 1000);
            },
            // 登出时调用：重置所有用户专属偏好，防止跨用户继承
            clearForLogout: () =>
                set({
                    streakDays: 0,
                    lastCheckInDate: null,
                    dailyLimits: {},
                    dailyStudyTimeByDate: {},
                    activeSessionStart: null,
                    dailyReminderEnabled: false,
                    dailyReminderTime: DEFAULT_DAILY_REMINDER_TIME,
                }),
        }),
        {
            name: 'learning-preferences',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                streakDays: state.streakDays,
                lastCheckInDate: state.lastCheckInDate,
                dailyLimits: state.dailyLimits,
                dailyStudyTimeByDate: state.dailyStudyTimeByDate,
                dailyReminderEnabled: state.dailyReminderEnabled,
                dailyReminderTime: state.dailyReminderTime,
            }),
        }
    )
);
````

## File: app/alphabet/test.tsx
````typescript
import React, { use, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { callCloudFunction } from '@/src/utils/apiClient';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useUserStore } from '@/src/stores/userStore';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { useTranslation } from 'react-i18next';
import { generateQuestion } from '@/src/utils/lettersQuestionGenerator';
import { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';
import { Letter } from '@/src/entities/types/letter.types';
import { AlphabetQuestion } from '@/src/entities/types/alphabet.types';
import { Audio } from 'expo-av';
import { TextStyle } from 'react-native';
import { getLetterAudioUrl } from '@/src/utils/alphabet/audioHelper';
import * as FileSystem from 'expo-file-system/legacy';


// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------


interface UserAnswer {
    questionId: string;
    answer: string;
}

interface TestResponse {
    questions: AlphabetQuestion[];
}

interface SubmitResponse {
    passed: boolean;
    score?: number;
}

// ------------------------------------------------------------------
// Pure Helper: Test Generator
// ------------------------------------------------------------------

/**
 * 纯函数：根据字母池生成 20 道测试题
 * 
 * 逻辑：
 * 1. 打乱字母池
 * 2. 确保凑够 20 个题目源 (不足则循环补充)
 * 3. 转换为 UI 展示用的 TestQuestion 格式
 */

export function generateTestQuestions(allLetters: Letter[]): AlphabetQuestion[] {
    // 防御性编程：如果没有字母或其他异常，返回空数组
    if (!allLetters || allLetters.length === 0) return [];
    // TODO 1: 创建副本并洗牌 (Shuffle)
    const pool = [...allLetters].sort(() => Math.random() - 0.5);
    // TODO 2: 截取或循环补齐到 20 个 (Target Letters)
    const TARGET_COUNT = 20;
    const targetLetters: Letter[] = [];
    let i = 0;
    while (targetLetters.length < TARGET_COUNT) {
        // 取模运算：即使 i 超过 pool.length，也能循环回到开头取值
        targetLetters.push(pool[i % pool.length]);
        i++;
    }
    // TODO 3: Generate Questions & Map to UI Model
    return targetLetters.map((letter, index) => {
        const queueItem = {
            letter,
            letterId: letter._id,
            gameType: Math.random() > 0.5
                ? AlphabetGameType.SOUND_TO_LETTER
                : AlphabetGameType.LETTER_TO_SOUND
        }
        // 提示：调用 generateQuestion(queueItem, allLetters)
        const algoQuestion = generateQuestion(queueItem, allLetters);

        return {
            ...algoQuestion,
            id: `${algoQuestion.id}-${index}`
        };
    }
    )
}

// ------------------------------------------------------------------
// Component: Alphabet Test Page
// ------------------------------------------------------------------
export default function AlphabetTestScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    // State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [questions, setQuestions] = useState<AlphabetQuestion[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    // 简化的音频播放（参考 AlphabetReviewView）
    const playAudio = async (audioUrl: string) => {
        try {
            // 停止并卸载之前的音频
            if (sound) {
                try {
                    await sound.stopAsync();
                    await sound.unloadAsync();
                } catch (e) {
                    // 忽略清理错误
                }
            }

            // 直接加载并播放
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
        } catch (error) {
            console.error('Failed to play audio:', error);
        }
    };

    //清理音频
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    // 🎵 后台音频预下载（参考 alphabetStore）
    const toHttpUrl = (path?: string | null): string => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        let finalPath = path;
        if (!/\.mp3($|\?)/.test(finalPath)) {
            finalPath = `${finalPath}.mp3`;
        }
        return `https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/${finalPath}`;
    };

    const predownloadAudio = async (letters: Letter[]) => {
        try {
            const cacheDir = `${FileSystem.cacheDirectory}alphabet-audio/`;
            const dirInfo = await FileSystem.getInfoAsync(cacheDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
            }

            const updatedLetters = new Map<string, Letter>();

            for (const letter of letters) {
                const updatedLetter = { ...letter };

                // 下载所有音频字段
                const fields: Array<{ key: keyof Letter; localKey: keyof Letter }> = [
                    { key: 'fullSoundUrl', localKey: 'fullSoundLocalPath' },
                    { key: 'syllableSoundUrl', localKey: 'syllableSoundLocalPath' },
                    { key: 'letterPronunciationUrl', localKey: 'letterPronunciationLocalPath' },
                ];

                for (const field of fields) {
                    const url = letter[field.key] as string | undefined;
                    if (!url) continue;

                    const httpUrl = toHttpUrl(url);
                    if (!httpUrl) continue;

                    const fileName = encodeURIComponent(httpUrl);
                    const localPath = `${cacheDir}${fileName}`;

                    try {
                        const info = await FileSystem.getInfoAsync(localPath);
                        if (!info.exists) {
                            await FileSystem.downloadAsync(httpUrl, localPath);
                        }
                        (updatedLetter as any)[field.localKey] = localPath;
                    } catch (err) {
                        console.warn(`Failed to download ${httpUrl}:`, err);
                    }
                }

                updatedLetters.set(letter._id, updatedLetter);
            }

            // 更新 questions 中的 Letter 对象
            setQuestions(prevQuestions =>
                prevQuestions.map(q => ({
                    ...q,
                    targetLetter: updatedLetters.get(q.targetLetter._id) || q.targetLetter,
                    options: q.options?.map(opt =>
                        updatedLetters.get(opt._id) || opt
                    )
                }))
            );

            console.log('✅ Audio predownload completed');
        } catch (error) {
            console.error('Failed to predownload audio:', error);
        }
    };

    // 1️⃣ Fetch Test Data on Mount
    useEffect(() => {
        fetchTest();
    }, []);

    const fetchTest = async () => {
        try {
            setLoading(true);
            // 🆕 调用新的 getAllLetters 接口获取字母池
            const result = await callCloudFunction<{ letters: Letter[] }>(
                'getAllLetters',
                {},
                { endpoint: API_ENDPOINTS.ALPHABET.GET_TEST }
            );

            if (result.success && result.data?.letters) {
                // 🆕 使用生成器函数在前端生成 20 道题
                const generatedQuestions = generateTestQuestions(result.data.letters);
                setQuestions(generatedQuestions);

                // 🎵 后台异步下载音频（不阻塞页面显示）
                (async () => {
                    if (result.data?.letters) {
                        await predownloadAudio(result.data.letters);
                    }
                })();
            } else {
                Alert.alert('Error', 'Failed to load letters.');
            }
        } catch (error) {
            console.error('Fetch test error:', error);
            Alert.alert('Error', 'An error occurred while loading the test.');
        } finally {
            setLoading(false);
        }
    };

    // 2️⃣ Handle Answer Selection
    const selectAnswer = (questionId: string, option: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    // 3️⃣ Submit Test
    const handleSubmit = async () => {
        // Basic Validation
        if (Object.keys(answers).length < questions.length) {
            Alert.alert('Incomplete', 'Please answer all questions before submitting.');
            return;
        }

        try {
            setSubmitting(true);

            // 🐛 调试：打印所有答案和正确答案
            console.log('=== 判分调试 ===');
            questions.forEach((q, idx) => {
                const userAnswer = answers[q.id];
                // LETTER_TO_SOUND: 比较 option._id 与 targetLetter._id
                const correctAnswer = q.gameType === AlphabetGameType.LETTER_TO_SOUND
                    ? q.targetLetter._id
                    : q.correctAnswer;
                const isCorrect = userAnswer === correctAnswer;
                console.log(`Q${idx + 1} [${q.gameType}]:`, {
                    userAnswer,
                    correctAnswer,
                    isCorrect,
                    targetLetter: q.targetLetter.thaiChar
                });
            });

            // 本地判分
            const correctCount = questions.filter(q => {
                const userAnswer = answers[q.id];
                // LETTER_TO_SOUND: 比较 option._id 与 targetLetter._id
                if (q.gameType === AlphabetGameType.LETTER_TO_SOUND) {
                    return userAnswer === q.targetLetter._id;
                }
                // SOUND_TO_LETTER: 比较 thaiChar 与 correctAnswer
                return userAnswer === q.correctAnswer;
            }).length;
            const passed = correctCount >= 17;

            console.log(`判分结果： ${correctCount}/20, 通过： ${passed}`);
            //如果没通过，直接提示失败，不调用后端
            if (!passed) {
                Alert.alert(
                    'Test Failed',
                    `You got ${correctCount}/20 correct. You need at least 17 to pass.`,
                    [{ text: 'Try again' }]
                )
                setSubmitting(false);
                return;     //提前返回，不执行后续网络请求
            }

            // 调用后端云函数：提交答案
            const userId = useUserStore.getState().currentUser?.userId;

            if (!userId) {
                Alert.alert('Error', 'User not logged in');
                setSubmitting(false);
                return;
            }

            const result = await callCloudFunction<SubmitResponse>(
                'submitLetterTest',
                { userId, passed: true },
                { endpoint: API_ENDPOINTS.ALPHABET.SUBMIT_TEST }
            );

            if (result.success) {
                // 🎉 Test Passed
                Alert.alert(
                    'Congratulations!',
                    'You have passed the test. All modules are now unlocked.',
                    [{
                        text: 'Got it',
                        onPress: async () => {
                            await useModuleAccessStore.getState().getUserProgress();
                            router.replace('/courses');
                        }
                    }]
                )

            } else {
                Alert.alert('Error', result.error || 'Submission failed.');
            }
        } catch (error) {
            console.error('Submit test error:', error);
            Alert.alert('Error', 'An error occurred while submitting the test.');
        } finally {
            setSubmitting(false);
        }
    };

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.thaiGold} />
                <Text style={styles.loadingText}>Loading Test...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.1} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Alphabet Test</Text>
                <Text style={styles.subtitle}>Pass this test to unlock all courses immediately.</Text>
            </View>

            {/* Questions List */}
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {questions.map((q, index) => (
                    <View key={q.id} style={styles.questionCard}>
                        {/* 题号 */}
                        <Text style={styles.questionNumber}>Question {index + 1}/20</Text>
                        {/* 🆕 根据题型显示不同内容 */}
                        {q.gameType === AlphabetGameType.SOUND_TO_LETTER ? (
                            // 听音选字：显示播放按钮
                            <View style={styles.audioQuestionContainer}>
                                <Text style={styles.questionText}>
                                    Which letter matches this sound?
                                </Text>
                                <Pressable
                                    style={styles.playButton}
                                    onPress={() => {
                                        const audioUrl = getLetterAudioUrl(q.targetLetter, 'letter');
                                        if (audioUrl) {
                                            playAudio(audioUrl);
                                        }
                                    }}
                                >
                                    <Text style={styles.playButtonText}>🔊 Play Sound</Text>
                                </Pressable>
                            </View>
                        ) : (
                            // 看字选音：显示泰文字母
                            <View style={styles.letterQuestionContainer}>
                                <Text style={styles.questionText}>
                                    Which sound matches this letter?
                                </Text>
                                <Text style={styles.targetLetter}>
                                    {q.targetLetter.thaiChar}
                                </Text>
                            </View>
                        )}
                        {/* 🆕 选项渲染 */}
                        <View style={styles.optionsContainer}>
                            {q.options?.map((option, optIndex) => {
                                // 🐛 修复：使用唯一标识符避免多选
                                // LETTER_TO_SOUND: 使用 option._id（唯一）
                                // SOUND_TO_LETTER: 使用 option.thaiChar
                                const comparisonValue = q.gameType === AlphabetGameType.LETTER_TO_SOUND
                                    ? option._id
                                    : option.thaiChar;
                                const isSelected = answers[q.id] === comparisonValue;

                                // SOUND_TO_LETTER: 显示泰文字符
                                if (q.gameType === AlphabetGameType.SOUND_TO_LETTER) {
                                    return (
                                        <Pressable
                                            key={option._id}
                                            style={[styles.optionButton, isSelected && styles.optionSelected]}
                                            onPress={() => selectAnswer(q.id, option.thaiChar)}
                                        >
                                            <View style={[styles.radioCircle, isSelected && styles.radioSelected]} />
                                            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                                {option.thaiChar}
                                            </Text>
                                        </Pressable>
                                    );
                                }

                                // LETTER_TO_SOUND: 显示播放按钮
                                return (
                                    <Pressable
                                        key={option._id}
                                        style={[styles.audioOptionButton, isSelected && styles.audioOptionSelected]}
                                        onPress={() => {
                                            // 使用 audioHelper 获取正确的音频路径
                                            const audioUrl = getLetterAudioUrl(option, 'letter');

                                            // 播放音频
                                            if (audioUrl) {
                                                playAudio(audioUrl);
                                            }

                                            // 🐛 修复：使用唯一的 option._id 避免多选
                                            selectAnswer(q.id, option._id);
                                        }}
                                    >
                                        <View style={[styles.radioCircle, isSelected && styles.radioSelected]} />
                                        <View style={styles.audioOptionContent}>
                                            <Text style={styles.audioOptionLabel}>选项 {optIndex + 1}</Text>
                                            <Text style={styles.audioOptionIcon}>🔊</Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                ))}

                {/* Submit Button */}
                <Pressable
                    style={[
                        styles.submitButton,
                        (submitting || Object.keys(answers).length < questions.length) && styles.submitDisabled
                    ]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color={Colors.white} />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit Test</Text>
                    )}
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

// ------------------------------------------------------------------
// Styles
// ------------------------------------------------------------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.paper,
    },
    loadingText: {
        marginTop: 12,
        fontFamily: Typography.notoSerifRegular,
        color: Colors.taupe,
    },
    header: {
        padding: 24,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.sand,
    },
    title: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        gap: 24,
    },
    audioQuestionContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    letterQuestionContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    targetLetter: {
        fontSize: 48,
        fontFamily: Typography.notoSerifBold,
        color: Colors.ink,
        marginTop: 12,
    },
    playButton: {
        backgroundColor: Colors.thaiGold,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 12,
    },
    playButtonText: {
        fontSize: 16,
        fontFamily: Typography.notoSerifBold,
        color: Colors.white,
    },
    questionNumber: {
        fontSize: 12,
        fontFamily: Typography.notoSerifRegular,
        color: Colors.taupe,
        marginBottom: 8,
    },
    audioOptionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
    },
    audioOptionSelected: {
        borderColor: Colors.thaiGold,
        backgroundColor: '#FFF9E6',
    },
    audioOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    audioOptionLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.ink,
    },
    audioOptionIcon: {
        fontSize: 20,
    },
    questionCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.sand,
    },
    questionText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
        marginBottom: 16,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
    },
    optionSelected: {
        borderColor: Colors.thaiGold,
        backgroundColor: '#FFF9E6', // Light gold bg
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.taupe,
        marginRight: 12,
    },
    radioSelected: {
        borderColor: Colors.thaiGold,
        backgroundColor: Colors.thaiGold,
    },
    optionText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.ink,
    },
    optionTextSelected: {
        color: Colors.ink, // Keep ink for readability, or change if needed
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    submitDisabled: {
        backgroundColor: '#A0A0A0',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.white,
        letterSpacing: 1,
    },
});
````

## File: app/learning/dailyLimit.tsx
````typescript
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { useLearningPreferenceStore, DEFAULT_DAILY_LIMIT } from '@/src/stores/learningPreferenceStore';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';

export default function DailyLimitSetupScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const moduleParam = typeof params.module === 'string' ? params.module : 'word';
    const moduleType: ModuleType = moduleParam === 'letter' ? 'letter' : 'word';
    const courseSource = typeof params.source === 'string' ? params.source : undefined;

    const { dailyLimits, setDailyLimit } = useLearningPreferenceStore();
    const { setDailyLimit: setProgressDailyLimit } = useModuleAccessStore();
    const { resetSession } = useVocabularyStore();

    // 优先使用本地已保存的值，否则使用系统默认值（与后端保持一致）
    const initialLimit = useMemo(() => dailyLimits[moduleType] ?? DEFAULT_DAILY_LIMIT, [dailyLimits, moduleType]);
    const [limit, setLimit] = useState(initialLimit);

    const handleConfirm = async () => {
        setDailyLimit(moduleType, limit);
        await setProgressDailyLimit(moduleType, limit);
        // 重置当前 session，让用户下次进入学习时按新 limit 重新拉取
        // （不在这里直接 initSession，因为用户可能还没有確认要进入哪个课程）
        if (moduleType === 'word') {
            resetSession(); // phase 设为 IDLE，下次进入学习页触发重新拉取
        }
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ThaiPatternBackground opacity={0.1} />
            <View style={styles.header}>
                <Text style={styles.title}>{t('learning.setupTitle', '今日学习计划')}</Text>
                <Text style={styles.subtitle}>
                    {moduleType === 'letter'
                        ? t('learning.setupSubtitle', '选择今天要学习/复习的字母数量')
                        : t('learning.setupSubtitleWords', '选择今天要学习/复习的单词数量')}
                </Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.limitValue}>{limit}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={5}
                    maximumValue={200}
                    step={5}
                    value={limit}
                    onValueChange={(value) => setLimit(Math.round(value))}
                    minimumTrackTintColor={Colors.thaiGold}
                    maximumTrackTintColor={Colors.sand}
                    thumbTintColor={Colors.ink}
                />
                <View style={styles.limitLabels}>
                    <Text style={styles.limitLabel}>5</Text>
                    <Text style={styles.limitLabel}>200</Text>
                </View>

                <Pressable style={styles.startButton} onPress={handleConfirm}>
                    <Text style={styles.startButtonText}>{t('learning.start', '开始学习')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
        paddingHorizontal: 24,
        paddingTop: 24,
    },
    header: {
        marginBottom: 24,
        gap: 8,
    },
    title: {
        fontFamily: Typography.playfairBold,
        fontSize: 26,
        color: Colors.ink,
    },
    subtitle: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
        lineHeight: 20,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.sand,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    limitValue: {
        fontFamily: Typography.playfairBold,
        fontSize: 42,
        color: Colors.ink,
        textAlign: 'center',
        marginBottom: 12,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    limitLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -8,
        marginBottom: 24,
    },
    limitLabel: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
    },
    startButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    startButtonText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
    },
});
````

## File: cloudbase/functions/memory-engine/handlers/checkModuleAccess.js
````javascript
/**
 * 检查模块访问权限
 * Action: checkModuleAccess
 */

const { checkModuleAccess } = require('../utils/memoryEngine');
const { validateParams } = require('../utils/validators');
const { createResponse } = require('../utils/response');

async function checkModuleAccessHandler(db, params) {

  const devForceUnlock = process.env.FORCE_UNLOCK === 'true';
  console.log('🔧 FORCE_UNLOCK 当前值:', process.env.FORCE_UNLOCK, '=>', devForceUnlock);
  if (devForceUnlock) {
    return createResponse(true, {
      allowed: true,
      moduleType: params.moduleType,
      progress: 100
    }, '【开发模式】模块已强制放行');
  }

  // ================== 以下为正式生产逻辑 ==================

  // 1️⃣ 参数验证
  const validation = validateParams(params, ['userId', 'moduleType']);
  if (!validation.isValid) {
    return createResponse(false, null, validation.message, 'INVALID_PARAMS');
  }

  const { userId, moduleType } = params;

  // 2️⃣ 验证 moduleType 合法性
  const validModules = ['letter', 'word', 'sentence', 'article'];
  if (!validModules.includes(moduleType)) {
    return createResponse(
      false,
      null,
      `无效的模块类型: ${moduleType}`,
      'INVALID_MODULE_TYPE'
    );
  }

  try {
    // 3️⃣ 正式校验模块权限
    const accessResult = await checkModuleAccess(db, userId, moduleType);

    if (!accessResult.allowed) {
      return createResponse(false, accessResult, accessResult.message, accessResult.errorCode);
    }

    // 4️⃣ 允许访问
    return createResponse(true, {
      allowed: true,
      moduleType,
      progress: accessResult.progress
    }, '模块已解锁,可以访问');

  } catch (error) {
    console.error('checkModuleAccess 错误:', error);
    return createResponse(false, null, error.message || '服务器错误', 'SERVER_ERROR');
  }
}

module.exports = checkModuleAccessHandler;
````

## File: cloudbase/functions/memory-engine/utils/sm2.js
````javascript
/**
 * SM-2 间隔重复算法模块（优化版）
 * 
 * 基于艾宾浩斯遗忘曲线优化:
 * - 早期复习间隔更密集: 1→2→4→7→14 天
 * - "模糊"状态缩短间隔而非维持不变
 * - "陌生"状态重置复习进度
 * 
 * 算法论文: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */

'use strict';

const { MasteryLevel, SM2_PARAMS, EARLY_INTERVALS } = require('./constants');

/**
 * 将掌握程度映射到 SM-2 Quality 值
 * @version 2.0.0 增加对数字和数字字符串的支持，确保 1-5 范围。
 * 
 * SM-2 Quality 定义:
 * 0 - 完全不记得
 * 1 - 错误回答，但看到正确答案后想起
 * 2 - 错误回答，正确答案看起来很熟悉
 * 3 - 正确回答，但困难较大
 * 4 - 正确回答，有些犹豫
 * 5 - 正确回答，毫无困难
 * 
 * @param {string|number} mastery - 掌握程度
 * @returns {number} Quality值 (1-5)
 */
function masteryToQuality(mastery) {
    // 1. 如果输入已经是 1-5 的数字（或可解析为 1-5 的数字字符串）
    const numericQuality = parseInt(mastery, 10);
    if (!isNaN(numericQuality) && numericQuality >= 1 && numericQuality <= 5) {
        return numericQuality;
    }
    // 2. 特殊处理 0 或 6 等越界情况
    if (!isNaN(numericQuality)) {
        return numericQuality < 1 ? 1 : 5;
    }
    // 3. 兼容旧版中文字符串
    switch (mastery) {
        case MasteryLevel.UNFAMILIAR:
            return 1;  // 完全不记得
        case MasteryLevel.FUZZY:
            return 3;  // 有印象但不确定
        case MasteryLevel.REMEMBERED:
            return 5;  // 完全记得
        default:
            return 1;// 默认视为陌生
    }
}

/**
 * 计算下次复习日期（优化版 SM-2 算法）
 * 
 * 改进点:
 * 1. 早期阶段（前5次）使用固定的渐进间隔 [1,2,4,7,14]
 * 2. "模糊"时缩短间隔而非维持不变
 * 3. "陌生"时完全重置复习进度
 * 
 * @param {string|number} mastery - 掌握程度: 忘记/模糊/认识
 * @param {number} currentInterval - 当前复习间隔（天）
 * @param {number} easinessFactor - 简易度因子（1.3-2.5+）
 * @param {number} reviewCount - 已复习次数
 * @returns {number} Quality值 (1-5)
 * 
 * @example
 * const result = calculateSM2('认识', 2, 2.5, 1);
 * // {
 * //   nextInterval: 4,
 * //   nextEasinessFactor: 2.6,
 * //   nextReviewDate: "2025-12-01T10:00:00Z",
 * //   shouldResetCount: false
 * // }
 * */
function calculateSM2(
    mastery,
    currentInterval = 1,
    easinessFactor = SM2_PARAMS.INITIAL_EASINESS_FACTOR,
    reviewCount = 0
) {
    let nextInterval = currentInterval;
    let nextEF = easinessFactor;
    let shouldResetCount = false;

    const quality = masteryToQuality(mastery);

    // ==================== 核心算法逻辑 ====================

    if (quality < 3) {
        // ========== 忘记: 完全重置 ==========
        // 用户完全不记得，需要从头开始学习
        nextInterval = 1;
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.2);
        shouldResetCount = true;

    } else if (quality === 3) {
        // ========== 模糊: 缩短间隔，加强复习 ==========
        // 改进: 不是维持不变，而是缩短20%
        nextInterval = Math.max(1, Math.round(currentInterval * SM2_PARAMS.FUZZY_MULTIPLIER));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF - 0.1);

    } else {
        // ========== 记得: 使用优化的间隔序列 ==========
        if (reviewCount < EARLY_INTERVALS.length) {
            // 早期阶段: 使用预定义的渐进间隔
            // 这是关键改进: 1→2→4→7→14 而非原版的 1→6
            nextInterval = EARLY_INTERVALS[reviewCount];
        } else {
            // 后期阶段: 使用 EF 计算指数增长
            nextInterval = Math.round(currentInterval * nextEF);
        }

        // 提高简易度 (标准 SM-2 公式)
        nextEF = nextEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        nextEF = Math.max(SM2_PARAMS.MIN_EASINESS_FACTOR, nextEF);
    }

    // 限制最大间隔
    nextInterval = Math.min(nextInterval, SM2_PARAMS.MAX_INTERVAL_DAYS);

    // 计算下次复习日期
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

    // 计算新的复习次数
    const newRepetitions = shouldResetCount ? 0 : reviewCount + 1;

    return {
        // === 兼容 memoryEngine.js 的旧接口 ===
        interval: nextInterval,
        easinessFactor: parseFloat(nextEF.toFixed(2)),
        repetitions: newRepetitions,

        // === 新接口（保留供未来使用）===
        nextInterval,
        nextEasinessFactor: parseFloat(nextEF.toFixed(2)),
        nextReviewDate: nextReviewDate.toISOString(),
        shouldResetCount,
    };
}

/**
 * 生成预计复习时间线
 * 
 * 用于前端展示未来的复习计划
 * 
 * @param {number} currentReviewCount - 当前复习次数
 * @param {number} maxItems - 返回的时间线项数 (默认5)
 * @returns {Array} 未来复习计划
 * 
 * @example
 * generateReviewTimeline(2);
 * // [
 * //   { reviewNumber: 3, intervalDays: 4 },
 * //   { reviewNumber: 4, intervalDays: 7 },
 * //   { reviewNumber: 5, intervalDays: 14 },
 * //   ...
 * // ]
 */
function generateReviewTimeline(currentReviewCount, maxItems = 5) {
    const timeline = [];
    let interval = 1;
    let ef = SM2_PARAMS.INITIAL_EASINESS_FACTOR;

    for (let i = currentReviewCount; i < currentReviewCount + maxItems; i++) {
        if (i < EARLY_INTERVALS.length) {
            interval = EARLY_INTERVALS[i];
        } else {
            interval = Math.round(interval * ef);
        }
        interval = Math.min(interval, SM2_PARAMS.MAX_INTERVAL_DAYS);

        timeline.push({
            reviewNumber: i + 1,
            intervalDays: interval,
        });
    }

    return timeline;
}

/**
 * 获取今天的时间范围 (UTC)
 * 
 * @returns {Object} { startOfDay, endOfDay, timestamp }
 */
function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0, 0, 0, 0
    ));
    const endOfDay = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0, 0, 0, 0
    ));

    return {
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString(),
        timestamp: now.toISOString(),
    };
}

/**
 * 获取算法信息 (用于前端展示)
 * 
 * @returns {Object} 算法元信息
 */
function getAlgorithmInfo() {
    return {
        name: 'Optimized SM-2',
        version: '1.1.0',
        earlyIntervals: EARLY_INTERVALS,
        maxInterval: SM2_PARAMS.MAX_INTERVAL_DAYS,
        description: '基于艾宾浩斯遗忘曲线优化的间隔重复算法',
    };
}

module.exports = {
    calculateSM2,
    generateReviewTimeline,
    getTodayRange,
    getAlgorithmInfo,
    masteryToQuality,
};
````

## File: cloudbase/functions/memory-engine/index.js
````javascript
/**
 * memory-engine 云函数
 * 统一记忆引擎服务
 * 版本: 1.0.0
 * 
 * 触发方式: HTTP 触发器
 */

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = cloud.database();

// ===== Handlers =====
const getTodayMemories = require('./handlers/getTodayMemories');
const submitMemoryResult = require('./handlers/submitMemoryResult');
const submitRoundEvaluation = require('./handlers/submitRoundEvaluation');
const checkModuleAccessHandler = require('./handlers/checkModuleAccess');
const getUserProgress = require('./handlers/getUserProgress');
const getAlphabetLessons = require('./handlers/getAlphabetLessons');
const setDailyLimit = require('./handlers/setDailyLimit');

// ===== Utils =====
const { createResponse } = require('./utils/response');

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
    // ===== 解析 HTTP 请求 =====
    let requestData = event;

    // HTTP 触发器：body 可能是字符串或对象
    if (event.body) {
        if (typeof event.body === 'string') {
            try {
                requestData = JSON.parse(event.body);
            } catch (e) {
                console.error('[memory-engine] JSON 解析失败:', e.message);
                return createResponse(false, null, 'Invalid JSON in request body', 'INVALID_JSON');
            }
        } else if (typeof event.body === 'object') {
            requestData = event.body;
        }
    }

    const { action, data = {} } = requestData;

    console.log(`[memory-engine] Action: ${action}`, JSON.stringify(data));

    // 验证 action 参数
    if (!action) {
        return createResponse(
            false,
            null,
            '缺少必填参数: action',
            'MISSING_ACTION'
        );
    }

    try {
        /**
         * 获取今日学习内容 (统一接口)
         */
        if (action === 'getTodayMemories') {
            return await getTodayMemories(db, data);
        }

        /**
         * 提交学习结果 (统一接口)
         */
        if (action === 'submitMemoryResult') {
            return await submitMemoryResult(db, data);
        }

        /**
         * 提交三轮评估结果（字母模块）
         */
        if (action === 'submitRoundEvaluation') {
            return await submitRoundEvaluation(db, data);
        }

        /**
         * 检查模块访问权限
         */
        if (action === 'checkModuleAccess') {
            return await checkModuleAccessHandler(db, data);
        }

        /**
         * 获取用户学习进度
         */
        if (action === 'getUserProgress') {
            return await getUserProgress(db, data);
        }

        /**
         * 获取字母课程列表（用于前端课程总览）
         */
        if (action === 'getAlphabetLessons') {
            return await getAlphabetLessons(db, data);
        }
        if (action === 'setDailyLimit') {
            return await setDailyLimit(db, data);
        }

        // ===== 支持的操作类型 =====
        const supportedActions = [
            'getTodayMemories',
            'submitMemoryResult',
            'submitRoundEvaluation',
            'checkModuleAccess',
            'getUserProgress',
            'getAlphabetLessons',
            'setDailyLimit',
        ];

        return createResponse(
            false,
            { supportedActions },
            `未知的操作类型: ${action}`,
            'UNKNOWN_ACTION'
        );

    } catch (error) {
        console.error(`[memory-engine] 云函数错误:`, error);
        console.error('错误堆栈:', error.stack);

        return createResponse(
            false,
            null,
            error.message || '服务器内部错误',
            'SERVER_ERROR'
        );
    }
};
````

## File: src/components/courses/CourseCard.tsx
````typescript
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export interface CourseCardData {
    id: string;
    source: string;
    title: string;
    description: string;
    level: string;
    imageSource: ImageSourcePropType;
    category: string;
    lessons: number;
}

interface CourseCardProps {
    course: CourseCardData;
    isCurrent: boolean;
    onStart: () => void;
    onCardPress?: () => void;
    progress?: {
        completed: number;
        total: number;
    };
    isLocked?: boolean; // Added: Locked state prop
}

export function CourseCard(
    {
        course,
        isCurrent,
        onStart,
        onCardPress,
        progress,
        isLocked = false, // Default to unlocked
    }: CourseCardProps
) {
    const { t } = useTranslation();

    const progressPercent = progress && progress.total > 0
        ? Math.min(100, Math.round((progress.completed / progress.total) * 100))
        : null;

    return (
        <Pressable
            key={course.id}
            style={[
                styles.card,
                (isCurrent && !isLocked) && styles.activeCard,
                // Removed: isLocked && styles.lockedCard (User requested normal look)
            ]}
            onPress={isLocked ? undefined : (onCardPress || onStart)} // Still disable press if locked
            disabled={isLocked}
        >
            <Image
                source={course.imageSource}
                style={styles.image} // Removed: isLocked && styles.lockedImage
            />
            <View style={styles.info}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={1}>
                        {t(course.title)}
                    </Text>
                    {!isLocked && (
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelText}>{t(course.level)}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {t(course.description)}
                </Text>

                <View style={styles.footer}>
                    {/* Meta Info (Hidden or dimmed when locked) */}
                    <View style={styles.metaColumn}>
                        {!isLocked && (
                            progressPercent !== null ? (
                                <>
                                    <View style={styles.progressBar}>
                                        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                                    </View>
                                    <Text style={styles.metaText}>
                                        {progress?.completed}/{progress?.total} ({progressPercent}%)
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.metaText}>{course.lessons} {t('courses.lessons')}</Text>
                            )
                        )}
                    </View>

                    <Pressable
                        style={[
                            styles.startBtn,
                            isCurrent && styles.activeStartBtn,
                            isLocked && styles.lockedBtn // Locked button style
                        ]}
                        onPress={(e) => {
                            if (isLocked) return;
                            e.stopPropagation();
                            onStart(); // <--- This calls the handler from courses.tsx
                        }}
                        disabled={isLocked}
                    >

                        <Text style={[
                            styles.startBtnText,
                            isCurrent && styles.activeStartBtnText,
                            isLocked && styles.lockedBtnText // Locked text style
                        ]}>
                            {isLocked
                                ? t('courses.locked', '未解锁')
                                : (isCurrent ? t('courses.continue', '继续学习') : t('courses.startBtnText', '开始学习'))
                            }
                        </Text>

                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.sand,
        height: 136,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    activeCard: {
        borderColor: Colors.thaiGold,
        borderWidth: 2,
        backgroundColor: '#FFFCF5',
    },
    lockedCard: {
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
        elevation: 0,
        shadowOpacity: 0,
    },
    image: {
        width: 110,
        height: '100%',
        resizeMode: 'cover',
    },
    lockedImage: {
        opacity: 0.5,
        tintColor: 'gray', // Grayscale effect
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
    },
    title: {
        flex: 1,
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
        color: Colors.ink,
    },
    lockedText: {
        color: '#A0A0A0',
    },
    levelBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    levelText: {
        fontSize: 10,
        color: Colors.thaiGold,
        fontFamily: Typography.notoSerifRegular,
    },
    description: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
        lineHeight: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    metaColumn: {
        flex: 1,
        gap: 6,
    },
    metaText: {
        fontSize: 11,
        color: Colors.taupe,
        fontFamily: Typography.notoSerifRegular,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 3,
    },
    startBtn: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        backgroundColor: Colors.ink,
        borderRadius: 12,
    },
    activeStartBtn: {
        backgroundColor: Colors.thaiGold,
    },
    lockedBtn: {
        backgroundColor: '#E0E0E0',
    },
    startBtnText: {
        fontSize: 12,
        color: Colors.white,
        fontFamily: Typography.notoSerifRegular,
    },
    activeStartBtnText: {
        color: Colors.white,
        fontWeight: '600',
    },
    lockedBtnText: {
        color: '#9E9E9E',
    },
});
````

## File: src/components/learning/vocabulary/NewWordView.tsx
````typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { VocabularyDetailView } from '@/src/components/learning/vocabulary/VocabularyDetailView';
import { WordCard } from '@/src/components/learning/vocabulary/WordCard';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';


interface NewWordViewProps {
    vocabulary: Vocabulary;
    onNext: () => void;
}

export const NewWordView: React.FC<NewWordViewProps> = ({ vocabulary, onNext }) => {
    const { t } = useTranslation();
    const [isRevealed, setIsRevealed] = useState(false);
    const markSelfRating = useVocabularyStore(state => state.markSelfRating);

    const handleRate = (score: number) => {
        markSelfRating(score);
        setIsRevealed(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <WordCard vocabulary={vocabulary} autoPlay={true} />
                <VocabularyDetailView
                    vocabulary={vocabulary}
                    blurDetails={!isRevealed}
                />
            </View>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                {!isRevealed ? (
                    <View style={styles.buttonRow}>
                        {/* Don't Know / Unfamiliar -> Score 1 */}
                        <Pressable
                            style={[styles.actionButton, styles.weakButton]}
                            onPress={() => handleRate(1)}
                        >
                            <Text style={[styles.actionButtonText, styles.weakButtonText]}>
                                {t('learning.dontKnow')}
                            </Text>
                        </Pressable>

                        {/* Know / Familiar -> Score 5 */}
                        <Pressable
                            style={[styles.actionButton, styles.strongButton]}
                            onPress={() => handleRate(5)}
                        >
                            <Text style={[styles.actionButtonText, styles.strongButtonText]}>
                                {t('learning.know')}
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable style={styles.nextButton} onPress={onNext}>
                        <Text style={styles.nextButtonText}>{t('learning.nextEnter')}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    content: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 20,
    },
    bottomBar: {
        padding: 20,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 16,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    actionButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 16,
    },
    weakButton: {
        backgroundColor: Colors.white,
        borderColor: Colors.sand,
    },
    weakButtonText: {
        color: Colors.taupe,
    },
    strongButton: {
        backgroundColor: Colors.ink,
        borderColor: Colors.ink,
    },
    strongButtonText: {
        color: Colors.white,
    },
    nextButton: {
        backgroundColor: Colors.thaiGold,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.white,
    },
});
````

## File: src/components/learning/vocabulary/VocabularyQuizView.tsx
````typescript
import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { VocabMultipleQuiz, QuizOption } from '@/src/components/learning/vocabulary/VocabMultipleQuiz';
import { VocabularyDetailView } from '@/src/components/learning/vocabulary/VocabularyDetailView';
import { WordCard } from '@/src/components/learning/vocabulary/WordCard';
import { useTranslation } from 'react-i18next';

interface VocabularyQuizViewProps {
    vocabulary: Vocabulary;
}

export const VocabularyQuizView: React.FC<VocabularyQuizViewProps> = ({ vocabulary }) => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'QUIZ' | 'DETAILS'>('QUIZ');
    const [options, setOptions] = useState<QuizOption[]>([]);

    const sessionPool = useVocabularyStore(state => state.sessionPool);
    const submitResult = useVocabularyStore(state => state.submitResult);

    // Generate Options only when vocabulary changes
    useEffect(() => {
        setViewMode('QUIZ');

        const correctOption: QuizOption = {
            id: vocabulary._id,
            definition: vocabulary.meaning,
            isCorrect: true
        };

        // 从 sessionPool （原始完整词列表快照）取干扰项，不受 skipWord 影响
        // sessionPool 中同一 id 可能出现多次（learn + quiz 两阶段），先去重
        const seenIds = new Set<string>();
        const uniquePool = sessionPool.filter(item => {
            if (seenIds.has(item.id)) return false;
            seenIds.add(item.id);
            return true;
        });
        const shuffledPool = uniquePool.sort(() => 0.5 - Math.random());

        const distractorPool = new Map<string, QuizOption>();
        for (const item of shuffledPool) {
            if (item.id !== vocabulary._id && !distractorPool.has(item.id)) {
                distractorPool.set(item.id, {
                    id: item.id,
                    definition: item.entity.meaning,
                    isCorrect: false
                });
            }
            if (distractorPool.size >= 3) break;
        }

        const distractors = Array.from(distractorPool.values());
        const combined = [correctOption, ...distractors];
        setOptions(combined.sort(() => 0.5 - Math.random()));
    }, [vocabulary._id]); // Only re-run when word changes

    const handleCorrect = () => {
        // Transition to Details view
        setViewMode('DETAILS');
    };

    const handleWrong = () => {
        // Record mistake, stay in QUIZ mode
        submitResult(false);
    };

    const handleNext = () => {
        // Submit correct (finally) and advance
        // Note: submitResult logic handles scoring based on mistakeCount accumulated during handleWrong
        submitResult(true);
    };

    return (
        <View style={styles.container}>
            {viewMode === 'QUIZ' ? (
                <VocabMultipleQuiz
                    vocabulary={vocabulary}
                    options={options}
                    onCorrect={handleCorrect}
                    onWrong={handleWrong}
                />
            ) : (
                <View style={styles.detailsWrapper}>
                    {/* Reuse VocabularyDetailView (without blur) */}
                    <WordCard
                        vocabulary={vocabulary}
                    />
                    <VocabularyDetailView
                        vocabulary={vocabulary}
                        blurDetails={false}
                    />

                    {/* Bottom Next Button */}
                    <View style={styles.bottomBar}>
                        <Pressable style={styles.nextButton} onPress={handleNext}>
                            <Text style={styles.nextButtonText}>{t('learning.next')}</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    detailsWrapper: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    bottomBar: {
        paddingVertical: 20,
        backgroundColor: Colors.paper,
        borderTopWidth: 1,
        borderTopColor: Colors.sand,
    },
    nextButton: {
        backgroundColor: Colors.ink,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.thaiGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonText: {
        fontFamily: Typography.notoSerifBold,
        fontSize: 18,
        color: Colors.white,
    },
});
````

## File: src/i18n/index.ts
````typescript
import i18n from 'i18next';  // 核心库
import { initReactI18next } from 'react-i18next';  // React 绑定
import * as Localization from 'expo-localization';  // 获取设备语言
import AsyncStorage from '@react-native-async-storage/async-storage';  // 本地存储

import zh from './locales/zh';  // 中文翻译
import en from './locales/en';  // 英文翻译

const LANGUAGE_KEY = 'user-language';  // 存储语言的 key

// 【核心函数1】从本地存储读取用户上次选择的语言
const getStoredLanguage = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LANGUAGE_KEY);  // 读取本地存储
  } catch (error) {
    console.error('Error reading language:', error);
    return null;
  }
};

// 【核心函数2】获取设备语言(如果用户没选过)
const getDeviceLanguage = (): string => {
  const locales = Localization.getLocales();  // 获取区域设置数组
  if (!locales || locales.length === 0) {
    return 'zh'; // 默认中文
  }
  const languageCode = locales[0].languageCode;  // 例如: "zh" 或 "en"
  return languageCode === 'zh' ? 'zh' : 'en';  // 默认中文
};

// 【核心函数3】初始化 i18n
const initI18n = async () => {
  const storedLanguage = await getStoredLanguage();  // 先读本地存储
  const initialLanguage = storedLanguage || getDeviceLanguage();  // 本地没有就用设备语言

  i18n
    .use(initReactI18next)  // 绑定 React
    .init({  // 配置
      resources: {  // 翻译资源
        zh: { translation: zh },  // 中文
        en: { translation: en },  // 英文
      },
      lng: initialLanguage,  // 初始语言
      fallbackLng: 'en',  // 如果翻译缺失,回退到英文
      interpolation: {
        escapeValue: false,  // React 已经防 XSS 了
      },
    });
};

initI18n();  // 立即执行初始化

export default i18n;
````

## File: src/utils/lettersQuestionGenerator.ts
````typescript
// src/utils/lettersQuestionGenerator.ts

/**
 * Letters Question Generator
 *
 * 字母题目生成器 - Phase 2 重构版本
 * 按照 alphabet-module-spec.md 第6章和统一 Question Engine 协议实现
 *
 * 变更说明:
 * - 移除了 LETTER_NAME_TO_THAI 和 THAI_TO_LETTER_NAME 题型
 * - 使用新的 AlphabetGameType 枚举
 * - 函数签名改为 generateQuestion(queueItem, allLetters)
 * - 添加 TONE_CALCULATION 和 PHONICS_MATH 占位实现
 */

import type { Letter } from '@/src/entities/types/letter.types';
import type {
  AlphabetQueueItem,
  AlphabetQuestion,
} from '@/src/entities/types/alphabet.types';
import { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';
import { generateLetterDistractors } from './lettersDistractorEngine';
import { getLetterAudioUrl } from './alphabet/audioHelper';

/**
 * 生成字母题目
 *
 * @param queueItem - 队列项,包含目标字母和题型信息
 * @param allLetters - 所有字母池,用于生成干扰项
 * @returns 生成的题目对象
 */
export function generateQuestion(
  queueItem: AlphabetQueueItem,
  allLetters: Letter[]
): AlphabetQuestion {
  const { letter, gameType } = queueItem;

  // 🐛 P0-1 FIX: 生成干扰项 (3个) + 防御性检查
  const distractorLetters =
    allLetters && allLetters.length > 1
      ? generateLetterDistractors({ pool: allLetters, correct: letter, count: 3 })
      : [];

  // 🐛 P0-1 FIX: 确保有足够的干扰项
  if (distractorLetters.length < 3) {
    console.warn('⚠️ 干扰项不足！', {
      expected: 3,
      actual: distractorLetters.length,
      poolSize: allLetters?.length || 0,
      letterId: letter._id,
      gameType
    });

    // 如果池子太小，用正确字母复制填充（临时方案）
    while (distractorLetters.length < 3) {
      distractorLetters.push({ ...letter, _id: `dummy-${distractorLetters.length}` });
    }
  }

  // 根据题型生成题目
  switch (gameType) {
    case AlphabetGameType.SOUND_TO_LETTER:
      return generateSoundToLetterQuestion(letter, distractorLetters);

    case AlphabetGameType.LETTER_TO_SOUND:
      return generateLetterToSoundQuestion(letter, distractorLetters);

    case AlphabetGameType.CONSONANT_CLASS:
      return generateConsonantClassQuestion(letter);

    case AlphabetGameType.INITIAL_SOUND:
      return generateInitialSoundQuestion(letter, distractorLetters);

    case AlphabetGameType.FINAL_SOUND:
      return generateFinalSoundQuestion(letter, distractorLetters);

    case AlphabetGameType.TONE_CALCULATION:
      return generateToneCalculationQuestion(letter);

    case AlphabetGameType.PHONICS_MATH:
      return generatePhonicsMathQuestion(letter);

    default:
      // STRICT MODE: Do not fallback to simple questions for unknown types.
      // If we get here, it means we requested a type that isn't handled.
      console.error('❌ Unknown Game Type requested:', gameType);
      // We must return *something* to avoid crash, but let's log loudly.
      // Ideally this should trigger a "Content Error" state in UI.
      // For now, return a placeholder valid object but log error.
      // BUT for strict requirement: "不允许 fallback 为简单题". 
      // This implies if we asked for Unknown/Complex, we shouldn't get Simple.
      // But if the code asked for it, it's a bug in the engine.
      // The Engine asked for `CONSONANT_CLASS`, we are in case `CONSONANT_CLASS`.

      // If the case is handled, we are good.
      // The only risk is if `generateConsonantClassQuestion` fails?
      // It currently always returns a question (options are fixed).

      // So this default block is only for truly unknown enum values.
      throw new Error(`[Generator] Unsupported Game Type: ${gameType}`);
  }
}

// ===== 各题型的具体实现 =====

/**
 * 听音选字 - 播放字母发音,选择正确的字母
 */
function generateSoundToLetterQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `sound-to-letter-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.SOUND_TO_LETTER,
    targetLetter: letter,
    options,
    correctAnswer: letter.thaiChar,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 看字选音 - 显示字母,选择正确的发音
 */
function generateLetterToSoundQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `letter-to-sound-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.LETTER_TO_SOUND,
    targetLetter: letter,
    options,
    correctAnswer: letter.initialSound || letter.fullSoundUrl || letter._id,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 辅音类别判断 - 判断字母属于高/中/低辅音
 */
function generateConsonantClassQuestion(letter: Letter): AlphabetQuestion {
  // 固定的三个选项: 高辅音、中辅音、低辅音
  const classOptions: Letter[] = [
    { ...letter, thaiChar: 'components.miniReview.highClass', class: 'high' } as Letter,
    { ...letter, thaiChar: 'components.miniReview.midClass', class: 'mid' } as Letter,
    { ...letter, thaiChar: 'components.miniReview.lowClass', class: 'low' } as Letter,
  ];

  return {
    id: `consonant-class-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.CONSONANT_CLASS,
    targetLetter: letter,
    options: classOptions,
    correctAnswer: mapClassToLabel(letter.class || 'low'),
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 首音判断 - 判断字母的首辅音发音
 */
function generateInitialSoundQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `initial-sound-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.INITIAL_SOUND,
    targetLetter: letter,
    options,
    correctAnswer: letter.initialSound,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 尾音判断 - 判断字母作为尾音时的发音
 */
function generateFinalSoundQuestion(
  letter: Letter,
  distractors: Letter[]
): AlphabetQuestion {
  const options = shuffle([letter, ...distractors]);

  return {
    id: `final-sound-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.FINAL_SOUND,
    targetLetter: letter,
    options,
    correctAnswer: letter.finalSound || letter.initialSound,
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 声调计算 - 占位实现
 *
 * TODO: 在后续迭代中实现完整的声调计算逻辑
 * 需要考虑: 辅音类别 + 元音长短 + 声调符号 → 最终声调
 */
function generateToneCalculationQuestion(letter: Letter): AlphabetQuestion {
  // 占位实现: 返回一个简单的固定题目
  const placeholderOptions: Letter[] = [
    { ...letter, thaiChar: '第1声(平声)' } as Letter,
    { ...letter, thaiChar: '第2声(低声)' } as Letter,
    { ...letter, thaiChar: '第3声(降声)' } as Letter,
  ];

  return {
    id: `tone-calculation-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.TONE_CALCULATION,
    targetLetter: letter,
    options: placeholderOptions,
    correctAnswer: '第1声(平声)', // 占位答案
    audioUrl: getLetterAudioUrl(letter, 'letter'),
  };
}

/**
 * 拼读数学 - 占位实现
 *
 * TODO: 在后续迭代中实现完整的拼读逻辑
 * 需要考虑: 辅音 + 元音的组合发音
 */
function generatePhonicsMathQuestion(letter: Letter): AlphabetQuestion {
  // 占位实现: 返回一个简单的拼读题
  const syllable = `${letter.thaiChar}า`; // 辅音 + 长元音 า
  const placeholderOptions: Letter[] = [
    { ...letter, thaiChar: syllable } as Letter,
    { ...letter, thaiChar: `${letter.thaiChar}ิ` } as Letter,
    { ...letter, thaiChar: `${letter.thaiChar}ุ` } as Letter,
  ];

  return {
    id: `phonics-math-${letter._id}-${Date.now()}`,
    gameType: AlphabetGameType.PHONICS_MATH,
    targetLetter: letter,
    options: placeholderOptions,
    correctAnswer: syllable, // 占位答案
    audioUrl: getLetterAudioUrl(letter, 'syllable'),
  };
}

// ===== 辅助函数 =====

/**
 * 随机打乱数组
 */
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * 将辅音类别映射为中文标签
 */
function mapClassToLabel(cls: string): string {
  if (cls === 'mid') return 'components.miniReview.midClass';
  if (cls === 'high') return 'components.miniReview.highClass';
  return 'components.miniReview.lowClass';
}

// ===== 向后兼容的导出 =====

/**
 * @deprecated 请使用新的 generateQuestion 函数
 *
 * 为了向后兼容,保留旧的函数签名
 * 会在后续版本中移除
 */
export function generateAlphabetQuestion(
  letter: Letter,
  pool: Letter[],
  preferredType?: any // 使用 any 避免导入旧的 QuestionType
): any {
  // 将旧的调用转换为新的格式
  const queueItem: AlphabetQueueItem = {
    letterId: letter._id,
    gameType: AlphabetGameType.SOUND_TO_LETTER, // 默认使用听音选字
    letter,
  };

  return generateQuestion(queueItem, pool);
}
````

## File: src/entities/types/alphabet.types.ts
````typescript
// src/entities/types/alphabet.types.ts

/**
 * 字母学习相关类型
 * 
 * 说明: 此文件定义字母学习会话(Session)相关的类型
 * 不要与letter.types.ts重复定义Letter基础结构
 */

import type { Letter } from './letter.types';

// ==================== 学习会话相关 ====================

/**
 * AlphabetLearningState - 字母学习状态
 *
 * 用于学习会话中追踪单个字母的学习进度
 */
export interface AlphabetLearningState {
    // 基础信息
    alphabetId: string;             // 字母ID (对应Letter._id)
    thaiChar: string;               // 泰文字符
    category: string;               // 类别
    pronunciation: string;          // 发音
    example: string;                // 例词 (已包含中文)
    audioPath: string;              // 音频URL

    // 学习进度
    currentAttempts: number;        // 当前尝试次数
    requiredAttempts: number;       // 需要达到的次数 (默认3)
    qualityHistory: number[];       // 质量评分历史 (1-5)
    isCompleted: boolean;           // 是否完成
    timestamp: string;              // 最后更新时间 (ISO格式)

    // 后端记忆状态 (可选,来自后端getTodayMemories)
    memoryState?: MemoryStatus;

    // ⭐ 新增: 保留完整Letter对象,方便访问所有字段
    letterData?: Letter;
}

// ==================== Phase 2 统一题型协议 ====================

import type { AlphabetGameType } from '@/src/entities/types/alphabetGameTypes';

/**
 * AlphabetQueueItem - 题目队列项
 *
 * 用于 Question Engine 的统一队列项协议
 * 包含字母信息和题型信息
 */
export interface AlphabetQueueItem {
    /** 字母ID */
    letterId: string;

    /** 题型 */
    gameType: AlphabetGameType;

    /** 完整的字母对象,供题目生成器使用 */
    letter: Letter;
}

/**
 * AlphabetQuestion - 统一题目协议
 *
 * 由 lettersQuestionGenerator 生成的标准题目结构
 */
export interface AlphabetQuestion {
    /** 题目ID (可用于追踪) */
    id: string;

    /** 题型 */
    gameType: AlphabetGameType;

    /** 目标字母 (正确答案对应的字母对象) */
    targetLetter: Letter;

    /** 选项 (选择题使用,拼写题可为空) */
    options?: Letter[];

    /** 正确答案 (字母的 thaiChar 或其他属性值) */
    correctAnswer: string;

    /** 音频URL (如果题目需要播放音频) */
    audioUrl?: string;
}

/**
 * MemoryStatus - 后端记忆状态
 * 
 * 来自统一记忆引擎的记忆状态
 */
export interface MemoryStatus {
    easinessFactor: number;         // 难度因子 (1.3-2.5)
    interval: number;               // 复习间隔(天)
    repetitions: number;            // 重复次数
    nextReviewDate: string;         // 下次复习日期 (ISO格式)
    lastReviewDate?: string;        // 最后复习日期
}

/**
 * UnlockInfo - 解锁信息
 * 
 * 用于统一记忆引擎的解锁系统
 */
export interface UnlockInfo {
    letterProgress: number;         // 字母学习进度 (0-1 比例值)
    wordUnlocked: boolean;          // 是否解锁单词学习
    unlocked?: boolean;             // 是否刚刚解锁 (用于弹窗提示)
}

/**
 * TodayLettersResponse - 今日字母学习响应
 * 
 * 后端getTodayMemories返回的数据结构
 */
export interface TodayLettersResponse {
    items: Array<{
        entityId: string;           // 字母ID
        memoryState: MemoryStatus;
    }>;
    unlockInfo: UnlockInfo;
}

/**
 * SubmitLetterResultRequest - 提交字母学习结果
 * 
 * 提交到后端记忆引擎的数据结构
 */
export interface SubmitLetterResultRequest {
    userId: string;
    entityType: 'letter';
    entityId: string;
    quality: number;                // 1-5的质量评分
}

/**
 * SubmitLetterResultResponse - 提交结果响应
 */
export interface SubmitLetterResultResponse {
    success: boolean;
    data?: {
        nextReviewDate: string;
        interval: number;
        repetitions: number;
        unlockInfo?: UnlockInfo;
    };
    message?: string;
    errorCode?: string;
}

// ==================== 测试相关 ====================

/**
 * AlphabetTest - 字母测试数据
 */
export interface AlphabetTest {
    testId: string;
    userId: string;
    questions: AlphabetTestQuestion[];
    totalQuestions: number;
    passingScore: number;           // 及格分数 (默认80)
    createdAt: string;
}

/**
 * AlphabetTestQuestion - 测试题目
 */
export interface AlphabetTestQuestion {
    questionId: string;
    type: 'recognition' | 'pronunciation' | 'writing';
    letterId: string;
    thaiChar: string;
    options?: string[];             // 选项 (选择题)
    correctAnswer: string;
}

/**
 * AlphabetTestResult - 测试结果
 */
export interface AlphabetTestResult {
    testId: string;
    userId: string;
    score: number;                  // 得分 (0-100)
    correctCount: number;
    totalQuestions: number;
    passed: boolean;                // 是否通过
    answers: Array<{
        questionId: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
    }>;
    unlocked?: boolean;             // 是否解锁了下一模块
    completedAt: string;
}

// ==================== 学习会话控制 ====================

/**
 * LearningSessionState - 学习会话状态
 * 
 * 用于AlphabetStore管理整个学习流程
 */
export interface LearningSessionState {
    phase: LearningPhase;
    reviewQueue: AlphabetLearningState[];
    currentAlphabet: AlphabetLearningState | null;
    completedCount: number;
    totalCount: number;
}

/**
 * LearningPhase - 学习阶段枚举
 */
export enum LearningPhase {
    IDLE = 'IDLE',                  // 空闲
    LOADING = 'LOADING',            // 加载中
    REVIEW = 'REVIEW',              // 复习中
    TEST_PROMPT = 'TEST_PROMPT',    // 测试提示
    TESTING = 'TESTING',            // 测试中
    TEST_RESULT = 'TEST_RESULT',    // 测试结果
    COMPLETED = 'COMPLETED'         // 完成
}


// ==================== Phase 2 错题统计 ====================

/**
 * RoundErrorSummary - 轮次错题统计
 *
 * 用于在 Round 结果页展示错误最多的字母
 */
export interface RoundErrorSummary {
    /** 字母ID */
    letterId: string;

    /** 完整的字母对象 */
    letter: Letter;

    /** 错误次数 */
    wrongCount: number;

    /** 总尝试次数 */
    totalAttempts: number;

    /** 错误率 (wrongCount / totalAttempts) */
    errorRate?: number;
}
````

## File: src/entities/types/vocabulary.types.ts
````typescript
// src/entities/types/vocabulary.types.ts


/**
 * 单词基础信息（严格匹配数据库实际字段）
 */
export interface Vocabulary {
    _id: string;
    vId: number;                 // 单词的实际顺序 
    vocabularyId: string;        // 如 "BaseThai_1_218"
    thaiWord: string;            // 泰语单词
    pronunciation: string;       // 发音
    meaning: string;             // 中文意思
    partOfSpeech: string;        // 词性
    level: string;               // 级别
    lessonNumber: string;        // 课程编号 "7.2"
    startingLetter: string;      // 起始字母
    source: string;              // 来源 "BaseThai_1"
    audioPath?: string;          // 主音频 "218.mp3"

    // 深度解析
    analysis?: {
        letter_pron_analysis?: string; // 字母发音解析
        part_of_speech?: string;       // 词性说明
        cognates: {
            0: string;
            1: string;
            2: string;
            3: string;
            4: string;
        };              // 同根词
        phonetic_association?: {       // 联想记忆
            拆分: string;
            记忆句: string;
        };
        common_mistakes?: {            // 常见错误
            使用场合?: string;
            发音易错点?: string;
            相似词汇区别?: string;
        };
        example_dialogue?: {           // 对话示例 (Text only legacy?)
            场景描述: string;
            对话内容: Record<string, { 中文: string; 泰语: string }>;
        };
        example_sentences?: Record<string, { // 例句 (Text only legacy?)
            中文: string;
            发音: string;
            泰语: string;
        }>;
    };

    // 结构化对话 (Audio supported)
    dialogue?: {
        场景描述: string;
        对话内容: {
            [speaker: string]: {
                audioPath: string; // "218_dia_A.mp3"
                中文: string;
                泰语: string;
            };
        };
    };

    // 结构化例句 (Audio supported)
    exampleSentences?: {
        [key: string]: {
            audioPath: string;     // "218_sen_实用场景1.mp3"
            中文: string;
            发音: string;
            泰语: string;
        };
    };

    // 用法说明
    usage?: {
        与中文差异?: string;
        语法示例?: {
            使用技巧?: string;
            结构: string;
            解释: string;
        };
    };

    // 常见错误 (Top level legacy or override?)
    mistakes?: {
        使用场合?: string;
        发音易错点?: string;
        相似词汇区别?: string;
    };

    // 同根词 (Array with audio)
    cognates?: Array<{
        audioPath: string;         // "218_cog_1.mp3"
        text: string;              // "เมื่อก่อน (mʉ̄a gròn) - 以前，从前"
    }>;

    // 时间戳
    createdAt?: Date | string | null;
}
// ==============================================================
/**
 * 单词来源
 */
export type VocabQueueSource =
    | 'vocab-review'       // 复习旧词自评 (ReviewWordView)
    | 'vocab-rev-quiz'     // 复习测验 (VocabularyQuizView)
    | 'vocab-new'          // 新词精讲 (NewWordView)
    | 'vocab-new-quiz'     // 新词测验 (VocabularyQuizView)
    | 'vocab-error-retry'; // 错题重练 (VocabularyQuizView)


/**
 * 单词会话全局状态枚举 (从 LearningPhase 整合)
 */
export enum VocabSessionPhase {
    IDLE = 'vocab-idle',
    LOADING = 'vocab-loading',
    LEARNING = 'vocab-learning',
    COMPLETED = 'vocab-completed',
}

/**
 * 单词评分分值配置
 *  PERFECT: 5,
    GOOD: 4,
    PASS: 3,
    WEAK: 2,
    FAIL: 1,
 */
export const VOCAB_SCORES = {
    PERFECT: 5,
    GOOD: 4,
    PASS: 3,
    WEAK: 2,
    FAIL: 1,
}

// ==============================================================
// 运行时单词状态（仅在内存中存在）
export interface SessionWord {
    id: string;              // 对应 Vocabulary._id
    entity: Vocabulary;      // 原始数据
    isNew: boolean;          // 是否为新词
    source: VocabQueueSource; // 当前处于哪个学习环节
    masteryLevel: number;    // 当前掌握度 (0-5)
    mistakeCount: number;    // 本轮错误计数
    selfRating?: number;     // 用户自评 (1-5)
}

/**
 * 单词学习状态
 */
export interface VocabularyLearningState {
    vocabularyId: string;
    thaiWord: string;
    pronunciation: string;
    meaning: string;
    exampleSentences?: Vocabulary['exampleSentences'];
    audioPath?: string;
    // 记忆引擎相关
    currentAttempts: number;    // 当前尝试次数
    requiredAttempts: number;   // 需要尝试次数
    qualityHistory: number[];   // 质量历史
    isCompleted: boolean;       // 是否完成
    timestamp: string;          // 时间戳

    // ⭐ 完整实体数据 (Single Source of Truth)
    // 前端展示组件应优先使用 entity 中的数据
    entity: Vocabulary;

    // 运行时单词状态（仅在内存中存在）
    sessionWord: SessionWord;
}

export const VOCABULARY_CONFIG = {
    CHUNK_SIZE: 5,           // 每组学习 5 个词
    SCORES: {
        PERFECT: 5,   // 记得 + 0错
        GOOD: 4,      // 模糊 + 0错
        PASS: 3,      // 记得 + 有错
        WEAK: 2,      // 模糊 + 有错
        FAIL: 1       // 陌生
    }
};

/**
 * 后端响应返回的数据：单词
 */
export interface VocabularyResponse {
    items: Array<Vocabulary & {
        memoryState: {
            masteryLevel: number;    // 0-5? or enum
            repetition: number;      // 记忆阶段
            correctCount: number;   // 正确次数
            wrongCount: number;     // 错误次数
            streakCorrect: number;  // 连续正确次数
            nextReviewDate: number; // 下次复习时间戳
            isNew: boolean;          // Backend calculated field from getTodayMemories
        };
    }>;
    summary: {
        total: number;
        reviewCount: number;
        newCount: number;
        entityType: string;
    };
    lessonMetadata?: any; // For letter module(可能已经弃用，待确认)
    phonicsRule?: any;    // For letter module(可能已经弃用，待确认)
}

/**
 * 提交结果请求
 */
export interface SubmitVocabularyResultRequest {
    userId: string;
    vocabularyId: string;
    quality: number;  // 1-5 的质量评分
}

/**
 * 单词进度
 */
export interface VocabularyProgress {
    masteredCount: number;
    totalCount: number;
    accuracy: number;
    masteredIds: string[];
}
````

## File: README.md
````markdown
# 🇹🇭 ThaiLearningApp - 泰语学习应用
⚠️ AI Development Rules

This project is governed by CLAUDE.md.
All AI-assisted changes must comply with it.

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.76.9-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-~52.0.38-000020.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-3178c6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

一款优雅的泰语学习应用，采用间隔重复算法，提供沉浸式的学习体验。

[功能特性](#-功能特性) • [技术栈](#-技术栈) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [开发指南](#-开发指南)

</div>

---

## 📸 应用截图

<div align="center">
  <img src="./docs/screenshots/home.png" width="250" alt="首页" />
  <img src="./docs/screenshots/learning.png" width="250" alt="学习页面" />
  <img src="./docs/screenshots/review.png" width="250" alt="复习页面" />
</div>

## ✨ 功能特性

### 🎯 核心功能
- **统一学习会话**: 复习旧词 + 学习新词的完整学习流程
- **间隔重复算法**: 基于记忆曲线的智能复习系统（每个单词重复3次）
- **三级评估系统**: 认识/模糊/忘记了 - 精准记录学习状态
- **跳过复习**: 灵活的学习节奏控制

### 🌍 国际化支持
- **多语言界面**: 完整支持中文/English
- **自动语言检测**: 根据设备语言自动切换
- **持久化偏好**: 记住用户的语言选择

### 🎨 UI/UX 设计
- **泰国风格主题**: 金色 (#D4AF37) + 墨色 (#1A1A1A) 优雅配色
- **模糊遮罩效果**: 渐进式信息展示，增强学习体验
- **流畅动画**: 使用 `expo-blur` 和 `react-native-reanimated`
- **响应式布局**: 适配各种屏幕尺寸

### 📚 学习功能
- **新词学习**: 
  - 三个标签页：基础释义、例句示例、用法详解
  - 音频发音按钮（准备接入）
  - 渐进式内容展示
- **单词复习**:
  - 上下文例句展示
  - 三按钮快速评估
  - 即时反馈

### 📊 进度追踪
- 学习天数统计
- 学习时长记录
- 掌握单词数量
- 连续打卡天数

## 🛠 技术栈

### 前端框架
- **React Native** 0.76.9 - 跨平台移动应用框架
- **Expo** ~52.0.38 - 开发工具链
- **Expo Router** ~4.0.20 - 文件系统路由
- **TypeScript** 5.1.3 - 类型安全

### UI 组件
- **expo-blur** - 模糊效果
- **lucide-react-native** - 图标库
- **react-native-svg** - SVG 支持
- **expo-linear-gradient** - 渐变效果

### 状态管理 & 数据
- **Zustand** 5.0.8 - 轻量级状态管理
- **i18next** 25.6.3 - 国际化
- **react-i18next** 16.3.4 - React 国际化绑定
- **AsyncStorage** - 本地存储

### 字体
- **Playfair Display** - 英文标题
- **Noto Serif SC** - 中文正文
- **Sarabun** - 泰文专用

### 后端准备
- **Tencent CloudBase** - 云开发平台（准备接入）
- **Axios** - HTTP 客户端

## 🚀 快速开始

### 环境要求
- Node.js >= 18.x
- npm 或 yarn
- iOS Simulator (macOS) 或 Android Emulator

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/ThaiLearningApp.git
cd ThaiLearningApp
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm start
```

4. **运行应用**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### 环境变量配置

创建 `.env` 文件：
```env
EXPO_PUBLIC_CLOUDBASE_ENV_ID=your_cloudbase_env_id
EXPO_PUBLIC_API_BASE_URL=your_api_base_url
```

## 📁 项目结构

```
ThaiLearningApp/
├── app/                          # Expo Router 页面
│   ├── (auth)/                   # 认证模块
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # 主导航
│   │   ├── index.tsx             # 首页
│   │   ├── courses.tsx           # 课程列表
│   │   └── profile.tsx           # 个人中心
│   ├── learning/                 # 学习模块
│   │   └── index.tsx             # 统一学习会话
│   └── _layout.tsx               # 根布局
├── src/
│   ├── components/               # 组件库
│   │   ├── common/               # 通用组件
│   │   ├── learning/             # 学习组件
│   │   │   ├── NewWordView.tsx   # 新词学习
│   │   │   └── ReviewWordView.tsx # 复习视图
│   │   ├── progress/             # 进度组件
│   │   └── pronunciation/        # 发音组件
│   ├── constants/                # 常量定义
│   │   ├── colors.ts             # 颜色系统
│   │   └── typography.ts         # 字体系统
│   ├── i18n/                     # 国际化
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── zh.ts             # 中文
│   │       └── en.ts             # 英文
│   ├── stores/                   # Zustand 状态
│   │   ├── authStore.ts
│   │   ├── languageStore.ts
│   │   └── learningStore.ts
│   ├── entities/                 # 类型定义
│   └── utils/                    # 工具函数
├── cloudbase/                    # 云开发
│   └── functions/                # 云函数
├── docs/                         # 文档
│   ├── project-snapshot-v5.md    # 项目快照
│   └── screenshots/              # 截图
└── assets/                       # 静态资源
```

## 🎨 设计系统

### 颜色规范
```typescript
Colors = {
  paper: '#FAF9F6',      // 背景色
  ink: '#1A1A1A',        // 主文本
  sand: '#E5E2DB',       // 边框
  taupe: '#8E8B82',      // 次要文本
  thaiGold: '#D4AF37',   // 强调色
  accent: '#B8956A',     // 辅助色
}
```

### 字体规范
- **标题**: Playfair Display (英文) / Noto Serif SC (中文)
- **正文**: Noto Serif SC
- **泰文**: Sarabun

### 组件规范
详见 [项目快照 v5](./docs/project-snapshot-v5.md)

## 💻 开发指南

### 添加新页面
使用 Expo Router 文件系统路由：
```bash
# 创建新页面
touch app/new-page.tsx
```

### 添加新组件
```bash
# 创建组件
touch src/components/MyComponent.tsx
```

### 国际化
1. 在 `src/i18n/locales/zh.ts` 和 `en.ts` 添加翻译键
2. 在组件中使用：
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <Text>{t('myKey')}</Text>;
};
```

### 状态管理
使用 Zustand：
```tsx
import { create } from 'zustand';

const useMyStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## � 后端接入

### 数据结构

#### 单词 (Word)
```typescript
interface WordData {
  id: string;
  thai: string;           // 泰文
  phonetic: string;       // 罗马音
  type: string;           // 词性
  meaning: string;        // 释义
  definitions: {
    basic: string;
    examples: { thai: string; meaning: string }[];
    usage: { /* ... */ };
  };
}
```

### API 接口

#### 获取学习队列
```typescript
GET /api/learning/queue
Response: {
  reviewWords: WordData[];
  newWords: WordData[];
}
```

#### 提交学习结果
```typescript
POST /api/learning/submit
Body: {
  wordId: string;
  quality: 'know' | 'unsure' | 'forgot';
  timestamp: number;
}
```

详细后端接入指南请参考 [项目快照 v5](./docs/project-snapshot-v5.md#后端接入指南)

## 📝 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 样式使用 StyleSheet.create()
- 所有用户可见文本必须国际化

### 命名规范
- 组件文件: `PascalCase.tsx`
- 工具文件: `camelCase.ts`
- 常量文件: `camelCase.ts`
- 样式名: `camelCase`

### Git 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

## 🗺 路线图

### v1.1 (计划中)
- [ ] 接入真实后端 API
- [ ] 实现音频播放功能
- [ ] 添加学习统计图表
- [ ] 实现离线缓存

### v1.2 (计划中)
- [ ] 实现 SM-2 间隔重复算法
- [ ] 添加单词收藏功能
- [ ] 实现学习提醒通知
- [ ] 添加社交分享功能

### v2.0 (规划中)
- [ ] AI 语音评测
- [ ] 个性化学习路径
- [ ] 社区互动功能
- [ ] 游戏化学习

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👥 团队

- **开发者**: Liang Jianyu
- **设计**: ThaiLearningApp Team

## 📧 联系方式

- 项目主页: [GitHub](https://github.com/yourusername/ThaiLearningApp)
- 问题反馈: [Issues](https://github.com/yourusername/ThaiLearningApp/issues)

## 🙏 致谢

- [Expo](https://expo.dev/) - 优秀的开发工具链
- [React Native](https://reactnative.dev/) - 强大的跨平台框架
- [Lucide Icons](https://lucide.dev/) - 精美的图标库
- 所有贡献者和支持者

---

<div align="center">

**[⬆ 回到顶部](#-thailearningapp---泰语学习应用)**

Made with ❤️ by ThaiLearningApp Team

</div>
````

## File: tsconfig.json
````json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-native",
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}
````

## File: app/(tabs)/_layout.tsx
````typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { Home, BookOpen, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface TabButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ icon: Icon, label, isActive, onPress }: TabButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <Icon
        size={22}
        strokeWidth={isActive ? 2 : 1.5}
        color={isActive ? Colors.ink : Colors.taupe}
      />
      <Text
        style={[
          styles.tabLabel,
          {
            color: isActive ? Colors.ink : Colors.taupe,
            fontFamily: Typography.notoSerifRegular,
          }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

function CustomTabBar({ state, navigation }: CustomTabBarProps) {

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
        }
      ]}
    >
      {Platform.OS === 'ios' && (
        <BlurView
          intensity={80}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.tabBarContent}>
        {/* Left: Learn */}
        <TabButton
          icon={BookOpen}
          label="学习"
          isActive={state.index === 1}
          onPress={() => navigation.navigate('courses')}
        />

        {/* Center: Home (Protruding) */}
        <View style={[styles.centerButtonContainer]}>
          <Pressable
            onPress={() => navigation.navigate('index')}
            style={[
              styles.centerButton,
              {
                backgroundColor: state.index === 0 ? Colors.ink : Colors.white,
              }
            ]}
          >
            <Home
              size={40}
              strokeWidth={2}
              color={state.index === 0 ? Colors.white : Colors.taupe}

            />
          </Pressable>
        </View>

        {/* Right: Profile */}
        <TabButton
          icon={User}
          label="我的"
          isActive={state.index === 2}
          onPress={() => navigation.navigate('profile')}
        />
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="courses" />
      {/* profile 路由由文件系统自动创建，无需手动声明 */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.white,
  },
  tabBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  centerButtonContainer: {
    position: 'absolute',
    left: '60%',
    marginLeft: -42,
  },
  centerButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.paper,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
````

## File: cloudbase/functions/user-register/index.js
````javascript
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

//JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

exports.main = async (event, context) => {
  // Parse request body if coming from HTTP trigger
  let requestData = event;
  if (typeof event.body === 'string') {
    try {
      requestData = JSON.parse(event.body);
    } catch (e) {
      return {
        success: false,
        message: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      };
    }
  } else if (event.body && typeof event.body === 'object') {
    requestData = event.body;
  }

  const { email, password, displayName, role = 'LEARNER' } = requestData;

  // Validate required fields
  if (!email || !password || !displayName) {
    return {
      success: false,
      message: 'Missing required fields: email, password, displayName',
      code: 'MISSING_FIELDS'
    };
  }

  try {
    // Check if email already exists 
    const existingUser = await db.collection('users').where({
      email: email.toLowerCase()
    }).count();

    if (existingUser.count > 0) {
      return {
        success: false,
        message: '邮箱已存在 \n Email already exists',
        code: 'EMAIL_EXISTS'
      };
    }

    // ===== Hash password =====
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 创建新用户
    const userId = `u_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const registrationDate = new Date().toISOString();
    const userDoc = {
      userId,
      email: email.toLowerCase(),
      passwordHash,
      displayName,
      role,
      registrationDate,
      lastLogin: registrationDate,
      isActive: true,
      preferences: {
        language: 'zh',
        notificationsEnabled: true
      }
    };
    // ===== Save to database =====
    await db.collection('users').add({
      data: userDoc
    });

    // 初始化用户整体学习进度 (统一进度表)
    await db.collection('user_progress').add({
      data: {
        userId,
        letterCompleted: false,
        letterProgress: 0.0,
        wordProgress: [],
        sentenceProgress: [],
        articleProgress: [],
        totalStudyDays: 0,
        streakDays: 0,
        lastStudyDate: null,
        createdAt: registrationDate,
        updatedAt: registrationDate
      }
    });

    // 初始化字母模块专用进度表
    // 说明:
    // - letterProgress: 0–1 之间的小数, 0.8 代表 80%
    // - letterCompleted: 三轮全部完成后由记忆引擎更新为 true
    // - completedLessons: 已完成的字母课程ID列表 (例如: ["alphabet-lesson1"])
    // - masteredLetterCount: 已掌握的字母数量
    // - totalLetterCount: 字母总数 (当前约 80, 预留给未来扩展)
    await db.collection('user_alphabet_progress').add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          // 🔥 新增：默认从第1轮开始
        roundHistory: [],         // 🔥 新增：轮次历史记录
        createdAt: registrationDate,
        updatedAt: registrationDate,
      }
    });

    // ===== Generate JWT token =====
    const token = jwt.sign(
      {
        userId,
        email: email.toLowerCase(),
        role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    // ===== Return user data (exclude password hash) =====
    const { passwordHash: _, ...userResponse } = userDoc;

    return {
      success: true,
      data: {
        user: userResponse,
        token,
        expiresIn: 604800 // 7 days in seconds
      }
    };

  } catch (error) {
    console.error('注册失败:', error);
    return {
      success: false,
      message: '注册失败: ' + error.message
    };
  }
};
````

## File: cloudbase/cloudbaserc.json
````json
{
  "envId": "cloud1-1gjcyrdd7ab927c6",
  "region": "ap-shanghai",
  "functionRoot": "./functions",
  "functions": [
    {
      "name": "user-register",
      "timeout": 15,
      "runtime": "Nodejs18.15",
      "handler": "index.main"
    },
    {
      "name": "user-login",
      "timeout": 15,
      "runtime": "Nodejs18.15",
      "handler": "index.main"
    },
    {
      "name": "user-reset-password",
      "timeout": 15,
      "runtime": "Nodejs18.15",
      "handler": "index.main"
    },
    {
      "name": "user-update-profile",
      "timeout": 15,
      "runtime": "Nodejs18.15",
      "handler": "index.main"
    },
    {
      "name": "memory-engine",
      "timeout": 20,
      "runtime": "Nodejs18.15",
      "handler": "index.main",
      "installDependency": true
    },
    {
      "name": "alphabet",
      "timeout": 20,
      "runtime": "Nodejs18.15",
      "handler": "index.main",
      "installDependency": true
    },
    {
      "name": "storage-download",
      "timeout": 20,
      "runtime": "Nodejs18.15",
      "handler": "index.main",
      "installDependency": true
    },
    {
      "name": "ai-engine",
      "timeout": 200,
      "runtime": "Nodejs18.15",
      "handler": "index.main",
      "installDependency": true
    }
  ]
}
````

## File: src/components/learning/alphabet/AlphabetLearningView.tsx
````typescript
// src/components/learning/alphabet/AlphabetLearningView.tsx

import React, { memo, useCallback, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Volume2, Play } from 'lucide-react-native';

import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetLearningViewProps {
  alphabet: AlphabetLearningState;
  onNext: () => void;
  onBack?: () => void;
}

export const AlphabetLearningView = memo(function AlphabetLearningView({
  alphabet,
  onNext,
  onBack,
}: AlphabetLearningViewProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const audioModeConfiguredRef = useRef(false);
  const autoPlayCounter = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const letter = alphabet.letter;
  const lessonOrder = letter.primaryCurriculumLessonOrder;

  const thaiChar = letter.thaiChar;
  const nameEnglish = letter.nameEnglish;

  const syllableSoundName = letter.syllableSoundName;

  const initialSound = letter.initialSound;
  const finalSound = letter.finalSound;

  const exampleWord = letter.exampleWord;
  const exampleMeaning = letter.exampleMeaning;
  const syllableSoundUrl = letter.syllableSoundUrl;
  const endSyllableSoundUrl = letter.endSyllableSoundUrl;

  const fullSoundLocalPath = letter.fullSoundLocalPath;
  const coreSyllableLocalPath = letter.syllableSoundLocalPath;
  const endSyllableSoundLocalPath = letter.endSyllableSoundLocalPath;
  const exampleWordLocalPath = letter.letterPronunciationLocalPath;

  // --- Audio Logic ---

  const resolveAudioPath = useCallback(
    (primary?: string | null) => {
      //  relaxes strict file:// check, allowing any valid path string
      if (primary && primary.length > 0) return primary;
      if (alphabet.audioUrl && alphabet.audioUrl.length > 0)
        return alphabet.audioUrl;
      return null;
    },
    [alphabet.audioUrl]
  );


  const playLocalAudio = useCallback(async (localPath?: string | null) => {
    // Relaxes check: allow any string path
    if (!localPath) return;


    try {
      setIsPlaying(true);
      if (!audioModeConfiguredRef.current) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        audioModeConfiguredRef.current = true;
      }

      if (soundRef.current) {
        await soundRef.current.unloadAsync().catch(() => { });
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: localPath },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (e) {
      console.warn('❌ Playback failed:', e);
      setIsPlaying(false);
    }
  }, []);

  const handlePlayFullLetter = useCallback(() => {
    const path = resolveAudioPath(fullSoundLocalPath);
    void playLocalAudio(path);
  }, [fullSoundLocalPath, resolveAudioPath, playLocalAudio]);

  const handlePlayCoreSyllable = useCallback(() => {
    const path = resolveAudioPath(coreSyllableLocalPath);
    void playLocalAudio(path);
  }, [coreSyllableLocalPath, resolveAudioPath, playLocalAudio]);

  const handlePlayEndSyllable = useCallback(() => {
    const path = resolveAudioPath(
      endSyllableSoundLocalPath || coreSyllableLocalPath
    );
    void playLocalAudio(path);
  }, [endSyllableSoundLocalPath, coreSyllableLocalPath, resolveAudioPath, playLocalAudio]);

  // Position Sound Handlers
  const handlePlayInitialSound = useCallback(() => {
    // Priority: Local Cache -> Remote Specific URL -> (resolveAudioPath Fallback to Full)
    const path = resolveAudioPath(coreSyllableLocalPath || syllableSoundUrl);
    void playLocalAudio(path);
  }, [coreSyllableLocalPath, syllableSoundUrl, resolveAudioPath, playLocalAudio]);

  const handlePlayFinalSound = useCallback(() => {
    // Priority: Local Final -> Remote Final -> Local Syllable -> Remote Syllable
    const path = resolveAudioPath(
      endSyllableSoundLocalPath || endSyllableSoundUrl || coreSyllableLocalPath || syllableSoundUrl
    );
    void playLocalAudio(path);
  }, [endSyllableSoundLocalPath, endSyllableSoundUrl, coreSyllableLocalPath, syllableSoundUrl, resolveAudioPath, playLocalAudio]);

  const handlePlayExampleWord = useCallback(() => {
    const path = resolveAudioPath(
      exampleWordLocalPath || fullSoundLocalPath || coreSyllableLocalPath
    );
    void playLocalAudio(path);
  }, [exampleWordLocalPath, fullSoundLocalPath, coreSyllableLocalPath, resolveAudioPath, playLocalAudio]);


  // --- Auto-Play Logic ---

  useEffect(() => {

    const playTwice = async () => {
      const path = resolveAudioPath(fullSoundLocalPath);
      if (!path) return;

      // First play
      await playLocalAudio(path);
    };

    void playTwice();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => { });
      }
    };
  }, [letter._id, resolveAudioPath, fullSoundLocalPath, playLocalAudio]);


  // --- Render ---

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Label */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {lessonOrder ? `Lesson ${lessonOrder} · ` : ''}Learning Letter
        </Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroInner}>
          <Text style={styles.thaiChar}>{thaiChar}</Text>
          {nameEnglish && <Text style={styles.englishName}>{nameEnglish}</Text>}

          <TouchableOpacity
            style={[styles.mainPlayButton, isPlaying && styles.buttonActive]}
            onPress={handlePlayFullLetter}
            disabled={!resolveAudioPath(fullSoundLocalPath)}
          >
            <Volume2 size={24} color={Colors.white} />
            <Text style={styles.mainPlayText}>Play Full Sound</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Card */}
      <View style={styles.detailsCard}>

        {/* Row 1: Syllable Sound */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🔊</Text>
            </View>
            <Text style={styles.detailLabel}>Core Sound</Text>
          </View>
          <TouchableOpacity
            style={styles.detailAction}
            onPress={handlePlayCoreSyllable}
            disabled={!resolveAudioPath(coreSyllableLocalPath)}
          >
            <Text style={styles.detailValue}>/{syllableSoundName || '-'}/</Text>
            <Play size={16} color={Colors.thaiGold} fill={Colors.thaiGold} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Row 2: Initial / Final */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🧩</Text>
            </View>
            <Text style={styles.detailLabel}>Position</Text>
          </View>
          <View style={styles.positionContainer}>
            <TouchableOpacity
              style={styles.positionBlock}
              onPress={handlePlayInitialSound}
              disabled={!resolveAudioPath(coreSyllableLocalPath || syllableSoundUrl)}
            >
              <Text style={styles.positionLabel}>Initial</Text>
              <View style={styles.positionValueRow}>
                <Text style={styles.positionValue}>/{initialSound || '-'}/</Text>
                <Play size={12} color={Colors.thaiGold} fill={Colors.thaiGold} style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>

            <View style={styles.verticalDivider} />

            <TouchableOpacity
              style={styles.positionBlock}
              onPress={handlePlayFinalSound}
              disabled={!resolveAudioPath(endSyllableSoundLocalPath || endSyllableSoundUrl || coreSyllableLocalPath || syllableSoundUrl)}
            >
              <Text style={styles.positionLabel}>Final</Text>
              <View style={styles.positionValueRow}>
                <Text style={styles.positionValue}>/{finalSound || '-'}/</Text>
                <Play size={12} color={Colors.thaiGold} fill={Colors.thaiGold} style={{ marginLeft: 4 }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Row 3: Example Word */}
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📌</Text>
            </View>
            <Text style={styles.detailLabel}>Example</Text>
          </View>
          <TouchableOpacity
            style={styles.detailAction}
            onPress={handlePlayExampleWord}
            disabled={!resolveAudioPath(exampleWordLocalPath || fullSoundLocalPath)}
          >
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.exampleWord}>{exampleWord || '-'}</Text>
              {exampleMeaning && <Text style={styles.exampleMeaning}>{exampleMeaning}</Text>}
            </View>
            <Play size={16} color={Colors.thaiGold} fill={Colors.thaiGold} />
          </TouchableOpacity>
        </View>

      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={onNext}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  heroInner: {
    alignItems: 'center',
    width: '100%',
  },
  thaiChar: {
    fontFamily: Typography.playfairBold,
    fontSize: 96,
    color: Colors.ink,
    lineHeight: 110,
    marginBottom: 8,
  },
  englishName: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    color: Colors.taupe,
    marginBottom: 24,
  },
  mainPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.thaiGold,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    gap: 8,
    width: '100%',
    justifyContent: 'center',
  },
  buttonActive: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }]
  },
  mainPlayText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 4,
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  detailLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 15,
    color: Colors.ink,
  },
  detailAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFCF5', // Light gold bg
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  detailValue: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  positionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  positionBlock: {
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: 10,
    color: Colors.taupe,
    textTransform: 'uppercase',
    marginBottom: 2,
    fontFamily: Typography.notoSerifRegular,
  },
  positionValue: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 15,
    color: Colors.ink,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
  },
  exampleWord: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
  exampleMeaning: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
  },
  positionValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footer: {
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    backgroundColor: Colors.ink,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  continueText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
````

## File: .gitignore
````
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

# generated native folders
/ios
/android

# environment variables
.env

# Local reference data (do not commit)
assets/courses/
assets/data/

# docs
/docs
docs/Document
docs/OLD
docs/project-freeze
/Rule
# Environment variables
.env.local
````

## File: app/alphabet/index.tsx
````typescript
// app/alphabet/index.tsx
// 字母课程总览页（课程入口 → Lesson 1~5）

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, X, BookOpen, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { getAllLessons } from '@/src/config/alphabet/lessonMetadata.config';
import type { LessonMetadata } from '@/src/entities/types/phonicsRule.types';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LessonCardProps {
  id: string;
  title: string;
  description: string;
  letterKeys: string[];
  lessonData: LessonMetadata; // Store full metadata for drawer
  isCurrent: boolean;
  progress?: {
    completed: number;
    total: number;
  };
}

// --- Drawer Component ---

interface LessonDrawerProps {
  visible: boolean;
  lesson: LessonCardProps | null;
  onClose: () => void;
  onStart: () => void;
  unlocked: boolean;
}

const LessonDrawer = ({ visible, lesson, onClose, onStart, unlocked }: LessonDrawerProps) => {
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  if (!lesson) return null;

  const { lessonData } = lesson;
  const allLetters = [
    ...lessonData.consonants,
    ...lessonData.vowels,
    ...lessonData.tones
  ];

  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={drawerStyles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[drawerStyles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            drawerStyles.sheet,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={drawerStyles.handle} />

          {/* Header */}
          <View style={drawerStyles.header}>
            <View style={{ flex: 1 }}>
              <Text style={drawerStyles.title}>{lesson.title}</Text>
              <Text style={drawerStyles.subtitle}>{t('alphabetCourse.drawer.expectedTime')}</Text>
            </View>
            <Pressable onPress={onClose} style={drawerStyles.closeButton}>
              <X size={24} color={Colors.taupe} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={drawerStyles.content}>
            <Text style={drawerStyles.sectionTitle}>{t('alphabetCourse.drawer.description')}</Text>
            <Text style={drawerStyles.description}>
              {t(`alphabetCourse.lessons.${lesson.id}.description`, { defaultValue: lesson.description })}
            </Text>

            <Text style={drawerStyles.sectionTitle}>{t('alphabetCourse.drawer.contentPreview', { count: allLetters.length })}</Text>
            <View style={drawerStyles.grid}>
              {allLetters.map((char, index) => (
                <View key={index} style={drawerStyles.gridItem}>
                  <Text style={drawerStyles.gridChar}>{char}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={drawerStyles.footer}>
            <Pressable
              style={[drawerStyles.startButton, !unlocked && drawerStyles.disabledBtn]}
              onPress={onStart}
              disabled={!unlocked}
            >
              <Text style={drawerStyles.startButtonText}>
                {unlocked ? t('alphabet.start') : t('courses.locked')}
              </Text>
              {unlocked && <ChevronRight size={20} color={Colors.white} />}
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// --- Main Screen ---

export default function AlphabetCoursesScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [lessons, setLessons] = useState<LessonCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Drawer State
  const [selectedLesson, setSelectedLesson] = useState<LessonCardProps | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 🔥 TODO-07: 使用 moduleAccessStore 读取已完成课程列表
  const { userProgress, getUserProgress } = useModuleAccessStore();
  const completedLessons = userProgress?.completedAlphabetLessons ?? [];

  // 🔥 TODO-07: 确保进入页面时加载用户进度
  useEffect(() => {
    getUserProgress();
  }, [getUserProgress]);

  useEffect(() => {
    let mounted = true;

    const mapLessons = (list: LessonMetadata[]): LessonCardProps[] =>
      list.map((lesson) => {
        const letterKeys = [
          ...lesson.consonants,
          ...lesson.vowels,
          ...lesson.tones,
        ];

        return {
          id: lesson.lessonId,
          title: lesson.title,
          description: lesson.description,
          letterKeys,
          lessonData: lesson,
          isCurrent: false,
          progress: {
            completed: 0,
            total: lesson.totalCount,
          },
        };
      });

    (async () => {
      try {
        const res = await callCloudFunction<{ lessons: LessonMetadata[] }>(
          'getAlphabetLessons',
          {},
          {
            endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
          },
        );

        const list: LessonMetadata[] =
          (res.success && res.data?.lessons) || getAllLessons();

        if (!mounted) return;
        setLessons(mapLessons(list));
      } catch {
        if (!mounted) return;
        setLessons(mapLessons(getAllLessons()));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔥 TODO-07: 进度百分比基于已完成课程数,而非字母数
  const totalLessons = lessons.length;
  const overallProgressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedLessons.length / totalLessons) * 100))
      : 0;

  const handleCardPress = (lesson: LessonCardProps) => {
    setSelectedLesson(lesson);
    setDrawerVisible(true);
  };

  const handleStartLesson = (lessonId: string) => {
    setDrawerVisible(false);
    router.push(`/alphabet/${lessonId}`);
  };

  // 🔥 TODO-07: 课程解锁逻辑只依赖 completedAlphabetLessons
  // 规则: lesson1 永远解锁, lessonN 需要 lesson(N-1) 已完成
  const isLessonUnlocked = useCallback((lessonIndex: number): boolean => {
    if (lessonIndex === 0) return true; // lesson1 永远解锁
    const prevLessonId = lessons[lessonIndex - 1]?.id;
    return prevLessonId ? completedLessons.includes(prevLessonId) : false;
  }, [lessons, completedLessons]);

  // Helper to check unlocked status for modal
  const isSelectedUnlocked = useMemo(() => {
    if (!selectedLesson) return false;
    const index = lessons.findIndex(l => l.id === selectedLesson.id);
    if (index === -1) return false;
    return isLessonUnlocked(index);
  }, [selectedLesson, lessons, isLessonUnlocked]);


  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>

      <View style={styles.backRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.taupe} />
          <Text style={styles.backText}>{t('alphabetCourse.back')}</Text>
        </Pressable>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('alphabetCourse.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('alphabetCourse.headerSubtitle', { count: lessons.length, percent: overallProgressPercent })}
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.thaiGold} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
            <ThaiPatternBackground opacity={0.12} />

            {lessons.map((lesson, index) => {
              // 🔥 TODO-07: 解锁逻辑统一为 completedAlphabetLessons
              const unlocked = isLessonUnlocked(index);

              // 🔥 TODO-07: "当前课程" = 第一个已解锁但未完成的课程
              const isCompleted = completedLessons.includes(lesson.id);
              const isCurrent = unlocked && !isCompleted;

              return (
                <Pressable
                  key={lesson.id}
                  style={[styles.card, isCurrent && styles.activeCard]}
                  onPress={() => handleCardPress(lesson)}
                >
                  <View style={styles.cardPressable}>
                    <View style={styles.info}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.title} numberOfLines={1}>
                          {t(`alphabetCourse.lessons.${lesson.id}.title`, { defaultValue: lesson.title })}
                        </Text>
                        {isCurrent && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>{t('alphabetCourse.currentBadge')}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.description} numberOfLines={2}>
                        {t(`alphabetCourse.lessons.${lesson.id}.description`, { defaultValue: lesson.description })}
                      </Text>

                      <View style={styles.footer}>
                        <View style={styles.metaColumn}>
                          <Text style={styles.lessonMeta}>
                            {t('alphabetCourse.letterCount', { count: lesson.letterKeys.length })}
                          </Text>
                        </View>

                        {/* Start Learning Button - Direct Access */}
                        <Pressable
                          disabled={!unlocked}
                          style={[
                            styles.startBtn,
                            isCurrent && styles.activeStartBtn,
                            !unlocked && styles.disabledStartBtn,
                          ]}
                          // Stop propagation to prevent opening drawer when clicking Start directly
                          onPress={(e) => {
                            e.stopPropagation();
                            router.push(`/alphabet/${lesson.id}`);
                          }}
                        >
                          <Text
                            style={[
                              styles.startBtnText,
                              isCurrent && styles.activeStartBtnText,
                            ]}
                          >
                            {unlocked ? t('alphabetCourse.start') : t('courses.locked')}
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Pressable>
              );
            })}

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Fixed Footer for Test Entry */}
          <View style={styles.footerContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.unlockAllBtn,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
              ]}
              onPress={() => router.push('/alphabet/test')}
            >
              <Text style={styles.unlockAllText}>
                {t('alphabetCourse.takeTest')}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Detail Drawer */}
      <LessonDrawer
        visible={drawerVisible}
        lesson={selectedLesson}
        unlocked={isSelectedUnlocked}
        onClose={() => setDrawerVisible(false)}
        onStart={() => selectedLesson && handleStartLesson(selectedLesson.id)}
      />

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  scroll: {
    flex: 1,
  },
  inner: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    paddingBottom: 48,
  },
  backRow: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  backText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
    marginLeft: 4,
  },
  headerTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activeCard: {
    borderColor: Colors.thaiGold,
    borderWidth: 1.5,
    backgroundColor: '#FFFCF5',
  },
  cardPressable: {
    flex: 1,
    flexDirection: 'row',
  },
  info: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 10,
    color: Colors.thaiGold,
    fontFamily: Typography.notoSerifBold,
    textTransform: 'uppercase',
  },
  description: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.taupe,
    lineHeight: 18,
  },
  lessonMeta: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 12,
    color: Colors.taupe,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  metaColumn: {
    flex: 1,
  },
  startBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.ink,
    borderRadius: 20,
  },
  activeStartBtn: {
    backgroundColor: Colors.thaiGold,
  },
  startBtnText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Typography.notoSerifBold,
  },
  activeStartBtnText: {
    color: Colors.white,
  },
  disabledStartBtn: {
    backgroundColor: '#E0E0E0',
  },
  // Footer Button Styles
  footerContainer: {
    padding: 24,
    paddingBottom: 34, // Extra padding for safe area
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.sand,
  },
  unlockAllBtn: {
    width: '100%',
    backgroundColor: Colors.ink,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  unlockAllText: {
    fontFamily: Typography.playfairBold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

const drawerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  sheet: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    minHeight: '50%',
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 15,
    color: Colors.taupe,
    lineHeight: 22,
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  gridChar: {
    fontFamily: Typography.playfairBold,
    fontSize: 20,
    color: Colors.ink,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  startButton: {
    backgroundColor: Colors.thaiGold,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.thaiGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.white,
  },
  disabledBtn: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
  }
});
````

## File: app/_layout.tsx
````typescript
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useUserStore } from '@/src/stores/userStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import '../global.css';
import { useState } from 'react';

// Prevent the splash screen from auto-hiding before asset loading
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const { isAuthenticated } = useUserStore();
  const { checkAccess, getUserProgress } = useModuleAccessStore();
  const [navReady, setNavReady] = useState(false);
  const didInitDevAccessRef = useRef(false);

  const [fontsLoaded, fontError] = useFonts({
    // Font loading temporarily disabled - font files not found
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    const ready =
      !!navigationState?.key &&
      Array.isArray((navigationState as any)?.routes) &&
      (navigationState as any).routes.length > 0;
    if (ready) {
      setNavReady(true);
    }
  }, [navigationState?.key, (navigationState as any)?.routes?.length]);

  useEffect(() => {
    // 等待根导航完整挂载（key 存在且 routes 非空）后再做跳转，避免“未挂载先导航”崩溃
    if (!navReady) return;
    if (!fontsLoaded && !fontError) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, fontsLoaded, fontError, navReady, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (didInitDevAccessRef.current) return;
    didInitDevAccessRef.current = true;

    (async () => {
      try {
        await getUserProgress();
        await checkAccess('word');
      } catch (error) {
        console.warn('⚠️ Dev access warmup failed:', error);
      }
    })();
  }, [isAuthenticated, checkAccess, getUserProgress]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="review-modal"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
````

## File: src/components/learning/alphabet/AlphabetLearningEngineView.tsx
````typescript
// src/components/learning/alphabet/AlphabetLearningEngineView.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import { AlphabetLearningView } from '@/src/components/learning/alphabet/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/alphabet/AlphabetReviewView';
import { PhonicsRuleCard } from '@/src/components/learning/alphabet/PhonicsRuleCard';
import { SessionRecoveryCard } from '@/src/components/learning/alphabet/SessionRecoveryCard';
import { AlphabetCompletionView } from '@/src/components/learning/alphabet/AlphabetCompletionView';
import { RoundCompletionView } from '@/src/components/learning/alphabet/RoundCompletionView';
import type { AlphabetQueueItem } from '@/src/stores/alphabetStore';

import type { Phase } from '@/src/hooks/useAlphabetLearningEngine';
import type { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import type { Letter } from '@/src/entities/types/letter.types';
import type {
  PhonicsRule,
  RoundEvaluationState,
} from '@/src/entities/types/phonicsRule.types';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetLearningEngineViewProps {
  phase: Phase;
  initialized: boolean;
  currentRound: number;
  roundEvaluation?: RoundEvaluationState;
  currentItem: AlphabetQueueItem | null;
  currentQuestionType: QuestionType | null;
  letterPool?: Letter[];
  onAnswer: (isCorrect: boolean, questionType: QuestionType) => void;
  onNext: () => void;
  // REMOVED: onStartNextRound (Manual start happens in Lesson Page now)
  onBack?: () => void;
  phonicsRule?: PhonicsRule | null;
  showPhonicsRuleCard?: boolean;
  onCompletePhonicsRule?: () => void;

  // Recovery
  pendingRecoverySession?: any;
  resolveRecovery?: (choice: 'continue' | 'restart') => void;

  // New props for Observability
  queueIndex?: number;
  totalQueue?: number;

  onSkipYesterdayReview?: () => void;
}

// Helper to get friendly phase name
const getPhaseLabel = (phase: Phase, t: any) => {
  switch (phase) {
    case 'new-learning': return t('alphabet.phase.new', 'New Letters');
    case 'mini-review': return t('alphabet.phase.review', 'Quick Review');
    case 'final-review': return t('alphabet.phase.final', 'Final Review');
    case 'error-review': return t('alphabet.phase.fix', 'Fix Mistakes');
    // 🔥 TODO-03: 统一使用 'previous-review'
    case 'previous-review': return t('alphabet.phase.warmup', 'Warm Up');
    case 'round-completed': return t('alphabet.phase.completed', 'Round Done');
    case 'finished': return t('alphabet.phase.finished', 'Finished');
    default: return phase;
  }
};

function RoundHeader({
  currentRound,
  phase,
  queueIndex,
  totalQueue,
  onBack,
  onSkipYesterdayReview
}: {
  currentRound: number;
  phase: Phase;
  queueIndex?: number;
  totalQueue?: number;
  onBack?: () => void;
  onSkipYesterdayReview?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        {/* Left: Back Button or Spacer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {onBack && (
            <TouchableOpacity onPress={onBack} hitSlop={12}>
              <ChevronLeft size={24} color={Colors.taupe} />
            </TouchableOpacity>
          )}
          <Text
            style={{
              fontFamily: Typography.notoSerifRegular,
              fontSize: 14,
              color: Colors.taupe,
            }}
          >
            {t('alphabet.roundInfo', { current: currentRound, total: 3 })}
          </Text>
        </View>

        {/* Visible Phase Label */}
        <View style={{
          backgroundColor: '#F0F0F0',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4
        }}>
          <Text style={{
            fontFamily: Typography.notoSerifBold,
            fontSize: 12,
            color: Colors.ink
          }}>
            {getPhaseLabel(phase, t)}
          </Text>
        </View>

        {/* Skip/Bury Button for previous-review */}
        {phase === 'previous-review' && onSkipYesterdayReview && (
          <TouchableOpacity
            style={{
              marginLeft: 8,
              paddingHorizontal: 12,
              paddingVertical: 4,
              backgroundColor: '#FFF0F0',
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#FFD0D0'
            }}
            onPress={onSkipYesterdayReview}
          >
            <Text style={{
              fontSize: 12,
              color: '#D00000',
              fontWeight: '600'
            }}>
              {t('alphabet.skipBury', 'Skip (Bury)')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}



export function AlphabetLearningEngineView({
  phase,
  initialized,
  currentRound,
  roundEvaluation,
  currentItem,
  currentQuestionType,
  letterPool,
  onAnswer,
  onNext,
  // onStartNextRound, // Removed
  onBack,
  phonicsRule,
  showPhonicsRuleCard,
  onCompletePhonicsRule,
  onSkipYesterdayReview,
  pendingRecoverySession,
  resolveRecovery,

  queueIndex,
  totalQueue,
}: AlphabetLearningEngineViewProps) {

  // 加载状态
  if (!initialized || !currentItem) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (phase === 'finished') {
    return (
      <AlphabetCompletionView
        roundEvaluation={roundEvaluation}
        onFinish={onBack || (() => { })} // Fallback to no-op if onBack missing, but it handles router.back
      />
    );
  }

  if (phase === 'round-completed') {
    return (
      <RoundCompletionView
        roundNumber={currentRound}
        onFinish={onBack || (() => { console.warn('No Back Handler'); })}
      />
    );
  }

  const source = (currentItem as any)?.source;
  // 🔥 TODO-03: 统一使用 'new-learning'
  const isNewLetter = source === 'new-learning';

  const hasValidRule = !!(phonicsRule && phonicsRule.title && phonicsRule.content?.length > 0);

  const shouldShowPhonicsRule =
    isNewLetter &&
    showPhonicsRuleCard &&
    hasValidRule &&
    onCompletePhonicsRule;

  const renderMainView = () => {

    if (shouldShowPhonicsRule) {
      return <PhonicsRuleCard rule={phonicsRule} onComplete={onCompletePhonicsRule} />;
    }

    if (!isNewLetter) {
      // Use currentQuestionType provided by engine, fallback to SoundToLetter if null
      return (
        <AlphabetReviewView
          alphabet={currentItem}
          letterPool={letterPool}
          preferredType={currentQuestionType ?? undefined}
          onAnswer={onAnswer}
          onNext={onNext}
          onBack={onBack}
        />
      );
    }

    return <AlphabetLearningView alphabet={currentItem} onNext={onNext} onBack={onBack} />;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>


      {/* 优先显示恢复弹窗 */}
      {pendingRecoverySession && resolveRecovery && (
        <SessionRecoveryCard
          onContinue={() => resolveRecovery('continue')}
          onRestart={() => resolveRecovery('restart')}
        />
      )}

      <RoundHeader currentRound={currentRound} phase={phase} queueIndex={queueIndex} totalQueue={totalQueue} onSkipYesterdayReview={onSkipYesterdayReview} />

      {renderMainView()}
    </SafeAreaView>
  );
}
````

## File: src/stores/userStore.ts
````typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/api.endpoints';
import type {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse
} from '../entities/types/api.types';
import type { User } from '../entities/types/entities';

// Type definitions


interface UserState {
  // State
  currentUser: User | null;
  isAuthenticated: boolean;
  authToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  register: (data: RegisterRequest) => Promise<boolean>;
  login: (data: LoginRequest) => Promise<boolean>;
  logout: () => void;
  requestPasswordReset: (data: ResetPasswordRequest) => Promise<boolean>;
  updateProfile: (data: { displayName?: string; avatar?: string }) => Promise<boolean>;
  setUser: (user: User, token: string) => void;
  checkAuth: () => boolean;
  clearError: () => void;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  // 可以添加更多规则
  return { valid: true };
};

// ==================== Store ====================

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // ==================== 初始状态 ====================
      currentUser: null,
      isAuthenticated: false,
      authToken: null,
      isLoading: false,
      error: null,

      // ==================== 注册 ====================
      /**
       * Register a new user
       * 
       * Flow:
       * 1. Set loading state
       * 2. Call API
       * 3. If success: save user + token, set authenticated
       * 4. If fail: save error message
       * 
       * @param data Registration data (email, password, displayName)
       * @returns Success status
       */
      register: async (data: RegisterRequest) => {

        if (!validateEmail(data.email)) {
          set({ error: 'Invalid email format' });
          return false;
        }

        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
          set({ error: passwordValidation.error });
          return false;
        }

        if (!data.displayName.trim()) {
          set({ error: 'Display name is required' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<RegisterResponse>(
            API_ENDPOINTS.AUTH.REGISTER,
            {
              email: data.email.toLowerCase().trim(),
              password: data.password,
              displayName: data.displayName,
            });

          if (response.success && response.data) {
            const { user, token } = response.data;

            // Save token to apiClient for future requests
            apiClient.setAuthToken(token);

            // Update store state
            set({
              currentUser: user as User,
              authToken: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // 🔍 调试日志：注册成功后打印 userId
            console.log('✅ [注册成功] currentUser.userId:', user.userId);

            return true;

          } else {
            set({
              error: response.error || '注册失败',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || '注册失败',
            isLoading: false,
          });
          return false;
        }
      },

      // ==================== 登录 ====================
      /**
       * Authenticate user
       * 
       * Flow:
       * 1. Set loading state
       * 2. Call API
       * 3. If success: save user + token, set authenticated
       * 4. If fail: save error message
       * 
       * @param email User email
       * @param password User password
       * @returns Success status
       */
      login: async (data: LoginRequest) => {

        if (!validateEmail(data.email)) {
          set({ error: 'Invalid email format' });
          return false;
        }

        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.valid) {
          set({ error: passwordValidation.error });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
            email: data.email.toLowerCase().trim(),
            password: data.password,
          });

          if (response.success && response.data) {
            const { user, token } = response.data;

            // Save token to apiClient for future requests
            apiClient.setAuthToken(token);

            // Update store state
            set({
              currentUser: user as User,
              authToken: token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });

            // 🔍 调试日志：登录成功后打印 userId
            console.log('✅ [登录成功] currentUser.userId:', user.userId);

            return true;
          } else {
            set({
              error: response.error || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      // ==================== 登出 ====================
      /**
       * Logout current user
       * 
       * Flow:
       * 1. Clear apiClient token
       * 2. Clear store state
       * 3. Clear AsyncStorage (via persist middleware)
       */
      logout: () => {
        // Clear token from apiClient
        apiClient.setAuthToken(null);

        // Clear store state
        set({
          currentUser: null,
          authToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // ==================== 重置密码 ====================
      /**
       * Request password reset email
       * 
       * @param email User email
       * @returns Success status
       */
      requestPasswordReset: async (data: ResetPasswordRequest) => {
        if (!validateEmail(data.email)) {
          set({ error: 'Invalid email format', isLoading: false });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<ResetPasswordResponse>(
            API_ENDPOINTS.AUTH.RESET_PASSWORD,
            { email: data.email.toLowerCase().trim() }
          );

          if (response.success) {
            set({ isLoading: false, error: null });
            return true;
          } else {
            set({
              error: response.error || 'Password reset failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Password reset failed',
            isLoading: false,
          });
          return false;
        }
      },

      // ==================== 更新个人资料 ====================
      /**
       * Update user profile
       * 
       * @param data Profile data to update
       * @returns Success status
       */
      updateProfile: async (data: { displayName?: string; avatar?: string }) => {
        const currentUser = get().currentUser;
        if (!currentUser) {
          set({ error: 'No user logged in' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.put<{ user: User }>(
            API_ENDPOINTS.AUTH.UPDATE_PROFILE,
            {
              userId: currentUser.userId,
              ...data,
            });

          if (response.success && response.data) {
            set({
              currentUser: {
                ...currentUser,
                ...(data.displayName && { displayName: data.displayName }),
                ...(data.avatar && { avatar: data.avatar }),
              },
              isLoading: false,
              error: null,
            });
            return true;
          } else {
            set({
              error: response.error || 'Profile update failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error: any) {
          set({
            error: error.message || 'Profile update failed',
            isLoading: false,
          });
          return false;
        }
      },

      // ===== Set User (Direct) =====
      /**
       * Directly set user and token
       * Used for: OAuth flows, token refresh
       * 
       * @param user User object
       * @param token Auth token
       */
      setUser: (user: User, token: string) => {
        apiClient.setAuthToken(token);

        set({
          currentUser: user,
          authToken: token,
          isAuthenticated: true,
          error: null,
        });
      },

      // ===== Check Auth Status =====
      /**
       * Check if user is authenticated
       * 
       * @returns Authentication status
       */
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.authToken !== null;
      },

      // ===== Clear Error =====
      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-storage', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),

      // Restore auth token to apiClient on rehydration
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.authToken) {
            apiClient.setAuthToken(state.authToken);
          }
        };
      },
    }
  )
);
````

## File: src/utils/apiClient.ts
````typescript
// src/utils/apiClient.ts

import { Platform } from 'react-native';
import {
  getApiBaseUrl,
  CURRENT_BACKEND,
  logBackendInfo,
} from '../config/backend.config';
import { getEndpoint, replacePathParams } from '../config/api.endpoints';
import type { EndpointMap } from '../config/api.endpoints';
import { API_TIMEOUT, ERROR_MESSAGES } from '../config/constants';
import type { ApiResponse } from '../entities/types/api.types';

interface RequestOptions {
  timeout?: number;
  headers?: Record<string, string>;
  pathParams?: Record<string, string>;  // 路径参数
}

// Cloud Function 调用可选参数
export interface CloudFunctionOptions {
  /**
   * 云函数的 HTTP 触发路径，默认值为 '/learn-vocab'。
   * 若项目中存在其他云函数（如 '/memory-engine'），请在调用时显式传入。
   */
  endpoint?: string | EndpointMap;
  /** 请求超时（毫秒），不传则使用 API_TIMEOUT.DEFAULT。AI 类请求建议传 API_TIMEOUT.AI。 */
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = getApiBaseUrl();

    // 打印后端信息（仅开发环境）
    logBackendInfo();
  }

  // ==================== Token 管理 ====================

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (__DEV__) {
      console.log('🔑 Token 已设置:', token ? token.substring(0, 20) + '...' : 'null');
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  // ==================== 构建完整 URL ====================

  private buildUrl(
    endpoint: string | EndpointMap,
    pathParams?: Record<string, string>
  ): string {
    let path: string;

    // 如果是端点映射对象，根据当前后端选择路径
    if (typeof endpoint === 'object') {
      path = getEndpoint(endpoint, CURRENT_BACKEND);
    } else {
      path = endpoint;
    }

    // 替换路径参数（如 /api/courses/:id）
    if (pathParams) {
      path = replacePathParams(path, pathParams);
    }

    // 拼接完整 URL
    const fullUrl = `${this.baseUrl}${path}`;

    return fullUrl;
  }

  // ==================== 通用请求方法 ====================

  private async request<T>(
    endpoint: string | EndpointMap,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = API_TIMEOUT.DEFAULT,
      headers = {},
      pathParams,
    } = options;

    // 构建请求头
    const authToken = this.getAuthToken();
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // 添加 Authorization 头
    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    // 构建 URL
    const url = this.buildUrl(endpoint, pathParams);

    // 超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      if (__DEV__) {
        console.log(`📤 [${method}] ${url}`);
        if (data) console.log('📦 Request data:', data);
      }

      // 发送请求
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (__DEV__) {
        console.log(`📥 Response status: ${response.status}`);
      }

      // 解析响应
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('❌ 解析响应失败:', parseError);
        return {
          success: false,
          error: ERROR_MESSAGES.SERVER_ERROR,
          code: 'PARSE_ERROR',
        };
      }

      // 检查 HTTP 状态码
      if (!response.ok) {
        // 401 Unauthorized - Token 失效
        if (response.status === 401) {
          return {
            success: false,
            error: responseData.error || ERROR_MESSAGES.TOKEN_EXPIRED,
            code: 'TOKEN_EXPIRED',
          };
        }

        // 其他错误
        return {
          success: false,
          error: responseData.error || responseData.message || ERROR_MESSAGES.SERVER_ERROR,
          code: responseData.code || 'SERVER_ERROR',
        };
      }

      // Return a successful response
      if (__DEV__) {
        console.log('✅ Response data:', responseData);
      }

      return {
        success: responseData.success,
        data: responseData.data || responseData,
      };

    } catch (error: any) {
      clearTimeout(timeoutId);

      // 超时错误
      if (error.name === 'AbortError') {
        console.error('⏱️ 请求超时');
        return {
          success: false,
          error: ERROR_MESSAGES.TIMEOUT_ERROR,
          code: 'TIMEOUT',
        };
      }

      // 网络错误：仅 Web 环境使用 navigator.onLine（RN 中不可用/不可靠）
      if (Platform.OS === 'web' && typeof navigator !== 'undefined' && !navigator.onLine) {
        console.error('📡 网络未连接');
        return {
          success: false,
          error: ERROR_MESSAGES.NETWORK_ERROR,
          code: 'NETWORK_ERROR',
        };
      }

      // 其他错误
      console.error('❌ 请求失败:', error);
      return {
        success: false,
        error: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  // ==================== HTTP 方法 ====================

  async get<T>(
    endpoint: string | EndpointMap,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, options);
  }

  async post<T>(
    endpoint: string | EndpointMap,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, options);
  }

  async put<T>(
    endpoint: string | EndpointMap,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, options);
  }

  async delete<T>(
    endpoint: string | EndpointMap,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, options);
  }
}

// ==================== 导出单例 ====================
export const apiClient = new ApiClient();

// ==================== Cloud Function 适配器 ====================

/**
 * 通用 CloudBase 云函数调用工具，适用于所有基于 `action` 参数的云函数。
 *
 * 说明（结合 V9 快照）：
 * - 对于多 action 云函数（如 `/memory-engine`、`/learn-vocab`），请求体统一为：
 *   `{ action, data }`
 * - 返回结构统一为 `ApiResponse<T>`，与 apiClient 其余 HTTP 调用保持一致。
 *
 * @param action   云函数内部业务标识，例如 'getTodayMemories'、'submitMemoryResult' 等。
 * @param data     业务请求参数对象，会被包装在 `{ action, data }` 中发送。
 * @param options  可选配置，当前支持自定义云函数入口路径（默认 '/learn-vocab'）。
 */
export async function callCloudFunction<T>(
  action: string,
  data: Record<string, any>,
  options?: CloudFunctionOptions
): Promise<ApiResponse<T>> {
  // DEPRECATED DEFAULT: '/learn-vocab' was removed.
  // Ideally, callers should always provide options.endpoint, but falling back to memory-engine is safer now.
  const endpoint = options?.endpoint ?? '/memory-engine';

  try {
    // 统一的请求体结构：{ action, data }
    const response = await apiClient.post<T>(
      endpoint,
      { action, data },
      options?.timeout != null ? { timeout: options.timeout } : undefined
    );

    // 直接返回后端的标准结构，调用方只需要判断 `success`
    return response;
  } catch (err: any) {
    // 理论上 apiClient 已经捕获大部分错误，这里是兜底防护
    console.error(`❌ CloudFunction "${action}" 调用异常:`, err);

    return {
      success: false,
      error: err?.message ?? '网络请求异常',
      code: err?.code ?? 'NETWORK_ERROR',
    };
  }
}
````

## File: app.json
````json
{
  "expo": {
    "newArchEnabled": true,
    "name": "ThaiLearningApp",
    "slug": "ThaiLearningApp",
    "scheme": "thailearningapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.asherlliang.ThaiLearningApp",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.asherlliang.ThaiLearningApp"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-localization",
      "expo-font"
    ],
    "extra": {
      "eas": {
        "projectId": "90c8f7ee-1efa-4f8e-be1d-5864b0a51f21"
      }
    }
  }
}
````

## File: app/(auth)/login.tsx
````typescript
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
import { AppLogo } from '@/src/components/common/AppLogo';

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
            <AppLogo />
            <Text style={styles.title}>{t('auth.title')}</Text>
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
````

## File: cloudbase/functions/memory-engine/handlers/getUserProgress.js
````javascript
/**
 * 获取用户学习进度
 * Action: getUserProgress
 */
'use strict';

const { createResponse } = require('../utils/response');

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 */
async function getUserProgress(db, params) {
  const { userId } = params;

  // 🔍 调试日志：打印收到的 userId
  console.log('📥 [getUserProgress] 收到请求，userId:', userId);

  if (!userId) {
    return createResponse(false, null, 'Missing userId', 'INVALID_PARAMS');
  }

  try {
    // 2. 获取用户进度记录
    // ❌ 修正: 不要用 getOne(), 用 limit(1).get()
    const progressResult = await db.collection('user_progress')
      .where({ userId })
      .limit(1)
      .get();

    if (!progressResult.data || progressResult.data.length === 0) {
      return createResponse(false, null, '用户进度记录不存在', 'USER_PROGRESS_NOT_FOUND');
    }

    const progress = progressResult.data[0];

    // 🔥 获取字母模块专属进度（包含 currentRound）
    let alphabetProgress = null;
    if (params.entityType === 'letter') {
      const alphabetProgressResult = await db.collection('user_alphabet_progress')
        .where({ userId })
        .limit(1)
        .get();

      console.log('📊 [getUserProgress] alphabetProgressResult:', {
        found: alphabetProgressResult.data?.length > 0,
        data: alphabetProgressResult.data?.[0]
      });

      if (alphabetProgressResult.data && alphabetProgressResult.data.length > 0) {
        alphabetProgress = alphabetProgressResult.data[0];
        console.log('📊 [getUserProgress] alphabetProgress.currentRound:', alphabetProgress.currentRound);
      } else {
        console.log('⚠️ [getUserProgress] No alphabet progress found for user:', userId);
      }
    }

    // 3. 统计各模块学习数据
    // 注意: 如果数据量很大，count() 比 get() 更高效
    const letterCountResult = await db.collection('memory_status')
      .where({ userId, entityType: 'letter' })
      .count();

    const letterMasteredResult = await db.collection('memory_status')
      .where({ userId, entityType: 'letter', masteryLevel: db.command.gte(0.7) })
      .count();

    const wordCountResult = await db.collection('memory_status')
      .where({ userId, entityType: 'word' })
      .count();

    const wordMasteredResult = await db.collection('memory_status')
      .where({ userId, entityType: 'word', masteryLevel: db.command.gte(0.7) })
      .count();

    // 🔥 按课程统计单词掌握数（entityId 格式: BaseThai_1_7, BaseThai_2_15 等）
    const WORD_SOURCES = ['BaseThai_1', 'BaseThai_2', 'BaseThai_3', 'BaseThai_4'];
    const wordProgressBySource = {};
    for (const source of WORD_SOURCES) {
      const prefix = `${source}_`;
      const nextSource = source.replace(/\d+$/, (m) => String(parseInt(m, 10) + 1));
      const masteredResult = await db.collection('memory_status')
        .where({
          userId,
          entityType: 'word',
          masteryLevel: db.command.gte(0.7),
          entityId: db.command.gte(prefix).and(db.command.lt(nextSource))
        })
        .count();
      wordProgressBySource[source] = { mastered: masteredResult.total };
    }

    // 4. 组装
    const result = {
      ...progress,
      // 🔥 合并字母模块专属字段（currentRound, completedLessons, roundHistory）
      ...(alphabetProgress ? {
        currentRound: alphabetProgress.currentRound,
        completedLessons: alphabetProgress.completedLessons || [],  // 🔥 新增字段
        roundHistory: alphabetProgress.roundHistory || []  // 🔥 P0-A: 补充 roundHistory
      } : {}),
      statistics: {
        letter: {
          total: 44,
          learned: letterCountResult.total,
          mastered: letterMasteredResult.total,
          progress: letterCountResult.total > 0 ? (letterMasteredResult.total / 44).toFixed(2) : 0
        },
        word: {
          total: 3500,
          learned: wordCountResult.total,
          mastered: wordMasteredResult.total,
          progress: wordCountResult.total > 0 ? (wordMasteredResult.total / 3500).toFixed(2) : 0
        },
        wordProgressBySource  // 🔥 按课程：{ BaseThai_1: { mastered: N }, ... }
      },
      unlockStatus: {
        letter: true,
        word: progress.wordUnlocked,
        sentence: progress.sentenceUnlocked,
        article: progress.articleUnlocked
      }
    };

    console.log('📊 [getUserProgress] roundHistory returned:', (alphabetProgress?.roundHistory || []).length);

    // 与前端约定：data.progress 为进度对象
    return createResponse(true, { progress: result }, '获取用户进度成功');

  } catch (error) {
    console.error('getUserProgress error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  }
}

module.exports = getUserProgress;
````

## File: app/alphabet/[lessonId].tsx
````typescript
// app/alphabet/lesson/[lessonId].tsx

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ActivityIndicator, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock } from 'lucide-react-native'; // Assuming Lock icon exists or use fallback

import { useAlphabetLearningEngine } from '@/src/hooks/useAlphabetLearningEngine';
import { AlphabetLearningEngineView } from '@/src/components/learning/alphabet/AlphabetLearningEngineView';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { getLessonMetadata, getAllLessons } from '@/src/config/alphabet/lessonMetadata.config';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';

export default function AlphabetLessonFlow() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  // Access Control & Progress
  const { userProgress, getUserProgress } = useModuleAccessStore();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await getUserProgress();
      if (mounted) setIsCheckingAccess(false);
    })();
    return () => { mounted = false; };
  }, [getUserProgress]);

  // Unlock Logic
  const isUnlocked = useMemo(() => {
    if (!lessonId) return false;
    // Always load progress before deciding (unless lesson1, but let's be consistent)
    if (isCheckingAccess && !userProgress) return false;

    const currentMetadata = getLessonMetadata(lessonId);
    if (!currentMetadata) return false; // Invalid lesson ID

    // Rule 1: Lesson 1 always unlocked
    if (currentMetadata.order === 1) return true;

    // Rule 2: Lesson N requires Lesson N-1 completed
    const allLessons = getAllLessons();
    const prevLesson = allLessons.find(l => l.order === currentMetadata.order - 1);

    // Safety: If no prev lesson found (logic error?), default to locked or unlocked? 
    // Strict default: Locked.
    if (!prevLesson) return false;

    const completed = userProgress?.completedAlphabetLessons ?? [];
    return completed.includes(prevLesson.lessonId);
  }, [lessonId, userProgress, isCheckingAccess]);


  // Engine Hook - Only initialize if unlocked to prevent side effects
  // We conditionally call the hook? No, hooks must be unconditional.
  // But we can prevent it from doing work by passing a null or invalid ID if locked,
  // OR we rely on the component returning early before `useAlphabetLearningEngine` has side effects that matter.
  // Actually, `useAlphabetLearningEngine` has `initializeSession` in `useEffect`. 
  // We MUST prevent that useEffect if locked.
  // Easy way: pass `null` or `undefined` as lessonId to the hook if locked, but hook expects string.
  // Better way: The hook takes `lessonId`. If we pass a dummy or keep it as is, it's fine 
  // AS LONG AS we don't render the view that triggers start.
  // BUT the hook starts auto-initialization. 
  // Let's modify the hook call to key off `isUnlocked`.

  // Wait, I cannot conditionally call a hook. I must call it.
  // I will pass `isUnlocked ? lessonId : ''` to the hook? 
  // If I access `app/alphabet/lessonX`, lessonId is 'lessonX'.
  // If I early return NOT in the component body but RENDER a different component, the hook still runs.

  // Strict requirement: "点击不得触发导航 / 初始化 session" => "不允许触发学习引擎".
  // If the hook runs `initializeSession`, it touches the backend.
  // I should check `isUnlocked` BEFORE calling the hook? No, I can't.

  // Solution: I will split the component? 
  // Or I can just verify that `useAlphabetLearningEngine` doesn't explode if I don't use the result?
  // It DOES `initializeSession`.

  // Best approach: A Guard Wrapper Component.
  // The default export will be the Guard. 
  // If unlocked, it renders the Engine Component (which calls the hook).

  if (isCheckingAccess) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.paper }}>
        <ActivityIndicator size="large" color={Colors.thaiGold} />
      </View>
    );
  }

  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.lockedContainer}>
        <ThaiPatternBackground opacity={0.1} />
        <View style={styles.lockedContent}>
          <Lock size={64} color={Colors.taupe} style={{ marginBottom: 24 }} />
          <Text style={styles.lockedTitle}>Lesson Locked</Text>
          <Text style={styles.lockedText}>
            Please complete the previous lesson to unlock this content.
          </Text>
          <Pressable onPress={() => router.replace('/alphabet')} style={styles.backButton}>
            <ArrowLeft size={20} color={Colors.white} />
            <Text style={styles.backButtonText}>Back to Courses</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Only render the Engine (and trigger the hook) if verified unlocked
  return <AuthenticatedLessonFlow lessonId={lessonId!} />;
}

// Inner component that actually invokes the engine hook
function AuthenticatedLessonFlow({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { startStudySession, stopStudySession } = useLearningPreferenceStore();

  useFocusEffect(
    React.useCallback(() => {
      startStudySession();
      return () => stopStudySession();
    }, [startStudySession, stopStudySession])
  );

  const {
    phase,
    initialized,
    currentRound,
    roundEvaluation,
    currentItem,
    currentQuestionType,
    letterPool,
    onAnswer,
    onNext,
    phonicsRule,
    showPhonicsRuleCard,
    onCompletePhonicsRule,
    pendingRecoverySession,
    resolveRecovery,
    onFinishRound,
    onSkipYesterdayReview,
  } = useAlphabetLearningEngine(lessonId);

  const handleBack = async () => {
    // 🔥 在离开页面前清除 session
    await onFinishRound();
    router.back();
  };

  return (
    <AlphabetLearningEngineView
      phase={phase}
      initialized={initialized}
      currentRound={currentRound}
      roundEvaluation={roundEvaluation}
      currentItem={currentItem}
      currentQuestionType={currentQuestionType}
      letterPool={letterPool}
      onAnswer={onAnswer}
      onNext={onNext}
      onBack={handleBack}
      phonicsRule={phonicsRule}
      showPhonicsRuleCard={showPhonicsRuleCard}
      onCompletePhonicsRule={onCompletePhonicsRule}
      pendingRecoverySession={pendingRecoverySession}
      resolveRecovery={resolveRecovery}
      onSkipYesterdayReview={onSkipYesterdayReview}
    />
  );
}

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    backgroundColor: Colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedContent: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.white,
    borderRadius: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  lockedTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 12,
  },
  lockedText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.thaiGold,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
  },
  backButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
});
````

## File: cloudbase/functions/memory-engine/handlers/submitMemoryResult.js
````javascript
/**
 * 提交学习结果（支持单条 + 批量）
 * 
 * 支持两种请求格式：
 * 1）旧版单条：
 * {
 *   userId,
 *   entityType,
 *   entityId,
 *   quality
 * }
 * 
 * 2）新版批量：
 * {
 *   userId,
 *   results: [
 *     { entityType, entityId, quality },
 *     ...
 *   ]
 * }
 */

'use strict';

const { createResponse } = require('../utils/response');
const { updateMemoryAfterReview, updateUserWordProgress } = require('../utils/memoryEngine');

const MAX_RESULTS = 30;
const BATCH_SIZE = 5;

/**
 * @param {Object} db     - cloud.database()
 * @param {Object} params - 请求参数（来自 index.js 中的 data）
 */
async function submitMemoryResult(db, params) {
  console.log('[submitMemoryResult] params:', params);
  const start = Date.now();
  const { userId, entityType, entityId, quality, isSkipped, results, source, vId } = params || {}; //Destructuring assignment
                                                                                      //receive parameters from the client

  // 1. 基本校验：必须有 userId
  if (!userId) {
    return createResponse(
      false,
      null,
      '缺少必填参数: userId',
      'INVALID_PARAMS'
    );
  }

  // 2. 规范化为统一的数组格式 items[]
  let items = [];

  // 2.1 新版：data.results 是数组
  if (Array.isArray(results) && results.length > 0) {
    //check if the number of results is greater than MAX_RESULTS
    if (results.length > MAX_RESULTS) {
      return createResponse(
        false,
        null,
        `单次最多提交 ${MAX_RESULTS} 条结果，请分批提交`,
        'RESULTS_TOO_MANY'
      );
    }
    //==========submit start here==========
    //map the results to items
    items = results.map((r) => ({
      entityType: r.entityType,
      entityId: r.entityId,
      quality: r.quality,
      isSkipped: r.isSkipped,
      source: r.source,
      vId: r.vId
    }));
  }
  // 2.2 兼容旧版：单条参数
  else if (entityType && entityId && (quality || isSkipped)) {
    items = [{ entityType, entityId, quality, isSkipped, source, vId }];
  } else {
    // 两种格式都不满足
    return createResponse(
      false,
      null,
      '缺少必填参数: entityType, entityId, (quality or isSkipped) 或 results[]',
      'INVALID_PARAMS'
    );
  }

  try {
    const updatedMemories = [];

    // 3. 分批并发更新记忆状态（防止超时）
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      //slice the items array into batches
      const batch = items.slice(i, i + BATCH_SIZE);
      //map the batch to batchResults
      const batchResults = await Promise.all(
        batch.map(async (item) => {
          const { entityType, entityId, quality, isSkipped, vId, source } = item;

          // 防御性校验，避免 results 里混入空对象
          if (!entityType || !entityId) return null;
          // non-skipped item must have quality
          if (!isSkipped && !quality) return null;

          const memoryState = await updateMemoryAfterReview(
            db,
            userId,
            entityType,
            entityId,
            quality,
            isSkipped,
            vId
          );
          if (userId && source && vId) {
            await updateUserWordProgress(db, userId, source, vId);
          }

          return {
            entityType,
            entityId,
            quality,
            isSkipped,
            memoryState,
            vId
          };
        })
      );

      batchResults
        .filter(Boolean)
        .forEach((res) => updatedMemories.push(res));//<--- res 的全称为 result，这里是将 res push 到 updatedMemories 数组中
    }

    if (updatedMemories.length === 0) {
      return createResponse(
        false,
        null,
        'results 中没有有效的记录',
        'INVALID_PARAMS'
      );
    }

    // 4. 返回统一结构
    const response = createResponse(
      true,
      { updatedMemories },
      '提交学习结果成功'
    );
    console.log('[FunctionCost] submitMemoryResult', Date.now() - start, 'ms');
    return response;

  } catch (error) {
    console.error('[submitMemoryResult] error:', error);
    console.log('[FunctionCost] submitMemoryResult', Date.now() - start, 'ms');

    return createResponse(
      false,
      null,
      error.message || '服务器内部错误',
      'SERVER_ERROR'
    );
  }
}

module.exports = submitMemoryResult;
````

## File: src/components/learning/alphabet/AlphabetReviewView.tsx
````typescript
// src/components/learning/alphabet/AlphabetReviewView.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { Volume2, Check, X, AudioLines } from 'lucide-react-native';

import type { AlphabetLearningState } from '@/src/stores/alphabetStore';
import type { Letter } from '@/src/entities/types/letter.types';
import type { AlphabetQueueItem, AlphabetQuestion } from '@/src/entities/types/alphabet.types';

// Use strict new types
import { AlphabetGameType, ALPHABET_GAME_TYPE_LABELS } from '@/src/entities/types/alphabetGameTypes';
import { generateQuestion } from '@/src/utils/lettersQuestionGenerator';
import { getLetterAudioUrl } from '@/src/utils/alphabet/audioHelper';
// Legacy type for prop compatibility (mapped internally)
import { QuestionType } from '@/src/entities/enums/QuestionType.enum';

import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

type AnswerState = 'idle' | 'correct' | 'wrong' | 'locked';

interface AlphabetReviewViewProps {
  alphabet: AlphabetLearningState;
  letterPool?: Letter[];
  preferredType?: QuestionType; // Legacy prop
  onAnswer: (isCorrect: boolean, questionType: any) => void;
  onNext: () => void;
  onBack?: () => void;
}

export function AlphabetReviewView({
  alphabet,
  letterPool,
  preferredType,
  onAnswer,
  onNext,
  onBack,
}: AlphabetReviewViewProps) {
  const [answerState, setAnswerState] = useState<AnswerState>('idle');
  // use index to track selection to avoid duplicate value issues
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const shakeX = useRef(new Animated.Value(0)).current;
  const wrongResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pool = letterPool || [];

  // --- 1. Question Generation & Type Mapping ---

  const mapLegacyType = (legacyType?: QuestionType): AlphabetGameType => {
    switch (legacyType) {
      case QuestionType.SOUND_TO_LETTER: return AlphabetGameType.SOUND_TO_LETTER;
      case QuestionType.LETTER_TO_SOUND: return AlphabetGameType.LETTER_TO_SOUND;
      case QuestionType.CLASS_CHOICE: return AlphabetGameType.CONSONANT_CLASS;
      case QuestionType.FINAL_CONSONANT: return AlphabetGameType.FINAL_SOUND;
      case QuestionType.SYLLABLE: return AlphabetGameType.SOUND_TO_LETTER;
      case QuestionType.ASPIRATED_CONTRAST: return AlphabetGameType.SOUND_TO_LETTER;
      case QuestionType.TONE_PERCEPTION: return AlphabetGameType.TONE_CALCULATION;
      case QuestionType.INITIAL_SOUND: return AlphabetGameType.INITIAL_SOUND;
      default: return AlphabetGameType.SOUND_TO_LETTER;
    }
  };

  const createQuestion = (): AlphabetQuestion => {
    const queueItem: AlphabetQueueItem = {
      letterId: alphabet.alphabetId,
      letter: alphabet.letter,
      gameType: mapLegacyType(preferredType),
    };
    return generateQuestion(queueItem, pool);
  };

  const [question, setQuestion] = useState<AlphabetQuestion>(createQuestion);
  const questionKey = question.id;

  // Debug Log
  useEffect(() => {
    // CONSONANT_CLASS has 3 options. Others usually 4.
    const minOptions = question.gameType === AlphabetGameType.CONSONANT_CLASS ? 3 : 4;
    // TONE_CALCULATION / PHONICS_MATH placeholders might also have fewer?
    // Let's safe guard.
    if (!question?.options || question.options.length < minOptions) {
      console.warn('⚠️ Options count low:', question?.options?.length || 0, 'Type:', question.gameType);
    }
  }, [question]);

  useEffect(() => {
    setQuestion(createQuestion());
    resetForNewQuestion();
  }, [alphabet.alphabetId, preferredType]);


  // --- 2. Audio Logic ---

  /* 
   * Stop audio safely handling potential race conditions
   * (e.g. concurrent calls where soundRef.current becomes null) 
   */
  const stopAudio = useCallback(async () => {
    const sound = soundRef.current;
    if (!sound) return;

    // Immediately detach ref to prevent other calls from accessing this instance
    soundRef.current = null;

    try {
      await sound.stopAsync().catch(() => { });
      await sound.unloadAsync().catch(() => { });
    } catch (ignore) {
      // Ignore errors during cleanup
    }
  }, []);

  const playAudio = useCallback(
    async (uri?: string | null) => {
      if (!uri) return;

      try {
        setIsPlaying(true);
        await stopAudio();
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true }
        );

        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.warn('[AlphabetReview] Playback failed:', error);
        setIsPlaying(false);
      }
    },
    [stopAudio]
  );

  useEffect(() => {
    resetForNewQuestion();

    const shouldAutoPlay = [
      AlphabetGameType.SOUND_TO_LETTER,
      AlphabetGameType.INITIAL_SOUND,
      AlphabetGameType.FINAL_SOUND
    ].includes(question.gameType);

    if (shouldAutoPlay && question.audioUrl) {
      void playAudio(question.audioUrl);
    }

    return () => {
      if (wrongResetTimer.current) clearTimeout(wrongResetTimer.current);
      if (correctLockTimer.current) clearTimeout(correctLockTimer.current);
      void stopAudio();
    };
  }, [questionKey]);


  // --- 3. Interaction Logic ---

  const resetForNewQuestion = useCallback(() => {
    setAnswerState('idle');
    setSelectedOptionIndex(null);
    shakeX.setValue(0);
    if (wrongResetTimer.current) clearTimeout(wrongResetTimer.current);
    if (correctLockTimer.current) clearTimeout(correctLockTimer.current);
  }, [shakeX]);

  const runShake = useCallback(() => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  }, [shakeX]);

  // MOVED checkAnswer UP to resolve hoisting error
  const checkAnswer = useCallback((optionValue: string, index: number) => {
    const isCorrect = optionValue === question.correctAnswer;
    setSelectedOptionIndex(index);

    if (isCorrect) {
      setAnswerState('correct');
      onAnswer(true, question.gameType);

      // Play success sound unless it's LetterToSound (where we already played)
      if (question.audioUrl && (question.gameType !== AlphabetGameType.LETTER_TO_SOUND)) {
        void playAudio(question.audioUrl);
      }

      correctLockTimer.current = setTimeout(() => {
        setAnswerState('locked');
      }, 500);
    } else {
      setAnswerState('wrong');
      onAnswer(false, question.gameType);
      runShake();
      Vibration.vibrate(50);

      wrongResetTimer.current = setTimeout(() => {
        setAnswerState('idle');
        setSelectedOptionIndex(null);
      }, 800);
    }
  }, [question, onAnswer, runShake, playAudio]);

  const handleOptionSelect = useCallback(
    (optionValue: string, index: number) => {
      if (answerState !== 'idle') return;

      const isAudioQuestion = question.gameType === AlphabetGameType.LETTER_TO_SOUND;

      if (isAudioQuestion) {
        // Play First Logic
        const targetLetter = question?.options?.[index];

        if (targetLetter) {
          const url = targetLetter.letterPronunciationUrl || targetLetter.fullSoundUrl || targetLetter.audioPath;
          if (url) {
            void playAudio(url);
          }
        }

        setSelectedOptionIndex(index);
        // Do NOT submit yet
        return;
      }

      // Default Immediate Feedback
      checkAnswer(optionValue, index);
    },
    [answerState, question, checkAnswer, playAudio]
  );

  const handleConfirmAnswer = useCallback(() => {
    if (selectedOptionIndex !== null && question.options) {
      // Get value from index
      const selectedItem = question.options[selectedOptionIndex];
      let val: string | undefined;

      switch (question.gameType) {
        case AlphabetGameType.LETTER_TO_SOUND:
          val = selectedItem.initialSound || selectedItem.fullSoundUrl || selectedItem._id;
          break;
        case AlphabetGameType.INITIAL_SOUND:
          val = selectedItem.initialSound;
          break;
        case AlphabetGameType.FINAL_SOUND:
          val = selectedItem.finalSound || selectedItem.initialSound;
          break;
        default:
          val = selectedItem.thaiChar;
      }

      if (val) checkAnswer(val, selectedOptionIndex);
    }
  }, [selectedOptionIndex, question, checkAnswer]);

  const handleNextQuestion = useCallback(() => {
    if (answerState !== 'locked') return;
    resetForNewQuestion();
    void stopAudio();
    onNext();
  }, [answerState, resetForNewQuestion, stopAudio, onNext]);


  // --- 4. Render Helpers ---
  const { t } = useTranslation();

  const renderQuestionHeader = () => {
    const title = ALPHABET_GAME_TYPE_LABELS[question.gameType] || 'Review';
    let instruction = t('alphabet.instructions.selectCorrect', 'Select the correct answer');

    switch (question.gameType) {
      case AlphabetGameType.SOUND_TO_LETTER: instruction = t('alphabet.instructions.listenChoose', 'Listen and choose the letter'); break;
      case AlphabetGameType.LETTER_TO_SOUND: instruction = t('alphabet.instructions.matchPronunciation', 'Match the pronunciation'); break;
      case AlphabetGameType.CONSONANT_CLASS: instruction = t('alphabet.instructions.consonantClass', 'Select the consonant class'); break;
      case AlphabetGameType.INITIAL_SOUND: instruction = t('alphabet.instructions.initialSound', 'Identify the initial sound'); break;
      case AlphabetGameType.FINAL_SOUND: instruction = t('alphabet.instructions.finalSound', 'Identify the final sound'); break;
      default: break;
    }

    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerInstruction}>{instruction}</Text>
      </View>
    );
  };

  const renderAudioButton = () => {
    // For Letter-to-Sound, the user must read the letter. Providing central audio defeats the visual recognition task.
    if (!question.audioUrl || question.gameType === AlphabetGameType.LETTER_TO_SOUND) return null;
    return (
      <TouchableOpacity
        style={[styles.audioButton, isPlaying && styles.audioButtonActive]}
        onPress={() => playAudio(question.audioUrl)}
      >
        <Volume2 size={32} color={Colors.white} />
      </TouchableOpacity>
    );
  };

  const renderStem = () => {
    if (question.gameType === AlphabetGameType.LETTER_TO_SOUND ||
      question.gameType === AlphabetGameType.CONSONANT_CLASS) {
      return (
        <View style={styles.stemContainer}>
          <Text style={styles.stemLetter}>{question.targetLetter.thaiChar}</Text>
        </View>
      );
    }
    return null;
  };

  const renderOptions = () => {
    const options = question.options || [];
    const minOptions = question.gameType === AlphabetGameType.CONSONANT_CLASS ? 3 : 4;

    if (!options || options.length < minOptions) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{t('alphabet.optionsLoadFailed', '题目选项加载失败')}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setQuestion(createQuestion());
              resetForNewQuestion();
            }}
          >
            <Text style={styles.retryButtonText}>{t('alphabet.regenerate', '重新生成题目')}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.optionsGrid,
          { transform: [{ translateX: shakeX }] }
        ]}
      >
        {options.map((optLetter, index) => {
          let displayValue = '';
          let comparisonValue = '';

          switch (question.gameType) {
            case AlphabetGameType.SOUND_TO_LETTER:
              displayValue = optLetter.thaiChar;
              comparisonValue = optLetter.thaiChar;
              break;
            case AlphabetGameType.LETTER_TO_SOUND:
              displayValue = `/${optLetter.initialSound || '...'} /`;
              comparisonValue = optLetter.initialSound || optLetter.fullSoundUrl || optLetter._id;
              break;
            case AlphabetGameType.INITIAL_SOUND:
              displayValue = `/${optLetter.initialSound}/`;
              comparisonValue = optLetter.initialSound;
              break;
            case AlphabetGameType.FINAL_SOUND:
              displayValue = `/${optLetter.finalSound || optLetter.initialSound}/`;
              comparisonValue = optLetter.finalSound || optLetter.initialSound;
              break;
            default:
              displayValue = optLetter.thaiChar;
              comparisonValue = optLetter.thaiChar;
          }

          const isSelected = selectedOptionIndex === index;
          const isCorrect = (answerState === 'correct' || answerState === 'locked') && comparisonValue === question.correctAnswer;
          const isWrong = answerState === 'wrong' && isSelected && comparisonValue !== question.correctAnswer;
          const isDimmed = (answerState === 'correct' || answerState === 'locked') && !isCorrect;

          return (
            <TouchableOpacity
              key={`${index}-${comparisonValue}`}
              style={[
                styles.optionCard,
                isSelected && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
                isDimmed && styles.optionDimmed,
              ]}
              onPress={() => {
                if (question.gameType === AlphabetGameType.LETTER_TO_SOUND) {
                  // Get normalized audio URL using helper
                  const url = getLetterAudioUrl(optLetter);

                  if (url) {
                    console.log('🔊 Playing Option Sound');
                    void playAudio(url);
                  } else {
                    console.warn('⚠️ No audio URL found for option:', optLetter.thaiChar);
                  }

                  handleOptionSelect(comparisonValue, index);
                } else {
                  handleOptionSelect(comparisonValue, index);
                }
              }}
              disabled={answerState !== 'idle' && answerState !== 'locked'}
            >
              {question.gameType === AlphabetGameType.LETTER_TO_SOUND ? (
                // Use AudioLines for "Voice Wave" style
                <View style={{ paddingBottom: 26 }}>
                  <AudioLines size={32} color={isSelected ? Colors.thaiGold : Colors.taupe} />
                </View>
              ) : (
                <Text
                  style={[
                    styles.optionText,
                    isCorrect && styles.optionTextCorrect,
                    isWrong && styles.optionTextWrong
                  ]}
                  adjustsFontSizeToFit
                  numberOfLines={1}
                >
                  {question.gameType === AlphabetGameType.CONSONANT_CLASS ? t(displayValue) : displayValue}
                </Text>
              )}

              <View style={styles.iconContainer}>
                {isCorrect && <Check size={20} color="#2A9D8F" />}
                {isWrong && <X size={20} color="#E63946" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderQuestionHeader()}

      <View style={styles.content}>
        {renderStem()}
        {renderAudioButton()}
        {renderOptions()}
      </View>

      <View style={styles.bottomArea}>
        {/* Confirm Button for Audio Questions */}
        {(question.gameType === AlphabetGameType.LETTER_TO_SOUND) && answerState === 'idle' && selectedOptionIndex !== null && (
          <TouchableOpacity style={styles.nextButton} onPress={handleConfirmAnswer}>
            <Text style={styles.nextButtonText}>{t('alphabet.checkAnswer', 'Check Answer')}</Text>
          </TouchableOpacity>
        )}

        {answerState === 'locked' && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
            <Text style={styles.nextButtonText}>{t('alphabet.nextQuestion', 'Next Question →')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.paper,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.thaiGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerInstruction: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 18,
    color: Colors.ink,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  stemContainer: {
    marginBottom: 32,
  },
  stemLetter: {
    fontFamily: Typography.playfairBold,
    fontSize: 88,
    color: Colors.ink,
  },
  audioButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.thaiGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
    shadowColor: Colors.thaiGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  audioButtonActive: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  optionsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  optionCard: {
    width: '47%',
    aspectRatio: 1.4,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 }
    })
  },
  optionSelected: {
    borderColor: Colors.thaiGold,
    backgroundColor: '#FFFCF5',
  },
  optionCorrect: {
    borderColor: '#2A9D8F',
    backgroundColor: '#E8F5F3',
  },
  optionWrong: {
    borderColor: '#E63946',
    backgroundColor: '#FFE8EA',
  },
  optionDimmed: {
    opacity: 0.3,
  },
  optionText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 42,
    color: Colors.ink,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    paddingBottom: 24, // Visual fix: Add bottom buffer to counteract font's top whitespace
  },
  optionTextCorrect: {
    color: '#2A9D8F',
  },
  optionTextWrong: {
    color: '#E63946',
  },
  iconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  bottomArea: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.white,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: '#E63946',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.thaiGold,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.white,
  },
});
````

## File: app/(tabs)/profile.tsx
````typescript
// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Settings, Award, LogOut, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LanguageSwitcher } from '@/src/components/common/LanguageSwitcher';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useUserStore } from '@/src/stores/userStore';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';

import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { cancelDailyReminder } from '@/src/utils/reminderNotification';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentUser, logout } = useUserStore();
  const clearVocabForLogout = useVocabularyStore(state => state.clearForLogout);
  const clearPrefForLogout = useLearningPreferenceStore(state => state.clearForLogout);
  const { streakDays } = useLearningPreferenceStore();
  const { userProgress } = useModuleAccessStore();

  const { dailyReminderEnabled, dailyReminderTime } = useLearningPreferenceStore();


  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      'Are you sure you want to logout?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            await cancelDailyReminder();
            clearVocabForLogout();    // 清除单词 Store 持久化状态
            clearPrefForLogout();     // 清除 streakDays / dailyLimits
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const achievements = [
    {
      id: 'streak7',
      icon: '🔥',
      label: t('profile.achievementBadges.streak7'),
      unlocked: (streakDays || 0) >= 7,
    },
    {
      id: 'master',
      icon: '🗣️',
      label: t('profile.achievementBadges.master'),
      unlocked: false,
    },
    {
      id: 'vocab100',
      icon: '📚',
      label: t('profile.achievementBadges.vocab100'),
      unlocked: false,
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>
          <Pressable style={styles.settingsButton}>
            <Settings size={24} color={Colors.ink} />
          </Pressable>
        </View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>L</Text>
            </View>
          </View>
          <Text style={styles.displayName}>{currentUser?.displayName || 'Unknow'}</Text>
          <Text style={styles.subtitle}>{currentUser?.email || ''}</Text>
        </Animated.View>

        {/* Achievements Section - 已屏蔽 */}
        {false && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Award size={20} color={Colors.ink} />
              <Text style={styles.sectionTitle}>{t('profile.achievements')}</Text>
            </View>

            <View style={styles.achievementsContainer}>
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement, index) => (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementBadge,
                      !achievement.unlocked && styles.achievementBadgeLocked,
                    ]}
                  >
                    <View style={styles.achievementIcon}>
                      <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                    </View>
                    <Text style={styles.achievementLabel}>{achievement.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Settings Section */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>

          <View style={styles.settingsCard}>
            {/* Daily Reminder */}
            <Pressable
              style={styles.settingItem}
              onPress={() => router.push('/learning/reminder-settings')}
            >
              <Text style={styles.settingLabel}>{t('profile.dailyReminder')}</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {dailyReminderEnabled ? dailyReminderTime : t('profile.reminder.off')}
                </Text>
                <ChevronRight size={20} color={Colors.taupe} />
              </View>
            </Pressable>

            {/* Daily Learning Limit */}
            <View style={styles.divider} />
            <Pressable
              style={styles.settingItem}
              onPress={() => router.push('/learning/dailyLimit')}
            >
              <Text style={styles.settingLabel}>{t('profile.limit')}</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {useLearningPreferenceStore(state => state.dailyLimits['word']) || userProgress?.dailyLimit || 20}
                </Text>
                <ChevronRight size={20} color={Colors.taupe} />
              </View>
            </Pressable>

            {/* TTS Engine */}
            <View style={styles.divider} />
            <Pressable style={styles.settingItem}>
              <Text style={styles.settingLabel}>{t('profile.ttsEngine')}</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>Tencent TTS</Text>
                <ChevronRight size={20} color={Colors.taupe} />
              </View>
            </Pressable>

            {/* Language Switcher */}
            <View style={styles.divider} />
            <View style={styles.languageSection}>
              <LanguageSwitcher variant="full" />
            </View>
          </View>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={16} color="#DC2626" />
            <Text style={styles.logoutText}>{t('auth.logout')}</Text>
          </Pressable>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.ink,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.playfairBold,
    fontSize: 36,
    fontWeight: '700',
    color: Colors.ink,
  },
  displayName: {
    fontFamily: Typography.playfairRegular,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  achievementsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    padding: 24,
  },
  achievementsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementBadge: {
    alignItems: 'center',
    opacity: 1,
  },
  achievementBadgeLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ink,
    textAlign: 'center',
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(229, 226, 219, 0.5)',
    marginVertical: 4,
  },
  languageSection: {
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    fontWeight: '500',
    color: '#DC2626',
  },
});
````

## File: src/components/courses/AlphabetCourseCard.tsx
````typescript
// src/components/courses/AlphabetCourseCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

interface AlphabetCourseCardProps {
  course: {
    id: string;
    source: string;
    title: string;
    description: string;
    level: string;
    imageSource: ImageSourcePropType;
    lessons: number;
  };
  isCurrent: boolean;
  progress?: { completed: number; total: number }; // 保留以兼容调用方，字母模块暂不显示
  onStart: () => void;
}

export function AlphabetCourseCard({ course, isCurrent, onStart }: AlphabetCourseCardProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.card, isCurrent && styles.activeCard]}>
      <Pressable style={styles.cardPressable} onPress={onStart}>
        <Image source={course.imageSource} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {t(course.title)}
            </Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{t(course.level)}</Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {t(course.description)}
          </Text>

          <View style={styles.footer}>
            {/* 字母模块不显示课时/进度 */}
            <View style={styles.metaColumn} />

            {/* Start Learning 按钮 */}
            <Pressable
              style={[styles.startBtn, isCurrent && styles.activeStartBtn]}
              onPress={(e) => {
                e.stopPropagation();
                onStart();
              }}
            >
              <Text style={[styles.startBtnText, isCurrent && styles.activeStartBtnText]}>
                {isCurrent ? t('courses.continue') : t('courses.startBtnText')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.sand,
    height: 136,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  activeCard: {
    borderColor: Colors.thaiGold,
    borderWidth: 2,
    backgroundColor: '#FFFCF5',
  },
  cardPressable: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    width: 110,
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
    color: Colors.ink,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  levelText: {
    fontSize: 10,
    color: Colors.thaiGold,
    fontFamily: Typography.notoSerifRegular,
  },
  description: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: Colors.taupe,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  metaColumn: {
    flex: 1,
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    color: Colors.taupe,
    fontFamily: Typography.notoSerifRegular,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.thaiGold,
    borderRadius: 3,
  },
  startBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.ink,
    borderRadius: 12,
  },
  activeStartBtn: {
    backgroundColor: Colors.thaiGold,
  },
  startBtnText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Typography.notoSerifRegular,
  },
  activeStartBtnText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
````

## File: src/config/api.endpoints.ts
````typescript
// src/config/api.endpoints.ts

/*
 * API 端点配置
 *
 * 作用：
 * 1. 统一管理所有 API 路径，支持多后端切换
 * 2. 显式标记“CloudBase 实际存在的云函数”和“仅占位/仅 Java 后端可用”的端点
 *
 * 当前 CloudBase 已部署的函数（来自 cloudbase/cloudbaserc.json）：
 * - user-register
 * - user-login
 * - user-reset-password
 * - user-update-profile
 * - learn-vocab          （多 action：词汇学习 / 模块解锁 等）
 * - memory-engine        （多 action：getTodayMemories / submitMemoryResult / submitRoundEvaluation 等）
 * - alphabet             （字母测试等单独功能）
 *
 * 除上述云函数名以外的 cloudbase 字段，均视为“未实现的云函数名称占位”，
 * 目前前端代码不应调用这些占位端点。
 */

// ==================== 后端类型定义 ====================
export type BackendType = 'cloudbase' | 'java';

// ==================== 端点映射接口 ====================
export interface EndpointMap {
  cloudbase: string;  // CloudBase 云函数名
  java: string;       // Java Spring Boot 路径
}

// ==================== 认证 API ====================
export const AUTH_ENDPOINTS = {
  // 用户登录
  // ✅ CloudBase: 已实现 user-login 云函数
  LOGIN: {
    cloudbase: '/user-login',
    java: '/api/auth/login'
  } as EndpointMap, /*
                    as EndpointMap 表示类型断言
                    作用是告诉TypeScript编译器，这个对象的类型是EndpointMap
                    */

  // 用户注册
  // ✅ CloudBase: 已实现 user-register 云函数
  REGISTER: {
    cloudbase: '/user-register',
    java: '/api/auth/register'
  } as EndpointMap,

  // 重置密码
  // ✅ CloudBase: 已实现 user-reset-password 云函数
  RESET_PASSWORD: {
    cloudbase: '/user-reset-password',
    java: '/api/auth/reset-password'
  } as EndpointMap,

  // 更新个人资料
  // ✅ CloudBase: 已实现 user-update-profile 云函数
  UPDATE_PROFILE: {
    cloudbase: '/user-update-profile',
    java: '/api/user/profile'
  } as EndpointMap,

  // 登出
  // ⚠️ CloudBase: 目前没有 user-logout 云函数，前端仅本地登出，不会调用该 cloudbase 端点
  LOGOUT: {
    cloudbase: '/user-logout',
    java: '/api/auth/logout'
  } as EndpointMap,
};

// ==================== 课程管理 API ====================
// ⚠️ 说明：
// - 下列 cloudbase 字段（/course-get-*）目前没有对应的云函数，仅作为未来扩展的占位。
// - 如需在 CloudBase 上实现课程管理，请新增对应云函数后，再正式启用这些端点。
export const COURSE_ENDPOINTS = {
  // 获取所有课程
  GET_ALL: {
    cloudbase: '/course-get-all',
    java: '/api/courses'
  } as EndpointMap,

  // 获取课程详情
  GET_DETAIL: {
    cloudbase: '/course-get-detail',
    java: '/api/courses/:id'
  } as EndpointMap,

  // 获取课程内容
  GET_CONTENT: {
    cloudbase: '/course-get-content',
    java: '/api/courses/:id/content'
  } as EndpointMap,
};

// ==================== 学习功能 API ====================
// ⚠️ 说明：
// - 下列 cloudbase 字段（/learning-*）目前没有对应的云函数，仅作为占位；
// - 当前实际的字母 / 单词学习统一走 memory-engine / learn-vocab 多 action 云函数。
export const LEARNING_ENDPOINTS = {
  // 获取字母表
  GET_ALPHABETS: {
    cloudbase: '/learning-get-alphabets',
    java: '/api/learning/alphabets'
  } as EndpointMap,

  // 获取词汇
  GET_VOCABULARY: {
    cloudbase: '/learning-get-vocabulary',
    java: '/api/learning/vocabulary'
  } as EndpointMap,

  // 获取句子
  GET_SENTENCES: {
    cloudbase: '/learning-get-sentences',
    java: '/api/learning/sentences'
  } as EndpointMap,

  // 获取文章
  GET_ARTICLES: {
    cloudbase: '/learning-get-articles',
    java: '/api/learning/articles'
  } as EndpointMap,

  // 记录学习完成
  RECORD_COMPLETION: {
    cloudbase: '/learning-record-completion',
    java: '/api/learning/record'
  } as EndpointMap,
};

// ==================== 发音评估 API ====================
// ⚠️ 说明：
// - 下列 cloudbase 字段（/pronunciation-*）目前没有对应云函数，仅 Java 端或未来扩展使用。
export const PRONUNCIATION_ENDPOINTS = {
  // 发音评估
  ASSESS: {
    cloudbase: '/pronunciation-assess',
    java: '/api/pronunciation/assess'
  } as EndpointMap,

  // 获取评估历史
  GET_HISTORY: {
    cloudbase: '/pronunciation-get-history',
    java: '/api/pronunciation/history'
  } as EndpointMap,
};

// ==================== 进度管理 API ====================
// ⚠️ 说明：
// - 下列 cloudbase 字段（/progress-*）目前没有对应云函数；
// - 进度相关逻辑暂由 memory-engine / learn-vocab 内部更新 user_progress。
export const PROGRESS_ENDPOINTS = {
  // 获取进度
  GET: {
    cloudbase: '/progress-get',
    java: '/api/progress'
  } as EndpointMap,

  // 更新进度
  UPDATE: {
    cloudbase: '/progress-update',
    java: '/api/progress'
  } as EndpointMap,

  // 获取统计数据
  GET_STATISTICS: {
    cloudbase: '/progress-get-statistics',
    java: '/api/progress/statistics'
  } as EndpointMap,
};

// ==================== 复习系统 API ====================
// ⚠️ 说明：
// - 下列 cloudbase 字段（/review-*）目前没有对应云函数，仅作为未来复习中心化服务的占位。
export const REVIEW_ENDPOINTS = {
  // 获取到期复习
  GET_DUE: {
    cloudbase: '/review-get-due',
    java: '/api/reviews/due'
  } as EndpointMap,

  // 更新复习记录
  UPDATE: {
    cloudbase: '/review-update',
    java: '/api/reviews/:id'
  } as EndpointMap,

  // 获取复习历史
  GET_HISTORY: {
    cloudbase: '/review-get-history',
    java: '/api/reviews/history'
  } as EndpointMap,
};

// ==================== 汇总所有端点 ====================


// ==================== 辅助函数：获取端点 ====================
export function getEndpoint(
  endpoint: EndpointMap,
  backendType: BackendType
): string {
  return endpoint[backendType];
}

// ==================== 辅助函数：替换路径参数 ====================
/**
 * 替换路径中的参数
 * 
 * @example
 * replacePathParams('/api/courses/:id', { id: '123' })
 * // 返回: '/api/courses/123'
 */
export function replacePathParams(
  path: string,
  params: Record<string, string>
): string {
  let result = path;

  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
    result = result.replace(`{${key}}`, value);
  }

  return result;
}
// === 字母学习 API ===
// ==================== 字母学习 API ====================
// ⚠️ 说明：
// - 当前字母学习主流程走 memory-engine + getTodayMemories。
// - 这里的 /vocabulary-get-* 云函数名在 CloudBase 中并不存在，仅为最早版本设计的占位。
// - 与字母测试相关的实际云函数为 `alphabet`（多 action），后续如需对接可在此重新映射。
export const ALPHABET_ENDPOINTS = {
  GET_TODAY: {
    cloudbase: '/vocabulary-get-today-alphabets',
    java: '/api/vocabulary/alphabets/today'
  } as EndpointMap,

  SUBMIT_RESULT: {
    cloudbase: '/vocabulary-submit-alphabet-result',
    java: '/api/vocabulary/alphabets/result'
  } as EndpointMap,

  GET_TEST: {
    cloudbase: '/alphabet',  // ✅ 修复：添加前导斜杠
    java: '/api/vocabulary/alphabets/test'
  } as EndpointMap,

  SUBMIT_TEST: {
    cloudbase: '/alphabet',  // ✅ 修复：添加前导斜杠
    java: '/api/vocabulary/alphabets/test/submit'
  } as EndpointMap,
};

// ==================== 模块权限 API ====================
export const MODULE_ENDPOINTS = {
  // ✅ CloudBase: 使用 learn-vocab 多 action 云函数（CHECK_ACCESS）
  // DEPRECATED: Migrated to memory-engine
  // CHECK_ACCESS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/modules/access'
  // } as EndpointMap,
  // 🔥 修复: GET_USER_PROGRESS 已迁移到 memory-engine
  GET_USER_PROGRESS: {
    cloudbase: '/memory-engine',
    java: '/api/modules/progress'
  } as EndpointMap,
};

// ==================== 单词学习 API ====================
export const VOCABULARY_ENDPOINTS = {
  // /*
  //  * DEPRECATED: Learn-Vocab cloud function has been removed.
  //  * All vocabulary learning logic should now use memory-engine.
  //  */
  // // ✅ CloudBase: 使用 learn-vocab 多 action 云函数（getTodayWords / updateMastery / getVocabularyList 等）
  // GET_TODAY_WORDS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/today'
  // } as EndpointMap,
  // UPDATE_MASTERY: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/mastery'
  // } as EndpointMap,
  // GET_VOCABULARY_LIST: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/list'
  // } as EndpointMap,
  // TOGGLE_SKIP_WORD: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/skip'
  // } as EndpointMap,
  // GET_SKIPPED_WORDS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/skipped'
  // } as EndpointMap,
  // GET_VOCABULARY_DETAIL: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/:id'
  // } as EndpointMap,
  // GET_REVIEW_STATISTICS: {
  //   cloudbase: '/learn-vocab',
  //   java: '/api/vocabulary/statistics'
  // } as EndpointMap,
};

// ==================== 统一记忆引擎 API ====================
export const MEMORY_ENDPOINTS = {
  // ✅ CloudBase: 使用 memory-engine 多 action 云函数
  GET_TODAY_MEMORIES: {
    cloudbase: '/memory-engine',  // 云函数名
    java: '/api/memory/today'
  } as EndpointMap,
  SUBMIT_MEMORY_RESULT: {
    cloudbase: '/memory-engine',
    java: '/api/memory/result'
  } as EndpointMap,
  SUBMIT_ROUND_EVALUATION: {
    cloudbase: '/memory-engine',
    java: '/api/memory/round-evaluation'
  } as EndpointMap,
  SET_DAILY_LIMIT: {
    cloudbase: '/memory-engine',
    java: '/api/memory/set-daily-limit'
  } as EndpointMap,
};

// ==================== 下载云存储 API ====================
export const STORAGE_ENDPOINTS = {
  GET_DOWNLOAD_URL: {
    cloudbase: '/storage-download',
    java: '/api/storage/get-download-url', // 预留
  } as EndpointMap,
  BATCH_GET_DOWNLOAD_URLS: {
    cloudbase: '/storage-download',
    java: '/api/storage/batch-get-download-urls',
  } as EndpointMap,
};

//=====================AI Function API ====================

export const AI_ENDPOINTS = {
  ENGINE: {
    cloudbase: '/ai-engine',
    java: '/api/ai/engine',
  } as EndpointMap,
};
// ==================== 汇总所有端点 ====================
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  COURSE: COURSE_ENDPOINTS,
  LEARNING: LEARNING_ENDPOINTS,
  PRONUNCIATION: PRONUNCIATION_ENDPOINTS,
  PROGRESS: PROGRESS_ENDPOINTS,
  REVIEW: REVIEW_ENDPOINTS,
  ALPHABET: ALPHABET_ENDPOINTS,
  VOCABULARY: VOCABULARY_ENDPOINTS,
  MODULE: MODULE_ENDPOINTS,
  MEMORY: MEMORY_ENDPOINTS,
  STORAGE: STORAGE_ENDPOINTS,
  AI: AI_ENDPOINTS,
};
````

## File: src/hooks/useAlphabetLearningEngine.ts
````typescript
// src/hooks/useAlphabetLearningEngine.ts

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useUserStore } from '@/src/stores/userStore';
import type { AlphabetLearningState, AlphabetQueueItem, AlphabetQueueSource } from '@/src/stores/alphabetStore';
import type {
  PhonicsRule,
  RoundEvaluationState,
} from '@/src/entities/types/phonicsRule.types';

// ✅ 修复: 统一使用 enum 中的 QuestionType
import { QuestionType } from '@/src/entities/enums/QuestionType.enum';
import { QualityButton } from '@/src/entities/enums/QualityScore.enum';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { Alert, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// 🔥 TODO-03: Phase = AlphabetQueueSource + 特殊状态
// Phase 仅用于 UI 展示，不参与执行决策
export type Phase = AlphabetQueueSource | 'finished' | 'round-completed';

const SESSION_STORAGE_KEY = '@alphabet_learning_session';

interface SessionRecoveryState {
  lessonId: string;
  round: 1 | 2 | 3;
  phase: Phase;
  answeredCount: number;
  currentIndex: number; // 🔥 Bug 3 修复：添加 currentIndex
  status: 'in-progress' | 'completed';
}


// ===== Hook 主体 =====

export function useAlphabetLearningEngine(lessonId: string) {
  const {
    queue,
    currentItem,
    currentIndex,
    currentRound: storeCurrentRound, // 从 Store 读取 currentRound
    lessonMetadata,
    phonicsRule,
    initializeSession,
    submitRoundEvaluation: submitRoundToStore,
    next: nextInQueue,
    appendQueue,
    setCurrentIndex, // 引入 setCurrentIndex 方法
    setCurrentRound: setStoreCurrentRound, // 引入 setCurrentRound 方法
  } = useAlphabetStore();

  const { currentUser } = useUserStore();
  const { userProgress } = useModuleAccessStore();
  const userId = currentUser?.userId ?? 'test-user';

  const [initialized, setInitialized] = useState(false);
  // REMOVED explicit phase state. Phase is now derived.
  // const [phase, setPhase] = useState<Phase>('finished'); 

  // 🔥 TODO-03: 以下状态仅用于 UI 展示，不参与执行决策 (legacy UI only)
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const [explicitPhase, setExplicitPhase] = useState<Phase | null>(null);

  // ===== Phase Logic (Derived) =====
  // 🔥 TODO-03: derivedPhase 仅用于 UI 展示，不参与执行决策 (legacy UI only)
  const derivedPhase: Phase = useMemo(() => {
    if (explicitPhase) return explicitPhase;
    if (isLessonFinished) return 'finished';
    if (!currentItem) return 'finished';

    // 直接返回 source，不再进行映射转换
    return currentItem.source;
  }, [currentItem, isLessonFinished, explicitPhase]);

  const [phonicsRuleShown, setPhonicsRuleShown] = useState(false);
  const [showPhonicsRuleCard, setShowPhonicsRuleCard] = useState(false);

  const [learnedCount, setLearnedCount] = useState(0);
  const [todayList, setTodayList] = useState<AlphabetLearningState[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<Set<string>>(new Set());

  // ✅ 修复: currentRound 类型为 1 | 2 | 3
  // 🔥 Bug 2 修复：初始化时从 Store 读取 currentRound
  const [currentRound, setCurrentRound] = useState<1 | 2 | 3>(storeCurrentRound || 1);
  const [roundEvaluation, setRoundEvaluation] = useState<RoundEvaluationState>({
    currentRound: 1,
    rounds: [],
    allRoundsPassed: false,
  });

  const roundMemoryResultsRef = useRef<Record<string, QualityButton>>({});
  const [answeredCount, setAnsweredCount] = useState(0);
  const [recoveryPrompted, setRecoveryPrompted] = useState(false);
  // 新增: 将恢复状态暴露给 UI
  const [pendingRecoverySession, setPendingRecoverySession] = useState<SessionRecoveryState | null>(null);

  // 🔥 新增: 标记用户是否已经开始答题（用于延迟 session 保存时机）
  const [hasStartedAnswering, setHasStartedAnswering] = useState(false);

  const prevRoundRef = useRef<1 | 2 | 3>(currentRound);


  // 🐛 P0-2 FIX: 防止重复点击
  const [isProcessingNext, setIsProcessingNext] = useState(false);

  const writeSessionState = useCallback(async (state: SessionRecoveryState | null) => {
    try {
      if (state) {
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
      } else {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('⚠️ 字母学习会话状态持久化失败:', error);
    }
  }, []);

  const persistSessionState = useCallback(async () => {
    // 🔥 TODO-03: 不依赖 derivedPhase，改为判断 isLessonFinished 和 currentItem
    // 当课程结束或没有当前题目时，清除 session
    if (!lessonId || !initialized || isLessonFinished || !currentItem) {
      console.log('💾 [Persist] Clearing session (finished or no item)');
      await writeSessionState(null);
      return;
    }

    // 🔥 新增：只有用户开始答题后，才保存 session
    if (!hasStartedAnswering) {
      console.log('💾 [Persist] User has not started answering, skip persisting');
      return;
    }

    const sessionData: SessionRecoveryState = {
      lessonId,
      round: currentRound,
      phase: currentItem.source, // 🔥 TODO-03: 直接使用 source，不再映射
      answeredCount,
      currentIndex, // 🔥 Bug 3 修复：保存 currentIndex
      status: 'in-progress', // 默认状态为 in-progress
    };
    console.log('💾 [Persist] Writing session:', sessionData);
    await writeSessionState(sessionData);
  }, [lessonId, initialized, isLessonFinished, currentItem, currentRound, answeredCount, currentIndex, writeSessionState, hasStartedAnswering]);

  const clearStoredSessionState = useCallback(async () => {
    await writeSessionState(null);
  }, [writeSessionState]);

  const handleContinueStoredSession = useCallback((session: SessionRecoveryState) => {
    setCurrentRound(session.round);
    // setPhase(session.phase); // Phase derived from queue restoration
    setAnsweredCount(session.answeredCount ?? 0);
    setTodayList([]);
    setWrongAnswers(new Set());
    setRecoveryPrompted(true);

    // 🔥 恢复学习时，标记为已经开始答题（因为是中断后恢复）
    setHasStartedAnswering(true);

    // 🔥 Bug 3 修复：恢复队列位置
    if (session.currentIndex !== undefined && session.currentIndex >= 0) {
      setCurrentIndex(session.currentIndex);
      console.log(`🔄 恢复队列位置: currentIndex = ${session.currentIndex}`);
    }
  }, [setCurrentIndex]);

  const handleRestartStoredSession = useCallback(async (session?: SessionRecoveryState) => {
    // 🔥 Bug 4 修复：重新开始本轮时，需要调用 initializeSession 重新加载队列
    // 从 Round1 的第一个阶段开始（previous-round-review 或 new-learning）
    const targetRound = session?.round ?? 1;

    setCurrentRound(targetRound);
    setAnsweredCount(0);
    setTodayList([]);
    setWrongAnswers(new Set());
    setRecoveryPrompted(true);

    // 🔥 重新开始时，重置答题标记
    setHasStartedAnswering(false);

    // 🔥 清除旧 session
    await clearStoredSessionState();

    // 🔥 重新初始化队列，指定 round
    try {
      await initializeSession(userId, { lessonId, round: targetRound });
      console.log(`🔄 重新加载队列: Round ${targetRound}`);
    } catch (error) {
      console.error('❌ handleRestartStoredSession: initializeSession 失败:', error);
    }
  }, [clearStoredSessionState, initializeSession, userId, lessonId]);

  // ===== 初始化 =====
  useEffect(() => {
    let cancelled = false;

    // 🔥 每次重新初始化时，重置答题标记
    setHasStartedAnswering(false);

    (async () => {
      try {
        await initializeSession(userId, { lessonId });
      } catch (e) {
        console.error('[useAlphabetLearningEngine] initializeSession 失败:', e);
        if (cancelled) return;
        // 后端失败时也不能永远停留在 loading
        setInitialized(true);
        // setPhase('finished');
        return;
      }

      if (cancelled) return;
      setInitialized(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId, userId, initializeSession]);

  useEffect(() => {
    void persistSessionState();
  }, [persistSessionState]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        void persistSessionState();
      }
    });

    return () => {
      void persistSessionState();
      subscription.remove();
    };
  }, [persistSessionState]);

  useEffect(() => {
    if (!initialized || recoveryPrompted || !lessonId) {
      console.log('🔍 [Recovery Check] Skipped:', { initialized, recoveryPrompted, lessonId });
      return;
    }

    console.log('🔍 [Recovery Check] Starting check...');

    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        console.log('🔍 [Recovery Check] Stored session:', stored ? 'Found' : 'Not found');

        if (!stored) return;

        const parsed: SessionRecoveryState = JSON.parse(stored);
        console.log('🔍 [Recovery Check] Parsed session:', {
          lessonId: parsed.lessonId,
          round: parsed.round,
          phase: parsed.phase,
          status: parsed.status,
          currentIndex: parsed.currentIndex
        });

        // 验证 lessonId 匹配
        if (parsed.lessonId !== lessonId) {
          console.log('🔍 [Recovery Check] LessonId mismatch, clearing...');
          await clearStoredSessionState();
          return;
        }

        // 🔥 关键修复：仅当 status === 'in-progress' 时才弹出恢复提示
        if (parsed.status !== 'in-progress') {
          console.log('🔍 [Recovery Check] Status not in-progress, clearing...', parsed.status);
          await clearStoredSessionState();
          return;
        }

        if (cancelled) return;

        // 替换 Alert.alert 为 UI 状态
        console.log('🔍 [Recovery Check] Showing recovery dialog');
        setPendingRecoverySession(parsed);
        setRecoveryPrompted(true);

      } catch (error) {
        console.error('⚠️ 读取字母学习会话状态失败:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    initialized,
    lessonId,
    recoveryPrompted,
    clearStoredSessionState,
  ]);

  // 新增: 处理用户的恢复选择
  const handleResolveRecovery = useCallback((choice: 'continue' | 'restart') => {
    if (!pendingRecoverySession) return;

    if (choice === 'continue') {
      handleContinueStoredSession(pendingRecoverySession);
    } else {
      handleRestartStoredSession(pendingRecoverySession);
    }
    setPendingRecoverySession(null);
  }, [pendingRecoverySession, handleContinueStoredSession, handleRestartStoredSession]);

  // 🔥 Bug 2 修复：从 Store 同步 currentRound 到 Hook 本地状态
  useEffect(() => {
    if (storeCurrentRound && storeCurrentRound !== currentRound) {
      console.log(`🔄 Syncing currentRound from Store: ${storeCurrentRound}`);
      setCurrentRound(storeCurrentRound);
    }
  }, [storeCurrentRound, currentRound]);

  useEffect(() => {
    if (prevRoundRef.current !== currentRound) {
      prevRoundRef.current = currentRound;
      setAnsweredCount(0);
    }
  }, [currentRound]);

  // ===== 首次进入：如果没有任何“旧字母”，自动跳过昨日复习 =====
  useEffect(() => {
    if (!initialized) return;
    if (!currentItem) return;
    // setPhase(currentItem.source); // REMOVED: Phase is derived
  }, [initialized, currentItem, queue]);

  // ===== Today Learning 首次显示拼读规则 =====
  useEffect(() => {
    // 🔥 TODO-03: 统一使用 'new-learning'
    const isNew = currentItem?.source === 'new-learning';
    if (isNew && !phonicsRuleShown && phonicsRule && learnedCount === 0) {
      setShowPhonicsRuleCard(true);
    }
  }, [phonicsRuleShown, phonicsRule, learnedCount, currentItem]);

  const handleCompletePhonicsRule = useCallback(() => {
    setShowPhonicsRuleCard(false);
    setPhonicsRuleShown(true);
  }, []);

  const recordMemoryResult = useCallback((letterId: string, quality: QualityButton) => {
    roundMemoryResultsRef.current[letterId] = quality;
  }, []);

  const submitAlphabetMemoryResults = useCallback(
    async (roundNumber: number) => {
      const entries = Object.entries(roundMemoryResultsRef.current);
      if (entries.length === 0) return;

      const results = entries.map(([entityId, quality]) => ({
        entityType: 'letter' as const,
        entityId,
        quality,
      }));

      try {
        await callCloudFunction(
          'submitMemoryResult',
          {
            userId,
            lessonId,
            roundNumber,
            results,
          },
          {
            endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase,
          }
        );
      } catch (error) {
        console.error('❌ submitAlphabetMemoryResults error:', error);
      }
    },
    [lessonId, userId]
  );

  // ===== 答题回调 =====
  const handleAnswer = useCallback(
    async (isCorrect: boolean, questionType: QuestionType) => {
      if (!currentItem) return;

      // 🔥 标记用户已经开始答题（触发 session 保存）
      if (!hasStartedAnswering) {
        setHasStartedAnswering(true);
        console.log('🎯 User started answering, session will now persist');
      }

      const quality = isCorrect ? QualityButton.KNOW : QualityButton.FORGET;
      recordMemoryResult(currentItem.alphabetId, quality);
      setAnsweredCount((prev) => prev + 1);

      const wrongKey = currentItem.alphabetId;

      setWrongAnswers((prev) => {
        const next = new Set(prev);
        if (isCorrect && currentItem.source === 'error-review') {
          next.delete(wrongKey);
        } else if (!isCorrect) {
          next.add(wrongKey);
        }
        return next;
      });
    },
    [currentItem, recordMemoryResult, hasStartedAnswering]
  );

  // REMOVED DUPLICATE derivedPhase definition from here (moved to top)


  // ===== Question Type Logic (Engine Driven) =====

  // 🔥 TODO-03: 题型选择只能基于 currentItem.source，不依赖 Phase
  const currentQuestionType = useMemo<QuestionType | null>(() => {
    if (!currentItem) return null;

    const source = currentItem.source;

    // 1. New Learning / Mini Review: ALLOW Simple Types
    if (source === 'new-learning') {
      return QuestionType.SOUND_TO_LETTER;
    }

    if (source === 'mini-review') {
      return Math.random() > 0.5 ? QuestionType.SOUND_TO_LETTER : QuestionType.LETTER_TO_SOUND;
    }

    // 2. Strict Review Phases: FORBID Simple Types (where possible)
    // 🔥 TODO-03: 统一使用 'previous-review'
    if (source === 'previous-review' || source === 'final-review') {
      const complexTypes = [];

      // Only allow CONSONANT_CLASS for Consonants
      if (currentItem.letter.type === 'consonant') {
        complexTypes.push(QuestionType.CLASS_CHOICE); // CONSONANT_CLASS
        // Initial/Final sound usually applies to consonants acting as such
        if (currentItem.letter.initialSound) complexTypes.push(QuestionType.INITIAL_SOUND);
        if (currentItem.letter.finalSound) complexTypes.push(QuestionType.FINAL_CONSONANT);
      } else {
        // Vowels / Tones:
        // Currently we lack "Complex" types for vowels (Tone Calculation is TODO).
        // Fallback to LETTER_TO_SOUND (Reading) which is harder than Sound-to-Letter.
        // We cannot use CONSONANT_CLASS.
      }

      // TODO: Enable these when data/logic is ready
      // complexTypes.push(QuestionType.TONE_CALCULATION);

      if (complexTypes.length === 0) {
        // Fallback for Vowels in Strict Phase
        // Prefer LETTER_TO_SOUND (Reading)
        return QuestionType.LETTER_TO_SOUND;
      }

      const hash = currentItem.alphabetId.charCodeAt(0) + (currentItem.round || 0) + Date.now();
      return complexTypes[hash % complexTypes.length];
    }

    if (source === 'error-review') {
      // Error Review: Retry what they failed.
      // If we don't know what they failed, default to SOUND_TO_LETTER for safety?
      // Or make it strict if it was a strict phase failure?
      // For now, allow simple types to ensure they at least get the basics.
      return QuestionType.SOUND_TO_LETTER;
    }

    return QuestionType.SOUND_TO_LETTER;
  }, [currentItem]);


  // ===== 下一题 =====
  const handleNext = useCallback(async () => {
    // 🐛 P0-2 FIX: 防止重复点击
    if (isProcessingNext) {
      console.log('🚫 防止重复点击 handleNext');
      return;
    }

    // 🔥 TODO-03: 不依赖 explicitPhase，改为判断 currentItem
    // 当轮次完成后，currentItem 为 null，无法继续答题
    if (!currentItem) {
      console.warn('⚠️ No current item, round may be completed.');
      return;
    }

    console.log('=== handleNext 调用 ===');
    console.log('调用前状态:', {
      phase: derivedPhase,
      currentRound,
      learnedCount,
      queueLength: queue.length,
      currentLetter: currentItem?.letter?.thaiChar || 'unknown',
      source: currentItem?.source,
      errorQueueSize: wrongAnswers.size, // Approximation of potential error queue
    });

    setIsProcessingNext(true);

    // 🔥 TODO-03: 统一使用 'new-learning'
    const isCurrentNew = currentItem?.source === 'new-learning';
    // STRICT Condition: End of Queue
    const atEnd = currentIndex >= queue.length - 1;

    try {
      if (currentItem && isCurrentNew) {
        setTodayList((prev) => [...prev, currentItem]);
        setLearnedCount((prev) => prev + 1);
      }

      if (atEnd) {
        // 1. Check if we have pending errors
        if (wrongAnswers.size > 0) {
          const errorItems: AlphabetQueueItem[] = [];
          const wrongArray = Array.from(wrongAnswers);

          wrongArray.forEach((letterId) => {
            const target = queue.find((q) => q.alphabetId === letterId);
            if (target) {
              errorItems.push({ ...target, source: 'error-review', round: currentRound });
            }
          });

          if (errorItems.length > 0) {
            appendQueue(errorItems);
            console.log('🔁 追加错题回顾队列:', errorItems.map((i) => i.alphabetId));
            // Just move next to start error review
            nextInQueue();
            return;
          }
        }

        // 2. Strict Round Completion Check
        // Condition: End of Queue AND No Errors allowed
        if (wrongAnswers.size === 0) {
          console.log('✅ Round Completed Check Passed.');
          await submitRoundResults();
          // DO NOT call nextInQueue, just stop here.
          return;
        }
      }

      nextInQueue();
    } finally {
      setTimeout(() => {
        setIsProcessingNext(false);
      }, 300);
    }
  }, [currentItem, learnedCount, nextInQueue, queue, currentRound, isProcessingNext, currentIndex, wrongAnswers, appendQueue]); // 🔥 TODO-03: 移除 derivedPhase 和 explicitPhase 依赖

  // ✅ 修复: submitRoundResults
  const submitRoundResults = useCallback(async () => {
    console.log(`🚀 Submitting Round ${currentRound} Results...`);

    const totalQuestions = queue.length; // Note: includes error retries
    const correctCount = Math.max(0, totalQuestions - wrongAnswers.size); // Rough calc

    const accuracy = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const passed = wrongAnswers.size === 0; // Round passes only if no errors

    // 🔥 TODO-05: 判定 mode，free-play 模式下禁止任何写入
    const mode = userProgress?.letterCompleted ? 'free-play' : 'learning';

    if (mode === 'learning') {
      // ===== learning 模式：正常写入进度 =====

      // 1. Submit to Backend
      await submitRoundToStore({
        userId,
        lessonId,
        roundNumber: currentRound,
        totalQuestions,
        correctCount,
        accuracy: 1, // Hack: If they cleared error queue, they technically "passed".
      });

      // 2. Log
      console.log(`✅ Round ${currentRound} Submit Success.`);

      // 🔥 Step 5: Round3 完成后刷新用户进度（从后端获取最新 completedLessons）
      if (currentRound === 3 && passed) {
        console.log('📚 Round3 completed! Refreshing user progress from backend...');

        // 🔥 刷新进度（会从后端获取最新的 completedLessons）
        await useModuleAccessStore.getState().getUserProgress();

        console.log('✅ User progress refreshed from backend');
      }

      // 3. 🔥 推进到下一轮（Round1 → Round2 → Round3）
      const nextRound = Math.min(currentRound + 1, 3) as 1 | 2 | 3;

      // 🔥 先更新 Store 的 currentRound (避免 useEffect 同步时覆盖)
      setStoreCurrentRound(nextRound);
      console.log(`🔄 Store currentRound updated: ${nextRound}`);

      // 🔥 再更新 Hook 的本地状态
      setCurrentRound(nextRound);

      // 4. 🔥 显式清除 session（避免下次进入时弹出恢复弹窗）
      await clearStoredSessionState();
      console.log('🗑️ Round completed, session cleared');

      // 5. ENTER 'round-completed' PHASE
      setExplicitPhase('round-completed');
    } else {
      // ===== free-play 模式：只读学习，不写入任何进度 =====
      console.log(`🎮 free-play 模式：Round 完成，但不写入进度`);

      // 仅清除 session，不推进 round
      await clearStoredSessionState();

      // 显示完成 UI
      setExplicitPhase('round-completed');
    }

  }, [currentRound, queue.length, wrongAnswers, userId, lessonId, submitRoundToStore, clearStoredSessionState, setStoreCurrentRound, userProgress, setCurrentRound, setExplicitPhase]);

  // REMOVED: handleStartNextRound. 
  // User must exit to Lesson page and restart to trigger next round init.
  /*
  const handleStartNextRound = useCallback(async () => { ... });
  */



  const letterPool = useMemo(() => queue.map((item) => item.letter), [queue]);

  // 🔥 新增: 在 RoundCompleted 或课程完成时调用，清除 session
  const handleFinishRound = useCallback(async () => {
    await clearStoredSessionState();
  }, [clearStoredSessionState]);

  // 🔥 新增: Skip (Bury) functionality for previous-review
  const handleSkipYesterdayReview = useCallback(async () => {
    // Only valid in previous-review phase
    // 🔥 TODO-03: derivedPhase is legacy, check source directly
    if (currentItem?.source !== 'previous-review') {
      console.warn('⚠️ handleSkipYesterdayReview called outside of previous-review phase');
      return;
    }

    console.log('⏭️ Skipping (Burying) review item:', currentItem.alphabetId);

    // 1. Mark as Known (Correct) to "bury" it for this session quality-wise
    // Using currentQuestionType or fallback to SOUND_TO_LETTER
    await handleAnswer(true, currentQuestionType ?? QuestionType.SOUND_TO_LETTER);

    // 2. Advance to next item immediately
    console.log('⏭️ Item skipped, advancing...');
    await handleNext();
  }, [currentItem, currentQuestionType, handleAnswer, handleNext]);

  return {
    initialized,
    phase: derivedPhase,
    currentRound,
    queueIndex: currentIndex,
    totalQueue: queue.length,
    roundEvaluation,
    currentItem,
    currentQuestionType,
    letterPool,
    onAnswer: handleAnswer,
    onNext: handleNext,
    // onStartNextRound: handleStartNextRound, // REMOVED
    phonicsRule,
    showPhonicsRuleCard,
    onCompletePhonicsRule: handleCompletePhonicsRule,
    // 透出给 UI
    pendingRecoverySession,
    resolveRecovery: handleResolveRecovery,
    onFinishRound: handleFinishRound,
    onSkipYesterdayReview: handleSkipYesterdayReview,
  };
}
````

## File: src/stores/moduleAccessStore.ts
````typescript
// src/stores/moduleAccessStore.ts

/**
 * 模块访问控制 Store
 * 
 * 功能：
 * 1. 检查用户是否有权限访问某个模块
 * 2. 缓存访问权限结果
 * 3. 提供全局进度数据
 */

import { create } from 'zustand';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useUserStore } from './userStore';
import { LESSON_METADATA } from '@/src/config/alphabet/lessonMetadata.config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getCompletedLessonsStorageKey = (userId: string): string =>
    `@alphabet_completed_lessons_${userId}`;



// ==================== 类型定义 ====================

/**
 * 模块类型
 * 
 * 注意：
 * - 与后端 memory-engine.checkModuleAccess 保持一致，字母模块使用 'letter'
 */
export type ModuleType = 'letter' | 'word' | 'sentence' | 'article';

/**
 * 用户进度数据
 */
export interface UserProgress {
    // 字母学习进度
    letterProgress: number;           // 0-1 (后端存储为比例值)
    letterCompleted: boolean;         // Added: Whether letter learning is completed
    letterMasteredCount: number;      // 已掌握字母数
    letterTotalCount: number;         // 总字母数

    // 单词学习进度
    wordProgress: number;             // 0-100
    wordMasteredCount: number;        // 已掌握单词数
    wordTotalCount: number;           // 总单词数

    // 句子学习进度
    sentenceProgress: number;         // 0-100
    sentenceMasteredCount: number;    // 已掌握句子数
    sentenceTotalCount: number;       // 总句子数

    // 文章学习进度
    articleProgress: number;          // 0-100
    articleMasteredCount: number;     // 已掌握文章数
    articleTotalCount: number;        // 总文章数

    // 解锁状态
    wordUnlocked: boolean;            // 单词模块是否解锁
    sentenceUnlocked: boolean;        // 句子模块是否解锁
    articleUnlocked: boolean;         // 文章模块是否解锁

    /**
     * 字母课程完成情况（仅前端使用）
     * 例如: ['lesson1','lesson2',...]
     */
    completedAlphabetLessons?: string[];

    /**
     * 按课程来源的单词掌握数（CoursePage 进度条用）
     * 例: { BaseThai_1: { mastered: 5 }, BaseThai_2: { mastered: 3 }, ... }
     */
    wordProgressBySource?: Record<string, { mastered: number }>;

    // 设置
    dailyLimit?: number;              // 每日学习数量设置
}

/**
 * 访问检查响应
 */
interface CheckAccessResponse {
    allowed: boolean;
    reason?: string;
    requiredProgress?: number;
    currentProgress?: number;
}

/**
 * 用户进度响应（后端返回）
 */
interface UserProgressResponse {
    progress: UserProgress & {
        completedLessons?: string[];  // 🔥 后端返回字段（user_alphabet_progress.completedLessons）
    };
}

// ==================== Store 定义 ====================

interface ModuleAccessStore {
    // ===== 状态 =====
    userProgress: UserProgress | null;
    accessCache: Map<ModuleType, boolean>;
    isLoading: boolean;
    error: string | null;

    // ===== 方法 =====
    checkAccess: (moduleType: ModuleType) => Promise<boolean>;
    checkAccessLocally: (moduleType: ModuleType) => boolean;
    getUserProgress: () => Promise<void>;
    clearCache: () => void;
    setError: (error: string | null) => void;
    setDailyLimit: (moduleType: ModuleType, limit: number) => void;
    /**
     * 标记某个字母课程已完成（仅用于字母模块解锁链路）
     */
    markAlphabetLessonCompleted: (lessonId: string) => void;
}

// ==================== 默认进度数据 ====================

const defaultProgress: UserProgress = {
    letterProgress: 0,
    letterCompleted: false,
    letterMasteredCount: 0,
    letterTotalCount: 44,
    wordProgress: 0,
    wordMasteredCount: 0,
    wordTotalCount: 0,
    sentenceProgress: 0,
    sentenceMasteredCount: 0,
    sentenceTotalCount: 0,
    articleProgress: 0,
    articleMasteredCount: 0,
    articleTotalCount: 0,
    wordUnlocked: false,
    sentenceUnlocked: false,
    articleUnlocked: false,
};

// ==================== Store 实现 ====================

export const useModuleAccessStore = create<ModuleAccessStore>()((set, get) => ({
    // ===== 初始状态 =====
    userProgress: null,
    accessCache: new Map<ModuleType, boolean>(),
    isLoading: false,
    error: null,

    // ===== 检查模块访问权限 =====
    /**
     * 检查用户是否有权限访问某个模块
     * 
     * @param moduleType 模块类型
     * @returns 是否有权限访问
     */
    checkAccess: async (moduleType: ModuleType): Promise<boolean> => {
        const { accessCache } = get();
        const userId = useUserStore.getState().currentUser?.userId;

        if (!userId) {
            console.warn('⚠️ 用户未登录，无法检查模块访问权限');
            return false;
        }

        // 1. 检查缓存
        if (accessCache.has(moduleType)) {
            const cachedResult = accessCache.get(moduleType);
            console.log(`✅ 从缓存获取 ${moduleType} 访问权限:`, cachedResult);
            return cachedResult!;
        }

        try {
            set({ isLoading: true, error: null });

            // 2. 调用云函数检查权限
            const result = await callCloudFunction<CheckAccessResponse>(
                'checkModuleAccess',
                {
                    userId,
                    moduleType,
                },
                {
                    endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
                }
            );

            if (result.success && result.data) {
                const allowed = result.data.allowed;

                // 3. 缓存结果
                const newCache = new Map(accessCache);
                newCache.set(moduleType, allowed);
                set({ accessCache: newCache, isLoading: false });

                console.log(`✅ ${moduleType} 访问权限检查完成:`, allowed);

                // 如果不允许，记录原因
                if (!allowed && result.data.reason) {
                    console.log(`📌 拒绝原因: ${result.data.reason}`);
                }

                return allowed;
            } else {
                // 请求失败，降级处理
                console.warn('⚠️ 云函数调用失败，使用本地逻辑判断');
                const localAllowed = get().checkAccessLocally(moduleType);

                // 缓存本地判断结果
                const newCache = new Map(accessCache);
                newCache.set(moduleType, localAllowed);
                set({ accessCache: newCache, isLoading: false });

                return localAllowed;
            }
        } catch (error: any) {
            console.error('❌ checkAccess error:', error);
            set({ error: error.message || '检查权限失败', isLoading: false });

            // 降级到本地逻辑
            const localAllowed = get().checkAccessLocally(moduleType);

            // 缓存本地判断结果
            const newCache = new Map(get().accessCache);
            newCache.set(moduleType, localAllowed);
            set({ accessCache: newCache });

            return localAllowed;
        }
    },

    // ===== 本地权限检查逻辑（降级方案）=====
    /**
     * 本地权限检查逻辑（降级方案）
     * 
     * @param moduleType 模块类型
     * @returns 是否有权限访问
     */
    checkAccessLocally: (moduleType: ModuleType): boolean => {
        const { userProgress } = get();

        if (!userProgress) {
            // 如果没有进度数据，允许访问字母模块，其他模块不允许
            return moduleType === 'letter';
        }

        // 与后端 memory-engine.checkModuleAccess 的意图保持一致：
        // - 字母模块始终可访问
        // - 只要 letterCompleted 为 true，或 letterProgress ≥ 0.8，所有非字母模块统一解锁
        if (moduleType === 'letter') {
            return true;
        }

        const finishedByTest = !!userProgress.letterCompleted;
        const finishedByProgress = (userProgress.letterProgress ?? 0) >= 0.8;

        return finishedByTest || finishedByProgress;
    },

    // ===== 获取用户进度 =====
    // ===== 获取用户进度 =====
    /**
     * 从后端获取用户进度数据
     */
    getUserProgress: async (): Promise<void> => {
        const userId = useUserStore.getState().currentUser?.userId;

        if (!userId) {
            console.warn('⚠️ 用户未登录，无法获取进度数据');
            set({ userProgress: defaultProgress });
            return;
        }

        try {
            const oldKey = '@alphabet_completed_lessons';
            const oldData = await AsyncStorage.getItem(oldKey);
            if (oldData) {
                await AsyncStorage.removeItem(oldKey);
                console.log('Old key has been delete.');
            }
        } catch (e) {
            console.warn('删除旧key失败：', e)
        }

        set({ isLoading: true, error: null });

        // Helper to try fetch
        const fetchProgress = async (endpoint: string) => {
            return await callCloudFunction<UserProgressResponse>(
                'getUserProgress',
                { userId, entityType: 'letter' },  // 添加 entityType 参数
                { endpoint }
            );
        };

        try {
            // 1. Try Primary Endpoint (memory-engine)
            let result = await fetchProgress(API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase);

            if (result.success && result.data) {
                console.log(`🌐 后端返回的每日限额: ${result.data.progress.dailyLimit}`);
                // 🔥 Step 3: 以后端数据为准，本地仅作缓存
                const remoteCompleted = result.data.progress.completedLessons || [];
                const stats = (result.data.progress as any).statistics;

                // 🔥 映射后端 statistics 为前端期望的扁平字段（CoursePage 进度条依赖）
                const letterMasteredCount = stats?.letter?.mastered ?? result.data.progress.letterMasteredCount ?? 0;
                const letterTotalCount = stats?.letter?.total ?? result.data.progress.letterTotalCount ?? 44;
                const wordMasteredCount = stats?.word?.mastered ?? result.data.progress.wordMasteredCount ?? 0;
                const wordTotalCount = stats?.word?.total ?? result.data.progress.wordTotalCount ?? 0;
                const wordProgressBySource = stats?.wordProgressBySource ?? result.data.progress.wordProgressBySource ?? {};

                // 🔥 更新本地缓存（用于离线时加速）
                const storageKey = getCompletedLessonsStorageKey(userId);
                AsyncStorage.setItem(storageKey, JSON.stringify(remoteCompleted)).catch(err => {
                    console.warn('⚠️ Failed to cache completed lessons:', err);
                });

                set({
                    userProgress: {
                        ...result.data.progress,
                        completedAlphabetLessons: remoteCompleted,
                        letterMasteredCount,
                        letterTotalCount,
                        wordMasteredCount,
                        wordTotalCount,
                        wordProgressBySource,
                    },
                    isLoading: false,
                });
                console.log('✅ 用户进度数据已更新 (Backend-first):', {
                    letterMasteredCount,
                    letterTotalCount,
                    wordMasteredCount,
                    wordTotalCount,
                    completedAlphabetLessons: remoteCompleted,
                });
            } else {
                // 🔥 后端失败时，尝试从本地缓存加载（降级方案）
                console.warn('⚠️ 获取用户进度失败 (Primary & Fallback)，尝试从本地缓存加载');
                try {
                    const storageKey = getCompletedLessonsStorageKey(userId);
                    const cached = await AsyncStorage.getItem(storageKey);
                    const cachedCompleted = cached ? JSON.parse(cached) : [];

                    set({
                        userProgress: {
                            ...defaultProgress,
                            completedAlphabetLessons: cachedCompleted
                        },
                        isLoading: false,
                        error: result.error || 'Failed to fetch progress'
                    });
                    console.log('⚠️ 使用本地缓存数据:', cachedCompleted);
                } catch (cacheError) {
                    set({
                        userProgress: defaultProgress,
                        isLoading: false,
                        error: result.error || 'Failed to fetch progress'
                    });
                }
            }
        } catch (error: any) {
            console.error('❌ getUserProgress error:', error);

            // 🔥 异常时，尝试从本地缓存加载（降级方案）
            try {
                const storageKey = getCompletedLessonsStorageKey(userId);
                const cached = await AsyncStorage.getItem(storageKey);
                const cachedCompleted = cached ? JSON.parse(cached) : [];

                set({
                    error: error.message || '获取进度失败',
                    userProgress: {
                        ...defaultProgress,
                        completedAlphabetLessons: cachedCompleted
                    },
                    isLoading: false,
                });
                console.log('⚠️ 异常时使用本地缓存:', cachedCompleted);
            } catch (cacheError) {
                set({
                    error: error.message || '获取进度失败',
                    userProgress: defaultProgress,
                    isLoading: false,
                });
            }
        }
    },

    // ===== 清除缓存 =====
    /**
     * 清除访问权限缓存
     * 用于：用户完成学习后需要重新检查权限
     */
    clearCache: (): void => {
        set({ accessCache: new Map<ModuleType, boolean>() });
        console.log('🗑️ 访问权限缓存已清除');
    },

    // ===== 设置错误 =====
    setError: (error: string | null): void => {
        set({ error });
    },

    // ===== 更新每日学习量（前端缓存）=====
    setDailyLimit: async (moduleType: ModuleType, limit: number) => {
        // 1. 先更新本地 UI（保证响应速度）
        set((state) => ({
            userProgress: {
                ...(state.userProgress || { ...defaultProgress }),
                dailyLimit: limit,
            },
        }));
        // 2. 立即推送到后端持久化
        const userId = useUserStore.getState().currentUser?.userId;
        if (userId) {
            try {
                await callCloudFunction(
                    'setDailyLimit',
                    {
                        userId,
                        dailyLimit: limit
                    },
                    { endpoint: API_ENDPOINTS.MEMORY.SET_DAILY_LIMIT.cloudbase }
                );
                console.log(`✅ 已成功同步 ${moduleType} 限额 ${limit} 到云端`);
            } catch (error) {
                console.error('❌ 更新每日学习量失败:', error);
            }
        };

        console.log(`📌 已更新 ${moduleType} dailyLimit 为 ${limit}`);
    },

    // ===== 标记字母课程完成（前端本地）=====
    markAlphabetLessonCompleted: (lessonId: string) => {
        const userId = useUserStore.getState().currentUser?.userId;
        if (!userId) {
            console.warn('⚠️ 用户未登录，无法标记课程完成');
            return;
        }

        const totalLessons = Object.keys(LESSON_METADATA).length;
        const coreLessons = 6; // 完成前 6 课视为“核心字母已学完”

        set((state) => {
            const prev = state.userProgress || { ...defaultProgress };

            const prevCompleted = new Set(prev.completedAlphabetLessons ?? []);
            prevCompleted.add(lessonId);
            const completedAlphabetLessons = Array.from(prevCompleted);

            const completedCount = completedAlphabetLessons.length;
            const allLessonsDone = completedCount >= totalLessons;

            // 进度：
            // - 完成 lesson1-4 视为 0.8
            // - 完成 lesson1-6 视为 0.9（核心字母全部完成）
            // - 完成全部 7 课视为 1.0（含罕用/古体字母）
            let nextLetterProgress = prev.letterProgress;
            if (completedCount >= 4 && nextLetterProgress < 0.8) {
                nextLetterProgress = 0.8;
            }
            if (completedCount >= coreLessons && nextLetterProgress < 0.9) {
                nextLetterProgress = 0.9;
            }
            if (completedCount >= totalLessons && nextLetterProgress < 1) {
                nextLetterProgress = 1;
            }

            // 完成前 6 课即视为核心字母学习完成，
            // lesson7 作为补充课程不影响其他模块解锁
            const coreLessonsDone = completedCount >= coreLessons;
            const nextLetterCompleted =
                prev.letterCompleted || coreLessonsDone;

            const updated: UserProgress = {
                ...prev,
                completedAlphabetLessons,
                letterCompleted: nextLetterCompleted,
                letterProgress: nextLetterProgress,
            };

            // 🔥 Persist to AsyncStorage (Fire and forget)
            const storageKey = getCompletedLessonsStorageKey(userId);
            AsyncStorage.setItem(storageKey, JSON.stringify(completedAlphabetLessons)).catch(err => {
                console.error('❌ Failed to persist completed alphabet lessons:', err);
            });

            return {
                userProgress: updated,
                accessCache: allLessonsDone
                    ? new Map<ModuleType, boolean>()
                    : state.accessCache,
            };
        });

        console.log(`✅ 字母课程已完成: ${lessonId}`);
    },
}));
````

## File: src/stores/alphabetStore.ts
````typescript
// src/stores/alphabetStore.ts

/**
 * 字母学习 Store（V9 版本）
 *
 * 职责：
 * - 通过 memory-engine（/memory-engine 云函数）获取今日字母队列
 * - 维护前端会话状态（当前字母、完成数量等）
 * - 接收「对 / 错」结果，自动映射为 记得/陌生 并调用 submitMemoryResult
 *
 * 注意：
 * - 不再依赖本地 letterData.ts，所有字母数据来自后端 Letter 文档
 * - 新字母学习（课程）负责把字母塞进记忆引擎；复习队列完全交给 getTodayMemories
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// 使用 expo-file-system 的 legacy API，避免 v54 新 File API
// 抛出的 getInfoAsync 等方法废弃错误。
import * as FileSystem from 'expo-file-system/legacy';

import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS, MODULE_ENDPOINTS } from '@/src/config/api.endpoints';

import type { Letter } from '@/src/entities/types/letter.types';
import { buildAlphabetQueue } from '@/src/utils/alphabet/buildAlphabetQueue';
import type { ApiResponse } from '@/src/entities/types/api.types';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import {
  QualityButton,
  QUALITY_SCORE_MAP,
  ATTEMPTS_INCREMENT_MAP,
} from '@/src/entities/enums/QualityScore.enum';


// ==================== 后端记忆状态 ====================

export interface MemoryStatus {
  masteryLevel: number;
  repetition: number;
  correctCount: number;
  wrongCount: number;
  streakCorrect: number;
  nextReviewDate: number;
  isNew: boolean;
}

// ==================== 会话中的字母状态 ====================

export type AlphabetLearningMode = 'learning' | 'free-play';

export interface AlphabetLearningState {
  // 基础
  alphabetId: string;
  _id: string; // Letter 的 _id，用于题目生成
  letter: Letter;
  thaiChar: string;
  pronunciation: string;
  example: string;
  audioUrl: string;
  category: string;

  // 发音相关字段（用于题目生成）
  syllableSoundName?: string; // 音节发音名称（如: "d"）
  initialSound?: string; // 首音（如: "d"）
  syllableSoundUrl?: string; // 音节发音URL
  letterPronunciationUrl?: string; // 字母发音URL
  audioPath?: string; // 旧版音频路径

  // 会话进度
  currentAttempts: number;
  requiredAttempts: number;
  qualityHistory: number[];
  isCompleted: boolean;
  timestamp: string;

  // 后端记忆信息（只读）
  memoryState?: MemoryStatus;
}

// ==================== 队列项（前端构建） ====================

// 🔥 TODO-03: 统一 source 命名，与 ALPHABET_MODULE_IMPLEMENTATION_SKELETON.md 对齐
export type AlphabetQueueSource =
  | 'previous-review'      // 之前轮次的复习
  | 'new-learning'         // 新字母学习
  | 'mini-review'          // 迷你复习（每3个字母）
  | 'final-review'         // 最终复习
  | 'error-review';        // 错题复习

export interface AlphabetQueueItem extends AlphabetLearningState {
  source: AlphabetQueueSource;
  round: number;
}

// ==================== 后端返回结构 ====================

import type {
  LessonMetadata,
  PhonicsRule,
} from '@/src/entities/types/phonicsRule.types';

interface TodayLettersResponse {
  items: Array<Letter & { memoryState?: MemoryStatus }>;
  summary: {
    total: number;
    newCount: number;
    reviewCount: number;
    entityType: string;
  };
  unlockInfo?: Record<string, any>;
  lessonMetadata?: LessonMetadata | null;
  phonicsRule?: PhonicsRule | null;
}

// ==================== Store 状态定义 ====================

interface AlphabetStoreState {
  phase: LearningPhase;

  queue: AlphabetQueueItem[];
  currentIndex: number;
  currentItem: AlphabetQueueItem | null;

  completedCount: number;
  totalCount: number;

  isLoading: boolean;
  error: string | null;

  // 已缓存的音频 URL（用于避免重复预下载）
  cachedAudioKeys: string[];

  // 当前课程元数据 / 拼读规则（由后端返回）
  lessonMetadata: LessonMetadata | null;
  phonicsRule: PhonicsRule | null;

  // 🔥 Bug 2 修复：添加 currentRound 字段
  currentRound: 1 | 2 | 3;

  // Actions
  initializeSession: (
    userId: string,
    options?: {
      limit?: number;
      lessonId?: string;
      round?: number;
    }
  ) => Promise<void>;
  /**
   * 前端组件只告诉我这题「对/错」
   * 这里自动映射为 QualityButton 并调用 submitMemoryResult
   */
  submitResult: (userId: string, isCorrect: boolean) => Promise<void>;
  submitRoundEvaluation: (params: {
    userId: string;
    lessonId: string;
    roundNumber: number;
    totalQuestions: number;
    correctCount: number;
    accuracy: number;
  }) => Promise<void>;

  next: () => void;
  appendQueue: (items: AlphabetQueueItem[]) => void;
  previous: () => void;
  // 🔥 Bug 3 修复：添加 setCurrentIndex 方法
  setCurrentIndex: (index: number) => void;
  // 🔥 Bug 2 修复：添加 setCurrentRound 方法
  setCurrentRound: (round: 1 | 2 | 3) => void;

  reset: () => void;
  clearError: () => void;
}

// ==================== 音频 URL 解析 ====================


// ==================== 辅助：Letter → AlphabetLearningState ====================

function mapLetterToState(
  letter: Letter,
  memoryState?: MemoryStatus
): AlphabetLearningState {
  const pronunciation =
    letter.letterNamePronunciation ||
    letter.syllableSoundName ||
    letter.initialSound ||
    '';

  const example =
    letter.exampleWord && letter.exampleMeaning
      ? `${letter.exampleWord}（${letter.exampleMeaning}）`
      : letter.exampleWord || '';

  const rawAudioKey =
    letter.fullSoundLocalPath ||
    letter.fullSoundUrl ||
    letter.letterPronunciationLocalPath ||
    letter.letterPronunciationUrl ||
    letter.syllableSoundLocalPath ||
    letter.syllableSoundUrl ||
    letter.audioPath ||
    '';

  // 为满足「播放只从本地读取」的目标，audioUrl 仅在预下载阶段被设置为 file:// 路径。
  // 这里如果已经有本地路径（*_LocalPath），就使用；否则先置空，等待预下载任务填充。
  const initialAudioUrl =
    (rawAudioKey.startsWith('file://') ? rawAudioKey : '');

  return {
    alphabetId: letter._id,
    _id: letter._id,
    letter,
    thaiChar: letter.thaiChar,
    pronunciation,
    example,
    audioUrl: initialAudioUrl,
    category: letter.category,

    // 发音相关字段
    syllableSoundName: letter.syllableSoundName,
    initialSound: letter.initialSound,
    syllableSoundUrl: letter.syllableSoundUrl,
    letterPronunciationUrl: letter.letterPronunciationUrl,
    audioPath: letter.audioPath,

    currentAttempts: 0,
    requiredAttempts: 3,
    qualityHistory: [],
    isCompleted: false,
    timestamp: new Date().toISOString(),

    memoryState,
  };
}

// ==================== Store 实现 ====================

export const useAlphabetStore = create<AlphabetStoreState>()(
  persist(
    (set, get) => ({
      phase: LearningPhase.IDLE,
      queue: [],
      currentIndex: 0,
      currentItem: null,
      completedCount: 0,
      totalCount: 0,
      isLoading: false,
      error: null,
      cachedAudioKeys: [],
      lessonMetadata: null,
      phonicsRule: null,
      // 🔥 Bug 2 修复：添加初始值
      currentRound: 1,

      // 获取今日字母学习/复习队列
      initializeSession: async (
        userId: string,
        options?: { limit?: number; lessonId?: string; round?: number }
      ) => {
        set({ isLoading: true, error: null });

        const limit = options?.limit ?? 30;
        const lessonId = options?.lessonId;

        // 🔥 从后端读取当前轮次（如果未显式传入）
        let round = options?.round ?? 1;
        let mode: AlphabetLearningMode = 'learning';

        try {
          // 读取 user_alphabet_progress，统一判定 currentRound 与 mode
          const progressCol = await callCloudFunction<any>(
            'getUserProgress',
            { userId, entityType: 'letter' },
            { endpoint: MODULE_ENDPOINTS.GET_USER_PROGRESS.cloudbase }
          );

          if (progressCol.success && progressCol.data?.progress) {
            const progress = progressCol.data.progress;

            // 🔥 P0-A: lesson-scoped round 推导（不再使用全局 currentRound）
            if (!options?.round && lessonId) {
              const roundHistory = progress.roundHistory || [];

              // 过滤出当前课程且 passed 的 round 记录
              const lessonHistoryRounds = roundHistory
                .filter((r: any) => r.lessonId === lessonId && r.passed === true)
                .map((r: any) => r.roundNumber);

              const lastPassedRound = lessonHistoryRounds.length > 0
                ? Math.max(...lessonHistoryRounds)
                : 0;

              const computedRound = Math.min(Math.max(lastPassedRound + 1, 1), 3);
              round = computedRound;

              console.log(`🔍 [P0-A] lessonId: ${lessonId}, backendCurrentRound: ${progress.currentRound || 'N/A'}, computedRound: ${computedRound}, lessonHistoryRounds: [${lessonHistoryRounds.join(',')}]`);
            }

            mode = progress.letterCompleted ? 'free-play' : 'learning';
            console.log(`✅ AlphabetLearningMode: ${mode}`);
          } else {
            console.log('⚠️ 未获取到 progress，默认使用 learning 模式');
          }
        } catch (e) {
          console.warn('⚠️ 读取 user_alphabet_progress 失败，使用默认值:', e);
        }

        try {
          const response = await callCloudFunction<TodayLettersResponse>(
            'getTodayMemories',
            {
              userId,
              entityType: 'letter',
              limit,
              includeNew: true,
              lessonId,
              roundNumber: round, // 🔥 传递 roundNumber
            },
            {
              endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase,
            }
          );

          if (!response.success || !response.data) {
            throw new Error(response.error ?? '获取今日字母失败');
          }

          const { items, lessonMetadata, phonicsRule } = response.data;

          if (!items || items.length === 0) {
            set({
              phase: LearningPhase.COMPLETED,
              queue: [],
              currentItem: null,
              currentIndex: 0,
              completedCount: 0,
              totalCount: 0,
              isLoading: false,
              lessonMetadata: lessonMetadata ?? null,
              phonicsRule: phonicsRule ?? null,
            });
            return;
          }

          const learningItems = items.map((item) =>
            mapLetterToState(item, item.memoryState)
          );

          // 🔥 P0-D: 按 lessonId 切分（不依赖 isNew）
          // 确保四段结构永远存在，且符合产品规则
          const currentLessonLetters = learningItems.filter(
            (item) => lessonId && item.letter.curriculumLessonIds?.includes(lessonId)
          );

          const nonCurrentLessonLetters = learningItems.filter(
            (item) => lessonId && !item.letter.curriculumLessonIds?.includes(lessonId)
          );

          let reviewLetters: AlphabetLearningState[];
          let newLetters: AlphabetLearningState[];

          if (round === 1) {
            // Round1: previous = 非本课字母（跨课），new = 本课字母
            reviewLetters = nonCurrentLessonLetters;
            newLetters = currentLessonLetters;
          } else {
            // Round2/3: previous = 本课字母（同课复习），new = 本课字母（保证 new-learning/mini/final 存在）
            reviewLetters = currentLessonLetters;
            newLetters = currentLessonLetters;
          }

          const queue = buildAlphabetQueue({
            lessonLetters: newLetters,           // 🔥 保证 new-learning/mini/final 永远有内容
            round,
            mode,
            previousRoundLetters: reviewLetters, // 🔥 Round1=跨课，Round2/3=本课
          });

          // 🔥 开发环境日志 + 四段结构验证（在构建后统计）
          if (__DEV__) {
            const sourceCounts = queue.reduce((acc, item) => {
              acc[item.source] = (acc[item.source] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            console.log('📊 [buildQueue] 队列分析:', {
              round,
              mode,
              lessonId,
              total: learningItems.length,
              currentLessonCount: currentLessonLetters.length,
              nonCurrentLessonCount: nonCurrentLessonLetters.length,
              reviewCount: reviewLetters.length,
              newCount: newLetters.length,
              queueTotal: queue.length,
              sourceCounts,  // 🔥 四段统计 {'previous-review': 5, 'new-learning': 12, ...}
              reviewIds: reviewLetters.map(l => l.thaiChar).slice(0, 5),
              newIds: newLetters.map(l => l.thaiChar).slice(0, 5),
            });
          }

          // 🐛 P0-3 DEBUG: 检查后端返回的队列是否包含三新一复逻辑
          console.log('=== 后端返回的队列分析 ===');
          console.log('总字母数:', queue.length);
          console.log(
            'todayQueue:',
            queue.map((item, index) => ({
              index,
              letterId: item.alphabetId,
              thaiChar: item.thaiChar,
              isNew: item.memoryState?.isNew ?? null,
              repetition: item.memoryState?.repetition ?? null,
              source: item.source,
              round: item.round,
            }))
          );

          // 统计新字母和复习字母的分布
          // 🔥 TODO-03: 统一使用 'new-learning'
          const newLettersInQueue = queue.filter((item) => item.source === 'new-learning');
          const reviewLettersInQueue = queue.filter((item) => item.source !== 'new-learning');
          console.log('新字母数量:', newLettersInQueue.length);
          console.log('复习字母数量:', reviewLettersInQueue.length);

          set({
            phase: LearningPhase.IDLE,
            queue,
            currentItem: queue[0],
            currentIndex: 0,
            completedCount: 0,
            totalCount: queue.length,
            currentRound: round as 1 | 2 | 3, // 🔥 Bug 2 修复：保存 currentRound
            isLoading: false,
            lessonMetadata: lessonMetadata ?? null,
            phonicsRule: phonicsRule ?? null,
          });

          // 预下载本课所有字母音频到本地文件系统（首次进入该课时）
          (async () => {
            try {
              const cacheDir = `${
                // expo-file-system 在类型定义里没有暴露 cacheDirectory，
                // 这里通过 any 访问以避免 TS 报错。
                (FileSystem as any).cacheDirectory ??
                (FileSystem as any).documentDirectory ??
                ''
                }alphabet-audio/`;
              const dirInfo = await FileSystem.getInfoAsync(cacheDir);
              if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(cacheDir, {
                  intermediates: true,
                });
              }

              const updatedQueue = [...queue];
              const urlToLocalPath = new Map<string, string>();

              const toHttpUrl = (path?: string | null): string => {
                if (!path) return '';
                if (path.startsWith('http://') || path.startsWith('https://')) {
                  return path;
                }
                let finalPath = path;
                if (!/\.mp3($|\?)/.test(finalPath)) {
                  finalPath = `${finalPath}.mp3`;
                }
                return `https://636c-cloud1-1gjcyrdd7ab927c6-1387301748.tcb.qcloud.la/alphabet/${finalPath}`;
              };

              // eslint-disable-next-line no-console
              console.log(
                '🎧 开始预下载本课字母音频, 队列长度:',
                updatedQueue.length,
              );

              for (let index = 0; index < updatedQueue.length; index += 1) {
                const current = updatedQueue[index];
                const letter = { ...current.letter };

                const fieldEntries: Array<{
                  key: 'full' | 'syllable' | 'end' | 'letter';
                  raw?: string;
                }> = [
                    { key: 'full', raw: letter.fullSoundUrl },
                    { key: 'syllable', raw: letter.syllableSoundUrl },
                    { key: 'end', raw: letter.endSyllableSoundUrl },
                    { key: 'letter', raw: letter.letterPronunciationUrl },
                  ];

                for (const entry of fieldEntries) {
                  if (!entry.raw) continue;
                  const httpUrl = toHttpUrl(entry.raw);
                  if (!httpUrl) continue;

                  let localPath = urlToLocalPath.get(httpUrl);
                  if (!localPath) {
                    const fileName = encodeURIComponent(httpUrl);
                    localPath = `${cacheDir}${fileName}`;

                    let success = false;
                    for (
                      let attempt = 0;
                      attempt < 3 && !success;
                      attempt += 1
                    ) {
                      try {
                        const info = await FileSystem.getInfoAsync(localPath);
                        if (!info.exists) {
                          // eslint-disable-next-line no-console
                          console.log(
                            `📥 下载音频(第 ${attempt + 1} 次):`
                          );
                          await FileSystem.downloadAsync(httpUrl, localPath);
                        }
                        success = true;
                      } catch (err) {
                        console.warn(
                          `⚠️ 下载字母音频失败(第 ${attempt + 1} 次):`,
                          httpUrl,
                          err,
                        );
                        await new Promise((resolve) =>
                          setTimeout(resolve, 500 * (attempt + 1)),
                        );
                      }
                    }

                    if (!success) {
                      // eslint-disable-next-line no-console
                      console.warn('❌ 多次下载失败,放弃该音频:', httpUrl);
                      continue;
                    }

                    urlToLocalPath.set(httpUrl, localPath);
                  }

                  if (entry.key === 'full') {
                    letter.fullSoundLocalPath = localPath;
                  } else if (entry.key === 'syllable') {
                    letter.syllableSoundLocalPath = localPath;
                  } else if (entry.key === 'end') {
                    letter.endSyllableSoundLocalPath = localPath;
                  } else if (entry.key === 'letter') {
                    letter.letterPronunciationLocalPath = localPath;
                  }
                }

                const primaryAudio =
                  letter.fullSoundLocalPath ||
                  letter.letterPronunciationLocalPath ||
                  letter.syllableSoundLocalPath ||
                  letter.endSyllableSoundLocalPath ||
                  current.audioUrl;

                updatedQueue[index] = {
                  ...current,
                  letter,
                  audioUrl: primaryAudio && primaryAudio.startsWith('file://')
                    ? primaryAudio
                    : primaryAudio,
                };
              }

              set((state) => {
                const { currentIndex } = state;
                const currentItem = updatedQueue[currentIndex] ?? state.currentItem;

                // 调试：当前项在预下载后的音频情况
                if (currentItem) {
                  // eslint-disable-next-line no-console
                  console.log('🎯 预下载后当前字母状态:', {
                    id: currentItem.letter._id,
                    thaiChar: currentItem.letter.thaiChar,
                  });
                }

                return {
                  queue: updatedQueue,
                  currentItem,
                };
              });
              // eslint-disable-next-line no-console
              console.log('🎧 预下载全部完成, 队列更新成功');
            } catch (err) {
              console.warn('⚠️ 预下载字母音频任务失败:', err);
            }
          })();
        } catch (e: any) {
          console.error('❌ initializeSession error:', e);
          set({
            isLoading: false,
            error: e?.message ?? '加载失败',
          });
        }
      },

      // 复习提交：只更新本地会话状态，记忆写入由 round 完成时统一处理
      submitResult: async (userId: string, isCorrect: boolean) => {
        const { currentItem, currentIndex, queue } = get();
        if (!currentItem) return;

        // 自动映射为质量枚举
        const quality: QualityButton = isCorrect
          ? QualityButton.KNOW
          : QualityButton.FORGET;

        try {
          const updatedQueue = [...queue];
          const item = updatedQueue[currentIndex];

          if (item) {
            item.currentAttempts += ATTEMPTS_INCREMENT_MAP[quality];
            item.qualityHistory.push(QUALITY_SCORE_MAP[quality]);

            if (item.currentAttempts >= item.requiredAttempts) {
              item.isCompleted = true;
            }

            item.timestamp = new Date().toISOString();
          }

          const completedCount = updatedQueue.filter(
            (it) => it.isCompleted
          ).length;

          set({
            queue: updatedQueue,
            completedCount,
          });

        } catch (e: any) {
          console.error('❌ submitResult error:', e);
          set({
            error: e?.message ?? '提交失败',
          });
        }
      },

      // 提交字母模块三轮评估结果（仅记录统计信息，不影响记忆算法）
      submitRoundEvaluation: async ({
        userId,
        lessonId,
        roundNumber,
        totalQuestions,
        correctCount,
        accuracy,
      }) => {
        try {
          await callCloudFunction(
            'submitRoundEvaluation',
            {
              userId,
              entityType: 'letter',
              lessonId,
              roundNumber,
              totalQuestions,
              correctCount,
              accuracy,
            },
            {
              endpoint: API_ENDPOINTS.MEMORY.SUBMIT_ROUND_EVALUATION.cloudbase,
            },
          );
        } catch (e: any) {
          console.error('❌ submitRoundEvaluation error:', e);
          // 不影响前端流程，出错时只记录日志
        }
      },

      // 下一个字母
      next: () => {
        const { currentIndex, queue } = get();
        const nextIndex = currentIndex + 1;

        if (nextIndex < queue.length) {
          set({
            currentIndex: nextIndex,
            currentItem: queue[nextIndex],
          });
        } else {
          set({
            phase: LearningPhase.COMPLETED,
            currentItem: null,
          });
        }
      },

      // 追加队列（用于错题回顾等动态插入）
      appendQueue: (items: AlphabetQueueItem[]) => {
        const { queue, currentIndex } = get();
        const newQueue = [...queue, ...items];
        set({
          queue: newQueue,
          totalCount: newQueue.length,
          currentItem: newQueue[currentIndex] ?? null,
        });
      },

      // 上一个字母（主要用于调试或某些 UI）
      previous: () => {
        const { currentIndex, queue } = get();
        const prevIndex = Math.max(0, currentIndex - 1);

        set({
          currentIndex: prevIndex,
          currentItem: queue[prevIndex] ?? null,
        });
      },

      // 🔥 Bug 3 修复：设置队列位置
      setCurrentIndex: (index: number) => {
        const { queue } = get();
        set({
          currentIndex: index,
          currentItem: queue[index] ?? null,
        });
      },

      // 🔥 Bug 2 修复：设置当前轮次
      setCurrentRound: (round: 1 | 2 | 3) => {
        set({ currentRound: round });
      },

      // 重置（例如切换用户）
      reset: () =>
        set({
          phase: LearningPhase.IDLE,
          queue: [],
          currentIndex: 0,
          currentItem: null,
          completedCount: 0,
          totalCount: 0,
          isLoading: false,
          error: null,
          cachedAudioKeys: [],
        }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'alphabet-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // 只持久化统计数据，队列保持会话级别
      partialize: (state) => ({
        completedCount: state.completedCount,
        totalCount: state.totalCount,
        cachedAudioKeys: state.cachedAudioKeys,
      }),
    }
  )
);

// ==================== 一些便捷 Hooks ====================

export const useAlphabetProgress = () => {
  const { completedCount, totalCount } = useAlphabetStore();
  if (!totalCount) return 0;
  return (completedCount / totalCount) * 100;
};

export const useCurrentAlphabet = () =>
  useAlphabetStore((s) => s.currentItem);

export const useAlphabetPhase = () => useAlphabetStore((s) => s.phase);
````

## File: app/(tabs)/courses.tsx
````typescript
// app/(tabs)/courses.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TextInput, ImageSourcePropType, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, BookOpen, Type, Grid } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { useTranslation } from 'react-i18next';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { CourseSelectionModal } from '@/src/components/courses/CourseSelectionModal';
import coursesData from '@/assets/courses/courses.json';
import alphabetCourses from '@/assets/courses/alphabetCourses.json';
import { CourseCard, type CourseCardData } from '@/src/components/courses/CourseCard';
import { AlphabetCourseCard } from '@/src/components/courses/AlphabetCourseCard';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useModuleAccessStore, type ModuleType } from '@/src/stores/moduleAccessStore';

const CATEGORIES = [
  { id: 'all', label: 'common.all', icon: Grid },
  { id: 'letter', label: 'modules.alphabet', icon: Type },
  { id: 'word', label: 'modules.word', icon: BookOpen },
];

type CourseItem = {
  id: string;
  source: string;
  title: string;
  description: string;
  level: string;
  image: string;
  category: string;
  lessons: number;
};

type CourseWithImage = CourseItem & {
  imageSource: ImageSourcePropType;
};

const COURSE_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  'ThaiBase_1.png': require('@/assets/images/courses/ThaiBase_1.png'),
  'ThaiBase_2.png': require('@/assets/images/courses/ThaiBase_2.png'),
  'ThaiBase_3.png': require('@/assets/images/courses/ThaiBase_3.png'),
  'ThaiBase_4.png': require('@/assets/images/courses/ThaiBase_4.png'),
  'thai_alphabet.png': require('@/assets/images/courses/thai_alphabet.png'),
  default: require('@/assets/images/courses/ThaiBase_1.png'),
};

// 包含字母课程和单词课程
const COURSES: CourseWithImage[] = (
  [
    ...(alphabetCourses as CourseItem[]),
    ...(coursesData as CourseItem[]),
  ]
).map((course) => ({
  ...course,
  imageSource: COURSE_IMAGE_MAP[course.image] || COURSE_IMAGE_MAP.default,
}));

export default function CoursesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentCourseSource, startCourse } = useVocabularyStore();
  const { userProgress, getUserProgress, checkAccess, accessCache } = useModuleAccessStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<CourseWithImage | null>(null);
  const didDevAccessCheckRef = useRef(false);

  useEffect(() => {
    //页面一加载，如果发现没有 userProgress，就赶紧去后端拉取。这是为了让课程卡片能显示 "12/50" 这样的进度条。
    if (!userProgress) {
      getUserProgress().catch((err) => console.warn('Failed to fetch user progress', err));
    }
  }, [userProgress, getUserProgress]);

  useEffect(() => {
    //这是一个只在开发模式 (__DEV__) 跑的逻辑。它会遍历所有模块自动检查一遍权限。这是为了方便开发者调试解锁逻辑，生产环境不会运行。
    if (!__DEV__) return;
    if (didDevAccessCheckRef.current) return;
    didDevAccessCheckRef.current = true;

    const uniqueModules = Array.from(new Set(COURSES.map(getModuleType)))
      .filter((moduleType) => moduleType !== 'letter');

    uniqueModules.forEach((moduleType) => {
      checkAccess(moduleType).catch((error) => {
        console.warn('⚠️ Dev module access check failed:', moduleType, error);
      });
    });
  }, [checkAccess]);

  const getModuleType = (course: CourseWithImage): ModuleType => {
    switch (course.category) {
      case 'letter':
        return 'letter';
      case 'sentence':
        return 'sentence';
      case 'article':
        return 'article';
      default:
        return 'word';
    }
  };

  const getCourseProgress = (course: CourseWithImage) => {
    // 🔒 暂屏蔽：字母/单词进度条显示不正确，待后端数据修正后再启用
    return undefined;
  };

  // ⭐ 过滤课程
  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
      const translatedTitle = t(course.title);
      const translatedDescription = t(course.description);
      const matchesSearch =
        translatedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        translatedDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, t]);



  // ⭐ 统一的 Start Learning 逻辑：接收 course，返回一个点击 handler
  /**
   * 说明：当用户点击课程卡片时触发
   * 逻辑流:
   * 1. 查锁: 先看这个课是不是锁住的 (isLocked)。如果锁了，直接拦截。
   * 2. 判重: 检查用户点的是不是当前正在学的课。
   *   - 是当前课: 直接跳转。但在跳转前，会检查 needsDailySetup。如果没设过每日计划，先跳到 setup 页；否则直接跳 learning 页。(注意：这里就是刚才那个 Bug 发生的地方，传参传错了)
   *   - 是新课: 不直接跳，而是唤起弹窗 (setModalVisible(true))，问用户“确定要切换课程吗？”。
   * @param course 
   * @returns 
   */
  const handleStartLearning = (course: CourseWithImage) => {
    return () => {
      // ⭐ 1. 查锁
      const moduleType = getModuleType(course);
      // 🔒 Double Check: UI Should be disabled, but logic must be safe
      const { checkAccessLocally, accessCache: cachedAccess } = useModuleAccessStore.getState();
      const devOverrideUnlocked = __DEV__ && cachedAccess.get(moduleType) === true;
      const isLocked = moduleType !== 'letter' && !devOverrideUnlocked && !checkAccessLocally(moduleType);
      if (isLocked) {
        console.warn('Course locked, double-check start prevented');
        return;
      }

      // ⭐ 2. 判重
      // ⭐ 3. 同一个课程：直接跳转
      if (currentCourseSource === course.source) {
        if (moduleType === 'letter') {
          router.push('/alphabet');
        } else {
          router.push({
            pathname: '/learning',
            params: {
              module: moduleType,
              source: course.source,
            },
          });
        }
        return;
      }

      // ⭐ 4. 是新课，切换课程：弹确认框
      setPendingCourse(course);
      setModalVisible(true);
    };
  };

  const confirmSwitchCourse = async () => {
    if (pendingCourse) {
      // ✅ 切换课程：直接跳转，让 learning 页面负责初始化
      const moduleType = getModuleType(pendingCourse);

      setModalVisible(false);
      setPendingCourse(null);

      // Notify store about course switch (even for letters to show golden box)


      // Special routing for Alphabet
      if (moduleType === 'letter') {
        router.push('/alphabet');
        startCourse(pendingCourse.source, 200, 'letter');
      } else {
        router.push({
          pathname: '/learning',
          params: {
            module: moduleType,
            source: pendingCourse.source,
          },
        });
      }
    }
  };

  // Clean up unused proceedToCourse if no longer needed, or redefine it as above. 
  // But strictly following the plan to modify handleStartLearning first.
  // Actually, confirmSwitchCourse calls proceedToCourse. Let's make confirmSwitchCourse do the work directly 
  // or update proceedToCourse.
  // Let's remove proceedToCourse and inline the logic into confirmSwitchCourse for simplicity as per "pure navigator" goal.



  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ThaiPatternBackground opacity={0.12} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('courses.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('courses.subtitle')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.taupe} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('courses.searchPlaceholder')}
            placeholderTextColor={Colors.taupe}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <Pressable
                key={cat.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Icon size={14} color={isActive ? Colors.white : Colors.taupe} />
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {t(cat.label)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 所有课程（包括AlphabetCourseCard和单词课程） */}
        {filteredCourses.map((course) => {
          const isCurrent = currentCourseSource === course.source;
          const moduleType = getModuleType(course);
          const progress = getCourseProgress(course);

          // 🔒 Calculation: Alphabet always unlocked, others check store
          const { checkAccessLocally, accessCache: cachedAccess } = useModuleAccessStore.getState();
          const devOverrideUnlocked = __DEV__ && cachedAccess.get(moduleType) === true;
          const isLocked = moduleType !== 'letter' && !devOverrideUnlocked && !checkAccessLocally(moduleType);

          // 字母课程：使用 AlphabetCourseCard，直接进入 /alphabet 流程
          if (course.category === 'letter') {
            return (
              <AlphabetCourseCard
                key={course.id}
                course={course}
                isCurrent={isCurrent}
                progress={progress}
                onStart={handleStartLearning(course)} // Connected handleStartLearning
              />
            );
          }

          // 单词课程：使用标准 CourseCard
          return (
            <CourseCard
              key={course.id}
              course={course as CourseCardData}
              isCurrent={isCurrent}
              progress={progress}
              onStart={handleStartLearning(course)}
              isLocked={isLocked} // Pass locked state
            />
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      <CourseSelectionModal
        visible={modalVisible}
        courseTitle={pendingCourse ? t(pendingCourse.title) : ''}
        onConfirm={confirmSwitchCourse}
        onCancel={() => {
          setModalVisible(false);
          setPendingCourse(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: Typography.playfairBold,
    fontSize: 28,
    color: Colors.ink,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.ink,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryContent: {
    paddingHorizontal: 24,
    gap: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.sand,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.thaiGold,
    borderColor: Colors.thaiGold,
  },
  categoryText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.taupe,
  },
  categoryTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
  },
});
````

## File: app/(tabs)/index.tsx
````typescript
// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Play, TrendingUp, Clock, Award, AlertCircle, Wrench, BookOpen } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
// import { FloatingBubbles } from '@/src/components/common/FloatingBubbles';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { ReviewItem } from '@/src/entities/types/entities';
import { useUserStore } from '@/src/stores/userStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useTodayStudyTime } from '@/src/hooks/useTodayStudyTime';
import { CourseSelectionModal } from '@/src/components/courses/CourseSelectionModal';
import coursesData from '@/assets/courses/courses.json';
import alphabetCourses from '@/assets/courses/alphabetCourses.json';
import type { ModuleType } from '@/src/stores/moduleAccessStore';
import type { ImageSourcePropType } from 'react-native';
// === AI Dictionary Imports ===
import { TextInput, ActivityIndicator, Modal } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { AiService } from '@/src/services/aiService';
import { AiExplanationView } from '@/src/components/ai/AiExplanationView';
import type { ExplainVocabularyResponse } from '@/src/entities/types/ai.types';
import { Vocabulary } from '@/src/entities/types/vocabulary.types';
import i18n from '@/src/i18n';

const MOCK_REVIEWS: ReviewItem[] = [
  { id: '1', char: 'ข', phonetic: 'Khor Khai', type: 'Review', dueIn: 'Today' },
  { id: '2', char: 'ค', phonetic: 'Khor Khwai', type: 'Hard', dueIn: 'Today' },
  { id: '3', char: 'ง', phonetic: 'Ngor Ngu', type: 'New', dueIn: 'Today' },
  { id: '4', char: 'จ', phonetic: 'Jor Jan', type: 'Review', dueIn: 'Today' },
];

type CourseItem = {
  id: string;
  source: string;
  title: string;
  description: string;
  level: string;
  image: string;
  category: string;
  lessons: number;
};

type CourseWithImage = CourseItem & { imageSource: ImageSourcePropType };

const COURSE_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  'ThaiBase_1.png': require('@/assets/images/courses/ThaiBase_1.png'),
  'ThaiBase_2.png': require('@/assets/images/courses/ThaiBase_2.png'),
  'ThaiBase_3.png': require('@/assets/images/courses/ThaiBase_3.png'),
  'ThaiBase_4.png': require('@/assets/images/courses/ThaiBase_4.png'),
  'thai_alphabet.png': require('@/assets/images/courses/thai_alphabet.png'),
  default: require('@/assets/images/courses/ThaiBase_1.png'),
};

const COURSES: CourseWithImage[] = [
  ...(alphabetCourses as CourseItem[]),
  ...(coursesData as CourseItem[]),
].map((c) => ({ ...c, imageSource: COURSE_IMAGE_MAP[c.image] || COURSE_IMAGE_MAP.default }));

function getModuleType(course: CourseWithImage): ModuleType {
  switch (course.category) {
    case 'letter': return 'letter';
    case 'sentence': return 'sentence';
    case 'article': return 'article';
    default: return 'word';
  }
}

export default function HomeScreen({ vocabulary }: { vocabulary: Vocabulary }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const router = useRouter();

  // Stores
  const { currentUser } = useUserStore();
  const { currentCourseSource, startCourse } = useVocabularyStore();
  const recentWrongWords = useVocabularyStore(s => s.recentWrongWords);
  const { streakDays, checkIn, hasCheckedInToday } = useLearningPreferenceStore();
  const { value: studyTimeValue, unit: studyTimeUnit } = useTodayStudyTime();

  // 英雄卡：切换课程确认弹窗
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingCourse, setPendingCourse] = useState<CourseWithImage | null>(null);
  
  //=========================================================================
  // === AI Dictionary State ===
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<ExplainVocabularyResponse | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // === AI Dictionary Action ===
  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    setShowAiModal(true); // Open modal early to show loading state
    
    // 将当前 UI 语言一并传给 AI，让它用对应语言回应
    const response = await AiService.explainVocabulary(searchQuery.trim(), currentUser?.userId || 'guest', i18n.language);
    
    setIsSearching(false);

    if (!response.success || !response.data) {
      setSearchError(response.error || t('home.aiError'));
      return;
    }

    // Now we can set the much cleaner response directly!
    setAiResult(response.data);
  };

  const closeAiModal = () => {
    setShowAiModal(false);
    setAiResult(null);
    setSearchError(null);
    setSearchQuery('');
  };
  //=========================================================================

  useEffect(() => {
    setTimeout(() => setReviews(MOCK_REVIEWS), 800);
  }, []);

  const handleBubbleClick = () => {
    router.push('/review-modal');
    setTimeout(() => setReviews([]), 500);
  };

  // 英雄卡：根据 currentCourseSource 获取当前课程，无则默认第一个（字母课）
  const heroCourse = COURSES.find((c) => c.source === currentCourseSource) ?? COURSES[0];
  const isHeroCurrent = currentCourseSource === heroCourse.source;

  // 英雄卡：与 courses 页一致的 Start/Continue 逻辑
  const handleHeroStartLearning = (course: CourseWithImage) => {
    const moduleType = getModuleType(course);
    const { checkAccessLocally, accessCache: cachedAccess } = useModuleAccessStore.getState();
    const devOverrideUnlocked = __DEV__ && cachedAccess.get(moduleType) === true;
    const isLocked = moduleType !== 'letter' && !devOverrideUnlocked && !checkAccessLocally(moduleType);
    if (isLocked) return;

    // 当前课或尚未选课：直接跳转
    if (!currentCourseSource || currentCourseSource === course.source) {
      if (moduleType === 'letter') {
        router.push('/alphabet');
      } else {
        router.push({
          pathname: '/learning',
          params: { module: moduleType, source: course.source },
        });
      }
      return;
    }

    // 切换课程：弹确认框
    setPendingCourse(course);
    setModalVisible(true);
  };

  const confirmSwitchCourse = async () => {
    if (!pendingCourse) return;
    const moduleType = getModuleType(pendingCourse);
    setModalVisible(false);
    setPendingCourse(null);
    if (moduleType === 'letter') {
      router.push('/alphabet');
      startCourse(pendingCourse.source, 200, 'letter');
    } else {
      router.push({
        pathname: '/learning',
        params: { module: moduleType, source: pendingCourse.source },
      });
    }
  };

  const displayName = currentUser?.displayName || 'Student';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ThaiPatternBackground opacity={0.15} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

          <View style={styles.headerContent}>
            <View>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>ສະບາຍດີ, {displayName}</Text>
                <Text style={styles.greetingDot}>.</Text>
              </View>
            </View>

            <View style={styles.awardBadge}>
              {/* 右上角荣誉图标 */}
              <Award size={18} color={Colors.ink} />
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          
          {/* AI Dictionary Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Search size={20} color={Colors.taupe} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('home.typeThaiOrChinese') || "搜你遇见的纯正泰语..."}
                placeholderTextColor={Colors.taupe}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleAiSearch}
                returnKeyType="search"
                editable={!isSearching}
              />
              {searchQuery.length > 0 && !isSearching && (
                <Pressable onPress={() => setSearchQuery('')} style={styles.clearSearchButton}>
                  <X size={16} color={Colors.taupe} />
                </Pressable>
              )}
            </View>
          </View>
          {/* ========================================= */}

          {/* Floating Bubbles */}
          {/* <FloatingBubbles reviews={reviews} onOpenReview={handleBubbleClick} /> */}

          {/* Hero Progress Card：根据 currentCourseSource 显示课程，与 courses 页一致的 Start/Continue 逻辑 */}
          <View>
            {(() => {
              const moduleType = getModuleType(heroCourse);
              const { checkAccessLocally } = useModuleAccessStore.getState();
              const isHeroLocked = moduleType !== 'letter' && !checkAccessLocally(moduleType);

              return (
                <Pressable
                  style={[styles.heroCard, isHeroLocked && { opacity: 0.8, backgroundColor: '#333' }]}
                  disabled={isHeroLocked}
                  onPress={() => handleHeroStartLearning(heroCourse)}
                >
                  <View style={styles.heroContent}>
                    <View style={styles.heroTopRow}>
                      <View>
                        <Text style={styles.courseLabel}>{t('home.currentCourse')}</Text>
                        <Text style={styles.courseName}>
                          {t(heroCourse.title)} {isHeroLocked ? '(Locked)' : ''}
                        </Text>
                      </View>
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{t(heroCourse.level)}</Text>
                      </View>
                    </View>

                    <View style={styles.heroBottomRow}>
                      <View style={styles.heroTextContainer}>
                        {heroCourse.category !== 'letter' && (
                          <Text style={styles.heroProgressText}>
                            {heroCourse.lessons} {t('courses.lessons')}
                          </Text>
                        )}
                        <Text style={styles.translationText} numberOfLines={2}>
                          {t(heroCourse.description)}
                        </Text>
                      </View>

                      <View style={[styles.playButtonLarge, isHeroLocked && { backgroundColor: '#666' }]}>
                        <Play size={20} fill={isHeroLocked ? '#999' : Colors.ink} color={isHeroLocked ? '#999' : Colors.ink} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.heroGradient1} />
                  <View style={styles.heroGradient2} />
                </Pressable>
              );
            })()}
          </View>

          <CourseSelectionModal
            visible={modalVisible}
            courseTitle={pendingCourse ? t(pendingCourse.title) : ''}
            onConfirm={confirmSwitchCourse}
            onCancel={() => {
              setModalVisible(false);
              setPendingCourse(null);
            }}
          />

          {/* Reading Practice Entry */}
          <Pressable
            style={styles.readingPracticeButton}
            onPress={() => router.push('/learning/article-practice-list')}
          >
            <View style={styles.readingPracticeLeft}>
              <View style={styles.readingPracticeIcon}>
                <BookOpen size={18} color={Colors.thaiGold} />
              </View>
              <View>
                <Text style={styles.readingPracticeTitle}>{t('articlePractice.listTitle')}</Text>
                <Text style={styles.readingPracticeHint}>{t('articlePractice.tapWordHint')}</Text>
              </View>
            </View>
            <Play size={16} fill={Colors.taupe} color={Colors.taupe} />
          </Pressable>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <Pressable
              style={[styles.statCard, !hasCheckedInToday() && styles.statCardCheckedIn]}
              onPress={() => {
                if (hasCheckedInToday()) return;
                const success = checkIn();
                if (success) {
                  // 可选：轻触反馈
                }
              }}
              disabled={hasCheckedInToday()}
            >
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <TrendingUp size={20} color={!hasCheckedInToday() ? Colors.taupe : Colors.ink} />
                </View>
                <Text style={styles.statLabel}>
                  {hasCheckedInToday() ? t('home.checkInToday') : t('profile.streakDays')}
                </Text>
              </View>
              <Text style={styles.statValue}>{streakDays ?? 0}</Text>
              <Text style={styles.statUnit}>{t('home.streak')}</Text>
            </Pressable>

            <View style={styles.statCard}>
              <View style={styles.statTopRow}>
                <View style={styles.statIconContainer}>
                  <Clock size={20} color={Colors.ink} />
                </View>
                <Text style={styles.statLabel}>{t('profile.studyTime')}</Text>
              </View>
              <Text style={styles.statValue}>{studyTimeValue}</Text>
              <Text style={styles.statUnit}>{studyTimeUnit === 'hrs' ? t('home.hoursToday') : t('home.minutesToday')}</Text>
            </View>
          </View>

          {/* Recent Wrong Words */}
          <View style={styles.achievementsSection}>
            <View style={styles.achievementsHeader}>
              <AlertCircle size={16} color={Colors.thaiGold} />
              <Text style={styles.achievementsTitle}>{t('home.recentWrong')}</Text>
            </View>

            <View style={styles.achievementsList}>
              {recentWrongWords.length === 0 ? (
                <Text style={styles.emptyHint}>{t('home.noWrongWords')}</Text>
              ) : (
                recentWrongWords.map((w, i) => (
                  <View key={w.id}>
                    {i > 0 && <View style={styles.divider} />}
                    <AchievementItem
                      char={w.entity.thaiWord}
                      meaning={w.entity.meaning}
                      category={`×${w.mistakeCount}`}
                    />
                  </View>
                ))
              )}
            </View>
          </View>
          {/* Dev Playground Entry - Only visible in DEV */}
          {__DEV__ && (
            <Pressable
              style={{
                marginTop: 20,
                padding: 12,
                backgroundColor: Colors.ink,
                borderRadius: 16,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
              onPress={() => router.push('/(dev)/playground')}
            >
              <Wrench size={16} color={Colors.thaiGold} />
              <Text style={{ color: Colors.white, fontFamily: Typography.notoSerifBold, fontSize: 12 }}>
                Open Dev Playground
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* AI Search Result Modal */}
      <Modal
        visible={showAiModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeAiModal}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                   <Text style={styles.modalTitle}>{t('ai.title')}</Text>
                   <Pressable onPress={closeAiModal} style={styles.closeModalBtn}>
                       <X size={24} color={Colors.ink} />
                   </Pressable>
                </View>

                {isSearching ? (
                   <View style={styles.modalLoadingState}>
                      <ActivityIndicator size="large" color={Colors.thaiGold} />
                      <Text style={styles.modalLoadingText}>{t('common.loading')}</Text>
                   </View>
                ) : searchError ? (
                   <View style={styles.modalErrorState}>
                      <Text style={styles.modalErrorText}>{searchError}</Text>
                      <Pressable style={styles.retryBtn} onPress={handleAiSearch}>
                         <Text style={styles.retryBtnText}>{t('common.confirm')}</Text>
                      </Pressable>
                   </View>
                ) : aiResult ? (
                   <View style={styles.aiResultWrapper}>
                       <AiExplanationView data={aiResult} />
                   </View>
                ) : null}
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

interface AchievementItemProps {
  char: string;
  meaning: string;
  category: string;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ char, meaning, category }) => (
  <Pressable style={styles.achievementItem}>
    <View style={styles.achievementLeft}>
      <View style={styles.achievementIconBox}>
        <Text style={styles.achievementChar}>{char}</Text>
      </View>
      <View>
        <Text style={styles.achievementName}>{meaning}</Text>
      </View>
    </View>
    <View style={styles.masteredBadge}>
      <Text style={styles.masteredText}>{category}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    position: 'relative',
  },
  greetingText: {
    fontFamily: Typography.playfairRegular,
    fontSize: 30,
    letterSpacing: -0.5,
    color: Colors.ink,
  },
  greetingDot: {
    fontFamily: Typography.playfairRegular,
    position: 'absolute',
    right: -12,
    top: -4,
    fontSize: 20,
    color: Colors.thaiGold,
  },
  subtitleText: {
    fontFamily: Typography.notoSerifRegular,
    marginTop: 4,
    fontSize: 14,
    letterSpacing: 0.5,
    color: Colors.taupe,
  },
  awardBadge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 672,
    alignSelf: 'center',
  },
  heroCard: {
    backgroundColor: Colors.ink,
    padding: 32,
    borderRadius: 32,
    marginBottom: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  heroContent: {
    zIndex: 10,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 48,
  },
  courseLabel: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.thaiGold,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  courseName: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 20,
    color: Colors.white,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    color: Colors.sand,
  },
  heroBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroProgressText: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.white,
    marginBottom: 6,
  },
  thaiText: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 48,
    letterSpacing: 1,
    color: Colors.white,
    marginBottom: 8,
  },
  translationText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    fontWeight: '300',
    color: Colors.sand,
    opacity: 0.6,
  },
  playButtonLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.thaiGold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },
  heroGradient1: {
    position: 'absolute',
    right: -48,
    top: -48,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    opacity: 0.5,
  },
  heroGradient2: {
    position: 'absolute',
    left: -40,
    bottom: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(184, 149, 106, 0.2)',
  },
  readingPracticeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  readingPracticeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  readingPracticeIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  readingPracticeTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 14,
    color: Colors.ink,
  },
  readingPracticeHint: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 11,
    color: Colors.taupe,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardCheckedIn: {
    opacity: 0.85,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(212, 175, 55, 0.06)',
  },
  statTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statIconContainer: {
    padding: 8,
    backgroundColor: Colors.paper,
    borderRadius: 12,
  },
  statLabel: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.taupe,
    textTransform: 'uppercase',
  },
  statValue: {
    fontFamily: Typography.playfairRegular,
    fontSize: 36,
    color: Colors.ink,
  },
  statUnit: {
    fontFamily: Typography.notoSerifRegular,
    marginTop: 4,
    fontSize: 12,
    color: Colors.taupe,
  },
  achievementsSection: {
    paddingBottom: 24,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  achievementsTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  achievementsList: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.sand,
    padding: 8,
  },
  emptyHint: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.5,
    textAlign: 'center',
    paddingVertical: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  achievementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  achievementIconBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.paper,
  },
  achievementChar: {
    fontFamily: Typography.sarabunRegular,
    fontSize: 20,
    color: Colors.ink,
  },
  achievementName: {
    fontFamily: Typography.playfairRegular,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.ink,
  },
  achievementCategory: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.taupe,
    textTransform: 'uppercase',
  },
  masteredBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.sand,
    backgroundColor: Colors.paper,
  },
  masteredText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 12,
    color: 'rgba(26, 26, 26, 0.6)',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(229, 226, 219, 0.5)',
    alignSelf: 'center',
    marginVertical: 4,
  },
  // AI Dictionary Styles
  searchContainer: {
    marginBottom: 24,
    marginTop: -8, // Pull slightly up towards header
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.sand,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.ink,
    height: '100%',
  },
  clearSearchButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sand,
  },
  modalTitle: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 18,
    color: Colors.ink,
  },
  closeModalBtn: {
    padding: 4,
  },
  modalLoadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  modalLoadingText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 14,
    color: Colors.taupe,
  },
  modalErrorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  modalErrorText: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.ink,
    borderRadius: 12,
  },
  retryBtnText: {
    color: Colors.white,
    fontFamily: Typography.notoSerifBold,
    fontSize: 16,
  },
  aiResultWrapper: {
    flex: 1,
    paddingTop: 16,
  }
});
````

## File: cloudbase/functions/memory-engine/utils/memoryEngine.js
````javascript
/**
 * 统一记忆引擎核心模块
 * 支持字母/单词/句子的统一记忆管理
 * 
 */

const { calculateSM2, masteryToQuality } = require('./sm2');

/**
 * 创建新的记忆记录,并写入 memory_status 集合,不做导出
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {boolean} isLocked - 是否锁定
 * @param {number} vId - 词汇ID(可选)
 * @returns {Promise<Object>} - 记忆记录
 */
async function createMemoryRecord(db, userId, entityType, entityId, vId, isLocked = false) {

    // 验证参数
    if (!userId || !entityType || !entityId) {
        console.error('[createMemoryRecord] 参数缺失:', { userId, entityType, entityId });
        throw new Error('userId, entityType, entityId 都是必需参数');
    }

    const now = new Date();
    const nextReviewDate = isLocked ? null : now.getTime() + 24 * 60 * 60 * 1000;

    const memoryRecord = {
        userId,               // 用户ID
        entityType,           // 实体类型
        entityId,             // 实体ID
        vId,                  // 词汇ID(可选)
        masteryLevel: 0.0,    // 掌握度
        repetition: 0,        // 0: 初始状态，1: 已复习
        easinessFactor: 2.5,  // 易度因子,SM-2 算法的标准初始难度（2.5表示中等难度）
        interval: 1,          // 间隔天数
        lastReviewAt: null,   // 上次复习时间
        nextReviewDate,       // 下次复习时间 (数字)
        correctCount: 0,      // 正确次数
        wrongCount: 0,        // 错误次数
        streakCorrect: 0,     // 连续正确次数
        isLocked: isLocked,   // 修复：必须显式写入，否则缺失字段导致 isLocked: false 查询无法匹配
        isSkipped: false,     // 是否跳过
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };

    try {
        // 数据库写入记忆状态到 memory_status 集合
        const result = await db.collection('memory_status').add({ data: memoryRecord });// 入记忆状态到 memory_status 集合

        console.log('[createMemoryRecord] 创建成功:', { userId, entityType, entityId });

        return {
            _id: result._id,
            ...memoryRecord
        };
    } catch (error) {
        // 如果是重复键错误，查询并返回现有记录
        if (error.errCode === -502001 || error.message.includes('duplicate key')) {
            console.log('[createMemoryRecord] 记录已存在，查询返回:', { userId, entityType, entityId });

            const existingResult = await db.collection('memory_status')
                .where({ userId, entityType, entityId })
                .get();

            if (existingResult.data && existingResult.data.length > 0) {
                return existingResult.data[0];
            }
        }

        // 其他错误继续抛出
        console.error('[createMemoryRecord] 创建失败:', error);
        throw error;
    }
}

/**
 * 更新用户在特定课程的进度指针 (vId)
 * @param {Object} db
 * @param {string} userId
 * @param {string} source - e.g. "BaseThai_1"
 * @param {number} vId - 当前学完的单词vId
 */
async function updateUserWordProgress(db, userId, source, vId) {
    if (!source || !vId) return;
    const progressRes = await db.collection('user_progress').where({ userId }).get();

    if (progressRes.data.length === 0) return; // Should not happen
    const progressDoc = progressRes.data[0];
    const progressId = progressDoc._id;

    // 1. 获取当前 wordProgress，统一转为以 source 为 key 的 Map 对象
    let wordProgress = progressDoc.wordProgress || {};

    // 兼容迁移：旧数据可能是数组格式，自动转为 Map
    if (Array.isArray(wordProgress)) {
        const converted = {};
        wordProgress.forEach(item => {
            if (item.source) {
                converted[item.source] = { lastVId: item.lastVId, updatedAt: item.updatedAt };
            }
        });
        wordProgress = converted;
    }

    // 2. 只在 vId 更大时更新
    const existing = wordProgress[source];
    if (existing && vId <= (existing.lastVId || 0)) {
        return; // 无需更新
    }

    // 3. 写入新值
    wordProgress[source] = {
        lastVId: vId,
        updatedAt: new Date().toISOString()
    };

    // 4. 使用 db.command.set 强制整体替换，防止 CloudBase 将对象拆解为数字 key
    await db.collection('user_progress').doc(progressId).update({
        data: { wordProgress: db.command.set(wordProgress) }
    });
    console.log(`[Progress] Updated ${source} -> vId: ${vId}`);
}

/**
 * 获取已有的memory_status记录，若没有则调用 createMemoryRecord 创建新记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {number} vId - 词汇ID(可选)
 * @param {boolean} isLocked - 是否锁定
 * @returns {Promise<Object>} - 记忆记录
 */
async function getOrCreateMemory(db, userId, entityType, entityId, vId, isLocked = false) {
    // 1. 尝试查询现有记录
    const existingMemory = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            entityId
        })
        .get();

    // 2. 如果存在,直接返回第一条
    if (existingMemory.data && existingMemory.data.length > 0) {
        return existingMemory.data[0];
    }

    // 3. 不存在则创建新记录
    return await createMemoryRecord(db, userId, entityType, entityId, vId);
}

/**
 * 更新记忆状态(答题后调用)
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {string} quality - 答题质量
 * @returns {Promise<Object>} - 更新后的记忆记录
 */
/**
 * 更新记忆状态(答题后调用)
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {string} entityId - 实体ID
 * @param {string} quality - 答题质量
 * @param {boolean} isSkipped - 是否跳过 (新增参数)
 * @returns {Promise<Object>} - 更新后的记忆记录
 */
async function updateMemoryAfterReview(db, userId, entityType, entityId, quality, isSkipped = false, vId) {
    console.log('【测试】updateMemoryAfterReview 被调用了！', { userId, quality, isSkipped });
    console.log('=== [updateMemoryAfterReview] 开始 ===');
    console.log('参数:', JSON.stringify({ userId, entityType, entityId, quality, isSkipped }));

    try {
        // 1. 获取当前记忆记录
        console.log('步骤1: 获取记忆记录');
        const memory = await getOrCreateMemory(db, userId, entityType, entityId, vId);
        console.log('记忆记录:', JSON.stringify(memory));

        let newMasteryLevel, nextReviewAt, updateData;
        let sm2Result = {};
        let newCorrectCount = memory.correctCount;
        let newWrongCount = memory.wrongCount;
        let newStreakCorrect = memory.streakCorrect;

        const now = new Date();

        // === 处理跳过逻辑 ===
        if (isSkipped) {
            console.log('步骤2 (SKIP): 处理跳过逻辑');
            newMasteryLevel = 1.0;
            // 设置为 100 年后，相当于永久移出复习队列
            const nextReviewDate = now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000;

            updateData = {
                masteryLevel: newMasteryLevel,
                nextReviewDate: nextReviewDate,
                updatedAt: now.toISOString(),
                isSkipped: true,
                // 跳过不影响 correct/wrong 计数，也不影响 streak
                // 但为了保持字段完整性，可以选择保留原值或重置某些状态
                // 这里选择仅更新调度相关的核心字段
            };
        } else {
            // === 原有 SM-2 逻辑 ===
            console.log('步骤2: 映射质量');

            const sm2Quality = masteryToQuality(quality);
            console.log('SM-2质量:', sm2Quality);

            // 3. 计算新的SM-2参数
            const oldInterval = memory.interval !== undefined ? memory.interval : (memory.intervalDays || 1);
            const oldRepetition = memory.repetition !== undefined ? memory.repetition : (memory.reviewStage || 0);

            console.log('步骤3: 调用 calculateSM2');
            console.log('调用参数:', {
                quality,
                interval: oldInterval,
                easinessFactor: memory.easinessFactor,
                repetition: oldRepetition
            });
            sm2Result = calculateSM2(
                quality,
                oldInterval,
                memory.easinessFactor,
                oldRepetition
            );

            console.log('SM-2结果:', JSON.stringify(sm2Result));

            // 4. 更新掌握度
            console.log('步骤4: 计算新掌握度');
            newMasteryLevel = memory.masteryLevel;
            if (sm2Quality >= 4) {
                newMasteryLevel = Math.min(1.0, memory.masteryLevel + 0.15);
            } else if (sm2Quality >= 2) {
                newMasteryLevel = Math.max(0.0, memory.masteryLevel + 0.05);
            } else {
                newMasteryLevel = Math.max(0.0, memory.masteryLevel - 0.2);
            }
            console.log('新掌握度:', newMasteryLevel);

            // 5. 更新连胜和计数
            console.log('步骤5: 计算连胜');
            newStreakCorrect = sm2Quality >= 4 ? memory.streakCorrect + 1 : 0;
            newCorrectCount = sm2Quality >= 4 ? memory.correctCount + 1 : memory.correctCount;
            newWrongCount = sm2Quality < 2 ? memory.wrongCount + 1 : memory.wrongCount;

            // 6. 计算下次复习时间
            console.log('步骤6: 计算下次复习时间');
            const nextReviewDate = now.getTime() + sm2Result.interval * 24 * 60 * 60 * 1000;
            console.log('下次复习时间:', nextReviewDate);

            // 7. 准备更新数据
            updateData = {
                isSkipped: false,
                masteryLevel: newMasteryLevel,
                repetition: sm2Result.repetitions,
                easinessFactor: sm2Result.easinessFactor,
                interval: sm2Result.interval,
                lastReviewAt: now.toISOString(),
                nextReviewDate: nextReviewDate,
                correctCount: newCorrectCount,
                wrongCount: newWrongCount,
                streakCorrect: newStreakCorrect,
                updatedAt: now.toISOString()
            };
            console.log('更新数据对象:', 'correctCount:', updateData.correctCount, 'nextReviewDate:', updateData.nextReviewDate);
        }

        console.log('步骤7: 准备更新数据库');
        console.log('更新数据对象:', JSON.stringify(updateData));

        // 检查是否有 undefined
        for (const [key, value] of Object.entries(updateData)) {
            if (value === undefined) {
                console.error(`❌ 发现 undefined 值: ${key}`);
            }
        }

        // 8. 执行更新
        console.log('步骤8: 执行数据库更新');
        await db.collection('memory_status')
            .where({
                userId,
                entityType,
                entityId
            })
            .update({
                data: updateData   // ✅ CloudBase 必须这样写
            });

        console.log('✅ 更新成功');

        // 返回结果增加 isSkipped 标识 (虽然不是必须，但方便调试)
        // 如果是 skipped，返回的部分 SM-2 字段可能是 undefined 或旧值，这取决于是否需要前端处理
        // 前端通常只关心是否成功
        return {
            entityId,
            entityType,
            masteryLevel: newMasteryLevel,
            repetition: sm2Result.repetitions || (memory.repetition !== undefined ? memory.repetition : memory.reviewStage),
            easinessFactor: sm2Result.easinessFactor || memory.easinessFactor,
            interval: sm2Result.interval || (memory.interval !== undefined ? memory.interval : memory.intervalDays),
            nextReviewDate: updateData.nextReviewDate,
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            streakCorrect: newStreakCorrect,
            isSkipped
        };

    } catch (error) {
        console.error('❌ [updateMemoryAfterReview] 错误:', error);
        console.error('错误堆栈:', error.stack);
        throw error;
    }
}

/**
 * 获取今日待复习的实体
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} entityType - 实体类型
 * @param {number} limit - 限制数量
 * @returns {Promise<Array>} - 待复习实体列表
 */
async function getTodayReviewEntities(db, userId, entityType, limit = 20) {
    const now = new Date();
    const cmd = db.command;

    const result = await db.collection('memory_status')
        .where({
            userId,
            entityType,
            isLocked: cmd.neq(true),    // neq(true) 兼容：字段不存在的旧记录 + 显式 false 的新记录
            isSkipped: cmd.neq(true),   // 防御性过滤：跳过的词不进复习队列
            nextReviewDate: cmd.lte(now.getTime())
        })
        .orderBy('nextReviewDate', 'asc')
        .limit(limit)
        .get();

    return result.data || [];
}


/**
 * 初始化用户的学习进度记录
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @returns {progressRecord} - 初始化后的学习进度记录
 */
async function initUserProgress(db, userId) {
    const now = new Date();

    const progressRecord = {
        userId,
        letterCompleted: false,
        letterProgress: 0.0,
        wordUnlocked: false,
        wordProgress: {},  // Map 结构，以 source 为 key，如 { "BaseThai_1": { lastVId: 5, updatedAt: ... } }
        sentenceUnlocked: false,
        sentenceProgress: [],
        articleUnlocked: false,
        articleProgress: [],
        currentStage: 'letter',
        totalStudyDays: 0,
        streakDays: 0,
        lastStudyDate: null,
        createdAt: now,
        updatedAt: now
    };

    await db.collection('user_progress').add({ data: progressRecord });
    return progressRecord;
}

/**
 * 检查模块访问权限
 * @param {Object} db - 数据库实例
 * @param {string} userId - 用户ID
 * @param {string} moduleType - 模块类型
 * @returns {Promise<Object>} - 检查结果
 */
async function checkModuleAccess(db, userId, moduleType) {
    const forceUnlock = process.env.FORCE_UNLOCK === 'true';

    // 特殊处理：开发阶段的本地测试用户
    // 前端在未登录情况下会使用 userId = 'test-user' 进入字母模块，
    // 此时 CloudBase 中并不存在对应的 user / user_progress 记录，
    // 如果直接访问数据库会触发各种约束错误（例如唯一索引）。
    //
    // 这里直接放行该用户，并返回一个最小化的进度对象，仅用于本地调试。
    if (userId === 'test-user') {
        console.warn('ℹ️ checkModuleAccess: 使用开发测试用户 test-user, 直接放行模块:', moduleType);
        const progress = {
            userId,
            letterCompleted: false,
            letterProgress: 0,
            wordUnlocked: false,
            wordProgress: 0,
            sentenceUnlocked: false,
            sentenceProgress: 0,
            articleUnlocked: false,
            articleProgress: 0,
            currentStage: moduleType,
        };
        return {
            allowed: true,
            progress,
        };
    }

    // 1. 获取用户进度记录
    const progressResult = await db.collection('user_progress')
        .where({ userId })
        .limit(1)
        .get();

    if (!progressResult.data || progressResult.data.length === 0) {
        // 没有进度记录：
        // - 如果开启 FORCE_UNLOCK，仍然放行并返回一个默认进度对象；
        // - 如果是字母模块，则自动初始化 user_progress 后放行；
        // - 其他模块保持原有行为（拒绝访问）。
        if (forceUnlock) {
            console.warn('⚠️ FORCE_UNLOCK 已开启, 但未找到 user_progress 记录, 使用默认进度:', moduleType);
            const progress = {
                userId,
                letterCompleted: true,
                letterProgress: 1,
                wordUnlocked: true,
                wordProgress: 1,
                sentenceUnlocked: true,
                sentenceProgress: 1,
                articleUnlocked: true,
                articleProgress: 1,
                currentStage: moduleType,
            };
            return {
                allowed: true,
                progress,
            };
        }

        // 字母模块：自动初始化进度记录，避免第一次进入字母模块就被拒绝
        if (moduleType === 'letter') {
            console.warn('ℹ️ 未找到 user_progress 记录, 为字母模块自动初始化进度:', userId);
            const progress = await initUserProgress(db, userId);
            return {
                allowed: true,
                progress,
            };
        }

        // 非字母模块：仍然要求先有进度记录
        return {
            allowed: false,
            errorCode: 'USER_PROGRESS_NOT_FOUND',
            message: '用户学习进度不存在,请联系管理员',
        };
    }

    const progress = progressResult.data[0];
    const letterProgress = typeof progress.letterProgress === 'number'
        ? progress.letterProgress
        : 0;

    // 2. 调试总开关：一键解锁所有模块
    if (forceUnlock) {
        console.warn('⚠️ FORCE_UNLOCK 已开启, 强制放行模块:', moduleType);
        return {
            allowed: true,
            progress: {
                ...progress,
                letterCompleted: true,
                letterProgress: 1,
                wordUnlocked: true,
                sentenceUnlocked: true,
                articleUnlocked: true,
                currentStage: moduleType,
            },
        };
    }

    // 3. 字母模块永远允许访问
    if (moduleType === 'letter') {
        return {
            allowed: true,
            progress,
        };
    }

    // 4. 其他模块：统一使用「二选一」规则
    // - letterCompleted === true
    // - 或 letterProgress >= 0.8 (即 80%)
    const finishedByTest = !!progress.letterCompleted;
    const finishedByProgress = letterProgress >= 0.8;

    if (!finishedByTest && !finishedByProgress) {
        return {
            allowed: false,
            errorCode: 'MODULE_LOCKED',
            message: `请先完成字母学习（当前进度：${Math.round(letterProgress * 100)}%）`,
            progress,
        };
    }

    return {
        allowed: true,
        progress,
    };
}

module.exports = {
    //createMemoryRecord,
    getOrCreateMemory,
    updateMemoryAfterReview,
    getTodayReviewEntities,
    // checkAndUnlockNextStage,
    initUserProgress,
    checkModuleAccess,
    updateUserWordProgress
};
````

## File: src/stores/vocabularyStore.ts
````typescript
// src/stores/vocabularyStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callCloudFunction } from '@/src/utils/apiClient';
import { API_ENDPOINTS } from '@/src/config/api.endpoints';
import { useUserStore } from './userStore';
import {
    SessionWord,
    VocabSessionPhase,
    VocabularyResponse,
    VOCAB_SCORES,
} from '@/src/entities/types/vocabulary.types';
import { resolveVocabPath, getAllVocabAudioPaths } from '@/src/utils/vocab/vocabAudioHelper';
import { downloadAudioBatch } from '@/src/utils/audioCache';
import { buildVocabQueue } from '@/src/utils/vocab/buildVocabQueue';
import { ModuleType } from './moduleAccessStore';



interface VocabularyStore {
    phase: VocabSessionPhase;
    currentCourseSource: string | null;
    queue: SessionWord[];
    currentIndex: number;
    totalSessionWords: number;
    completedCount: number;
    pendingResults: Array<{ userId: string, entityId: string, entityType: string, quality: number, vId?: number, source?: string }>;
    skippedIds: string[]; // Track skipped word IDs
    sessionPool: SessionWord[]; // 原始完整词列表快照，不受 skipWord 影响，用于干扰项生成
    recentWrongWords: SessionWord[]; // 本轮 mistakeCount > 2 的词，会话结束时填充，下次开始时清空
    initSession: (userId: string, options?: { limit?: number, source?: string }) => Promise<void>;
    startCourse: (source: string, limit?: number, moduleType?: ModuleType) => Promise<void>;
    submitResult: (isCorrect: boolean, score?: number) => Promise<void>;
    markSelfRating: (rating: number) => void;
    skipWord: (id: string) => void;
    submitSkippedWords: () => Promise<void>;
    next: () => void;
    finishSession: () => void;
    resetSession: () => void;
    flushResults: () => Promise<void>;
    clearForLogout: () => void; // 登出时完整清除所有状态（含持久化字段）
}

/**
 * 单词学习 Store
 * 
 * 功能：
 * 1. 从后端获取今日单词学习任务
 * 2. 管理单词学习会话流程
 * 3. 提交学习结果到后端
 * 4. 本地进度追踪
 * 
 */
export const useVocabularyStore = create<VocabularyStore>()(
    persist(
        (set, get) => ({
            phase: VocabSessionPhase.IDLE,
            currentCourseSource: null,
            queue: [],
            currentIndex: 0,
            totalSessionWords: 0,
            completedCount: 0,
            pendingResults: [],
            skippedIds: [],
            sessionPool: [], // 原始词列表快照
            recentWrongWords: [], // 本轮错词（完成后填充）
            //Above are the variables that are used to store the state of the vocabulary store

            //================= 下面是函数=================
            initSession: async (userId: string, options: { limit?: number, source?: string } = {}) => {
                try {
                    set({ 
                        phase: VocabSessionPhase.LOADING, 
                        pendingResults: [], 
                        skippedIds: [] ,
                    }); // Clear pending, skipped & wrong words
                    
                    const { limit, source } = options;
                    // 确保 limit 是合法整数且不是 NaN
                    const finalLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
                    const safeLimit = (typeof finalLimit === 'number' && isFinite(finalLimit)) ? finalLimit : 5;
                    console.log(`🚀 开始获取单词学习任务，限制为${safeLimit}`);
                    console.log(`🚀 initSession params: source=${source}, limit=${limit}`);
                    const result: any = await callCloudFunction<VocabularyResponse>(
                        "getTodayMemories",
                        { userId, limit: safeLimit, entityType: 'word', source: source || get().currentCourseSource },
                        { endpoint: API_ENDPOINTS.MEMORY.GET_TODAY_MEMORIES.cloudbase }
                    );
                    if (result.success && result.data?.items?.length > 0) {
                        const queue = buildVocabQueue(result.data);

                        // DEBUG: Inspect data structure
                        console.log('🔍 [Debug] First item fields:', Object.keys(result.data.items[0]));
                        if (result.data.items[0].audioPath) {
                            console.log('🔍 [Debug] audioPath found:', result.data.items[0].audioPath);
                        }

                        // Extract ALL associated audio (main, example, dialogue, cognates)
                        const audioUrls = (result.data.items || []).flatMap((item: any) =>
                            getAllVocabAudioPaths(item)
                                .map((path: string) => resolveVocabPath(path, item.source))
                                .filter(Boolean)
                        );

                        console.log(`📦 [Audio] Found ${audioUrls.length} total URLs to check`);
                        if (audioUrls.length > 0) {
                            downloadAudioBatch(audioUrls).catch(console.error);
                        }

                        set({
                            queue,
                            sessionPool: queue, // 保存原始快照，skipWord 不修改此字段
                            currentIndex: 0,
                            totalSessionWords: result.data.summary?.total || result.data.items.length,
                            completedCount: 0,
                            phase: VocabSessionPhase.LEARNING,
                            pendingResults: [] // Reset buffer
                        });
                    } else {
                        set({ phase: VocabSessionPhase.COMPLETED });
                    }
                } catch (error) {
                    console.error('❌ initSession failed:', error);
                    set({ phase: VocabSessionPhase.IDLE });
                }
            },
            markSelfRating: (rating: number) => {
                const { queue, currentIndex } = get();
                const currentItem = queue[currentIndex];
                if (!currentItem) return;

                // 1. Update current item's rating
                const updatedQueue = [...queue];
                updatedQueue[currentIndex] = { ...currentItem, selfRating: rating };

                // 2. State Sync: Find the corresponding Quiz item and sync the rating
                // Search forward from current index
                for (let i = currentIndex + 1; i < updatedQueue.length; i++) {
                    const nextItem = updatedQueue[i];
                    // Correct Sync Logic: Same ID, and is a Quiz Phase
                    if (nextItem.id === currentItem.id &&
                        (nextItem.source === 'vocab-rev-quiz' || nextItem.source === 'vocab-new-quiz')) {
                        updatedQueue[i] = { ...nextItem, selfRating: rating };
                        break; // Found the match, stop sync
                    }
                }

                set({ queue: updatedQueue });
                // Do NOT call next() here. We wait for manual "Next" button in UI.
            },
            submitResult: async (isCorrect: boolean, score?: number) => {
                const { queue, currentIndex, completedCount, pendingResults } = get();
                const currentItem = queue[currentIndex];
                if (!currentItem) return;

                const userId = useUserStore.getState().currentUser?.userId;

                // === Case 1: Wrong Answer ===
                // Immediate Retry (Stay on card) + Increment Mistake Count
                if (!isCorrect) {
                    // Counter Logic: Increment mistakeCount ONLY IF NOT in retry phase
                    const shouldIncrement = currentItem.source !== 'vocab-error-retry';
                    const newMistakeCount = shouldIncrement ? currentItem.mistakeCount + 1 : currentItem.mistakeCount;

                    const updatedQueue = [...queue];
                    updatedQueue[currentIndex] = { ...currentItem, mistakeCount: newMistakeCount };

                    set({ queue: updatedQueue });
                    // DO NOT call next(). Wait for user to retry.
                    return;
                }

                // === Case 2: Correct Answer ===
                // Determine if we are finishing the interaction with this word
                const isFinalStep = currentItem.source === 'vocab-rev-quiz' ||
                    currentItem.source === 'vocab-new-quiz' ||
                    currentItem.source === 'vocab-error-retry';

                if (isCorrect && isFinalStep) {
                    set({ completedCount: completedCount + 1 });

                    // --- Scoring Matrix Calculation ---
                    const R = currentItem.selfRating || 3; // Default to 3 (Pass) if missing
                    const M = currentItem.mistakeCount;
                    let finalQuality = R;

                    if (R === 5) { // Remembered / Know
                        if (M === 0) finalQuality = 5;       // Perfect
                        else if (M === 1) finalQuality = 4;  // Good (Remembered + 1 Slip)
                        else finalQuality = 3;               // Pass (Remembered + Many Errors)
                    } else if (R === 3) { // Fuzzy / Don't Know
                        if (M === 0) finalQuality = 3;       // Pass
                        else finalQuality = 2;               // Weak
                    } else if (R === 1) { // Forgot
                        finalQuality = 1;                    // Fail
                    } else {
                        // Default fallback (e.g. R=2/4 if ever supported)
                        finalQuality = Math.max(1, R - (M > 0 ? 1 : 0));
                    }

                    // --- Deferred Submission (Buffer) ---
                    // Refinement: vocab-error-retry does NOT re-submit scores.
                    const shouldSubmitScore = currentItem.source !== 'vocab-error-retry';

                    if (userId && shouldSubmitScore) {
                        const payload = {
                            userId,
                            entityId: currentItem.id,
                            entityType: 'word',
                            quality: finalQuality,
                            vId: currentItem.entity.vId,
                            source: currentItem.entity.source
                        };
                        set({ pendingResults: [...pendingResults, payload] });
                    }

                    // --- Retry Queue Logic ---
                    // If word had mistakes, it needs a dedicated Retry Phase later
                    if (M > 0) {
                        // Check if this item is already a retry item logic? 
                        // "into the queue end"
                        // We always push a new Retry Item if M > 0, UNLESS it's already a retry item?
                        // Plan: "如果是第一次在测验中做错...进入后续的 Retry Phase"
                        // Actually, if I am in vocab-error-retry and I initially got it wrong (Stay) and then right,
                        // do I need to push it AGAIN?
                        // User said: "Retry Phase: Wrong answers do NOT increment mistakeCount".
                        // Usually Retry Phase assumes "Iterate until correct". Once correct, it's done. 
                        // We don't loop retry-items forever unless they fail *again*?
                        // But here we implement "Immediate Retry" (Stay). So once they pass, they pass.
                        // So we ONLY push to retry queue if `source !== 'vocab-error-retry'`.
                        if (currentItem.source !== 'vocab-error-retry') {
                            const retryItem: SessionWord = {
                                ...currentItem,
                                source: 'vocab-error-retry',
                                // Keep mistake count for history, or reset?
                                // Actually, keep it so we know it was a problem.
                                // But for the NEW retry item, should we reset mistakeCount?
                                // No, keep it.
                            };
                            set({ queue: [...queue, retryItem] });
                        }
                    }
                }

                // Proceed to next
                get().next();
            },
            skipWord: (id: string) => {
                const { queue, skippedIds, currentIndex } = get();
                // 1. Add to skippedIds
                if (!skippedIds.includes(id)) {
                    set({ skippedIds: [...skippedIds, id] });
                }

                // 2. Remove from queue (all instances of this word)
                const newQueue = queue.filter(w => w.id !== id);

                set({ queue: newQueue });

                // Check bounds
                if (currentIndex >= newQueue.length) {
                    if (newQueue.length === 0) {
                        // 先跳转完成页，网络请求后台静默执行，不阻塞 UI
                        get().finishSession();
                        get().submitSkippedWords().catch(e => console.error('\u274c submitSkippedWords failed:', e));
                        get().flushResults().catch(e => console.error('\u274c flushResults failed:', e));
                    }
                }
            },

            submitSkippedWords: async () => {
                const { skippedIds } = get();
                const userId = useUserStore.getState().currentUser?.userId;

                if (!userId || skippedIds.length === 0) return;

                console.log(`🚀 Submitting ${skippedIds.length} skipped words...`);
                try {
                    const results = skippedIds.map(id => ({
                        entityType: 'word',
                        entityId: id,
                        quality: 0, // Ignored by backend when isSkipped is true
                        isSkipped: true
                    }));

                    // Use batch submission
                    await callCloudFunction(
                        "submitMemoryResult",
                        { userId, results },
                        { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase }
                    );

                    console.log("✅ Skipped words submitted.");
                    // 不在这里清空 skippedIds，避免用户进入 session-summary 时丢失“跳过词”展示。
                    // skippedIds 会在下一次 initSession/startCourse 时被重置。
                } catch (e) {
                    console.error("❌ Failed to submit skipped words:", e);
                }
            },
            next: async () => {
                const { currentIndex, queue } = get();
                if (currentIndex + 1 < queue.length) {
                    set({ currentIndex: currentIndex + 1 });
                } else {
                    // 先跳转完成页，网络请求后台静默执行，不阻塞 UI
                    get().finishSession();
                    get().submitSkippedWords().catch(e => console.error('\u274c submitSkippedWords failed:', e));
                    get().flushResults().catch(e => console.error('\u274c flushResults failed:', e));
                }
            },
            flushResults: async () => {
                const { pendingResults } = get();
                if (pendingResults.length === 0) return;

                console.log(`🚀 Flushing ${pendingResults.length} vocabulary results...`);

                // Batch/Parallel processing could be implemented here if API supports batch
                // For now, parallel clean requests
                try {
                    await Promise.all(pendingResults.map(p =>
                        callCloudFunction("submitMemoryResult", p, { endpoint: API_ENDPOINTS.MEMORY.SUBMIT_MEMORY_RESULT.cloudbase })
                    ));
                    console.log("✅ Results flushed successfully.");
                    set({ pendingResults: [] });
                } catch (e) {
                    console.error("❌ Failed to flush results:", e);
                    // Strategy: Keep them in pending? Or fail silent? 
                    // For now, log error. SM2 is resilient to missed updates (just reviewing again sooner/later).
                    // But ideally we might want to retry? keeping it simple for now.
                }
            },
            startCourse: async (source: string, limit?: number, moduleType: ModuleType = 'word') => {
                console.log(`🚀 开始课程：${source}，限制为${limit}`);
                const userId = useUserStore.getState().currentUser?.userId;
                if (!userId) return;
                set(
                    {
                        currentCourseSource: source,
                        currentIndex: 0,
                        queue: [],
                        pendingResults: [],
                        phase: VocabSessionPhase.IDLE
                    }
                );//Reset state of vocabulary session

                if (moduleType === 'letter') {
                    set({ phase: VocabSessionPhase.IDLE });
                    return;
                }

                await get().initSession(userId, { source, limit });
            },

            finishSession: () => {
                const { queue } = get();
                // 去重：同一个词可以在 queue 里出现多次（原始项 + retry 副本）
                // mistakeCount 只在非 retry 项上自增，所以只取 source !== 'vocab-error-retry' 的项
                const seen = new Set<string>();
                const wrongWords = queue
                    .filter(w => w.source !== 'vocab-error-retry' && w.mistakeCount > 1)
                    .filter(w => { const ok = !seen.has(w.id); seen.add(w.id); return ok; });

                // 只有本轮有错词时才覆盖，否则保留上次的错词列表
                if (wrongWords.length > 0) {
                    set({ phase: VocabSessionPhase.COMPLETED, recentWrongWords: wrongWords });
                } else {
                    set({ phase: VocabSessionPhase.COMPLETED });
                }
            },
            resetSession: () => {
                set({ phase: VocabSessionPhase.IDLE });
            },
            // 登出时调用：完整清除所有状态，包含持久化字段 currentCourseSource
            // 防止不同用户在同一设备上共享学习进度
            clearForLogout: () => {
                set({
                    phase: VocabSessionPhase.IDLE,
                    currentCourseSource: null,
                    queue: [],
                    sessionPool: [],
                    currentIndex: 0,
                    totalSessionWords: 0,
                    completedCount: 0,
                    pendingResults: [],
                    skippedIds: [],
                    recentWrongWords: [],
                });
            }
        }),
        {
            name: 'vocabulary-learning-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                currentCourseSource: state.currentCourseSource,
                recentWrongWords: state.recentWrongWords,
            }),
        }
    )
);
````

## File: app/learning/index.tsx
````typescript
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { ThaiPatternBackground } from '@/src/components/common/ThaiPatternBackground';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';
import { AlphabetLearningView } from '@/src/components/learning/alphabet/AlphabetLearningView';
import { AlphabetReviewView } from '@/src/components/learning/alphabet/AlphabetReviewView';
import { VocabularyQuizView } from '@/src/components/learning/vocabulary/VocabularyQuizView';
import { NewWordView } from '@/src/components/learning/vocabulary/NewWordView';
import { ReviewWordView } from '@/src/components/learning/vocabulary/ReviewWordView';
import { useVocabularyStore } from '@/src/stores/vocabularyStore';
import { useLearningPreferenceStore } from '@/src/stores/learningPreferenceStore';
import { useAlphabetStore } from '@/src/stores/alphabetStore';
import { useModuleAccessStore } from '@/src/stores/moduleAccessStore';
import { LearningPhase } from '@/src/entities/enums/LearningPhase.enum';
import { useUserStore } from '@/src/stores/userStore';
import { useVocabularyLearningEngine } from '@/src/hooks/useVocabularyLearningEngine';
import { VocabSessionPhase } from '@/src/entities/types/vocabulary.types';


type SessionMode = 'REVIEW' | 'LEARN_NEW';
type ModuleVariant = 'letter' | 'word';

export default function LearningSession() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const moduleParam = typeof params.module === 'string' ? params.module : 'word';
    const moduleType: ModuleVariant = moduleParam === 'letter' ? 'letter' : 'word';
    const courseSource = typeof params.source === 'string' ? params.source : undefined;
    const rawLimit = params.limit ? parseInt(params.limit as string, 10) : undefined;
    const limit = (typeof rawLimit === 'number' && isFinite(rawLimit)) ? rawLimit : undefined;
    const { startCourse, currentCourseSource, phase, queue } = useVocabularyStore();
    const { currentUser } = useUserStore();
    const { dailyLimits } = useLearningPreferenceStore();
    const { userProgress } = useModuleAccessStore();
    // 用于判断是否是本次 mount 后的第一次初始化
    // 每次组件重新挂载（新实例），useRef(true) 会重置为 true
    const isFirstMountRef = useRef(true);

    useEffect(() => {
        // 确保有课程来源且用户信息已加载（startCourse 内部依赖 userId）
        if (!courseSource || !currentUser?.userId) return;

        // ⭐ 1. 字母模块：不在这里自动 startCourse
        if (moduleType === 'letter') {
            return;
        }

        // ⭐ 2. 核心初始化逻辑（单一数据源）
        // 触发条件：
        // A. 本次 mount 后首次运行（替代原来的 isIdle，避免依赖 phase 引发竞态）
        // B. 课程来源不一致（切换课程）
        // C. 虽然处于 LEARNING 状态但内存中无数据（处理异常重启/热重载后的状态不一致）
        const isFirstMount = isFirstMountRef.current;
        const isDifferentSource = !currentCourseSource || currentCourseSource !== courseSource;
        const isDataMissing = phase === VocabSessionPhase.LEARNING && (!queue || queue.length === 0);

        if (isFirstMount || isDifferentSource || isDataMissing) {
            isFirstMountRef.current = false;
            console.log(`🔄 Init Session: Phase[${phase}] Queue[${queue.length}] Source[${currentCourseSource} -> ${courseSource}]`);

            // 🔥 CRITICAL: Trust store only. Do not use URL params for limit.
            const effectiveLimit = userProgress?.dailyLimit || limit || 20;
            console.log(`有效限制: ${effectiveLimit}`);

            startCourse(courseSource, effectiveLimit, moduleType as any);
        }
    }, [
        moduleType,
        courseSource,
        currentCourseSource,
        // phase 不放入依赖数组：WordSession.cleanup 调 resetSession() 会改变 phase，
        // 若 phase 在依赖里，卸载过程中会意外触发 startCourse → getTodayMemories
        queue.length,
        currentUser?.userId,
        startCourse,
        dailyLimits.word,
        userProgress?.dailyLimit
    ]);

    // 学习时长追踪：进入页面开始计时，离开时累加到当日
    const { startStudySession, stopStudySession } = useLearningPreferenceStore();
    useFocusEffect(
        React.useCallback(() => {
            startStudySession();
            return () => stopStudySession();
        }, [startStudySession, stopStudySession])
    );

    if (moduleType === 'letter') {
        return <AlphabetSession />;
    }

    return <WordSession />;
}

function WordSession() {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        currentItem,
        componentType,
        progress,
        handleAnswer
    } = useVocabularyLearningEngine();

    const handleBackToCourses = () => {
        router.replace('/(tabs)/courses');
    };

    useEffect(() => {
        return () => {
            if (useVocabularyStore.getState().phase === VocabSessionPhase.COMPLETED) {
                useVocabularyStore.getState().resetSession();
            }
        };
    }, []);

    // 处理退出
    const handleClose = () => {
        Alert.alert(
            t('learning.endSessionTitle'),
            t('learning.endSessionMessage'),
            [
                { text: t('common.cancel'), style: "cancel" },
                { text: t('learning.quit'), style: "destructive", onPress: () => router.back() }
            ]
        );
    };


    // 分发渲染容器
    const renderContent = () => {
        switch (componentType) {
            case 'loading':
                return <View style={styles.centerContent}><Text>{t('common.loading')}</Text></View>;
            case 'completed':
                return (
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeTitle}>{t('learning.sessionComplete')}</Text>
                        <Pressable style={styles.completeButton} onPress={() => router.push('/learning/session-summary')}>
                            <Text style={styles.completeButtonText}>{t('microReading.title', '微阅读')}</Text>
                        </Pressable>
                        <Pressable style={styles.completeButton} onPress={handleBackToCourses}>
                            <Text style={styles.completeButtonText}>{t('learning.backToHome', '返回首页')}</Text>
                        </Pressable>
                    </View>
                );
            case 'vocab-new':
                return <NewWordView key={currentItem!.entity._id} vocabulary={currentItem!.entity} onNext={() => handleAnswer(true)} />;
            case 'vocab-review':
                return <ReviewWordView key={currentItem!.entity._id} vocabulary={currentItem!.entity} onNext={() => handleAnswer(true)} />;
            case 'vocab-new-quiz':
            case 'vocab-rev-quiz':
            case 'vocab-error-retry':
                return <VocabularyQuizView vocabulary={currentItem!.entity} />;
            default:
                return null;
        }
    };
    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />
            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>

                {/* 跳过按钮 (置于进度条右侧) */}
                {(componentType === 'vocab-new' || componentType === 'vocab-review') && currentItem?.entity?._id ? (
                    <Pressable
                        onPress={() => useVocabularyStore.getState().skipWord(currentItem.entity._id)}
                        style={styles.headerSkipButton}
                    >
                        <Text style={styles.headerSkipText}>{t('learning.skip')}</Text>
                        <X size={14} color={Colors.taupe} />
                    </Pressable>
                ) : (
                    <View style={{ width: 44 }} />
                )}
            </View>
            <View style={styles.content}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
}

function AlphabetSession() {
    const { t } = useTranslation();
    const router = useRouter();
    const { currentUser } = useUserStore();
    const { dailyLimits } = useLearningPreferenceStore();
    const [hasViewedIntro, setHasViewedIntro] = useState(false);
    const [sessionStarted, setSessionStarted] = useState(false);

    const {
        phase,
        isLoading,
        initializeSession,
        submitResult,
        reset,
        completedCount,
        totalCount,
        currentItem,
    } = useAlphabetStore();

    const currentAlphabet = currentItem;

    useEffect(() => {
        setHasViewedIntro(false);
    }, [currentAlphabet?.alphabetId]);

    useEffect(() => {
        const start = async () => {
            if (sessionStarted || isLoading) return;
            const userId = currentUser?.userId || 'user_123';
            await initializeSession(userId, {
                limit: dailyLimits.letter || 30,
            });
            setSessionStarted(true);
        };

        start();
    }, [sessionStarted, isLoading, initializeSession, currentUser?.userId, dailyLimits.letter]);

    const handleClose = () => {
        Alert.alert(
            t('learning.endSessionTitle', '结束学习?'),
            t('learning.endSessionMessage', '当前进度将不会保存'),
            [
                { text: t('common.cancel', '取消'), style: "cancel" },
                {
                    text: t('learning.quit', '退出'),
                    style: "destructive",
                    onPress: () => {
                        reset();
                        router.back();
                    }
                }
            ]
        );
    };

    if (isLoading && !sessionStarted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text>{t('common.loading', '加载中...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (phase === LearningPhase.COMPLETED) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text style={styles.completeTitle}>{t('learning.sessionComplete', '今日学习完成!')}</Text>
                    <Pressable style={styles.microReadingButton} onPress={() => router.push('/learning/session-summary')}>
                        <Text style={styles.completeButtonText}>{t('microReading.title', '微阅读')}</Text>
                    </Pressable>
                    <Pressable style={styles.completeButton} onPress={() => router.push('/courses')}>
                        <Text style={styles.completeButtonText}>{t('learning.backToHome', '返回首页')}</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentAlphabet) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.centerContent}>
                    <Text>{t('common.loading', '加载中...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isNew = !currentAlphabet.memoryState || currentAlphabet.memoryState.isNew;
    const showIntro = isNew && !hasViewedIntro && currentAlphabet.currentAttempts === 0;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
            <ThaiPatternBackground opacity={0.05} />

            <View style={styles.header}>
                <Pressable onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={Colors.taupe} />
                </Pressable>

                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>

                <View style={{ width: 60 }} />
            </View>

            <View style={styles.content}>
                {showIntro ? (
                    <AlphabetLearningView
                        alphabet={currentAlphabet}
                        onNext={() => setHasViewedIntro(true)}
                    />
                ) : (
                    <AlphabetReviewViewWrapper
                        key={currentAlphabet.alphabetId}
                        alphabet={currentAlphabet}
                        onSubmit={(quality) => {
                            const userId = currentUser?.userId || 'user_123';
                            submitResult(userId, quality);
                        }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

function AlphabetReviewViewWrapper({ alphabet, onSubmit }: { alphabet: any, onSubmit: (q: any) => void }) {
    const [quality, setQuality] = useState<any>(null);

    return (
        <AlphabetReviewView
            alphabet={alphabet}
            onAnswer={(q) => setQuality(q)}
            onNext={() => {
                if (quality) onSubmit(quality);
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.paper,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    closeButton: {
        padding: 8,
    },
    progressBarContainer: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(229, 226, 219, 0.5)',
        borderRadius: 3,
        marginHorizontal: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.thaiGold,
        borderRadius: 3,
    },
    headerSkipButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        gap: 2,
        marginRight: 4,
    },
    headerSkipText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 12,
        color: Colors.taupe,
    },
    content: {
        flex: 1,
    },
    completeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeTitle: {
        fontFamily: Typography.playfairBold,
        fontSize: 24,
        color: Colors.ink,
        marginBottom: 24,
    },
    microReadingButton: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    completeButton: {
        backgroundColor: Colors.ink,
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 12,
    },
    completeButtonText: {
        color: Colors.white,
        fontFamily: Typography.notoSerifBold,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipText: {
        fontFamily: Typography.notoSerifRegular,
        fontSize: 14,
        color: Colors.taupe,
    },
});
````

## File: cloudbase/functions/memory-engine/handlers/getTodayMemories.js
````javascript
/**
 * 统一获取今日学习内容 (字母/单词/句子)
 * Action: getTodayMemories
 */
'use strict';

// 假设 memoryEngine 内部没有严重的全局副作用，如果有问题，可能需要检查 memoryEngine
const { getTodayReviewEntities, getOrCreateMemory, checkModuleAccess } = require('../utils/memoryEngine');
const { createResponse } = require('../utils/response');
const {
  getLessonMetadataFromDb,
  getPhonicsRuleByLessonFromDb,
} = require('../config/alphabetLessonConfig');

const MAX_NEW_LETTERS = 12; // 单课安全上限，防止 3s 超时
const MAX_REVIEW_LIMIT = 2000; // 复习队列宽松上限，确保获取所有复习
const MAX_LETTER_DAILY_LIMIT = 200; // 字母模块每日学习硬上限（稳定模式）
const MAX_GENERIC_DAILY_LIMIT = 200; // 其他模块的兜底上限，防止无界请求

/**
 * 懒初始化：字母进度表
 * 兼容旧用户：如果 user_alphabet_progress 中没有记录，则插入一条默认记录
 * 给字母模块提供进度表
 * col.add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          
        roundHistory: [],        
        createdAt: now,
        updatedAt: now,
      },
 * @param {Object} db
 * @param {string} userId
 * 
 */
async function ensureUserAlphabetProgress(db, userId) {
  const col = db.collection('user_alphabet_progress');
  const existing = await col.where({ userId }).limit(1).get();

  if (!existing.data || existing.data.length === 0) {
    const now = new Date().toISOString();

    // 🔥 并发保护：二次检查防止重复记录
    const checkAgain = await col.where({ userId }).limit(1).get();
    if (checkAgain.data && checkAgain.data.length > 0) {
      console.log('⚠️ [ensureUserAlphabetProgress] 记录已被并发创建, 跳过');
      return;
    }

    await col.add({
      data: {
        userId,
        letterProgress: 0.0,
        letterCompleted: false,
        completedLessons: [],
        masteredLetterCount: 0,
        totalLetterCount: 80,
        currentRound: 1,          // 🔥 新增：默认从第1轮开始
        roundHistory: [],         // 🔥 新增：轮次历史记录
        createdAt: now,
        updatedAt: now,
      },
    });
    console.log('✅ [ensureUserAlphabetProgress] 已创建默认进度记录');
  }
}

//========================================================
/**
 * 懒初始化：用户词汇进度表（传统进度表）
 * 说明：
 * 给单词模块提供进度表
 * col.add({
      data: {
        userId,
        vocabularyId: null,
        mastery: null,
        reviewCount: 0,
        lastReviewed: null,
        nextReviewDate: null,
        intervalDays: 0,
        // 占位记录默认标记为 skipped，避免影响 getTodayWords 等查询逻辑
        skipped: true,
        easinessFactor: 2.5,
        createdAt: now,
        updatedAt: now,
      },
    });
 * - 该集合原本按单词一条记录，这里只为旧用户插入一条「占位记录」
 * - 使用 skipped: true，避免影响 getTodayWords 等查询逻辑
 *
 * @param {Object} db
 * @param {string} userId
 *
async function ensureUserVocabularyProgress(db, userId) {
  const col = db.collection('user_vocabulary_progress');
  const existing = await col.where({ userId }).limit(1).get();

  if (!existing.data || existing.data.length === 0) {
    const now = new Date().toISOString();
    await col.add({
      data: {
        userId,
        vocabularyId: null,
        mastery: null,
        reviewCount: 0,
        lastReviewed: null,
        nextReviewDate: null,
        intervalDays: 0,
        // 占位记录默认标记为 skipped，避免被当成真实复习数据
        skipped: true,
        easinessFactor: 2.5,
        createdAt: now,
        updatedAt: now,
      },
    });
  }
}
*/

//========================================================

/**
 * @param {Object} db - 数据库实例
 * @param {Object} params - 请求参数
 * @returns {Promise<Object>} - 响应对象
 */
async function getTodayMemories(db, params) {
  /**
     * 第一层：防御与初始化 (Defense & Init)
     * (对应代码 L130-146)
     *
     * 做什么：检查参数 (userId 有没有？)、检查老用户数据状态 (ensure...Progress)。
     * 设计思想：Fail Fast (快速失败)。如果缺参数，第一行就报错返回，别浪费资源往下跑。
   */
  const start = Date.now();
  const { userId, entityType, limit, includeNew = true, roundNumber } = params;
  // 🔍 调试日志：打印收到的 userId
  console.log('📥 [getTodayMemories] 收到请求，userId:', userId, ', entityType:', entityType, ', limit:', limit, ', includeNew:', includeNew, ', roundNumber:', roundNumber);

  if (!userId || !entityType) {
    return createResponse(false, null, 'Missing userId or entityType', 'INVALID_PARAMS');
  }

  try {
    // 0. 懒初始化用户相关进度表（兼容在新增注册逻辑之前的老用户）
    if (entityType === 'letter') {
      await ensureUserAlphabetProgress(db, userId);
    }
    /**
         * 第二层：权限守门 (Gatekeeping)
         * (对应代码 L164-167)
         *
         * 做什么：checkModuleAccess。
         * 设计思想：统一鉴权。不要要在业务逻辑里写 if (score > 60)，
         * 而是抽离成一个独立的权限函数。这样以后改规则（比如从60分改成80分解锁），只需要改一个地方。
    */
    // ============== 1. 检查模块访问权限 =============
    // 使用 memoryEngine 中的统一权限检查
    const accessCheck = await checkModuleAccess(db, userId, entityType);
    if (!accessCheck.allowed) {
      return createResponse(false, null, accessCheck.message, accessCheck.errorCode);
    }

    /**
         * 第三层：调度逻辑 (Scheduling - 核心大脑)
         * (对应代码 L179-226)
         *
         * 做什么：
         * 问 SM-2 算法：今天该复习谁？(getTodayReviewEntities)
         * 问配额系统：今天还能学几个新的？(limit)
         * 算法融合：把“复习的”和“新的”按 3:1 穿插在一起。
         * 设计思想：业务逻辑与数据存储分离。这一层只处理 ID 和 规则，完全不关心“单词意思是啥”、“音频在哪”。它只管“ID列表”。
    */

    // ================ 1.5 获取/更新用户每日学习量设置 =============
    // 注意：
    // - 字母模块（entityType === 'letter'）不再允许前端通过 limit 动态调整每日新字母数量，
    //   只使用服务器端存储的 dailyLimit（如果有），否则退回默认值；
    // - 其他实体类型仍沿用原有逻辑。
    const userProgress = accessCheck.progress; // checkModuleAccess returns progress
    let effectiveLimit = limit;

    // 逻辑分支 A: 字母模块 (固定规则)
    if (entityType === 'letter') {
      // 字母模块强制使用按课获取逻辑，完全忽略用户设置的 limit
      // 直接使用模块最大安全上限，确保能一次性拉取整节课的所有字母
      effectiveLimit = MAX_LETTER_DAILY_LIMIT;
    }
    // 逻辑分支 B: 其他模块 (单词/句子等)
    else {
      // 如果前端传入了新的 limit，且与存量不同 -> 更新数据库
      if (userProgress && params.limit && params.limit !== userProgress.dailyLimit) {
        // [离线更新] 不await，避免拖慢主流程
        db.collection('user_progress').where({ userId }).update({
          data: {
            dailyLimit: params.limit,
            updatedAt: new Date().toISOString()
          }
        }).catch(err => console.error('Limit update failed:', err));
      }
      // 如果 params.limit 没传，但数据库有值 -> 用数据库的
      if (!params.limit && userProgress && userProgress.dailyLimit) {
        effectiveLimit = userProgress.dailyLimit;
      }
      // 强制应用通用上限 (200) 防止恶意请求
      effectiveLimit = Math.min(effectiveLimit, MAX_GENERIC_DAILY_LIMIT);
    }

    // =============== 3. 获取今日复习实体 ===============
    /**
     * reviewMemories
     * 
     * 作用：
     * 去数据库查 SM-2 算法认为“今天到期该复习”的卡片放入 reviewMemories
     * 
     * 适用范围：全模块通用（字母、单词、句子）。
     * 如果 entityType 是 word，它就会去查单词的复习队列。
     * 这一行代码是绝对不能删除或改为字母专用的，否则单词模块就没法复习了。
     */
    let reviewMemories = await getTodayReviewEntities(db, userId, entityType, MAX_REVIEW_LIMIT);

    /* 
     字母模块专用补丁（仅 Letter）
     第 219 - 257 行（如果不算那行 let explicitPreviousCount 的声明）：
     字母模块使用: 显式获取 Round1 跨课程 previous-review（只做 round==1 且 lesson>1）
     作用：这是为了配合字母课程的特殊设计（Round 1 强制滚雪球复习上一课）。
     适用范围：仅字母模块。
     entityType === 'letter' 这个判断条件像一堵墙，把单词和句子模块挡在了外面。
     所以这部分代码虽然写在这里，但对单词模块是 "无公害" 的，不会产生任何副作用。
    */
    let explicitPreviousCount = 0;

    if (entityType === 'letter' && roundNumber === 1 && params.lessonId && params.lessonId !== 'lesson1') {
      try {
        const currentLessonMeta = await getLessonMetadataFromDb(db, params.lessonId);
        if (currentLessonMeta && currentLessonMeta.order && currentLessonMeta.order > 1) {
          const prevLessonId = `lesson${currentLessonMeta.order - 1}`;

          // 查询上一课的字母
          const prevLettersResult = await db.collection('letters')
            .where({ curriculumLessonIds: db.command.in([prevLessonId]) })
            .limit(20)
            .get();

          const explicitPrevMemories = [];

          // 获取这些字母的记忆状态
          for (const letter of prevLettersResult.data) {
            const mem = await getOrCreateMemory(db, userId, entityType, letter._id, false);
            if (mem) {
              // 浅拷贝避免副作用
              const rep = mem.repetition !== undefined ? mem.repetition : (mem.reviewStage || 0);
              const patched = {
                ...mem,
                repetition: Math.max(rep, 1)
              };
              explicitPrevMemories.push(patched);
            }
          }

          explicitPreviousCount = explicitPrevMemories.length;

          // 合并到 reviewMemories（去重）
          const existingIds = new Set(reviewMemories.map(m => m.entityId));
          const uniquePrev = explicitPrevMemories.filter(m => !existingIds.has(m.entityId));
          reviewMemories = [...uniquePrev, ...reviewMemories];

          console.log(`🔍 [P0-C] lessonId: ${params.lessonId}, prevLessonId: ${prevLessonId}, explicitPrevCount: ${explicitPreviousCount}`);
        }
      } catch (err) {
        console.warn('⚠️ [P0-C] 获取上一课程字母失败:', err);
      }
    }

    // ============= 4. 获取新学习内容 =============
    let newMemories = [];
    if (includeNew) {
      const remainingSlots = effectiveLimit;

      const collectionMap = {
        letter: 'letters',
        word: 'vocabulary',
        sentence: 'sentences'
      };

      const collectionName = collectionMap[entityType];
      if (!collectionName) {
        return createResponse(false, null, `不支持的实体类型: ${entityType}`, 'INVALID_ENTITY_TYPE');
      }

      const query = db.collection(collectionName);
      let newEntities = [];

      // 获取已存在的实体ID (包括复习队列中的)
      const existingEntityIds = reviewMemories.map(m => m.entityId);

      // 字母模块：根据课程一次性取出该课需要的全部字母（不受 limit 限制）
      if (entityType === 'letter' && params.lessonId) {
        const { lessonId } = params;
        const cmd = db.command;

        const whereCondition = {
          curriculumLessonIds: cmd.in([lessonId]),
        };

        // 🔥 Round2/3 时不过滤已有记忆的字母（用于复习）
        if (roundNumber === 1 && existingEntityIds.length > 0) {
          whereCondition._id = cmd.nin(existingEntityIds);
        }
        // Round2/3 时返回该课程的全部字母

        const newEntitiesResult = await query
          .where(whereCondition)
          // 为了安全起见，仍加一个较大的上限（远大于实际字母总数）
          .limit(MAX_NEW_LETTERS)
          .get();

        newEntities = newEntitiesResult.data;
      }
      //===============================单词模块获取逻辑====================================
      // 其他模块或未指定 lessonId：沿用原逻辑，按剩余名额和 lessonNumber 顺序获取
      else {
        const cmd = db.command;

        // 构建单词模块查询条件（必须合并到一个对象，CloudBase 链式 .where() 后者覆盖前者）
        const whereCondition = {};

        // 1. source 过滤（必须在同一词书内取词）
        if (entityType === 'word' && params.source) {
          whereCondition.source = params.source;

          // 2. vId 指针过滤（读取 user_progress.wordProgress 中存储的上次学习位置）
          if (userProgress && userProgress.wordProgress && params.source) {
            const wp = userProgress.wordProgress;
            let progressItem;

            // 优先 Map 格式：{ "BaseThai_1": { lastVId: 10 } }
            if (!Array.isArray(wp) && typeof wp === 'object') {
              progressItem = wp[params.source];
            }
            // 兼容旧数组格式：[{ source: "BaseThai_1", lastVId: 10 }]
            else if (Array.isArray(wp)) {
              progressItem = wp.find(p => p.source === params.source);
            }

            if (progressItem && progressItem.lastVId) {
              console.log(`[FastFetch] Using pointer vId > ${progressItem.lastVId} for ${params.source}`);
              whereCondition.vId = cmd.gt(progressItem.lastVId);
            }
          }
        }

        // 3. 排除已在复习队列中的词（避免新词与复习词重复）
        if (existingEntityIds.length > 0) {
          whereCondition._id = cmd.nin(existingEntityIds);
        }

        const newEntitiesResult = await query
          .where(whereCondition)
          .orderBy('vId', 'asc')
          .limit(Math.min(remainingSlots, MAX_GENERIC_DAILY_LIMIT))
          .get();

        newEntities = newEntitiesResult.data;
      }


      const cappedNewEntities =   // →→→→→ 限制新内容的数量
        entityType === 'letter'
          ? newEntities.slice(0, MAX_NEW_LETTERS)
          : newEntities.slice(0, Math.min(remainingSlots, MAX_GENERIC_DAILY_LIMIT));

      // ✅ 每一位新词，不再调用 getOrCreateMemory 写数据库
      // 而是直接在内存里生成一个 "Virtual Memory Object"
      const now = new Date().toISOString();
      newMemories = cappedNewEntities.map((entity) => ({
        _id: `temp_${entity.vId}`, // 临时ID，或者不给ID也可以，只要不报错
        userId,
        entityType,
        entityId: entity._id,
        vId: entity.vId,

        // SM-2 初始状态
        masteryLevel: 0,
        repetition: 0,
        easinessFactor: 2.5,
        interval: 0,

        // 计数器
        correctCount: 0,
        wrongCount: 0,
        streakCorrect: 0,

        // 时间
        createdAt: now,
        updatedAt: now,

        // 关键标识
        isNew: true
      }));
    }
    /**
     * 第四层：数据富化 (Data Enrichment - 也是 map/filter 所在层)
     * (对应代码 L337-370)
     * 做什：拿着第三层算出来的 [ID1, ID2, ID3]，去 vocabulary 表里一次性查出所有详情，然后组装。
     * 知识点：应用层 Join (Application-side Join)。
     * 在 NoSQL (如 MongoDB/CloudBase) 中，我们很少用复杂的表连接 (Lookup)。
     * 最佳实践：先查出所有 ID -> where({ _id: in(ids) }) 批量查详情 -> 在内存里用 Map 拼装。这比数据库 Join 更快、更灵活。
    */
    // ================= 5. 合并 & 穿插 (Interleave) =================
    // 制作一个数组，包含复习内容和新内容,这里设置内容要按照一定的规则穿插
    // "单词和字母学习开始前，优先复习之前学的内容" -> 优先放入复习内容
    // "这部分内容复习完后才进入三新1复习的穿插学习" -> 复习完老内容后，新内容按 3新:1复习(新) 穿插
    let allMemories = [...reviewMemories];

    // 处理新内容 (3新 : 1复习)
    // 这里 "1复习" 指的是对刚刚学习的新内容的巩固复习 (Intra-session repetition)
    // 例如: N1, N2, N3, N1(复习), N4, N5, N6, N4(复习)...
    if (newMemories.length > 0) {
      for (let i = 0; i < newMemories.length; i++) {
        allMemories.push(newMemories[i]);

        // 每3个新词，插入一个复习 (复习这组的第一个)
        if ((i + 1) % 3 === 0) {
          // 插入 i-2 (即这组的第一个) 作为复习
          // 注意：这里直接push同一个对象，前端会再次渲染它
          allMemories.push(newMemories[i - 2]);
        }
      }
    }

    if (allMemories.length === 0) {
      return createResponse(true, { items: [], summary: { total: 0 } }, '今日无学习内容');
    }

    // ======================== 6. 获取详情 ========================
    // 制作一个数组，包含复习内容和新内容，这里是从数据库中获取的实际内容
    const entityIds = allMemories.map(m => m.entityId);
    const collectionMap = {
      letter: 'letters',
      word: 'vocabulary',
      sentence: 'sentences'
    };

    const entitiesResult = await db.collection(collectionMap[entityType])
      .where({
        _id: db.command.in(entityIds)
      })
      .get();

    const entitiesMap = new Map(entitiesResult.data.map(e => [e._id, e]));

    // ======================= 7. 组装 =======================
    // 将 step5 的数组内容规则和 step6 获得的详细内容，进行组装数据，将复习内容和新内容合并
    const data = allMemories.map(memory => {
      const entity = entitiesMap.get(memory.entityId);
      if (!entity) return null; // 如果没有找到对应的实体，返回 null
      return {
        // ...entity: 展开运算符
        // 将数据库中查询到的单词/字母的所有原始字段（如 thaiWord, meaning, audioPath 等）
        // 原封不动地复制到返回结果中，前端直接使用这些字段。
        ...entity,
        memoryState: {
          masteryLevel: memory.masteryLevel,     // 熟练度
          repetition: memory.repetition !== undefined ? memory.repetition : memory.reviewStage, // 复习阶段
          correctCount: memory.correctCount,     // 正确次数
          wrongCount: memory.wrongCount,         // 错误次数
          streakCorrect: memory.streakCorrect,   // 连续正确次数
          nextReviewDate: memory.nextReviewDate !== undefined ? memory.nextReviewDate : memory.nextReviewAt, // 下次复习时间
          isNew: (memory.repetition !== undefined ? memory.repetition : memory.reviewStage) === 0 // 是否是新内容
        }
      };
    }).filter(Boolean); // 过滤掉 null 值

    const summary = {
      total: data.length,                       // 总数
      reviewCount: reviewMemories.length,       // 复习数
      newCount: newMemories.length,             // 新数
      entityType,                              // 实体类型
    };

    // ======================= 8. 字母模块附加课程元数据 & 拼读规则（真实配置） =======================
    // 这一步是专门为【字母模块】服务的。
    // 字母学习不仅仅是看卡片，还需要知道“这一课的主题是什么”（lessonMetadata）
    // 以及“这一课的拼读规则是什么”（phonicsRule）。
    // 这些信息存储在独立的数据库集合里，需要单独查出来。

    let lessonMetadata = null;
    let phonicsRule = null;

    if (entityType === 'letter' && data.length > 0) {
      // 1. 确定 Lesson ID (课程ID)
      // 因为数据库里的数据可能格式不统一（新老数据混杂），所以这里做了多重兜底：
      // - 优先取前端传过来的 params.lessonId (最准)
      // - 其次取实体里的 lessonId 字段
      // - 再次取 curriculumLessonIds 数组的第一个
      // - 最后兼容老数据的 lessonNumber (数字转字符串)
      const firstEntity = data[0];
      const lessonIdFromParam = params.lessonId;
      const lessonIdFromField = firstEntity.lessonId || null;
      const lessonIdFromCurriculum =
        (firstEntity.curriculumLessonIds &&
          firstEntity.curriculumLessonIds[0]) ||
        null;
      const lessonIdFromLegacy =
        typeof firstEntity.lessonNumber === 'number' &&
          firstEntity.lessonNumber > 0
          ? `lesson${firstEntity.lessonNumber}`
          : null;

      const resolvedLessonId =
        lessonIdFromParam ||
        lessonIdFromCurriculum ||
        lessonIdFromField ||
        lessonIdFromLegacy;

      // 2. 如果确定了课程ID，就去查元数据和规则
      if (resolvedLessonId) {
        // 查课程标题、描述等信息 (collection: 'lessons' 或配置)
        lessonMetadata = await getLessonMetadataFromDb(db, resolvedLessonId);
        // 查拼读规则 (collection: 'phonics_rules')
        phonicsRule = await getPhonicsRuleByLessonFromDb(db, resolvedLessonId);
      }
    }

    return createResponse(
      true,
      {
        items: data,
        summary,
        lessonMetadata,
        phonicsRule,
      },
      '获取今日学习内容成功',
    );

  } catch (error) {
    console.error('getTodayMemories error:', error);
    return createResponse(false, null, error.message, 'SERVER_ERROR');
  } finally {
    console.log('[FunctionCost] getTodayMemories', Date.now() - start, 'ms');
  }
}

module.exports = getTodayMemories;
````

## File: src/i18n/locales/zh.ts
````typescript
// src/i18n/locales/zh.ts
export default {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    all: '全部',
  },
  auth: {
    title: '试试泰语',
    login: '登录',
    register: '注册',
    registerSuccess: '注册成功',
    logout: '退出登录',
    email: '邮箱',
    password: '密码',
    emailPlaceholder: '请输入邮箱',
    passwordPlaceholder: '请输入密码',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '请再次输入密码',
    displayName: '昵称',
    displayNamePlaceholder: '请输入昵称',
    loginButton: '登录',
    registerButton: '注册',
    forgotPassword: '忘记密码？',
    noAccount: '还没有账号？',
    hasAccount: '已有账号？',
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    alreadyHaveAccount: '已有账号？',
    logining: '登录中'
  },
  tabs: {
    home: '首页',
    learn: '学习',
    courses: '课程',
    profile: '我的',
  },
  profile: {
    title: '个人中心',
    editProfile: '编辑资料',
    achievements: '学习成就',
    settings: '设置',
    completedAlphabets: '已学字母',
    completedVocabulary: '已学词汇',
    completedSentences: '已学句子',
    completedArticles: '已读文章',
    totalScore: '总分',
    studyTime: '学习时长',
    streakDays: '连续天数',
    hours: '小时',
    days: '天',
    selectLanguage: '选择语言',
    chinese: '中文',
    english: 'English',
    dailyReminder: '每日提醒',
    reminder: {
      title: '定时提醒',
      subtitle: '设置每天的学习提醒时间，到点会收到通知',
      timeLabel: '提醒时间',
      off: '未开启',
      permissionTitle: '需要通知权限',
      permissionMessage: '请在系统设置中允许通知，以便接收学习提醒',
      unsupportedEnv: '当前环境不支持定时提醒，请使用 Development Build 运行应用',
      notificationTitle: '泰语学习提醒',
      notificationBody: '该学习啦！坚持每天练习，进步更快哦～',
    },
    ttsEngine: '音频反馈引擎',
    limit: '每次学习上限',
    achievementBadges: {
      streak7: '7天连胜',
      master: '声调大师',
      vocab100: '词汇100',
    },
  },
  home: {
    greeting: 'ສະບາຍດີ',
    todayProgress: '今日学习目标已完成',
    currentCourse: '当前课程',
    recentWrong: '最近马虎的词',
    noWrongWords: '本轮没有错词 🎉',
    mastered: '已掌握',
    reviewDue: '待复习内容',
    streak: '连续打卡',
    checkIn: '打卡',
    checkInToday: '今日已打卡',
    checkInSuccess: '打卡成功',
    hoursThisWeek: '本周小时数',
    minutesToday: '分钟',
    hoursToday: '小时',
    aiError: 'AI 查询失败，请稍后再试',
    typeThaiOrChinese: '搜你遇见的纯正泰语...',
  },
  ai: {
    title: 'AI 智能解析',
    analysis: '✨ AI 深度剖析',
    examples: '📖 沉浸例句',
  },
  courses: {
    title: '选择一本吧少年',
    subtitle: '开启你的泰语学习之旅',
    searchPlaceholder: '搜索课程...',
    startBtnText: '开始学习',
    continue: '继续学习',
    locked: '未解锁',
    lessons: '课时',
    levels: {
      beginner: '入门',
      elementary: '初级',
      intermediate: '中级',
      advanced: '高级',
    },
    list: {
      alphabet: {
        title: '泰语字母表',
        description: '从44个辅音到元音与声调，逐步掌握泰语读写基础。',
      },
      thai_1: {
        title: '基础泰语1',
        description: '从零开始学习泰语，掌握初步词汇。',
      },
      thai_2: {
        title: '基础泰语2',
        description: '掌握更多词汇，开始简单对话。',
      },
      thai_3: {
        title: '基础泰语3',
        description: '掌握更多词汇，进行比较熟练的对话。',
      },
      thai_4: {
        title: '基础泰语4',
        description: '熟练掌握大部分泰语高频词汇。',
      },
    },
  },
  learning: {
    basicDefinition: '基础释义',
    exampleSentences: '例句示例',
    usageDetails: '用法详解',
    grammarExamples: '语法示例',
    structure: '结构',
    explain: '解释',
    usageTip: '使用技巧',
    diffWithChinese: '与中文差异',
    commonMistakes: '常见错误',
    similarWordsDiff: '相似词汇区别',
    pronunciationPitfalls: '发音易错点',
    usageScenarios: '使用场合',
    dialogueExample: '对话示例',
    individualSentences: '例句',
    viewDefinition: '查看释义',
    nextEnter: '下一个',
    next: '下一个',
    forgot: '忘记了',
    unsure: '模糊',
    know: '认识',
    skipReview: '跳过复习',
    sessionComplete: '学习完成！',
    backToHome: '返回首页',
    noNewWordsTitle: '没有新单词',
    noNewWordsMessage: '你已经学完了所有新单词！',
    endSessionTitle: '结束学习？',
    endSessionMessage: '确定要退出吗？',
    quit: '退出学习',
    noExamples: '暂无例句',
    noUsage: '暂无用法详解',
    setupTitle: '今日学习计划',
    setupSubtitle: '选择今天要学习/复习的字母数量',
    setupSubtitleWords: '选择今天要学习/复习的单词数量',
    start: '开始学习',
    quizInstruction: '请选择正确的含义',
    skip: '跳过',
    dontKnow: '不认识',
    nextStep: '下一步',
    cognates: '同源词',
    memoryTips: '记忆技巧',
    split: '拆分',
    memoryPhrase: '记忆短语',
  },
  modules: {
    alphabet: '字母学习',
    word: '单词学习',
    sentence: '句子学习',
    article: '文章阅读',
  },
  moduleAccess: {
    locked: '模块已锁定',
    lockedMessage: '{{module}}模块暂未解锁',
    requirement: '解锁要求',
    prerequisite: {
      word: '完成字母学习并达到 95% 进度',
      sentence: '完成单词学习并达到 80% 进度',
      article: '完成句子学习并达到 80% 进度',
    },
    currentProgress: '当前进度',
    remainingProgress: '还需完成 {{remaining}}%',
    progressComplete: '进度已达标！',
    goBack: '返回',
    noProgress: '请先开始学习',
    unknownModule: '未知模块',
  },
  alphabet: {
    title: '泰语字母学习',
    level: '基础',
    description: '学习44个辅音和32个元音，掌握标准发音',
    continue: '继续学习',
    start: '开始学习',
    phase: {
      new: '新字母',
      review: '快速复习',
      final: '最终复习',
      fix: '错题修正',
      warmup: '热身环节',
      completed: '本轮完成',
      finished: '课程完成'
    },
    roundInfo: '第 {{current}} / {{total}} 轮',
    skipBury: '跳过(不再复习)',
    optionsLoadFailed: '题目选项加载失败',
    regenerate: '重新生成题目',
    checkAnswer: '检查答案',
    nextQuestion: '下一题 →',
    instructions: {
      selectCorrect: '请选择正确的含义',
      listenChoose: '听音选字',
      matchPronunciation: '匹配发音',
      consonantClass: '选择辅音类别',
      initialSound: '识别声母',
      finalSound: '识别韵母'
    },
  },
  alphabetTest: {
    title: '字母测试',
    description: '测试你的字母掌握情况',
    start: '开始测试',
    submit: '提交',
    score: '得分',
    passed: '通过',
    failed: '未通过',
    retry: '重新测试',
    backToHome: '返回首页',
  },
  components: {
    phonics: {
      title: '声调规则表',
      interactive: '📌 交互示例',
      understood: '明白了,继续学习 →'
    },
    completion: {
      courseDone: '课程完成！',
      roundDone: 'Round {{round}} 完成',
      courseDoneMsg: '恭喜你完成了本节课程的所有学习内容！',
      roundDoneMsg: '休息一下，准备进入下一轮学习\n每节课需完成3轮学习',
      finishCourse: '完成课程',
      backToCourses: '返回选课'
    },
    recovery: {
      title: '继续上次学习？',
      message: '检测到您在该课程存在未完成的轮次，是否继续之前的阶段？',
      restart: '重新开始本轮',
      continue: '继续学习'
    },
    miniReview: {
      hint: '💡 提示:',
      pitchCurve: '🎵 音高曲线',
      playSound: '播放发音',
      explanation: '💡 解释',
      aspirated: '送气音 (aspirated)',
      unaspirated: '不送气音 (unaspirated)',
      voiceless: '清音 (voiceless)',
      voiced: '浊音 (voiced)',
      highClass: '高辅音',
      midClass: '中辅音',
      lowClass: '低辅音',
      consonantClass: '辅音类'
    },
    aspirated: {
      title: '送气音对比训练',
      instruction: '🔊 先播放目标音频,然后从下方选项中选择对应的字母',
      playTarget: '播放目标发音',
      tipsTitle: '💡 区分技巧',
      aspirated: '送气',
      unaspirated: '不送气',
      correctAns: '✅ 正确答案',
      aspiratedDesc: '这是一个送气音,发音时有明显气流',
      unaspiratedDesc: '这是一个不送气音,发音时气流较弱'
    }
  },
  alphabetCourse: {
    title: '字母课程',
    back: '返回',
    headerSubtitle: '共 {{count}} 课 · 已完成 {{percent}}%',
    currentBadge: '当前',
    letterCount: '{{count}} 个字母',
    start: '开始',
    takeTest: '参加测试以解锁全部课程',
    drawer: {
      expectedTime: '预计用时：15 分钟',
      description: '简介',
      contentPreview: '内容预览（{{count}} 个字母）',
    },
    lessons: {
      lesson1: {
        title: '第一课：基础拼读能力',
        description: '掌握最基础的中辅音和常见长元音，建立 CV 拼读概念',
      },
      lesson2: {
        title: '第二课：前置元音系统',
        description: '学习前置元音（เ แ โ）和更多高频辅音',
      },
      lesson3: {
        title: '第三课：声调入门',
        description: '掌握送气/不送气对比，引入基础声调系统',
      },
      lesson4: {
        title: '第四课：辅音类与声调',
        description: '理解高/中/低辅音对声调的影响，掌握完整声调系统',
      },
      lesson5: {
        title: '第五课：复合元音系统',
        description: '掌握三合元音（เอีย เอือ อัว）等复杂元音组合',
      },
      lesson6: {
        title: '第六课：完整覆盖（常用进阶）',
        description: '补充常用进阶辅音与复合元音，掌握特殊规则（如 ห นำ 等）',
      },
      lesson7: {
        title: '第七课：罕用字母与特殊元音',
        description: '集中学习现代泰语中较少使用的辅音与复杂元音，用于阅读古文与特殊专有名词',
      },
    },
  },
  questionType: {
    soundToLetter: '听音选字母',
    letterToSound: '看字母选发音',
    syllable: '拼读组合',
    reverseSyllable: '音素分离',
    missingLetter: '缺字填空',
    aspiratedContrast: '送气音对比',
    vowelLengthContrast: '元音长短对比',
    finalConsonant: '尾音规则',
    tonePerception: '声调听辨',
    classChoice: '辅音分类',
    letterName: '字母名称',
    initialSound: '首音判断',
  },
  sessionSummary: {
    title: '本次学习总结',
    wrongWords: '本轮错词',
    newWords: '新学单词',
    skippedWords: '跳过的单词',
    cancelSkip: '取消跳过',
    generateBtn: '生成微阅读（{{count}} 词已选）',
    noWords: '本轮无词可选',
    generating: 'AI 生成中...',
    errorTitle: '生成失败',
    errorMessage: 'AI 生成遇到问题，请重试',
    retry: '重试',
  },
  microReading: {
    title: 'AI 微阅读',
    voicePlaceholder: '朗读练习 - 即将上线',
    translationLabel: '中文辅助',
    backToHome: '返回上一级',
    wordsUsed: '本文涉及词汇',
    saveArticle: '保存到练习库',
    saving: '保存中...',
    saveSuccess: '已保存到阅读练习库',
    saveError: '保存失败，请重试',
    alreadySaved: '该文章已保存',
  },
  articlePractice: {
    listTitle: '阅读练习库',
    emptyTitle: '暂无文章',
    emptyMessage: '完成单词学习后，在微阅读页面保存文章到这里',
    wordCount: '{{count}} 词',
    deleteConfirmTitle: '删除文章',
    deleteConfirmMessage: '确定要删除这篇文章吗？',
    practiceTitle: '阅读练习',
    blindMode: '盲听模式',
    revealMode: '显示原文',
    clozeMode: '挖空背诵',
    clozeFull: '全显示',
    clozePartial: '半挖空',
    clozeBlind: '全挖空',
    tapWordHint: '点击单词查看释义',
    shadowingTitle: '跟读练习',
    startRecording: '开始录音',
    stopRecording: '停止录音',
    playback: '回放',
    getAiFeedback: '获取 AI 发音建议',
    feedbackTitle: '发音建议',
    playOriginal: '播放原文',
    stopPlaying: '停止播放',
    ttsLoading: '语音加载中...',
    ttsError: '语音合成失败，请重试',
    analyzing: '正在分析发音...',
    overallScore: '综合评分',
    pronunciationSuggestions: '改进建议',
    analyzeError: '发音分析失败，请重试',
    noRecording: '请先录音',
  },
};
````

## File: src/i18n/locales/en.ts
````typescript
import { Split } from "lucide-react-native";

// src/i18n/locales/en.ts
export default {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    all: 'All',
  },
  auth: {
    title: 'TRY THAI',
    login: 'Login',
    register: 'Register',
    registerSuccess: 'Register successful',
    logout: 'Logout',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    displayName: 'Display Name',
    displayNamePlaceholder: 'Enter your display name',
    loginButton: 'Login',
    registerButton: 'Register',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    alreadyHaveAccount: 'Already have an account?',
    logining: 'logining'
  },
  tabs: {
    home: 'Home',
    learn: 'Learn',
    courses: 'Courses',
    profile: 'Profile',
  },
  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    achievements: 'Achievements',
    settings: 'Settings',
    completedAlphabets: 'Alphabets Learned',
    completedVocabulary: 'Vocabulary Learned',
    completedSentences: 'Sentences Learned',
    completedArticles: 'Articles Read',
    totalScore: 'Total Score',
    studyTime: 'Study Time',
    streakDays: 'Streak Days',
    hours: 'hrs',
    days: 'days',
    selectLanguage: 'Select Language',
    chinese: '中文',
    english: 'English',
    dailyReminder: 'Daily Reminder',
    reminder: {
      title: 'Daily Reminder',
      subtitle: 'Set a time to receive learning reminders each day',
      timeLabel: 'Reminder Time',
      off: 'Off',
      permissionTitle: 'Notification Permission Required',
      permissionMessage: 'Please enable notifications in system settings to receive learning reminders',
      unsupportedEnv: 'Reminders require a Development Build. Expo Go does not support this feature.',
      notificationTitle: 'Thai Learning Reminder',
      notificationBody: "Time to study! Keep practicing every day for faster progress.",
    },
    ttsEngine: 'TTS Engine',
    limit: 'Daily Limit',
    achievementBadges: {
      streak7: '7-Day Streak',
      master: 'Tone Master',
      vocab100: 'Vocab 100',
    },
  },
  home: {
    greeting: 'Hello',
    todayProgress: "Today's learning goal completed",
    currentCourse: 'Current Course',
    recentWrong: 'Recent Wrong Words',
    noWrongWords: 'No mistakes this session 🎉',
    mastered: 'Mastered',
    reviewDue: 'Reviews Due',
    streak: 'Current Streak',
    checkIn: 'Check In',
    checkInToday: 'Checked In Today',
    checkInSuccess: 'Check-in successful',
    hoursThisWeek: 'Hours this week',
    minutesToday: 'min today',
    hoursToday: 'hrs today',
    aiError: 'AI query failed',
    typeThaiOrChinese: 'Search genuine Thai...',
  },
  ai: {
    title: 'AI In-depth Analysis',
    analysis: '✨ AI Breakdown',
    examples: '📖 Immersive Examples',
  },
  courses: {
    title: 'Choose a course',
    subtitle: 'Start your Thai language journey',
    searchPlaceholder: 'Search courses...',
    startBtnText: 'Start Learning',
    continue: 'Continue',
    locked: 'Locked',
    lessons: 'lessons',
    levels: {
      beginner: 'Beginner',
      elementary: 'Elementary',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    list: {
      alphabet: {
        title: 'Thai Alphabet',
        description: 'From 44 consonants to vowels and tones, master Thai reading and writing.',
      },
      thai_1: {
        title: 'Basic Thai 1',
        description: 'Start learning Thai from scratch, master basic vocabulary.',
      },
      thai_2: {
        title: 'Basic Thai 2',
        description: 'Master more vocabulary and start simple conversations.',
      },
      thai_3: {
        title: 'Basic Thai 3',
        description: 'Master more vocabulary and engage in more fluent conversations.',
      },
      thai_4: {
        title: 'Basic Thai 4',
        description: 'Master most high-frequency Thai vocabulary.',
      },
    },
  },
  learning: {
    basicDefinition: 'Basic Def',
    exampleSentences: 'Examples',
    usageDetails: 'Usage Details',
    grammarExamples: 'Grammar Examples',
    structure: 'Structure',
    explain: 'Explain',
    usageTip: 'Usage Tip',
    diffWithChinese: 'Diff with Chinese',
    commonMistakes: 'Common Mistakes',
    similarWordsDiff: 'Similar Words',
    pronunciationPitfalls: 'Pronunciation Pitfalls',
    usageScenarios: 'Usage Scenarios',
    dialogueExample: 'Dialogue Example',
    individualSentences: 'Example Sentences',
    viewDefinition: 'View Definition',
    nextEnter: 'Next',
    next: 'Next',
    forgot: 'Forgot',
    unsure: 'Unsure',
    know: 'Know',
    skipReview: 'Skip Review',
    sessionComplete: 'Session Complete!',
    backToHome: 'Back to Home',
    noNewWordsTitle: 'No New Words',
    noNewWordsMessage: 'You have finished all new words!',
    endSessionTitle: 'End Session?',
    endSessionMessage: 'Are you sure you want to quit?',
    quit: 'Quit',
    noExamples: 'No examples available',
    noUsage: 'No usage details available',
    setupTitle: 'Daily Plan',
    setupSubtitle: 'Select number of letters to learn/review',
    setupSubtitleWords: 'Select number of words to learn/review',
    start: 'Start Learning',
    quizInstruction: 'Select the correct meaning',
    skip: 'Skip',
    dontKnow: 'Unfamiliar',
    nextStep: 'Next',
    cognates: 'Cognates',
    memoryTips: 'Memory Tips',
    split: 'Split',
    memoryPhrase: 'Memory Phrase',
  },
  modules: {
    alphabet: 'Alphabet',
    word: 'Vocabulary',
    sentence: 'Sentences',
    article: 'Articles',
  },
  moduleAccess: {
    locked: 'Module Locked',
    lockedMessage: '{{module}} module is not yet unlocked',
    requirement: 'Unlock Requirement',
    prerequisite: {
      word: 'Complete alphabet learning and reach 95% progress',
      sentence: 'Complete vocabulary learning and reach 80% progress',
      article: 'Complete sentence learning and reach 80% progress',
    },
    currentProgress: 'Current Progress',
    remainingProgress: '{{remaining}}% remaining',
    progressComplete: 'Progress complete!',
    goBack: 'Go Back',
    noProgress: 'Please start learning first',
    unknownModule: 'Unknown module',
  },
  alphabet: {
    title: 'Thai Alphabet Learning',
    level: 'Basic',
    description: 'Learn 44 consonants and 32 vowels, mastered standard pronunciation',
    continue: 'Continue Learning',
    start: 'Start Learning',
    phase: {
      new: 'New Letter',
      review: 'Quick Review',
      final: 'Final Review',
      fix: 'Mistake Review',
      warmup: 'Warm Up',
      completed: 'Round Completed',
      finished: 'Course Completed'
    },
    roundInfo: 'Round {{current}} / {{total}}',
    skipBury: 'Skip (Bury)',
    optionsLoadFailed: 'Failed to load options',
    regenerate: 'Regenerate Question',
    checkAnswer: 'Check Answer',
    nextQuestion: 'Next Question →',
    instructions: {
      selectCorrect: 'Select the correct meaning',
      listenChoose: 'Listen and choose the letter',
      matchPronunciation: 'Match the pronunciation',
      consonantClass: 'Select the consonant class',
      initialSound: 'Identify the initial sound',
      finalSound: 'Identify the final sound'
    },
  },
  alphabetTest: {
    title: 'Alphabet Test',
    description: 'Test your alphabet knowledge',
    start: 'Start Test',
    submit: 'Submit',
    score: 'Score',
    passed: 'Pass',
    failed: 'Fail',
    retry: 'Retry',
    backToHome: 'Back to Home',
  },
  components: {
    phonics: {
      title: 'Tone Rules',
      interactive: '📌 Interactive Example',
      understood: 'Understood, Continue →'
    },
    completion: {
      courseDone: 'Course Completed!',
      roundDone: 'Round {{round}} Completed',
      courseDoneMsg: 'Congratulations! You have completed all content in this lesson!',
      roundDoneMsg: 'Take a break and get ready for the next round\n3 rounds required per lesson',
      finishCourse: 'Finish Course',
      backToCourses: 'Back to Courses'
    },
    recovery: {
      title: 'Resume Session?',
      message: 'Unfinished round detected. Do you want to continue?',
      restart: 'Restart Round',
      continue: 'Continue Learning'
    },
    miniReview: {
      hint: '💡 Hint:',
      pitchCurve: '🎵 Pitch Curve',
      playSound: 'Play Sound',
      explanation: '💡 Explanation',
      aspirated: 'Aspirated',
      unaspirated: 'Unaspirated',
      voiceless: 'Voiceless',
      voiced: 'Voiced',
      highClass: 'High',
      midClass: 'Mid',
      lowClass: 'Low',
      consonantClass: 'Class'
    },
    aspirated: {
      title: 'Aspirated Sound Training',
      instruction: '🔊 Play the target sound first, then choose the matching letter',
      playTarget: 'Play Target Sound',
      tipsTitle: '💡 Tips',
      aspirated: 'Aspirated',
      unaspirated: 'Unaspirated',
      correctAns: '✅ Correct Answer',
      aspiratedDesc: 'This is an aspirated sound (strong airflow)',
      unaspiratedDesc: 'This is an unaspirated sound (weak airflow)'
    }
  },
  alphabetCourse: {
    title: 'Alphabet Course',
    back: 'Back',
    headerSubtitle: '{{count}} Lessons · {{percent}}% Completed',
    currentBadge: 'Current',
    letterCount: '{{count}} letters',
    start: 'Start',
    takeTest: 'Take Test to Unlock All',
    drawer: {
      expectedTime: 'Expected time: 15 mins',
      description: 'Description',
      contentPreview: 'Content Preview ({{count}} items)',
    },
    lessons: {
      lesson1: {
        title: 'Lesson 1: CV Reading Basics',
        description: 'Master the core mid-class consonants and common long vowels. Build your first CV syllable-reading ability.',
      },
      lesson2: {
        title: 'Lesson 2: Leading Vowel System',
        description: 'Learn leading vowels (เ แ โ) and more high-frequency consonants.',
      },
      lesson3: {
        title: 'Lesson 3: Tone Fundamentals',
        description: 'Understand aspirated vs. unaspirated sounds and introduce the basic Thai tone system.',
      },
      lesson4: {
        title: 'Lesson 4: Consonant Classes & Tones',
        description: 'Understand how high, mid, and low consonant classes affect tone. Master the full tone system.',
      },
      lesson5: {
        title: 'Lesson 5: Compound Vowels',
        description: 'Master complex vowel clusters such as เอีย, เอือ, and อัว.',
      },
      lesson6: {
        title: 'Lesson 6: Full Coverage (Advanced)',
        description: 'Supplement advanced consonants and compound vowels. Grasp special rules like ห นำ.',
      },
      lesson7: {
        title: 'Lesson 7: Rare Letters & Special Vowels',
        description: 'Study rarely-used consonants and special vowels found in classical texts and proper nouns.',
      },
    },
  },
  questionType: {
    soundToLetter: 'Sound to Letter',
    letterToSound: 'Letter to Sound',
    syllable: 'Syllables',
    reverseSyllable: 'Reverse Syllable',
    missingLetter: 'Missing Letter',
    aspiratedContrast: 'Aspirated Contrast',
    vowelLengthContrast: 'Vowel Length Contrast',
    finalConsonant: 'Final Consonant Rule',
    tonePerception: 'Tone Perception',
    classChoice: 'Consonant Class',
    letterName: 'Letter Name',
    initialSound: 'Initial Sound',
  },
  sessionSummary: {
    title: 'Session Summary',
    wrongWords: 'Difficult Words',
    newWords: 'New Words',
    skippedWords: 'Skipped Words',
    cancelSkip: 'Un-skip',
    generateBtn: 'Generate Reading ({{count}} selected)',
    noWords: 'No words to select this round',
    generating: 'AI Generating...',
    errorTitle: 'Generation Failed',
    errorMessage: 'AI generation encountered an issue. Please try again.',
    retry: 'Retry',
  },
  microReading: {
    title: 'AI Micro-Reading',
    voicePlaceholder: 'Reading Practice - Coming Soon',
    translationLabel: 'Translation',
    backToHome: 'Back to Previous Page',
    wordsUsed: 'Words in this passage',
    saveArticle: 'Save to Practice',
    saving: 'Saving...',
    saveSuccess: 'Saved to reading practice',
    saveError: 'Save failed, please retry',
    alreadySaved: 'Article already saved',
  },
  articlePractice: {
    listTitle: 'Reading Practice',
    emptyTitle: 'No Articles Yet',
    emptyMessage: 'Save articles from the micro-reading page after your study session',
    wordCount: '{{count}} words',
    deleteConfirmTitle: 'Delete Article',
    deleteConfirmMessage: 'Are you sure you want to delete this article?',
    practiceTitle: 'Reading Practice',
    blindMode: 'Blind Listening',
    revealMode: 'Show Text',
    clozeMode: 'Cloze Practice',
    clozeFull: 'Full Text',
    clozePartial: 'Partial Cloze',
    clozeBlind: 'Full Cloze',
    tapWordHint: 'Tap any word for definition',
    shadowingTitle: 'Shadowing Practice',
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    playback: 'Playback',
    getAiFeedback: 'Get AI Pronunciation Feedback',
    feedbackTitle: 'Pronunciation Feedback',
    playOriginal: 'Play Original',
    stopPlaying: 'Stop Playing',
    ttsLoading: 'Loading audio...',
    ttsError: 'Speech synthesis failed, please retry',
    analyzing: 'Analyzing pronunciation...',
    overallScore: 'Overall Score',
    pronunciationSuggestions: 'Suggestions',
    analyzeError: 'Pronunciation analysis failed, please retry',
    noRecording: 'Please record first',
  },
};
````

## File: package.json
````json
{
  "name": "thailearningapp",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "export-logo": "node scripts/export-logo-png.js",
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "@expo-google-fonts/noto-serif-sc": "^0.4.2",
    "@expo-google-fonts/playfair-display": "^0.4.2",
    "@expo-google-fonts/sarabun": "^0.4.1",
    "@expo/cli": "^54.0.18",
    "@expo/vector-icons": "15.0.3",
    "@notifee/react-native": "^9.1.8",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/datetimepicker": "^8.6.0",
    "@react-native-community/slider": "5.0.1",
    "axios": "^1.13.2",
    "expo": "54.0.27",
    "expo-asset": "12.0.11",
    "expo-audio": "^1.1.1",
    "expo-av": "16.0.8",
    "expo-blur": "15.0.8",
    "expo-constants": "18.0.11",
    "expo-file-system": "^19.0.20",
    "expo-font": "14.0.10",
    "expo-linear-gradient": "15.0.8",
    "expo-linking": "8.0.10",
    "expo-localization": "17.0.8",
    "expo-router": "6.0.17",
    "expo-speech": "~14.0.8",
    "expo-splash-screen": "31.0.12",
    "expo-status-bar": "3.0.9",
    "i18next": "^25.6.3",
    "lucide-react-native": "^0.554.0",
    "react": "19.1.0",
    "react-i18next": "^16.3.4",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-linear-gradient": "^2.8.3",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "5.6.2",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-worklets": "0.5.1",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@resvg/resvg-js": "^2.6.2",
    "@testing-library/react-native": "^13.0.0",
    "@types/react": "~19.1.10",
    "@types/react-native": "^0.72.8",
    "babel-plugin-module-resolver": "^5.0.2",
    "react-test-renderer": "^19.2.1",
    "typescript": "^5.1.3"
  },
  "private": true
}
````
