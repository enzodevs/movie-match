// Componente para animação de slide in

import React, { useEffect } from 'react';
import { Animated, ViewProps } from 'react-native';

type Direction = 'left' | 'right' | 'top' | 'bottom';

interface SlideInProps extends ViewProps {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  style?: any;
}

export const SlideIn = ({ 
  children, 
  direction = 'bottom',
  distance = 100,
  duration = 300, 
  delay = 0,
  style,
  ...props 
}: SlideInProps) => {
  // Determinar a propriedade de transformação com base na direção
  const getTransform = () => {
    switch (direction) {
      case 'left':
        return { translateX: new Animated.Value(-distance) };
      case 'right':
        return { translateX: new Animated.Value(distance) };
      case 'top':
        return { translateY: new Animated.Value(-distance) };
      case 'bottom':
      default:
        return { translateY: new Animated.Value(distance) };
    }
  };
  
  const transform = getTransform();
  const transformKey = Object.keys(transform)[0] as keyof typeof transform;
  const animation = transform[transformKey] as Animated.Value;
  
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver: true
    }).start();
  }, []);
  
  return (
    <Animated.View 
      style={[
        style,
        { transform: [{ [transformKey]: animation }] }
      ]} 
      {...props}
    >
      {children}
    </Animated.View>
  );
};