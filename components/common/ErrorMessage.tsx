// Componente para exibir mensagens de erro

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ErrorType } from '~/services/errorService';

interface ErrorMessageProps {
  /**
   * Mensagem de erro
   */
  message: string;
  
  /**
   * Tipo de erro
   * @default ErrorType.UNKNOWN
   */
  type?: ErrorType;
  
  /**
   * Texto do botão de tentar novamente
   */
  retryText?: string;
  
  /**
   * Callback ao clicar no botão de tentar novamente
   */
  onRetry?: () => void;
  
  /**
   * Callback ao dispensar o erro
   */
  onDismiss?: () => void;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

/**
 * Componente para exibir mensagens de erro
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = ErrorType.UNKNOWN,
  retryText,
  onRetry,
  onDismiss,
  className = ''
}) => {
  // Mapear tipos de erro para ícones
  const errorIcons: Record<ErrorType, keyof typeof Ionicons.glyphMap> = {
    [ErrorType.NETWORK]: 'wifi',
    [ErrorType.AUTH]: 'lock-closed',
    [ErrorType.VALIDATION]: 'warning',
    [ErrorType.SERVER]: 'server',
    [ErrorType.NOT_FOUND]: 'search',
    [ErrorType.PERMISSION]: 'key',
    [ErrorType.UNKNOWN]: 'alert-circle'
  };
  
  // Mapear tipos de erro para cores
  const errorColors: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: '#3498db', // Azul
    [ErrorType.AUTH]: '#9b59b6',    // Roxo
    [ErrorType.VALIDATION]: '#f39c12', // Laranja
    [ErrorType.SERVER]: '#e74c3c',  // Vermelho
    [ErrorType.NOT_FOUND]: '#f1c40f', // Amarelo
    [ErrorType.PERMISSION]: '#d35400', // Laranja escuro
    [ErrorType.UNKNOWN]: '#e74c3c'  // Vermelho
  };
  
  const icon = errorIcons[type];
  const color = errorColors[type];
  
  return (
    <View className={`bg-red-800/30 p-3 rounded-lg mb-4 ${className}`}>
      <View className="flex-row items-center">
        <Ionicons name={icon} size={20} color={color} />
        <Text className="text-white ml-2 flex-1">{message}</Text>
        
        {onDismiss && (
          <TouchableOpacity 
            onPress={onDismiss}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="close" size={20} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>
      
      {onRetry && retryText && (
        <TouchableOpacity
          onPress={onRetry}
          className="mt-2 bg-button-secondary py-1 px-3 rounded-lg self-end"
        >
          <Text className="text-white text-sm">{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};