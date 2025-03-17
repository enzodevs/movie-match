// Componente de card reutilizável

import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  /**
   * Conteúdo do card
   */
  children: ReactNode;
  
  /**
   * Título do card (opcional)
   */
  title?: string;
  
  /**
   * Se o card deve ser pressionável
   * @default false
   */
  pressable?: boolean;
  
  /**
   * Função a ser chamada ao pressionar o card
   */
  onPress?: () => void;
  
  /**
   * Se o card deve ter um gradiente de fundo
   * @default false
   */
  gradient?: boolean;
  
  /**
   * Cores do gradiente (usado apenas se gradient=true)
   * @default ['#1a1a1a', '#333333']
   */
  gradientColors?: readonly [string, string, ...string[]];
  
  /**
   * Classes CSS adicionais para estilização
   */
  className?: string;
  
  /**
   * Estilo customizado (opcional)
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Componente de card reutilizável
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  pressable = false,
  onPress,
  gradient = false,
  gradientColors = ['#1a1a1a', '#333333'] as const,
  className = '',
  style
}) => {
  // Conteúdo do card
  const cardContent = (
    <>
      {title && (
        <Text className="text-white font-bold mb-2 text-lg">
          {title}
        </Text>
      )}
      {children}
    </>
  );
  
  // Se for um card com gradiente
  if (gradient) {
    const content = (
      <LinearGradient
        colors={gradientColors}
        className={`p-4 rounded-lg ${className}`}
        style={style}
      >
        {cardContent}
      </LinearGradient>
    );
    
    // Se for pressionável, envolver em TouchableOpacity
    if (pressable && onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {content}
        </TouchableOpacity>
      );
    }
    
    return content;
  }
  
  // Card normal sem gradiente
  const content = (
    <View 
      className={`bg-button-secondary p-4 rounded-lg ${className}`}
      style={style}
    >
      {cardContent}
    </View>
  );
  
  // Se for pressionável, envolver em TouchableOpacity
  if (pressable && onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  
  return content;
};