// components/movie/details/MovieSimilar.tsx
import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { useMovieStore } from '~/store/';
import { MovieGridCard } from '~/components/movie/MovieGridCard';

interface MovieSimilarProps {
  movieId: number;
  similarMovies?: any[];
}

export const MovieSimilar = ({ movieId, similarMovies }: MovieSimilarProps) => {
  const { isLoadingSimilar } = useMovieStore();
  const isLoading = isLoadingSimilar[movieId];
  
  if (isLoading) {
    return (
      <View className="px-4 pt-6 pb-8">
        <Text className="text-white text-lg font-bold mb-3">Filmes Similares</Text>
        <ActivityIndicator size="small" color="#ff4500" />
      </View>
    );
  }
  
  if (!similarMovies || similarMovies.length === 0) {
    return (
      <View className="px-4 pt-6 pb-8">
        <Text className="text-white text-lg font-bold mb-3">Filmes Similares</Text>
        <Text className="text-gray-400">Filmes similares não encontrados.</Text>
      </View>
    );
  }
  
  return (
    <View className="px-4 pt-6 pb-28">
      <Text className="text-white text-lg font-bold mb-3">Filmes Similares</Text>
      <FlatList
        data={similarMovies.slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mr-3">
            <MovieGridCard 
              id={item.id} 
              posterPath={item.poster_path} 
            />
            <Text className="text-white text-xs mt-1 w-24" numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
};