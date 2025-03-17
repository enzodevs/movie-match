// Card componente para mostrar movie cards

import React from 'react';
import { View, Text, ActivityIndicator, FlatList, Dimensions } from 'react-native';
import { MovieGridCard } from './MovieGridCard';
import { Movie } from '~/types/movie';

interface MovieGridProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  loadMore?: () => void;
}

export const MovieGrid = ({ 
  title, 
  movies, 
  isLoading = false, 
  loadMore 
}: MovieGridProps) => {
  
  return (
    <View className="flex-1">
      <View className="items-center mb-4 mt-4">
        <Text className="text-white text-xl font-bold">{title}</Text>
      </View>
      
      {isLoading && movies.length === 0 ? (
        <View className="h-40 justify-center items-center">
          <ActivityIndicator color="#ff4500" size="large" />
        </View>
      ) : (
        <FlatList
          data={movies}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 8,
            paddingBottom: 16
          }}
          numColumns={3}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{ 
            justifyContent: 'space-evenly',
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
            isLoading && movies.length > 0 ? (
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