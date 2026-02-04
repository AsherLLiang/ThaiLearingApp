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
