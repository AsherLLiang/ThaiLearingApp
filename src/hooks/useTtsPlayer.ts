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
