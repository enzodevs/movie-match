// Módulo de estado para gerenciar o estado global de filmes com zustand

import { create } from 'zustand';
import { tmdbApi } from '~/services/api';
import { Movie, MovieCredits } from '~/types/';

interface MovieState {
  // Listas de filmes
  popularMovies: Movie[];
  trendingMovies: Movie[];
  nowPlayingMovies: Movie[];
  upcomingMovies: Movie[];

  trendingWeeklyMovies: Movie[];
  topRatedMovies: Movie[];
  searchResults: Movie[];
  movieCredits: Record<number, MovieCredits>;
  similarMovies: Record<number, Movie[]>;
  
  // Cache de detalhes de filmes
  movieDetails: Record<number, Movie>;
  
  // Loading estados
  isLoadingPopular: boolean;
  isLoadingTrending: boolean;
  isLoadingNowPlaying: boolean;
  isLoadingUpcoming: boolean;
  isLoadingDetails: Record<number, boolean>;
  isLoadingTrendingWeekly: boolean;
  isLoadingTopRated: boolean;
  isLoadingSearch: boolean;
  isLoadingCredits: Record<number, boolean>;
  isLoadingSimilar: Record<number, boolean>;
  
  // Paginação
  popularPage: number;
  nowPlayingPage: number;
  upcomingPage: number;
  topRatedPage: number;
  searchPage: number;
  searchQuery: string;

  // Gêneros
  genreMovies: Record<number, Movie[]>;
  isLoadingGenre: Record<number, boolean>;

  // Ações
  fetchPopularMovies: () => Promise<void>;
  fetchMorePopularMovies: () => Promise<void>;
  fetchTrendingMovies: () => Promise<void>;
  fetchNowPlayingMovies: () => Promise<void>;
  fetchMoreNowPlayingMovies: () => Promise<void>;
  fetchUpcomingMovies: () => Promise<void>;
  fetchMoreUpcomingMovies: () => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<Movie | null>;
  clearMovieCache: () => void;
  fetchTrendingWeeklyMovies: () => Promise<void>;
  fetchTopRatedMovies: () => Promise<void>;
  fetchMoreTopRatedMovies: () => Promise<void>;
  searchMovies: (query: string) => Promise<void>;
  searchMoreMovies: () => Promise<void>;
  fetchMovieCredits: (movieId: number) => Promise<any | null>;
  fetchSimilarMovies: (movieId: number) => Promise<Movie[] | null>;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  // Listas de filmes
  popularMovies: [],
  trendingMovies: [],
  nowPlayingMovies: [],
  upcomingMovies: [],
  trendingWeeklyMovies: [],
  topRatedMovies: [],
  searchResults: [],
  movieCredits: {},
  similarMovies: {},

  // Coleções de filmes por gênero
  genreMovies: {},
  isLoadingGenre: {},
  
  // Cache de detalhes de filmes
  movieDetails: {},
  
  // Loading estados
  isLoadingPopular: false,
  isLoadingTrending: false,
  isLoadingNowPlaying: false,
  isLoadingUpcoming: false,
  isLoadingDetails: {},
  isLoadingTrendingWeekly: false,
  isLoadingTopRated: false,
  isLoadingSearch: false,
  isLoadingCredits: {},
  isLoadingSimilar: {},
  
  // Pagination
  popularPage: 1,
  nowPlayingPage: 1,
  upcomingPage: 1,
  topRatedPage: 1,
  searchPage: 1,
  searchQuery: "",
  
  // Ações

  // Função para buscar filmes populares
  fetchPopularMovies: async () => {
    const { popularMovies, isLoadingPopular } = get();
    
    // Retornar se já carregado ou carregando
    if (popularMovies.length > 0 || isLoadingPopular) return;
    
    set({ isLoadingPopular: true });
    
    try {
      const data = await tmdbApi.movie.getPopular();
      set({ 
        popularMovies: data.results, 
        popularPage: 1,
        isLoadingPopular: false 
      });
    } catch (error) {
      console.error("Failed to fetch popular movies:", error);
      set({ isLoadingPopular: false });
    }
  },
  
  // Função para buscar mais filmes populares
  fetchMorePopularMovies: async () => {
    const { popularPage, isLoadingPopular, popularMovies } = get();
    
    if (isLoadingPopular) return;
    
    set({ isLoadingPopular: true });
    
    try {
      const nextPage = popularPage + 1;
      const data = await tmdbApi.movie.getPopular(nextPage);
      
      set({ 
        popularMovies: [...popularMovies, ...data.results], 
        popularPage: nextPage,
        isLoadingPopular: false 
      });
    } catch (error) {
      console.error("Failed to fetch more popular movies:", error);
      set({ isLoadingPopular: false });
    }
  },
  
  // Função para buscar filmes em alta
  fetchTrendingMovies: async () => {
    const { trendingMovies, isLoadingTrending } = get();
    
    // Retorna se já carregado ou carregando
    if (trendingMovies.length > 0 || isLoadingTrending) return;
    
    set({ isLoadingTrending: true });
    
    try {
      const data = await tmdbApi.movie.getTrending();
      set({ 
        trendingMovies: data.results, 
        isLoadingTrending: false 
      });
    } catch (error) {
      console.error("Failed to fetch trending movies:", error);
      set({ isLoadingTrending: false });
    }
  },
  
  // Função para buscar filmes em cartaz
  fetchNowPlayingMovies: async () => {
    const { nowPlayingMovies, isLoadingNowPlaying } = get();
    
    // Retorna se já carregado ou carregando
    if (nowPlayingMovies.length > 0 || isLoadingNowPlaying) return;
    
    set({ isLoadingNowPlaying: true });
    
    try {
      const data = await tmdbApi.movie.getNowPlaying();
      set({ 
        nowPlayingMovies: data.results, 
        nowPlayingPage: 1,
        isLoadingNowPlaying: false 
      });
    } catch (error) {
      console.error("Failed to fetch now playing movies:", error);
      set({ isLoadingNowPlaying: false });
    }
  },
  
  // Função para buscar mais filmes em cartaz
  fetchMoreNowPlayingMovies: async () => {
    const { nowPlayingPage, isLoadingNowPlaying, nowPlayingMovies } = get();
    
    if (isLoadingNowPlaying) return;
    
    set({ isLoadingNowPlaying: true });
    
    try {
      const nextPage = nowPlayingPage + 1;
      const data = await tmdbApi.movie.getNowPlaying(nextPage);
      
      set({ 
        nowPlayingMovies: [...nowPlayingMovies, ...data.results], 
        nowPlayingPage: nextPage,
        isLoadingNowPlaying: false 
      });
    } catch (error) {
      console.error("Failed to fetch more now playing movies:", error);
      set({ isLoadingNowPlaying: false });
    }
  },
  
  // Função para buscar filmes que serão lançados
  fetchUpcomingMovies: async () => {
    const { upcomingMovies, isLoadingUpcoming } = get();
    
    // Retorna se já carregado ou carregando
    if (upcomingMovies.length > 0 || isLoadingUpcoming) return;
    
    set({ isLoadingUpcoming: true });
    
    try {
      const data = await tmdbApi.movie.getUpcoming();
      set({ 
        upcomingMovies: data.results, 
        upcomingPage: 1,
        isLoadingUpcoming: false 
      });
    } catch (error) {
      console.error("Failed to fetch upcoming movies:", error);
      set({ isLoadingUpcoming: false });
    }
  },
  
  // Função para buscar mais filmes que serão lançados
  fetchMoreUpcomingMovies: async () => {
    const { upcomingPage, isLoadingUpcoming, upcomingMovies } = get();
    
    if (isLoadingUpcoming) return;
    
    set({ isLoadingUpcoming: true });
    
    try {
      const nextPage = upcomingPage + 1;
      const data = await tmdbApi.movie.getUpcoming(nextPage);
      
      set({ 
        upcomingMovies: [...upcomingMovies, ...data.results], 
        upcomingPage: nextPage,
        isLoadingUpcoming: false 
      });
    } catch (error) {
      console.error("Failed to fetch more upcoming movies:", error);
      set({ isLoadingUpcoming: false });
    }
  },
  
  // Função para buscar detalhes de um filme
  fetchMovieDetails: async (movieId: number) => {
    const { movieDetails } = get();

    if (movieDetails[movieId]) {
      return movieDetails[movieId];
    }

    set((state) => ({
      isLoadingDetails: { ...state.isLoadingDetails, [movieId]: true },
    }));

    try {
      const data = await tmdbApi.movie.getDetails(movieId);

      if (data) {
        set((state) => ({
          movieDetails: { ...state.movieDetails, [movieId]: data },
          isLoadingDetails: { ...state.isLoadingDetails, [movieId]: false },
        }));
        return data;
      } else {
        set((state) => ({
          isLoadingDetails: { ...state.isLoadingDetails, [movieId]: false },
        }));
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      set((state) => ({
        isLoadingDetails: { ...state.isLoadingDetails, [movieId]: false },
      }));
      return null;
    }
  },

  // Função para limpar cache de detalhes de filmes
  clearMovieCache: () => {
    set({ movieDetails: {} });
  },

  // Função para buscar filmes populares da semana
  fetchTrendingWeeklyMovies: async () => {
    const { trendingWeeklyMovies, isLoadingTrendingWeekly } = get();
    
    if (trendingWeeklyMovies.length > 0 || isLoadingTrendingWeekly) return;
    
    set({ isLoadingTrendingWeekly: true });
    
    try {
      const data = await tmdbApi.movie.getTrendingWeekly();
      set({ 
        trendingWeeklyMovies: data.results, 
        isLoadingTrendingWeekly: false 
      });
    } catch (error) {
      console.error("Failed to fetch weekly trending movies:", error);
      set({ isLoadingTrendingWeekly: false });
    }
  },
  
  // Função para buscar filmes mais bem avaliados
  fetchTopRatedMovies: async () => {
    const { topRatedMovies, isLoadingTopRated } = get();
    
    if (topRatedMovies.length > 0 || isLoadingTopRated) return;
    
    set({ isLoadingTopRated: true });
    
    try {
      const data = await tmdbApi.movie.getTopRated();
      set({ 
        topRatedMovies: data.results, 
        topRatedPage: 1,
        isLoadingTopRated: false 
      });
    } catch (error) {
      console.error("Failed to fetch top rated movies:", error);
      set({ isLoadingTopRated: false });
    }
  },
  
  // Função para buscar mais filmes mais bem avaliados
  fetchMoreTopRatedMovies: async () => {
    const { topRatedPage, isLoadingTopRated, topRatedMovies } = get();
    
    if (isLoadingTopRated) return;
    
    set({ isLoadingTopRated: true });
    
    try {
      const nextPage = topRatedPage + 1;
      const data = await tmdbApi.movie.getTopRated(nextPage);
      
      set({ 
        topRatedMovies: [...topRatedMovies, ...data.results], 
        topRatedPage: nextPage,
        isLoadingTopRated: false 
      });
    } catch (error) {
      console.error("Failed to fetch more top rated movies:", error);
      set({ isLoadingTopRated: false });
    }
  },
  
  // Função para buscar filmes por query com filtro para remover filmes sem pôster
searchMovies: async (query: string) => {
  if (!query.trim()) {
    set({ searchResults: [], searchQuery: "", searchPage: 1 });
    return;
  }
  
  set({ isLoadingSearch: true, searchQuery: query });
  
  try {
    const data = await tmdbApi.movie.search(query);
    
    // Filtrar os resultados para mostrar apenas filmes com pôster
    const filteredResults = data.results.filter((movie: Movie) => 
      movie.poster_path !== null && movie.poster_path !== ''
    );
    
    set({ 
      searchResults: filteredResults, 
      searchPage: 1,
      isLoadingSearch: false 
    });
  } catch (error) {
    console.error("Failed to search movies:", error);
    set({ isLoadingSearch: false });
  }
},

// Função para buscar mais filmes por query com filtro para remover filmes sem pôster
searchMoreMovies: async () => {
  const { searchPage, isLoadingSearch, searchResults, searchQuery } = get();
  
  if (isLoadingSearch || !searchQuery) return;
  
  set({ isLoadingSearch: true });
  
  try {
    const nextPage = searchPage + 1;
    const data = await tmdbApi.movie.search(searchQuery, nextPage);
    
    // Filtrar os resultados para mostrar apenas filmes com pôster
    const filteredResults = data.results.filter((movie: Movie) => 
      movie.poster_path !== null && movie.poster_path !== ''
    );
    
    set({ 
      searchResults: [...searchResults, ...filteredResults], 
      searchPage: nextPage,
      isLoadingSearch: false 
    });
  } catch (error) {
    console.error("Failed to fetch more search results:", error);
    set({ isLoadingSearch: false });
  }
},

  // Função para buscar créditos de um filme
  fetchMovieCredits: async (movieId: number) => {
    const { movieCredits } = get();

    if (movieCredits[movieId]) {
      return movieCredits[movieId];
    }

    set((state) => ({
      isLoadingCredits: { ...state.isLoadingCredits, [movieId]: true },
    }));

    try {
      const data = await tmdbApi.movie.getCredits(movieId);

      if (data) {
        set((state) => ({
          movieCredits: { ...state.movieCredits, [movieId]: data },
          isLoadingCredits: { ...state.isLoadingCredits, [movieId]: false },
        }));
        return data;
      } else {
        set((state) => ({
          isLoadingCredits: { ...state.isLoadingCredits, [movieId]: false },
        }));
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch movie credits:", error);
      set((state) => ({
        isLoadingCredits: { ...state.isLoadingCredits, [movieId]: false },
      }));
      return null;
    }
  },

  // Função para buscar filmes similares
  fetchSimilarMovies: async (movieId: number) => {
    const { similarMovies } = get();

    if (similarMovies[movieId]) {
      return similarMovies[movieId];
    }

    set((state) => ({
      isLoadingSimilar: { ...state.isLoadingSimilar, [movieId]: true },
    }));

    try {
      const data = await tmdbApi.movie.getSimilar(movieId);

      if (data && data.results) {
        set((state) => ({
          similarMovies: { ...state.similarMovies, [movieId]: data.results },
          isLoadingSimilar: { ...state.isLoadingSimilar, [movieId]: false },
        }));
        return data.results;
      } else {
        set((state) => ({
          isLoadingSimilar: { ...state.isLoadingSimilar, [movieId]: false },
        }));
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch similar movies:", error);
      set((state) => ({
        isLoadingSimilar: { ...state.isLoadingSimilar, [movieId]: false },
      }));
      return null;
    }
  },
}));