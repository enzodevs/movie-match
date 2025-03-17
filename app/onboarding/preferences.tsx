// app/onboarding/preferences.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '~/hooks/';
import { useProfileStore } from '~/store/profileStore';
import { GenreSelector } from '~/components/onboarding/GenreSelector';
import { Button } from '~/components/default/Button';

const PreferencesScreen = () => {
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();
  const { profile, fetchProfile, updateFavoriteGenres } = useProfileStore();
  
  // Verificar se usuário está autenticado
  useEffect(() => {
    if (!user) {
      router.replace('/onboarding');
      return;
    }
    
    // Carregar perfil e preferências existentes
    const loadData = async () => {
      try {
        if (!profile) {
          await fetchProfile();
        }
        
        // Carregar gêneros da API
        await fetchGenres();
        
        // Verificar se já existem gêneros favoritos selecionados
        if (profile?.app_settings?.favorite_genres?.length) {
          setSelectedGenres(profile.app_settings.favorite_genres);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, profile]);
  
  // Função para buscar gêneros da API TMDb
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/genre/movie/list?language=pt-BR',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
      // Fallback com gêneros mais comuns
      setGenres([
        { id: 28, name: 'Ação' },
        { id: 12, name: 'Aventura' },
        { id: 16, name: 'Animação' },
        { id: 35, name: 'Comédia' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentário' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Família' },
        { id: 14, name: 'Fantasia' },
        { id: 36, name: 'História' },
        { id: 27, name: 'Terror' },
        { id: 10402, name: 'Música' },
        { id: 9648, name: 'Mistério' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Ficção científica' },
        { id: 53, name: 'Thriller' },
        { id: 10752, name: 'Guerra' },
        { id: 37, name: 'Faroeste' }
      ]);
    }
  };
  
  // Toggle seleção de gênero
  const toggleGenreSelection = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };
  
  // Salvar preferências e prosseguir
  const handleComplete = async () => {
    if (selectedGenres.length === 0) {
      // Permitir continuar mesmo sem selecionar gêneros
      router.replace('/(tabs)');
      return;
    }
    
    setIsSaving(true);
    
    try {
      await updateFavoriteGenres(selectedGenres);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      // Continuar mesmo com erro
      router.replace('/(tabs)');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-primary">
      <View className="pt-16 px-6 pb-4">
        <Text className="text-white text-3xl font-bold">Personalize sua experiência</Text>
        <Text className="text-gray-300 mt-2">
          Selecione seus gêneros favoritos para recomendações personalizadas.
        </Text>
      </View>
      
      <ScrollView className="flex-1 px-6">
        <GenreSelector
          genres={genres}
          selectedGenres={selectedGenres}
          onToggleGenre={toggleGenreSelection}
        />
        
        <View className="h-32" />
      </ScrollView>
      
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-primary border-t border-button-secondary/30">
        <Text className="text-gray-300 mb-4 text-center">
          {selectedGenres.length === 0 
            ? 'Você pode selecionar seus gêneros favoritos ou continuar sem selecionar.'
            : `Você selecionou ${selectedGenres.length} ${selectedGenres.length === 1 ? 'gênero' : 'gêneros'}.`
          }
        </Text>
        
        <Button
          title={isSaving ? "Salvando..." : "Concluir"}
          onPress={handleComplete}
          disabled={isSaving}
          className="bg-secondary"
        />
      </View>
    </View>
  );
}

export default PreferencesScreen;