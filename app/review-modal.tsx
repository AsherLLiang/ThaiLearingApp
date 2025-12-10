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
