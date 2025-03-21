// Componente para animação de fade in

import React, { useEffect } from 'react';
import { Animated, ViewProps } from 'react-native';

interface FadeInProps extends ViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  from?: number;
  style?: any;
}

export const FadeIn = ({ 
  children, 
  duration = 300, 
  delay = 0, 
  from = 0,
  style,
  ...props 
}: FadeInProps) => {
  const opacity = new Animated.Value(from);
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true
    }).start();
  }, []);
  
  return (
    <Animated.View style={[{ opacity }, style]} {...props}>
      {children}
    </Animated.View>
  );
};

