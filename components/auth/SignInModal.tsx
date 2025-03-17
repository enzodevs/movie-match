// Componente modal de autenticação

import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '~/hooks/';

interface SignInModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SignInModal = ({ visible, onClose, onSuccess }: SignInModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  
  const handleAuth = async () => {
    setError(null);
    
    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido');
      return;
    }
    
    // Validação de senhas no cadastro
    if (!isLogin && password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      
      // Autenticação bem-sucedida
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err: any) {
      console.error('Erro de autenticação:', err);
      
      // Mensagens de erro amigáveis
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else if (err.message.includes('already registered')) {
        setError('Este email já está registrado');
      } else {
        setError('Erro de autenticação. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
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
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white text-xl font-bold">
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Text>
              
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            {error && (
              <View className="bg-red-800/30 p-3 rounded-lg mb-4 flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#ff4444" />
                <Text className="text-red-400 ml-2">{error}</Text>
              </View>
            )}
            
            <View className="mb-4">
              <Text className="text-white mb-2">Email</Text>
              <TextInput
                className="bg-primary px-4 py-3 rounded-lg text-white"
                placeholder="Seu email"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-white mb-2">Senha</Text>
              <TextInput
                className="bg-primary px-4 py-3 rounded-lg text-white"
                placeholder="Sua senha"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            {!isLogin && (
              <View className="mb-6">
                <Text className="text-white mb-2">Confirmar Senha</Text>
                <TextInput
                  className="bg-primary px-4 py-3 rounded-lg text-white"
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#999999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            )}
            
            <TouchableOpacity
              onPress={handleAuth}
              disabled={isLoading}
              className={`bg-secondary py-3 rounded-lg items-center mt-2 ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="text-white font-bold">
                  {isLogin ? 'Entrar' : 'Cadastrar'}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={toggleMode}
              className="mt-6 items-center"
            >
              <Text className="text-secondary">
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};