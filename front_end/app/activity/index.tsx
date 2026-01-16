import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Activity</Text>
      <Text style={styles.content}>Activity content goes here</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});