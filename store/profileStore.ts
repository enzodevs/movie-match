// Módulo para gerenciar o perfil do usuário e suas listas de filmes

import { create } from 'zustand';
import { profileService, userMoviesService } from '~/services/api';
import { UserProfile } from '~/types';

interface ProfileState {
  // Estado do perfil
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Listas do usuário
  watchedMovies: number[];
  favoriteMovies: number[];
  watchlistMovies: number[];
  
  // Estado de carregamento para as listas
  isLoadingWatched: boolean;
  isLoadingFavorites: boolean;
  isLoadingWatchlist: boolean;
  
  // Ações
  fetchProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfileImage: (imageUri: string) => Promise<string | null>;
  
  fetchWatchedMovies: () => Promise<void>;
  fetchFavoriteMovies: () => Promise<void>;
  fetchWatchlistMovies: () => Promise<void>;
  
  addToWatched: (movieId: number, rating?: number) => Promise<void>;
  removeFromWatched: (movieId: number) => Promise<void>;
  
  addToFavorites: (movieId: number) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  
  addToWatchlist: (movieId: number) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  
  updateFavoriteGenres: (genreIds: number[]) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  // Estado inicial
  profile: null,
  isLoading: false,
  error: null,
  
  watchedMovies: [],
  favoriteMovies: [],
  watchlistMovies: [],
  
  isLoadingWatched: false,
  isLoadingFavorites: false,
  isLoadingWatchlist: false,
  
  // Buscar perfil do usuário
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const userId = await userMoviesService.getCurrentUserId();
      
      if (!userId) {
        set({ 
          profile: null, 
          isLoading: false, 
          error: "Usuário não autenticado" 
        });
        return;
      }
      
      // Buscar perfil usando o serviço
      const profile = await profileService.getProfile(userId);
      
      if (profile) {
        set({ 
          profile, 
          isLoading: false 
        });
      } else {
        // Perfil não encontrado - criar um novo
        const { email } = await userMoviesService.getCurrentUserEmail() || { email: '' };
        
        const newProfile: UserProfile = {
          id: userId,
          email: email || '',
          display_name: email?.split('@')[0] || 'Usuário',
          app_settings: {
            theme: 'dark',
            notifications: true,
            language: 'pt-BR',
            favorite_genres: []
          },
          stats: {
            movies_watched: 0,
            watchlist_count: 0,
            favorite_genres: [],
            total_watch_time_minutes: 0
          }
        };
        
        const success = await profileService.createProfile(newProfile);
        
        if (!success) {
          throw new Error("Falha ao criar perfil");
        }
        
        set({ profile: newProfile, isLoading: false });
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      set({ 
        isLoading: false, 
        error: "Falha ao buscar perfil do usuário" 
      });
    }
  },
  
  // Atualizar perfil do usuário
  updateProfile: async (profileData: Partial<UserProfile>) => {
    const { profile } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const success = await profileService.updateProfile(profile.id, profileData);
      
      if (!success) {
        throw new Error("Falha ao atualizar perfil");
      }
      
      set({ 
        profile: { ...profile, ...profileData },
        isLoading: false 
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      set({ 
        isLoading: false, 
        error: "Falha ao atualizar perfil" 
      });
    }
  },
  
  // Atualizar imagem de perfil
  updateProfileImage: async (imageUri: string): Promise<string | null> => {
    const { profile } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return null;
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const publicUrl = await profileService.updateProfileImage(profile.id, imageUri);
      
      if (!publicUrl) {
        throw new Error("Falha ao atualizar imagem");
      }
      
      // Atualizar perfil com nova URL
      await get().updateProfile({ profile_url: publicUrl });
      
      set({ isLoading: false });
      return publicUrl;
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      set({ 
        isLoading: false, 
        error: "Falha ao atualizar imagem de perfil" 
      });
      return null;
    }
  },
  
  // Buscar filmes já assistidos pelo usuário
  fetchWatchedMovies: async () => {
    const { profile } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    set({ isLoadingWatched: true, error: null });
    
    try {
      const movieIds = await userMoviesService.getWatchedMovies(profile.id);
      set({ watchedMovies: movieIds, isLoadingWatched: false });
    } catch (error) {
      console.error('Erro ao buscar filmes assistidos:', error);
      set({ 
        isLoadingWatched: false, 
        error: "Falha ao buscar filmes assistidos" 
      });
    }
  },
  
  // Buscar filmes favoritos do usuário
  fetchFavoriteMovies: async () => {
    const { profile } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    set({ isLoadingFavorites: true, error: null });
    
    try {
      const movieIds = await userMoviesService.getFavoriteMovies(profile.id);
      set({ favoriteMovies: movieIds, isLoadingFavorites: false });
    } catch (error) {
      console.error('Erro ao buscar filmes favoritos:', error);
      set({ 
        isLoadingFavorites: false, 
        error: "Falha ao buscar filmes favoritos" 
      });
    }
  },
  
  // Buscar watchlist do usuário
  fetchWatchlistMovies: async () => {
    const { profile } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    set({ isLoadingWatchlist: true, error: null });
    
    try {
      const movieIds = await userMoviesService.getWatchlistMovies(profile.id);
      set({ watchlistMovies: movieIds, isLoadingWatchlist: false });
    } catch (error) {
      console.error('Erro ao buscar watchlist:', error);
      set({ 
        isLoadingWatchlist: false, 
        error: "Falha ao buscar watchlist" 
      });
    }
  },
  
  // Adicionar filme à lista de assistidos
  addToWatched: async (movieId: number, rating?: number) => {
    const { profile, watchedMovies } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    // Verificar se o filme já está na lista
    if (watchedMovies.includes(movieId)) {
      // Se houver rating, apenas atualizar o rating
      if (rating !== undefined) {
        try {
          await userMoviesService.updateWatchedMovie(profile.id, movieId, rating);
        } catch (error) {
          console.error('Erro ao atualizar filme assistido:', error);
          set({ error: "Falha ao atualizar filme assistido" });
        }
      }
      return;
    }
    
    try {
      await userMoviesService.addToWatched(profile.id, movieId, rating);
      
      // Atualizar estado local
      set({ watchedMovies: [...watchedMovies, movieId] });
      
      // Se o filme estava na watchlist, removê-lo
      const { watchlistMovies } = get();
      if (watchlistMovies.includes(movieId)) {
        await get().removeFromWatchlist(movieId);
      }
      
      // Atualizar estatísticas do usuário
      if (profile.stats) {
        const updatedStats = {
          ...profile.stats,
          movies_watched: (profile.stats.movies_watched || 0) + 1
        };
        
        await get().updateProfile({
          stats: updatedStats
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar filme assistido:', error);
      set({ error: "Falha ao adicionar filme assistido" });
    }
  },
  
  // Remover filme da lista de assistidos
  removeFromWatched: async (movieId: number) => {
    const { profile, watchedMovies } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    try {
      await userMoviesService.removeFromWatched(profile.id, movieId);
      
      // Atualizar estado local
      set({ 
        watchedMovies: watchedMovies.filter(id => id !== movieId) 
      });
      
      // Atualizar estatísticas do usuário
      if (profile.stats && profile.stats.movies_watched > 0) {
        const updatedStats = {
          ...profile.stats,
          movies_watched: profile.stats.movies_watched - 1
        };
        
        await get().updateProfile({
          stats: updatedStats
        });
      }
    } catch (error) {
      console.error('Erro ao remover filme assistido:', error);
      set({ error: "Falha ao remover filme assistido" });
    }
  },
  
  // Adicionar filme aos favoritos
  addToFavorites: async (movieId: number) => {
    const { profile, favoriteMovies } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    // Verificar se o filme já está na lista
    if (favoriteMovies.includes(movieId)) {
      return;
    }
    
    try {
      await userMoviesService.addToFavorites(profile.id, movieId);
      
      // Atualizar estado local
      set({ favoriteMovies: [...favoriteMovies, movieId] });
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      set({ error: "Falha ao adicionar favorito" });
    }
  },
  
  // Remover filme dos favoritos
  removeFromFavorites: async (movieId: number) => {
    const { profile, favoriteMovies } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    try {
      await userMoviesService.removeFromFavorites(profile.id, movieId);
      
      // Atualizar estado local
      set({ 
        favoriteMovies: favoriteMovies.filter(id => id !== movieId) 
      });
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      set({ error: "Falha ao remover favorito" });
    }
  },
  
  // Adicionar filme à watchlist
  addToWatchlist: async (movieId: number) => {
    const { profile, watchlistMovies, watchedMovies } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    // Verificar se o filme já está na lista
    if (watchlistMovies.includes(movieId)) {
      return;
    }
    
    // Verificar se o filme já foi assistido
    if (watchedMovies.includes(movieId)) {
      set({ error: "Filme já foi assistido" });
      return;
    }
    
    try {
      await userMoviesService.addToWatchlist(profile.id, movieId);
      
      // Atualizar estado local
      set({ watchlistMovies: [...watchlistMovies, movieId] });
      
      // Atualizar estatísticas do usuário
      if (profile.stats) {
        const updatedStats = {
          ...profile.stats,
          watchlist_count: (profile.stats.watchlist_count || 0) + 1
        };
        
        await get().updateProfile({
          stats: updatedStats
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar à watchlist:', error);
      set({ error: "Falha ao adicionar à watchlist" });
    }
  },
  
  // Remover filme da watchlist
  removeFromWatchlist: async (movieId: number) => {
    const { profile, watchlistMovies } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    try {
      await userMoviesService.removeFromWatchlist(profile.id, movieId);
      
      // Atualizar estado local
      set({ 
        watchlistMovies: watchlistMovies.filter(id => id !== movieId) 
      });
      
      // Atualizar estatísticas do usuário
      if (profile.stats && profile.stats.watchlist_count > 0) {
        const updatedStats = {
          ...profile.stats,
          watchlist_count: profile.stats.watchlist_count - 1
        };
        
        await get().updateProfile({
          stats: updatedStats
        });
      }
    } catch (error) {
      console.error('Erro ao remover da watchlist:', error);
      set({ error: "Falha ao remover da watchlist" });
    }
  },
  
  // Atualizar gêneros favoritos do usuário
  updateFavoriteGenres: async (genreIds: number[]) => {
    const { profile } = get();
    
    if (!profile) {
      set({ error: "Usuário não autenticado" });
      return;
    }
    
    try {
      await profileService.updateFavoriteGenres(profile.id, genreIds);
      
      const appSettings = {
        ...(profile.app_settings || {}),
        favorite_genres: genreIds
      };
      
      set({
        profile: {
          ...profile,
          app_settings: appSettings
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar gêneros favoritos:', error);
      set({ error: "Falha ao atualizar gêneros favoritos" });
    }
  }
}));