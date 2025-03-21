// Componente para animação de atraso escalonado

import React, { useEffect, Children, cloneElement, isValidElement, ReactNode } from 'react';
import { View, ViewProps } from 'react-native';

interface StaggerProps extends ViewProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  style?: any;
}

export const Stagger = ({ 
  children, 
  staggerDelay = 100,
  initialDelay = 0,
  style,
  ...props 
}: StaggerProps) => {
  // Aplica um atraso escalonado para cada filho
  const staggeredChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      const delay = initialDelay + index * staggerDelay;
      return cloneElement(child as React.ReactElement<any>, {
        delay
      });
    }
    return child;
  });
  
  return (
    <View style={style} {...props}>
      {staggeredChildren}
    </View>
  );
};