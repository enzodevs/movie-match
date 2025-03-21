// Tela de pesquisa de filmes

import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useMovieStore } from '~/store/';
import { Header } from '~/components/layout/Header';
import { MovieGridCard } from '~/components/movie/MovieGridCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  
  const { 
    searchMovies, 
    searchResults, 
    searchMoreMovies,
    isLoadingSearch,
    topRatedMovies,
    fetchTopRatedMovies,
    fetchMoreTopRatedMovies,
    isLoadingTopRated
  } = useMovieStore();

  useEffect(() => {
    if (activeTab === 'topRated' && topRatedMovies.length === 0) {
      fetchTopRatedMovies();
    }
  }, [activeTab]);

  const handleSearch = () => {
    if (query.trim()) {
      searchMovies(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    searchMovies('');
  };

  const renderMovieGrid = () => {
    const displayMovies = activeTab === 'search' ? searchResults : topRatedMovies;
    const isLoading = activeTab === 'search' ? isLoadingSearch : isLoadingTopRated;
    const loadMore = activeTab === 'search' ? searchMoreMovies : fetchMoreTopRatedMovies;
    
    const windowWidth = Dimensions.get('window').width;
    const cardWidth = (windowWidth - 48) / 3; // 48 = padding (16*2) + spacing between cards (8*2)
    const cardHeight = cardWidth * 1.5; // 2:3 aspect ratio for movie posters
    
    if (activeTab === 'search' && !query.trim()) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-opacity-60 text-lg">
            Digite algo para pesquisar filmes
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1">
        {isLoading && displayMovies.length === 0 ? (
          <View className="h-40 justify-center items-center">
            <ActivityIndicator color="#ff4500" size="large" />
          </View>
        ) : displayMovies.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-opacity-60 text-lg">
              Nenhum filme encontrado
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayMovies}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingHorizontal: 16,
              paddingBottom: 16
            }}
            numColumns={3}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={{ 
              justifyContent: 'space-between',
              marginBottom: 8
            }}
            renderItem={({ item }) => (
              <MovieGridCard
                id={item.id}
                posterPath={item.poster_path}
              />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoading ? (
                <View className="w-full items-center justify-center py-4">
                  <ActivityIndicator color="#ff4500" size="large" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <Stack.Screen options={{ header: () => null }} />
      <Header title="Pesquisar" />
      
      <View className="px-4 py-2">
        <View className="flex-row items-center bg-button-secondary rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#ffffff" />
          <TextInput
            className="flex-1 text-white ml-2"
            placeholder="Buscar filmes..."
            placeholderTextColor="#9ca3af"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={20} color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View className="flex-row px-4 py-2">
        <TouchableOpacity
          className={`mr-4 pb-1 ${activeTab === 'search' ? 'border-b-2 border-secondary' : ''}`}
          onPress={() => setActiveTab('search')}
        >
          <Text className={`text-white ${activeTab === 'search' ? 'font-bold' : 'text-opacity-70'}`}>
            Pesquisa
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className={`mr-4 pb-1 ${activeTab === 'topRated' ? 'border-b-2 border-secondary' : ''}`}
          onPress={() => setActiveTab('topRated')}
        >
          <Text className={`text-white ${activeTab === 'topRated' ? 'font-bold' : 'text-opacity-70'}`}>
            Mais Avaliados
          </Text>
        </TouchableOpacity>
      </View>
      
      {renderMovieGrid()}
    </View>
  );
}