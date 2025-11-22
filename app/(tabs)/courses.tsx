// app/(tabs)/courses.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';
import { Typography } from '@/src/constants/typography';

export default function CoursesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>课程页面</Text>
      <Text style={styles.subtitle}>即将推出</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.notoSerifBold,
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Typography.notoSerifRegular,
    fontSize: 16,
    color: Colors.taupe,
  },
});