// app/_layout.tsx
import '../global.css';

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '~/contexts';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1a1a' },
            gestureEnabled: true,
            animation: 'slide_from_right',
            animationDuration: 300,
            presentation: 'card',
            animationTypeForReplace: 'push',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="modal" 
            options={{ 
              presentation: 'modal',
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="details/[movieId]" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
              animationTypeForReplace: 'push',
            }} 
          />
          <Stack.Screen 
            name="person/[personId]" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
          <Stack.Screen 
            name="onboarding" 
            options={{ 
              headerShown: false,
              animation: 'fade',
            }} 
          />
          <Stack.Screen 
            name="onboarding/preferences" 
            options={{ 
              headerShown: false,
              animation: 'slide_from_right',
            }} 
          />
        </Stack>
      </AppProvider>
    </GestureHandlerRootView>
  );
}