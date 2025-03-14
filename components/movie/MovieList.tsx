import React from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { MovieCard } from './MovieCard';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
}

interface MovieListProps {
  title: string;
  movies: Movie[];
  isLoading?: boolean;
  loadMore?: () => void;
}

export const MovieList = ({ 
  title, 
  movies, 
  isLoading = false, 
  loadMore
}: MovieListProps) => {
  return (
    <View>
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
          horizontal={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ 
            paddingHorizontal: 8,
            paddingBottom: 8,
            paddingTop: 4
          }}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ 
            justifyContent: 'space-evenly', 
            gap: 10,
            marginBottom: 14
          }}
          renderItem={({ item }) => (
            <MovieCard
              id={item.id}
              title={item.title}
              posterPath={item.poster_path}
              voteAverage={item.vote_average}
              releaseDate={item.release_date}
            />
          )}
          ListFooterComponent={
            isLoading && movies.length > 0 ? (
              <View className="w-16 justify-center items-center">
                <ActivityIndicator color="#ff4500" size="large" className="my-3" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};