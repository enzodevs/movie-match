// Tipos relacionados a filmes

export interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    release_date?: string;
    overview?: string;
    genres?: Genre[];
  }
  
  export interface Genre {
    id: number;
    name: string;
  }
  
  export interface MovieCredits {
    cast: MovieCast[];
    crew: MovieCrew[];
  }
  
  export interface MovieCast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }
  
  export interface MovieCrew {
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
  }
  
  export interface MovieState {
    // Listas de filmes
    popularMovies: Movie[];
    trendingMovies: Movie[];
    nowPlayingMovies: Movie[];
    upcomingMovies: Movie[];
    trendingWeeklyMovies: Movie[];
    topRatedMovies: Movie[];
    searchResults: Movie[];
    
    // Cache de detalhes
    movieDetails: Record<number, Movie>;
    movieCredits: Record<number, MovieCredits>;
    similarMovies: Record<number, Movie[]>;
    
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
  }