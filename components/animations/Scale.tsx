// Componente para animação de escala

import React, { useEffect } from 'react';
import { Animated, ViewProps } from 'react-native';

interface ScaleProps extends ViewProps {
  children: React.ReactNode;
  initialScale?: number;
  finalScale?: number;
  duration?: number;
  delay?: number;
  style?: any;
}

export const Scale = ({ 
  children, 
  initialScale = 0.9,
  finalScale = 1,
  duration = 300, 
  delay = 0,
  style,
  ...props 
}: ScaleProps) => {
  const scale = new Animated.Value(initialScale);
  
  useEffect(() => {
    Animated.timing(scale, {
      toValue: finalScale,
      duration,
      delay,
      useNativeDriver: true
    }).start();
  }, []);
  
  return (
    <Animated.View 
      style={[
        style,
        { transform: [{ scale }] }
      ]} 
      {...props}
    >
      {children}
    </Animated.View>
  );
};