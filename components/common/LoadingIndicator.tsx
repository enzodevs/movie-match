// Componente para exibir indicadores de carregamento com diferentes estilos

import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

type LoadingIndicatorSize = 'small' | 'large' | 'fullscreen';
type LoadingIndicatorVariant = 'default' | 'primary' | 'secondary';

interface LoadingIndicatorProps {
  /**
   * Tamanho do indicador
   * @default 'large'
   */
  size?: LoadingIndicatorSize;
  
  /**
   * Variante de cor
   * @default 'primary'
   */
  variant?: LoadingIndicatorVariant;
  
  /**
   * Texto opcional para exibir abaixo do indicador
   */
  text?: string;
  
  /**
   * Classes CSS adicionais para estilização
   */
  className?: string;
}

/**
 * Componente para exibir um indicador de carregamento
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  variant = 'primary',
  text,
  className = ''
}) => {
  // Mapear variantes para cores
  const colorMap = {
    default: '#ffffff',
    primary: '#ff4500',
    secondary: '#333333'
  };
  
  // Mapear tamanhos para valores do ActivityIndicator
  const sizeMap = {
    small: 'small' as const,
    large: 'large' as const,
    fullscreen: 'large' as const
  };
  
  // Definir classes CSS com base no tamanho
  const containerClass = size === 'fullscreen'
    ? 'flex-1 justify-center items-center bg-primary/80 absolute inset-0 z-50'
    : 'justify-center items-center py-4';
  
  return (
    <View className={`${containerClass} ${className}`}>
      <ActivityIndicator 
        size={sizeMap[size]} 
        color={colorMap[variant]} 
      />
      
      {text && (
        <Text className="text-white text-sm mt-2">{text}</Text>
      )}
    </View>
  );
};