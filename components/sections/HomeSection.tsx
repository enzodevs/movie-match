import React from 'react';
import { View } from 'react-native';
import { MovieList } from '../movie/MovieList';
import { MovieCarousel } from '../movie/MovieCarousel';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
}

interface HomeSectionProps {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  horizontal?: boolean;
  loadMore?: () => void;
}

export const HomeSection = ({ 
  title, 
  movies, 
  isLoading, 
  horizontal = false,
  loadMore 
}: HomeSectionProps) => {
  // Seção vazia e não esta carregando
  if (movies.length === 0 && !isLoading) {
    return null;
  }

  return (
    <View className="mb-4">
      {horizontal ? (
        <MovieCarousel
          title={title}
          movies={movies}
          isLoading={isLoading}
        />
      ) : (
        <MovieList
          title={title}
          movies={movies}
          isLoading={isLoading}
          loadMore={loadMore}
        />
      )}
    </View>
  );
};