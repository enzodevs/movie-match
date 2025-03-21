// Componente para exibir estados vazios (quando não há dados)

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  /**
   * Ícone a ser exibido
   * @default 'alert-circle-outline'
   */
  icon?: keyof typeof Ionicons.glyphMap;
  
  /**
   * Cor do ícone
   * @default '#999999'
   */
  iconColor?: string;
  
  /**
   * Tamanho do ícone
   * @default 36
   */
  iconSize?: number;
  
  /**
   * Título principal
   */
  title: string;
  
  /**
   * Mensagem descritiva
   */
  message?: string;
  
  /**
   * Texto do botão de ação (opcional)
   */
  actionText?: string;
  
  /**
   * Função a ser chamada ao pressionar o botão de ação
   */
  onAction?: () => void;
  
  /**
   * Classes CSS adicionais para estilização
   */
  className?: string;
}

/**
 * Componente para exibir estados vazios (quando não há dados)
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'alert-circle-outline',
  iconColor = '#999999',
  iconSize = 36,
  title,
  message,
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <View className={`bg-button-secondary/20 py-6 rounded-lg items-center ${className}`}>
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      
      <Text className="text-white font-bold mt-3 text-center">
        {title}
      </Text>
      
      {message && (
        <Text className="text-gray-300 mt-1 text-center px-4">
          {message}
        </Text>
      )}
      
      {actionText && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="mt-4 bg-secondary rounded-full py-2 px-4"
        >
          <Text className="text-white font-bold">{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};