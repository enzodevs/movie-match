import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '~/hooks/useAuth';
import { useProfile } from '~/hooks/useProfile';
import { Button } from '~/components/default/Button';
import { Header } from '~/components/layout/Header';

const SettingsScreen = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { profile, updateProfile, isLoading } = useProfile();
  
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!displayName.trim()) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({ display_name: displayName });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Temporary handle for password change since we don't have a route yet
  const handlePasswordChange = () => {
    // In a real app, we would navigate to the password change screen
    alert('Funcionalidade de alteração de senha será implementada em breve!');
  };

  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={{ header: () => null }} />
      <Header 
        title="Configurações" 
        hasBackButton={true}
        onBack={() => router.back()} 
      />
      
      <ScrollView className="px-6 py-4">
        {/* Seção de Perfil */}
        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">Perfil</Text>
          
          <View className="bg-button-secondary/20 p-4 rounded-lg">
            <View className="mb-4">
              <Text className="text-gray-300 mb-2">Nome de Exibição</Text>
              <TextInput
                className="bg-primary px-4 py-3 rounded-lg text-white"
                placeholder="Seu nome"
                placeholderTextColor="#999999"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
            
            <View className="mb-4">
              <Text className="text-gray-300 mb-2">Email</Text>
              <TextInput
                className="bg-primary/50 px-4 py-3 rounded-lg text-gray-300"
                value={user?.email || ''}
                editable={false}
              />
            </View>
            
            <Button
              title={isUpdating ? "Salvando..." : "Salvar Alterações"}
              onPress={handleSave}
              disabled={isUpdating || !displayName.trim()}
              className="mt-2"
              icon={isUpdating ? 
                <ActivityIndicator size="small" color="#ffffff" /> : 
                <Ionicons name="save-outline" size={20} color="#ffffff" />
              }
            />
          </View>
        </View>
        
        {/* Seção de Conta */}
        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">Conta</Text>
          
          <View className="bg-button-secondary/20 p-4 rounded-lg">
            <Button
              title="Alterar Senha"
              onPress={handlePasswordChange}
              variant="outline"
              className="mb-3"
              icon={<Ionicons name="key-outline" size={20} color="#ff4500" />}
            />
            
            <Button
              title="Sair"
              onPress={signOut}
              variant="danger"
              icon={<Ionicons name="log-out-outline" size={20} color="#ffffff" />}
            />
          </View>
        </View>
        
        {/* Seção de Aparência */}
        <View className="mb-8">
          <Text className="text-white text-lg font-bold mb-4">Aparência</Text>
          
          <View className="bg-button-secondary/20 p-4 rounded-lg">
            <Text className="text-gray-300 mb-4">Modo Escuro/Automático/Claro</Text>
            {/* Implementar toggle de tema aqui */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;