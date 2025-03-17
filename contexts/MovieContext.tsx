// Contexto para filmes

import React, { createContext, useContext, ReactNode } from 'react';
import { Movie, MovieCredits } from '~/types';
import { useMovies } from '~/hooks/useMovies';

interface MovieContextType {
  // Listas de filmes
  popularMovies: Movie[];
  trendingMovies: Movie[];
  trendingWeeklyMovies: Movie[];
  nowPlayingMovies: Movie[];
  upcomingMovies: Movie[];
  topRatedMovies: Movie[];
  searchResults: Movie[];
  
  // Cache
  movieDetails: Record<number, Movie>;
  movieCredits: Record<number, MovieCredits>;
  similarMovies: Record<number, Movie[]>;
  
  // Estados de carregamento
  isLoadingPopular: boolean;
  isLoadingTrending: boolean;
  isLoadingTrendingWeekly: boolean;
  isLoadingNowPlaying: boolean;
  isLoadingUpcoming: boolean;
  isLoadingTopRated: boolean;
  isLoadingSearch: boolean;
  isLoadingDetails: Record<number, boolean>;
  isLoadingCredits: Record<number, boolean>;
  isLoadingSimilar: Record<number, boolean>;
  
  // Funções para buscar filmes
  fetchPopularMovies: () => Promise<void>;
  fetchMorePopularMovies: () => Promise<void>;
  fetchTrendingMovies: () => Promise<void>;
  fetchTrendingWeeklyMovies: () => Promise<void>;
  fetchNowPlayingMovies: () => Promise<void>;
  fetchMoreNowPlayingMovies: () => Promise<void>;
  fetchUpcomingMovies: () => Promise<void>;
  fetchMoreUpcomingMovies: () => Promise<void>;
  fetchTopRatedMovies: () => Promise<void>;
  fetchMoreTopRatedMovies: () => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
  searchMoreMovies: () => Promise<void>;
  
  // Funções para buscar detalhes
  fetchMovieDetails: (movieId: number) => Promise<Movie | null>;
  fetchMovieCredits: (movieId: number) => Promise<MovieCredits | null>;
  fetchSimilarMovies: (movieId: number) => Promise<Movie[] | null>;
  
  // Utilitários
  clearMovieCache: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const movies = useMovies();
  
  return (
    <MovieContext.Provider value={movies}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

