// app/(tabs)/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '~/hooks/';
import { useProfileStore, useMovieStore} from '~/store/';
import { Header } from '~/components/layout/Header';
import { ProfileStats } from '~/components/profile/ProfileStats';
import { ProfileListSection } from '~/components/profile/ProfileListSection';
import { Button } from '~/components/default/Button';
import { SignInModal } from '~/components/auth/SignInModal';

const ProfileScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const router = useRouter();
  
  // Auth hooks
  const { user, signOut } = useAuth();
  
  // Profile hooks
  const { 
    profile, 
    isLoading: isLoadingProfile, 
    fetchProfile,
    updateProfileImage,
    watchedMovies,
    favoriteMovies,
    watchlistMovies,
    fetchWatchedMovies,
    fetchFavoriteMovies,
    fetchWatchlistMovies
  } = useProfileStore();
  
  // Movie hooks para obter detalhes dos filmes
  const { 
    fetchMovieDetails, 
    movieDetails
  } = useMovieStore();
  
  // Carregar dados do perfil e listas de filmes quando a tela é montada
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);
  
  // Função para buscar todos os dados do perfil
  const fetchData = async () => {
    if (!user) return;
    
    await fetchProfile();
    
    // Buscar listas de filmes
    await Promise.all([
      fetchWatchedMovies(),
      fetchFavoriteMovies(),
      fetchWatchlistMovies()
    ]);
    
    // Buscar detalhes dos filmes nas listas
    const allMovieIds = [...new Set([
      ...watchedMovies.slice(0, 6),
      ...favoriteMovies.slice(0, 6),
      ...watchlistMovies.slice(0, 6)
    ])];
    
    // Buscar detalhes de cada filme se ainda não estiverem em cache
    allMovieIds.forEach(movieId => {
      if (!movieDetails[movieId]) {
        fetchMovieDetails(movieId);
      }
    });
  };
  
  // Função para atualizar dados (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  
  const selectProfileImage = async () => {
    if (!user) return;
    
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('É necessário permissão para acessar a galeria!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        await updateProfileImage(imageUri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      alert('Ocorreu um erro ao selecionar a imagem');
    }
  };
  
  // Renderização condicional baseada no estado de autenticação
  if (!user) {
    return (
      <View className="flex-1 bg-primary">
        <Stack.Screen options={{ header: () => null }} />
        <Header title="Perfil" />
        
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="person-circle-outline" size={100} color="#ff4500" />
          <Text className="text-white text-xl font-bold mt-4 text-center">
            Entre para acompanhar seus filmes
          </Text>
          <Text className="text-gray-300 text-center mt-2 mb-6">
            Crie um perfil para marcar filmes como assistidos, favoritos e criar listas personalizadas.
          </Text>
          
          <Button
            title="Entrar / Criar Conta"
            onPress={() => setShowAuthModal(true)}
            className="w-full bg-secondary py-3 px-2 rounded-lg flex-row items-center justify-center"
          />
        </View>
        
        <SignInModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </View>
    );
  }
  
  // Exibir indicador de loading enquanto carrega dados do perfil
  if (isLoadingProfile && !profile) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Stack.Screen options={{ header: () => null }} />
        <Header title="Perfil" />
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={{ header: () => null }} />
      <Header title="Perfil" />
      
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ff4500']}
            tintColor="#ff4500"
          />
        }
      >
        {/* Cabeçalho do perfil */}
        <View className="px-6 py-6 flex-row items-center">
          <TouchableOpacity onPress={selectProfileImage}>
            {profile?.profile_url ? (
              <Image
                source={{ uri: profile.profile_url }}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <View className="w-20 h-20 rounded-full bg-button-secondary items-center justify-center">
                <Ionicons name="person" size={36} color="#ffffff" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-secondary rounded-full p-1">
              <Ionicons name="camera" size={16} color="#ffffff" />
            </View>
          </TouchableOpacity>
          
          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold">{profile?.display_name}</Text>
            <Text className="text-gray-300">{profile?.email}</Text>
            
            <View className="flex-row mt-3">
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                className="bg-button-secondary py-1 px-3 rounded-full mr-2 flex-row items-center"
              >
                <Ionicons name="settings-outline" size={16} color="#ffffff" />
                <Text className="text-white text-xs ml-1">Configurações</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={signOut}
                className="bg-button-secondary py-1 px-3 rounded-full flex-row items-center"
              >
                <Ionicons name="log-out-outline" size={16} color="#ffffff" />
                <Text className="text-white text-xs ml-1">Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Estatísticas do perfil */}
        <ProfileStats profile={profile} />
        
        {/* Seção: Filmes assistidos recentemente */}
        <ProfileListSection
          title="Filmes Assistidos Recentemente"
          movieIds={watchedMovies.slice(0, 6)}
          emptyMessage="Você ainda não marcou nenhum filme como assistido"
          onSeeAllPress={() => {}} // TODO: Navegar para tela de todos os filmes assistidos
        />
        
        {/* Seção: Filmes favoritos */}
        <ProfileListSection
          title="Filmes Favoritos"
          movieIds={favoriteMovies.slice(0, 6)}
          emptyMessage="Você ainda não adicionou nenhum filme aos favoritos"
          onSeeAllPress={() => {}} // TODO: Navegar para tela de todos os favoritos
        />
        
        {/* Seção: Filmes para assistir (Watchlist) */}
        <ProfileListSection
          title="Watchlist"
          movieIds={watchlistMovies.slice(0, 6)}
          emptyMessage="Sua watchlist está vazia"
          onSeeAllPress={() => {}} // TODO: Navegar para tela de todos os filmes na watchlist
        />
        
        {/* Espaço extra no final para evitar que conteúdo fique sob a tab bar */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;