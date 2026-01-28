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
