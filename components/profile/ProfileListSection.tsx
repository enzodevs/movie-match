// components/profile/ProfileListSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMovieStore } from '~/store/';
import { MovieGridCard } from '~/components/movie/MovieGridCard';

interface ProfileListSectionProps {
  title: string;
  movieIds: number[];
  emptyMessage: string;
  onSeeAllPress: () => void;
}

export const ProfileListSection = ({ 
  title, 
  movieIds, 
  emptyMessage,
  onSeeAllPress 
}: ProfileListSectionProps) => {
  const { movieDetails, isLoadingDetails } = useMovieStore();
  
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center px-6 mb-3">
        <Text className="text-white text-lg font-bold">{title}</Text>
        
        {movieIds.length > 0 && (
          <TouchableOpacity 
            onPress={onSeeAllPress}
            className="flex-row items-center"
          >
            <Text className="text-secondary text-sm mr-1">Ver todos</Text>
            <Ionicons name="chevron-forward" size={16} color="#ff4500" />
          </TouchableOpacity>
        )}
      </View>
      
      {movieIds.length === 0 ? (
        <View className="bg-button-secondary/20 py-6 mx-6 rounded-lg items-center">
          <Ionicons name="film-outline" size={36} color="#999999" />
          <Text className="text-gray-300 mt-2 text-center">{emptyMessage}</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
        >
          {movieIds.map((movieId) => {
            const movie = movieDetails[movieId];
            const isLoading = isLoadingDetails[movieId];
            
            if (isLoading) {
              return (
                <View 
                  key={movieId}
                  className="w-24 h-36 rounded-lg bg-button-secondary/20 mr-3 items-center justify-center"
                >
                  <ActivityIndicator size="small" color="#ff4500" />
                </View>
              );
            }
            
            return (
              <View key={movieId} className="mr-3">
                <MovieGridCard 
                  id={movieId} 
                  posterPath={movie?.poster_path || ''} 
                />
                {movie && (
                  <Text className="text-white text-xs mt-1 w-24" numberOfLines={1}>
                    {movie.title}
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};