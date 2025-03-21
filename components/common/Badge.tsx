// Componente de badge para exibir pequenas informações

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface BadgeProps {
  /**
   * Texto do badge
   */
  text: string;
  
  /**
   * Variante visual do badge
   * @default 'default'
   */
  variant?: BadgeVariant;
  
  /**
   * Ícone opcional
   */
  icon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Tamanho do ícone
   * @default 14
   */
  iconSize?: number;
  
  /**
   * Se o badge deve ser pequeno
   * @default false
   */
  small?: boolean;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Componente de badge para exibir pequenas informações
 */
export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'default',
  icon,
  iconSize = 14,
  small = false,
  className = ''
}) => {
  // Mapear variantes para classes
  const variantClasses = {
    default: 'bg-button-secondary/20',
    primary: 'bg-secondary',
    secondary: 'bg-button-secondary',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };
  
  // Determinar padding com base no tamanho
  const paddingClass = small 
    ? 'px-2 py-1' 
    : 'px-3 py-1.5';
  
  // Determinar tamanho do texto
  const textClass = small
    ? 'text-xs'
    : 'text-sm';
  
  return (
    <View className={`${variantClasses[variant]} ${paddingClass} rounded-full flex-row items-center ${className}`}>
      {icon && (
        <Ionicons 
          name={icon} 
          size={iconSize} 
          color="#ffffff" 
          style={{ marginRight: 4 }}
        />
      )}
      
      <Text className={`text-white ${textClass} ${icon ? 'ml-1' : ''}`}>
        {text}
      </Text>
    </View>
  );
};