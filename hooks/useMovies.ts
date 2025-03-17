// Hook refatorado para gerenciar filmes

import { useState, useCallback } from 'react';
import { Movie, MovieCredits } from '~/types';
import { tmdbApi } from '~/services/api';

export const useMovies = () => {
  // Cache de detalhes, créditos e filmes similares
  const [movieDetails, setMovieDetails] = useState<Record<number, Movie>>({});
  const [movieCredits, setMovieCredits] = useState<Record<number, MovieCredits>>({});
  const [similarMovies, setSimilarMovies] = useState<Record<number, Movie[]>>({});
  
  // Estados de carregamento
  const [isLoadingDetails, setIsLoadingDetails] = useState<Record<number, boolean>>({});
  const [isLoadingCredits, setIsLoadingCredits] = useState<Record<number, boolean>>({});
  const [isLoadingSimilar, setIsLoadingSimilar] = useState<Record<number, boolean>>({});
  
  // Listas de filmes
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingWeeklyMovies, setTrendingWeeklyMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  
  // Estados de carregamento para listas
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isLoadingTrendingWeekly, setIsLoadingTrendingWeekly] = useState(false);
  const [isLoadingNowPlaying, setIsLoadingNowPlaying] = useState(false);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [isLoadingTopRated, setIsLoadingTopRated] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  // Paginação
  const [popularPage, setPopularPage] = useState(1);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filmes populares
  const fetchPopularMovies = async () => {
    if (popularMovies.length > 0 || isLoadingPopular) return;
    
    setIsLoadingPopular(true);
    
    try {
      const { results } = await tmdbApi.movie.getPopular();
      setPopularMovies(results);
      setPopularPage(1);
    } catch (err) {
      console.error('Error fetching popular movies:', err);
    } finally {
      setIsLoadingPopular(false);
    }
  };
  
  const fetchMorePopularMovies = async () => {
    if (isLoadingPopular) return;
    
    setIsLoadingPopular(true);
    
    try {
      const nextPage = popularPage + 1;
      const { results } = await tmdbApi.movie.getPopular(nextPage);
      
      setPopularMovies(prev => [...prev, ...results]);
      setPopularPage(nextPage);
    } catch (err) {
      console.error('Error fetching more popular movies:', err);
    } finally {
      setIsLoadingPopular(false);
    }
  };
  
  // Filmes em tendência
  const fetchTrendingMovies = async () => {
    if (trendingMovies.length > 0 || isLoadingTrending) return;
    
    setIsLoadingTrending(true);
    
    try {
      const { results } = await tmdbApi.movie.getTrending();
      setTrendingMovies(results);
    } catch (err) {
      console.error('Error fetching trending movies:', err);
    } finally {
      setIsLoadingTrending(false);
    }
  };
  
  // Filmes em tendência da semana
  const fetchTrendingWeeklyMovies = async () => {
    if (trendingWeeklyMovies.length > 0 || isLoadingTrendingWeekly) return;
    
    setIsLoadingTrendingWeekly(true);
    
    try {
      const { results } = await tmdbApi.movie.getTrendingWeekly();
      setTrendingWeeklyMovies(results);
    } catch (err) {
      console.error('Error fetching weekly trending movies:', err);
    } finally {
      setIsLoadingTrendingWeekly(false);
    }
  };
  
  // Filmes em cartaz
  const fetchNowPlayingMovies = async () => {
    if (nowPlayingMovies.length > 0 || isLoadingNowPlaying) return;
    
    setIsLoadingNowPlaying(true);
    
    try {
      const { results } = await tmdbApi.movie.getNowPlaying();
      setNowPlayingMovies(results);
      setNowPlayingPage(1);
    } catch (err) {
      console.error('Error fetching now playing movies:', err);
    } finally {
      setIsLoadingNowPlaying(false);
    }
  };
  
  const fetchMoreNowPlayingMovies = async () => {
    if (isLoadingNowPlaying) return;
    
    setIsLoadingNowPlaying(true);
    
    try {
      const nextPage = nowPlayingPage + 1;
      const { results } = await tmdbApi.movie.getNowPlaying(nextPage);
      
      setNowPlayingMovies(prev => [...prev, ...results]);
      setNowPlayingPage(nextPage);
    } catch (err) {
      console.error('Error fetching more now playing movies:', err);
    } finally {
      setIsLoadingNowPlaying(false);
    }
  };
  
  // Próximos lançamentos
  const fetchUpcomingMovies = async () => {
    if (upcomingMovies.length > 0 || isLoadingUpcoming) return;
    
    setIsLoadingUpcoming(true);
    
    try {
      const { results } = await tmdbApi.movie.getUpcoming();
      setUpcomingMovies(results);
      setUpcomingPage(1);
    } catch (err) {
      console.error('Error fetching upcoming movies:', err);
    } finally {
      setIsLoadingUpcoming(false);
    }
  };
  
  const fetchMoreUpcomingMovies = async () => {
    if (isLoadingUpcoming) return;
    
    setIsLoadingUpcoming(true);
    
    try {
      const nextPage = upcomingPage + 1;
      const { results } = await tmdbApi.movie.getUpcoming(nextPage);
      
      setUpcomingMovies(prev => [...prev, ...results]);
      setUpcomingPage(nextPage);
    } catch (err) {
      console.error('Error fetching more upcoming movies:', err);
    } finally {
      setIsLoadingUpcoming(false);
    }
  };
  
  // Filmes mais bem avaliados
  const fetchTopRatedMovies = async () => {
    if (topRatedMovies.length > 0 || isLoadingTopRated) return;
    
    setIsLoadingTopRated(true);
    
    try {
      const { results } = await tmdbApi.movie.getTopRated();
      setTopRatedMovies(results);
      setTopRatedPage(1);
    } catch (err) {
      console.error('Error fetching top rated movies:', err);
    } finally {
      setIsLoadingTopRated(false);
    }
  };
  
  const fetchMoreTopRatedMovies = async () => {
    if (isLoadingTopRated) return;
    
    setIsLoadingTopRated(true);
    
    try {
      const nextPage = topRatedPage + 1;
      const { results } = await tmdbApi.movie.getTopRated(nextPage);
      
      setTopRatedMovies(prev => [...prev, ...results]);
      setTopRatedPage(nextPage);
    } catch (err) {
      console.error('Error fetching more top rated movies:', err);
    } finally {
      setIsLoadingTopRated(false);
    }
  };
  
  // Pesquisa de filmes
  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchQuery('');
      setSearchPage(1);
      return;
    }
    
    setIsLoadingSearch(true);
    setSearchQuery(query);
    
    try {
      const { results } = await tmdbApi.movie.search(query);
      
      // Filtrar resultados para mostrar apenas filmes com pôster
      const filteredResults = results.filter(movie => movie.poster_path);
      setSearchResults(filteredResults);
      setSearchPage(1);
    } catch (err) {
      console.error('Error searching movies:', err);
    } finally {
      setIsLoadingSearch(false);
    }
  };
  
  const searchMoreMovies = async () => {
    if (isLoadingSearch || !searchQuery) return;
    
    setIsLoadingSearch(true);
    
    try {
      const nextPage = searchPage + 1;
      const { results } = await tmdbApi.movie.search(searchQuery, nextPage);
      
      // Filtrar resultados para mostrar apenas filmes com pôster
      const filteredResults = results.filter(movie => movie.poster_path);
      
      setSearchResults(prev => [...prev, ...filteredResults]);
      setSearchPage(nextPage);
    } catch (err) {
      console.error('Error fetching more search results:', err);
    } finally {
      setIsLoadingSearch(false);
    }
  };
  
  // Detalhes do filme
  const fetchMovieDetails = useCallback(async (movieId: number) => {
    // Retornar detalhes do cache se disponíveis
    if (movieDetails[movieId]) {
      return movieDetails[movieId];
    }
    
    // Definir estado de carregamento
    setIsLoadingDetails(prev => ({ ...prev, [movieId]: true }));
    
    try {
      const movie = await tmdbApi.movie.getDetails(movieId);
      
      // Atualizar cache
      setMovieDetails(prev => ({ ...prev, [movieId]: movie }));
      return movie;
    } catch (err) {
      console.error(`Error fetching movie details for ID ${movieId}:`, err);
      return null;
    } finally {
      setIsLoadingDetails(prev => ({ ...prev, [movieId]: false }));
    }
  }, [movieDetails]);
  
  // Créditos do filme
  const fetchMovieCredits = useCallback(async (movieId: number) => {
    // Retornar créditos do cache se disponíveis
    if (movieCredits[movieId]) {
      return movieCredits[movieId];
    }
    
    // Definir estado de carregamento
    setIsLoadingCredits(prev => ({ ...prev, [movieId]: true }));
    
    try {
      const credits = await tmdbApi.movie.getCredits(movieId);
      
      // Atualizar cache
      setMovieCredits(prev => ({ ...prev, [movieId]: credits }));
      return credits;
    } catch (err) {
      console.error(`Error fetching movie credits for ID ${movieId}:`, err);
      return null;
    } finally {
      setIsLoadingCredits(prev => ({ ...prev, [movieId]: false }));
    }
  }, [movieCredits]);
  
  // Filmes similares
  const fetchSimilarMovies = useCallback(async (movieId: number) => {
    // Retornar filmes similares do cache se disponíveis
    if (similarMovies[movieId]) {
      return similarMovies[movieId];
    }
    
    // Definir estado de carregamento
    setIsLoadingSimilar(prev => ({ ...prev, [movieId]: true }));
    
    try {
      const { results } = await tmdbApi.movie.getSimilar(movieId);
      
      // Atualizar cache
      setSimilarMovies(prev => ({ ...prev, [movieId]: results }));
      return results;
    } catch (err) {
      console.error(`Error fetching similar movies for ID ${movieId}:`, err);
      return null;
    } finally {
      setIsLoadingSimilar(prev => ({ ...prev, [movieId]: false }));
    }
  }, [similarMovies]);
  
  // Limpar cache de detalhes de filmes
  const clearMovieCache = () => {
    setMovieDetails({});
    setMovieCredits({});
    setSimilarMovies({});
  };
  
  return {
    // Listas de filmes
    popularMovies,
    trendingMovies,
    trendingWeeklyMovies,
    nowPlayingMovies,
    upcomingMovies,
    topRatedMovies,
    searchResults,
    
    // Cache
    movieDetails,
    movieCredits,
    similarMovies,
    
    // Estados de carregamento
    isLoadingPopular,
    isLoadingTrending,
    isLoadingTrendingWeekly,
    isLoadingNowPlaying,
    isLoadingUpcoming,
    isLoadingTopRated,
    isLoadingSearch,
    isLoadingDetails,
    isLoadingCredits,
    isLoadingSimilar,
    
    // Funções para buscar filmes
    fetchPopularMovies,
    fetchMorePopularMovies,
    fetchTrendingMovies,
    fetchTrendingWeeklyMovies,
    fetchNowPlayingMovies,
    fetchMoreNowPlayingMovies,
    fetchUpcomingMovies,
    fetchMoreUpcomingMovies,
    fetchTopRatedMovies,
    fetchMoreTopRatedMovies,
    searchMovies,
    searchMoreMovies,
    
    // Funções para buscar detalhes
    fetchMovieDetails,
    fetchMovieCredits,
    fetchSimilarMovies,
    
    // Utilitários
    clearMovieCache
  };
};