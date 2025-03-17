// Componente de botão animado com escala e opacidade

import React from 'react';
import { TouchableWithoutFeedback, Animated, ViewProps } from 'react-native';

interface AnimatedPressableProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  scaleSize?: number;
  scaleDuration?: number;
  activeOpacity?: number;
  disabled?: boolean;
  style?: any;
}

export const AnimatedPressable = ({ 
  children, 
  onPress,
  scaleSize = 0.95,
  scaleDuration = 150,
  activeOpacity = 0.8,
  disabled = false,
  style,
  ...props 
}: AnimatedPressableProps) => {
  const scaleAnim = new Animated.Value(1);
  const opacityAnim = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: scaleSize,
        duration: scaleDuration,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: activeOpacity,
        duration: scaleDuration,
        useNativeDriver: true
      })
    ]).start();
  };
  
  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: scaleDuration,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: scaleDuration,
        useNativeDriver: true
      })
    ]).start();
  };
  
  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={disabled ? undefined : onPress}
    >
      <Animated.View
        style={[
          style,
          { 
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim 
          }
        ]}
        {...props}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};