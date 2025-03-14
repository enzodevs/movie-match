// Tela de detalhes do filme

import React, { useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useMovieStore } from '~/store/movieStore';
import { Header } from '~/components/layout/Header';
import { MovieGridCard } from '~/components/movie/MovieGridCard';

const { width } = Dimensions.get('window');

export default function MovieDetails() {
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const id = Number(movieId);
  
  const { 
    fetchMovieDetails, 
    movieDetails, 
    isLoadingDetails,
    fetchMovieCredits,
    movieCredits,
    isLoadingCredits,
    fetchSimilarMovies,
    similarMovies,
    isLoadingSimilar
  } = useMovieStore();
  
  const movie = movieDetails[id];
  const credits = movieCredits[id];
  const similar = similarMovies[id];
  
  const isLoading = isLoadingDetails[id];
  const isLoadingCast = isLoadingCredits[id];
  const isLoadingSimilarMovies = isLoadingSimilar[id];
  
  useEffect(() => {
    fetchMovieDetails(id);
    fetchMovieCredits(id);
    fetchSimilarMovies(id);
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
      
      {/* Replace ScrollView with FlatList as the main container */}
      <FlatList
        data={[{ key: 'content' }]}
        keyExtractor={item => item.key}
        renderItem={() => (
          <View>
            {/* Seção Hero com backdrop */}
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
                  <Text className="text-white text-xl font-bold">{movie.title}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-300">{releaseYear}</Text>
                    <View className="mx-2 w-1 h-1 rounded-full bg-gray-300" />
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#ff4500" />
                      <Text className="text-gray-300 ml-1">{movie.vote_average.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Gêneros */}
            {movie.genres && movie.genres.length > 0 && (
              <FlatList
                data={movie.genres}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View 
                    className="bg-button-secondary/20 px-3 py-1 rounded-full mr-2"
                  >
                    <Text className="text-white text-xs">{item.name}</Text>
                  </View>
                )}
              />
            )}
            
            {/* Sinopse */}
            <View className="px-4 py-3">
              <Text className="text-white text-lg font-bold mb-2">Sinopse</Text>
              <Text className="text-gray-300">
                {movie.overview || "Sinopse não disponível."}
              </Text>
            </View>

            {/* Botões de ação */}
            <View className="px-4 flex-row justify-between mb-4">
              <TouchableOpacity
                onPress={() => {}}
                className="flex-1 bg-button-primary py-3 px-2 rounded-lg flex-row items-center justify-center mr-2"
              >
                <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                <Text className="text-white font-bold ml-2">Já assisti</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {}}
                className="flex-1 bg-button-secondary py-2 px-2 rounded-lg flex-row items-center justify-center ml-2"
              >
                <Ionicons name="time-outline" size={20} color="#ffffff" />
                <Text className="text-white font-bold ml-2">Assistir mais tarde</Text>
              </TouchableOpacity>
            </View>
            
            {/* Elenco */}
            <View className="px-4 pt-4">
              <Text className="text-white text-lg font-bold mb-3">Elenco</Text>
              {isLoadingCast ? (
                <ActivityIndicator size="small" color="#ff4500" />
              ) : (
                credits && credits.cast && credits.cast.length > 0 ? (
                  <FlatList
                    data={credits.cast.slice(0, 15)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                      const profileUrl = item.profile_path
                        ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Image';
                      
                      return (
                        <View className="mr-4 items-center w-20">
                          <Image
                            source={{ uri: profileUrl }}
                            className="w-20 h-20 rounded-full"
                            resizeMode="cover"
                          />
                          <Text className="text-white text-xs mt-2 text-center" numberOfLines={1}>
                            {item.name}
                          </Text>
                          <Text className="text-gray-400 text-xs text-center" numberOfLines={1}>
                            {item.character}
                          </Text>
                        </View>
                      );
                    }}
                  />
                ) : (
                  <Text className="text-gray-400">Informações do elenco não disponíveis.</Text>
                )
              )}
            </View>
            
            {/* Filmes Similares */}
            <View className="px-4 pt-6 pb-8">
              <Text className="text-white text-lg font-bold mb-3">Filmes Similares</Text>
              {isLoadingSimilarMovies ? (
                <ActivityIndicator size="small" color="#ff4500" />
              ) : (
                similar && similar.length > 0 ? (
                  <FlatList
                    data={similar.slice(0, 10)}
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
                ) : (
                  <Text className="text-gray-400">Filmes similares não encontrados.</Text>
                )
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}