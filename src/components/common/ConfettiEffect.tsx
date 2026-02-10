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
