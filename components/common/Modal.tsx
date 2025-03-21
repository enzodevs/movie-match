// Componente de modal reutilizável

import React, { ReactNode } from 'react';
import { 
  Modal as RNModal, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  StyleProp,
  ViewStyle,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface ModalProps {
  /**
   * Se o modal está visível
   */
  visible: boolean;
  
  /**
   * Função para fechar o modal
   */
  onClose: () => void;
  
  /**
   * Título do modal
   */
  title?: string;
  
  /**
   * Conteúdo do modal
   */
  children: ReactNode;
  
  /**
   * Se o conteúdo deve ser envolvido em um ScrollView
   * @default true
   */
  scrollable?: boolean;
  
  /**
   * Se o modal deve ter fundo blur
   * @default true
   */
  blurBackground?: boolean;
  
  /**
   * Intensidade do blur (1-100)
   * @default 80
   */
  blurIntensity?: number;
  
  /**
   * Classes CSS adicionais para o container do modal
   */
  className?: string;
  
  /**
   * Estilo customizado para o container do modal
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Componente de modal reutilizável
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  scrollable = true,
  blurBackground = true,
  blurIntensity = 80,
  className = '',
  style
}) => {
  // Renderizar conteúdo do modal
  const renderContent = () => {
    // Container principal do modal
    const modalContainer = (
      <View 
        className={`bg-button-secondary rounded-2xl p-4 w-full max-w-md ${className}`}
        style={style}
      >
        {/* Cabeçalho */}
        <View className="flex-row justify-between items-center mb-4">
          {title ? (
            <Text className="text-white text-lg font-bold">
              {title}
            </Text>
          ) : (
            <View />
          )}
          
          <TouchableOpacity 
            onPress={onClose}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
        
        {/* Conteúdo */}
        {scrollable ? (
          <ScrollView>
            {children}
          </ScrollView>
        ) : (
          children
        )}
      </View>
    );
    
    // Se deve ter fundo blur
    if (blurBackground) {
      return (
        <BlurView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}
          intensity={blurIntensity}
          tint="dark"
        >
          {modalContainer}
        </BlurView>
      );
    }
    
    // Sem fundo blur
    return (
      <View className="flex-1 justify-center items-center p-4 bg-primary/95">
        {modalContainer}
      </View>
    );
  };
  
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}
    >
      {renderContent()}
    </RNModal>
  );
};