// Tipos relacionados ao perfil do usuário

export interface UserProfile {
    id: string;
    email: string;
    display_name: string;
    profile_url?: string;
    app_settings?: AppSettings;
    stats?: UserStats;
  }
  
  export interface AppSettings {
    theme?: string;
    notifications?: boolean;
    language?: string;
    favorite_genres?: number[];
  }
  
  export interface UserStats {
    movies_watched: number;
    watchlist_count: number;
    favorite_genres: FavoriteGenre[];
    total_watch_time_minutes: number;
  }
  
  export interface FavoriteGenre {
    id: number;
    name: string;
    count: number;
  }
  
  export interface ProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    
    watchedMovies: number[];
    favoriteMovies: number[];
    watchlistMovies: number[];
    
    isLoadingWatched: boolean;
    isLoadingFavorites: boolean;
    isLoadingWatchlist: boolean;
  }