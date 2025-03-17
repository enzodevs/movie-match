// components/movie/details/MovieCast.tsx
import React from 'react';
import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useMovieStore } from '~/store/';
import { router } from 'expo-router';

interface MovieCastProps {
  movieId: number;
  credits?: {
    cast?: any[];
    crew?: any[];
  };
}

export const MovieCast = ({ movieId, credits }: MovieCastProps) => {
  const { isLoadingCredits } = useMovieStore();
  const isLoading = isLoadingCredits[movieId];
  
  const navigateToPersonDetails = (personId: number) => {
    router.push({
      pathname: "/person/[personId]" as never,
      params: { personId: personId.toString() }
    });
  };
  
  if (isLoading) {
    return (
      <View className="px-4 pt-4">
        <Text className="text-white text-lg font-bold mb-3">Elenco</Text>
        <ActivityIndicator size="small" color="#ff4500" />
      </View>
    );
  }
  
  if (!credits || !credits.cast || credits.cast.length === 0) {
    return (
      <View className="px-4 pt-4">
        <Text className="text-white text-lg font-bold mb-3">Elenco</Text>
        <Text className="text-gray-400">Informações do elenco não disponíveis.</Text>
      </View>
    );
  }
  
  return (
    <View className="px-4 pt-4">
      <Text className="text-white text-lg font-bold mb-3">Elenco</Text>
      <FlatList
        data={credits.cast.slice(0, 15)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // Usar a imagem local como fallback se profile_path for null ou vazio
          const profileUrl = item.profile_path
            ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
            : require('~/assets/images/profile-placeholder.png');
          
          return (
            <TouchableOpacity 
              className="mr-4 items-center w-20"
              onPress={() => navigateToPersonDetails(item.id)}
            >
              <Image
                source={typeof profileUrl === 'string' ? { uri: profileUrl } : profileUrl}
                className="w-20 h-20 rounded-full bg-button-secondary"
                resizeMode="cover"
              />
              <Text className="text-white text-xs mt-2 text-center" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-gray-400 text-xs text-center" numberOfLines={1}>
                {item.character}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};