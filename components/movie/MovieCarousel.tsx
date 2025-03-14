import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { MovieCarouselCard } from './MovieCarouselCard';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
}

export const MovieCarousel = ({ title, movies, isLoading = false }: MovieCarouselProps) => {
  return (
    <View className="mb-6">
      <View className="items-center mb-3">
        <Text className="text-heading-2 text-center">{title}</Text>
      </View>
      
      {isLoading && movies.length === 0 ? (
        <View className="h-40 justify-center items-center">
          <ActivityIndicator color="#ff4500" size="large" />
        </View>
      ) : (
        <FlatList
          data={movies}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{ 
            paddingHorizontal: 16, 
            paddingVertical: 4 
          }}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <MovieCarouselCard
              id={item.id}
              title={item.title}
              posterPath={item.poster_path}
              backdropPath={item.backdrop_path}
              voteAverage={item.vote_average}
            />
          )}
        />
      )}
    </View>
  );
};