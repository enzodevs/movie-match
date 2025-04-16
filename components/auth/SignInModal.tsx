// Componente modal de autenticação

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/hooks';
import { profileService } from '~/services/api/profile';
import { User, UserProfile } from '~/types';

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (userId: string) => void;
}

// Separate interfaces for form state and validation
interface AuthFormState {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  isLogin: boolean;
}

// Component for displaying error messages
const ErrorMessage = ({ message }: { message: string | null }) => {
  if (!message) return null;
  
  return (
    <View className="bg-red-800/30 p-3 rounded-lg mb-4 flex-row items-center">
      <Ionicons name="alert-circle" size={20} color="#ff4444" />
      <Text className="text-red-400 ml-2">{message}</Text>
    </View>
  );
};

export const SignInModal = ({ visible, onClose, onSuccess }: SignInModalProps) => {
  // Form state
  const [formState, setFormState] = useState<AuthFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    isLogin: true
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  
  // Handle form input changes
  const handleChange = (field: keyof AuthFormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };
  
  // Validate form inputs
  const validateForm = (): boolean => {
    const { email, password, confirmPassword, displayName, isLogin } = formState;
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido');
      return false;
    }
    
    if (!isLogin) {
      if (!displayName.trim()) {
        setError('Por favor, insira um nome de exibição');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        return false;
      }
    }
    
    return true;
  };
  
  // Create user profile after signup
  const createUserProfile = async (userId: string, email: string): Promise<boolean> => {
    try {
      const profileData: Partial<UserProfile> = {
        email: email,
        display_name: formState.displayName,
        app_settings: {
          theme: 'dark',
          notifications: true,
          language: 'pt-BR'
        }
      };
      
      return await profileService.updateProfile(userId, profileData);
    } catch (err) {
      console.error('Error creating profile:', err);
      return false;
    }
  };
  
  // Handle authentication
  const handleAuth = async () => {
    setError(null);
    
    if (!validateForm()) return;
    
    const { email, password, isLogin } = formState;
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        // Sign up and get user data
        const user = await signUp(email, password);
        
        if (user && user.id) {
          // Create profile for the new user
          const profileCreated = await createUserProfile(user.id, user.email || email);
          
          if (profileCreated) {
            // Notify parent component
            onSuccess?.(user.id);
          }
        }
      }
      
      // Reset form and close modal
      resetForm();
      onClose();
    } catch (err: any) {
      console.error('Authentication error:', err);
      
      // User-friendly error messages
      if (err.message?.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else if (err.message?.includes('already registered')) {
        setError('Este email já está registrado');
      } else {
        setError('Erro de autenticação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle between login and signup
  const toggleMode = () => {
    setFormState(prev => ({ ...prev, isLogin: !prev.isLogin }));
    setError(null);
  };
  
  // Reset form state
  const resetForm = () => {
    setFormState({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      isLogin: true
    });
  };
  
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-primary/95 justify-center"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="bg-button-secondary m-6 p-6 rounded-xl">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">
                {formState.isLogin ? 'Entrar' : 'Criar Conta'}
              </Text>
              
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {/* Error message */}
            <ErrorMessage message={error} />

            {/* Display name field (sign up only) */}
            {!formState.isLogin && (
              <View className="mb-4">
                <Text className="text-white mb-2">Nome de Exibição</Text>
                <TextInput
                  className="bg-primary px-4 py-3 rounded-lg text-white"
                  placeholder="Como quer ser chamado"
                  placeholderTextColor="#999999"
                  value={formState.displayName}
                  onChangeText={(value) => handleChange('displayName', value)}
                />
              </View>
            )}
            
            {/* Email field */}
            <View className="mb-4">
              <Text className="text-white mb-2">Email</Text>
              <TextInput
                className="bg-primary px-4 py-3 rounded-lg text-white"
                placeholder="Seu email"
                placeholderTextColor="#999999"
                value={formState.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            {/* Password field */}
            <View className="mb-4">
              <Text className="text-white mb-2">Senha</Text>
              <TextInput
                className="bg-primary px-4 py-3 rounded-lg text-white"
                placeholder="Sua senha"
                placeholderTextColor="#999999"
                value={formState.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry
              />
            </View>
            
            {/* Confirm password field (sign up only) */}
            {!formState.isLogin && (
              <View className="mb-6">
                <Text className="text-white mb-2">Confirmar Senha</Text>
                <TextInput
                  className="bg-primary px-4 py-3 rounded-lg text-white"
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#999999"
                  value={formState.confirmPassword}
                  onChangeText={(value) => handleChange('confirmPassword', value)}
                  secureTextEntry
                />
              </View>
            )}
            
            {/* Submit button */}
            <TouchableOpacity
              onPress={handleAuth}
              disabled={isLoading}
              className={`bg-secondary py-3 rounded-lg items-center mt-2 ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="text-white font-bold">
                  {formState.isLogin ? 'Entrar' : 'Cadastrar'}
                </Text>
              )}
            </TouchableOpacity>
            
            {/* Toggle mode button */}
            <TouchableOpacity
              onPress={toggleMode}
              className="mt-6 items-center"
            >
              <Text className="text-secondary">
                {formState.isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};