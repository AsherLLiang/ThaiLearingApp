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