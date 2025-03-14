import { create } from 'zustand';
import { fetchPopularMovies, fetchTrendingMovies, fetchNowPlayingMovies, fetchUpcomingMovies, fetchMovieDetails } from '~/lib/api';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  overview?: string;
  genres?: { id: number, name: string }[];
  // Add other movie properties as needed
}

interface MovieState {
  // Movie lists
  popularMovies: Movie[];
  trendingMovies: Movie[];
  nowPlayingMovies: Movie[];
  upcomingMovies: Movie[];
  
  // Movie details cache
  movieDetails: Record<number, Movie>;
  
  // Loading states
  isLoadingPopular: boolean;
  isLoadingTrending: boolean;
  isLoadingNowPlaying: boolean;
  isLoadingUpcoming: boolean;
  isLoadingDetails: Record<number, boolean>;
  
  // Pagination
  popularPage: number;
  nowPlayingPage: number;
  upcomingPage: number;
  
  // Actions
  fetchPopularMovies: () => Promise<void>;
  fetchMorePopularMovies: () => Promise<void>;
  fetchTrendingMovies: () => Promise<void>;
  fetchNowPlayingMovies: () => Promise<void>;
  fetchMoreNowPlayingMovies: () => Promise<void>;
  fetchUpcomingMovies: () => Promise<void>;
  fetchMoreUpcomingMovies: () => Promise<void>;
  fetchMovieDetails: (movieId: number) => Promise<Movie | null>;
  clearMovieCache: () => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  // Movie lists
  popularMovies: [],
  trendingMovies: [],
  nowPlayingMovies: [],
  upcomingMovies: [],
  
  // Movie details cache
  movieDetails: {},
  
  // Loading states
  isLoadingPopular: false,
  isLoadingTrending: false,
  isLoadingNowPlaying: false,
  isLoadingUpcoming: false,
  isLoadingDetails: {},
  
  // Pagination
  popularPage: 1,
  nowPlayingPage: 1,
  upcomingPage: 1,
  
  // Actions
  fetchPopularMovies: async () => {
    const { popularMovies, isLoadingPopular } = get();
    
    // Return if already loaded or loading
    if (popularMovies.length > 0 || isLoadingPopular) return;
    
    set({ isLoadingPopular: true });
    
    try {
      const data = await fetchPopularMovies();
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
  
  fetchMorePopularMovies: async () => {
    const { popularPage, isLoadingPopular, popularMovies } = get();
    
    if (isLoadingPopular) return;
    
    set({ isLoadingPopular: true });
    
    try {
      const nextPage = popularPage + 1;
      const data = await fetchPopularMovies(nextPage);
      
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
  
  fetchTrendingMovies: async () => {
    const { trendingMovies, isLoadingTrending } = get();
    
    // Return if already loaded or loading
    if (trendingMovies.length > 0 || isLoadingTrending) return;
    
    set({ isLoadingTrending: true });
    
    try {
      const data = await fetchTrendingMovies();
      set({ 
        trendingMovies: data.results, 
        isLoadingTrending: false 
      });
    } catch (error) {
      console.error("Failed to fetch trending movies:", error);
      set({ isLoadingTrending: false });
    }
  },
  
  fetchNowPlayingMovies: async () => {
    const { nowPlayingMovies, isLoadingNowPlaying } = get();
    
    // Return if already loaded or loading
    if (nowPlayingMovies.length > 0 || isLoadingNowPlaying) return;
    
    set({ isLoadingNowPlaying: true });
    
    try {
      const data = await fetchNowPlayingMovies();
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
  
  fetchMoreNowPlayingMovies: async () => {
    const { nowPlayingPage, isLoadingNowPlaying, nowPlayingMovies } = get();
    
    if (isLoadingNowPlaying) return;
    
    set({ isLoadingNowPlaying: true });
    
    try {
      const nextPage = nowPlayingPage + 1;
      const data = await fetchNowPlayingMovies(nextPage);
      
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
  
  fetchUpcomingMovies: async () => {
    const { upcomingMovies, isLoadingUpcoming } = get();
    
    // Return if already loaded or loading
    if (upcomingMovies.length > 0 || isLoadingUpcoming) return;
    
    set({ isLoadingUpcoming: true });
    
    try {
      const data = await fetchUpcomingMovies();
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
  
  fetchMoreUpcomingMovies: async () => {
    const { upcomingPage, isLoadingUpcoming, upcomingMovies } = get();
    
    if (isLoadingUpcoming) return;
    
    set({ isLoadingUpcoming: true });
    
    try {
      const nextPage = upcomingPage + 1;
      const data = await fetchUpcomingMovies(nextPage);
      
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
  
  fetchMovieDetails: async (movieId: number) => {
    const { movieDetails, isLoadingDetails } = get();

    if (movieDetails[movieId]) {
      return movieDetails[movieId];
    }

    set((state) => ({
      isLoadingDetails: { ...state.isLoadingDetails, [movieId]: true },
    }));

    try {
      const data = await fetchMovieDetails(movieId);

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

  clearMovieCache: () => {
    set({ movieDetails: {} });
  },
}));