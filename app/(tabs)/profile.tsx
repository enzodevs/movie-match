import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/default/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Profile' }} />
      <View style={styles.container}>
        <ScreenContent path="app/(tabs)/profile.tsx" title="Profile" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
