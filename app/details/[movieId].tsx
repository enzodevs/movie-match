// Página de detalhes do filme

import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useMovieStore } from '~/store/movieStore';
import { Header } from '~/components/layout/Header';

const { width } = Dimensions.get('window');

export default function MovieDetails() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const id = Number(movieId);
  
  const { fetchMovieDetails, movieDetails, isLoadingDetails } = useMovieStore();
  const movie = movieDetails[id];
  const isLoading = isLoadingDetails[id];
  
  useEffect(() => {
    fetchMovieDetails(id);
  }, [id]);

  if (!movie && isLoading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Stack.Screen options={{ header: () => null }} />
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Stack.Screen options={{ header: () => null }} />
        <Text className="text-white text-lg">Filme não encontrado</Text>
      </View>
    );
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : 'https://via.placeholder.com/780x439?text=No+Image';
    
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image';

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';

  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={{ header: () => null }} />
      <Header hasBackButton title="" />
      
      <ScrollView className="flex-1">
        {/* Seção Hero com backgrop */}
        <View className="relative">
          <Image 
            source={{ uri: backdropUrl }}
            style={{ width, height: width * 0.56 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', '#1a1a1a']}
            style={{ position: 'absolute', bottom: 0, width: '100%', height: 100 }}
          />
          
          <View className="absolute bottom-0 left-0 right-0 p-4 flex-row">
            <Image 
              source={{ uri: posterUrl }}
              className="w-28 h-40 rounded-lg"
              resizeMode="cover"
            />
            <View className="ml-4 flex-1 justify-end">
              <Text className="font-bebas-neue text-3xl text-white">{movie.title}</Text>
              <Text className="text-white text-opacity-70">{releaseYear}</Text>
              
              <View className="flex-row items-center mt-2">
                <View className="bg-secondary py-1 px-3 rounded-full flex-row items-center">
                  <Ionicons name="star" size={16} color="#FFF" />
                  <Text className="text-white ml-1 font-medium">
                    {movie.vote_average.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Detalhes do filme */}
        <View className="p-4">
          {/* generos */}
          {movie.genres && movie.genres.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {movie.genres.map(genre => (
                <View key={genre.id} className="bg-button-secondary py-1 px-3 rounded-full">
                  <Text className="text-white text-xs">{genre.name}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Overview */}
          <View className="mb-6">
            <Text className="font-bebas-neue text-xl text-white mb-2">Sinopse</Text>
            <Text className="text-white text-opacity-80 leading-6">
              {movie.overview || "Sem descrição disponível."}
            </Text>
          </View>
          
        {/* Botoes */}
        <View className="flex-row justify-between mb-6">
        <TouchableOpacity className="bg-secondary flex-1 py-3 rounded-lg flex-row justify-center items-center">
            <Ionicons name="time-outline" size={20} color="#FFF" />
            <Text className="text-white ml-2 font-semibold">Assistir Mais Tarde</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="ml-4 border-2 border-secondary bg-transparent flex-1 py-3 rounded-lg flex-row justify-center items-center">
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            <Text className="text-white ml-2 font-semibold">Marcar como Assistido</Text>
        </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </View>
  );
}