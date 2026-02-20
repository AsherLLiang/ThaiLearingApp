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
