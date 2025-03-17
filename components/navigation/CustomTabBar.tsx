// components/navigation/CustomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform, SafeAreaView } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  
  // Calcular o padding adicional baseado no dispositivo
  // Garantimos o espaçamento adequado em dispositivos com ou sem notch
  const bottomInset = Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 10;
  
  return (
    <SafeAreaView style={[
      styles.safeArea, 
      { paddingBottom: bottomInset }
    ]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const icon = options.tabBarIcon ? 
            options.tabBarIcon({ 
              focused: isFocused, 
              color: isFocused ? '#ff4500' : '#999999', 
              size: 24 
            }) : null;

          // Estilos animados para o indicador da tab
          const animatedStyles = useAnimatedStyle(() => {
            return {
              transform: [
                { 
                  scale: withSpring(isFocused ? 1 : 0.8, { 
                    damping: 15, 
                    stiffness: 100 
                  }) 
                }
              ],
              opacity: withSpring(isFocused ? 1 : 0.7)
            };
          });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <Animated.View style={[styles.iconContainer, animatedStyles]}>
                {icon}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333333',
    borderTopWidth: 1,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});