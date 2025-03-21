// Hook refatorado para gerenciar o perfil do usuário

import { useState, useEffect } from 'react';
import { UserProfile } from '~/types';
import { profileService, userMoviesService } from '~/services/api';
import { useAuth } from './useAuth';
import { useErrorHandler } from './useErrorHandler';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Listas de filmes
  const [watchedMovies, setWatchedMovies] = useState<number[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<number[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<number[]>([]);
  
  // Estados de carregamento para listas
  const [isLoadingWatched, setIsLoadingWatched] = useState(false);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  
  // Gerenciamento de erros
  const { handleError, error, clearError } = useErrorHandler('useProfile');
  
  // Buscar perfil do usuário quando o usuário mudar
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    
    fetchProfile();
  }, [user]);
  
  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    clearError();
    
    try {
      const fetchedProfile = await profileService.getProfile(user.id);
      
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      } else {
        // Criar perfil default se não existir
        const newProfile: UserProfile = {
          id: user.id,
          email: user.email || '',
          display_name: user.email?.split('@')[0] || 'Usuário',
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
        
        await profileService.createProfile(newProfile);
        setProfile(newProfile);
      }
    } catch (err: any) {
      handleError(err, { method: 'fetchProfile' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user || !profile) {
      handleError(new Error('User not authenticated'), { method: 'updateProfile' });
      return;
    }
    
    setIsLoading(true);
    clearError();
    
    try {
      await profileService.updateProfile(user.id, profileData);
      setProfile({ ...profile, ...profileData });
    } catch (err: any) {
      handleError(err, { method: 'updateProfile' });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfileImage = async (imageUri: string): Promise<string | null> => {
    if (!user || !profile) {
      handleError(new Error('User not authenticated'), { method: 'updateProfileImage' });
      return null;
    }
    
    setIsLoading(true);
    clearError();
    
    try {
      const publicUrl = await profileService.updateProfileImage(user.id, imageUri);
      
      if (publicUrl) {
        // Atualizar perfil com a nova URL da imagem
        await updateProfile({ profile_url: publicUrl });
      }
      
      return publicUrl;
    } catch (err: any) {
      handleError(err, { method: 'updateProfileImage' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Métodos para gerenciar listas de filmes
  
  const fetchWatchedMovies = async () => {
    if (!user) return;
    
    setIsLoadingWatched(true);
    clearError();
    
    try {
      const movieIds = await userMoviesService.getWatchedMovies(user.id);
      setWatchedMovies(movieIds);
    } catch (err: any) {
      handleError(err, { method: 'fetchWatchedMovies' });
    } finally {
      setIsLoadingWatched(false);
    }
  };
  
  const fetchFavoriteMovies = async () => {
    if (!user) return;
    
    setIsLoadingFavorites(true);
    clearError();
    
    try {
      const movieIds = await userMoviesService.getFavoriteMovies(user.id);
      setFavoriteMovies(movieIds);
    } catch (err: any) {
      handleError(err, { method: 'fetchFavoriteMovies' });
    } finally {
      setIsLoadingFavorites(false);
    }
  };
  
  const fetchWatchlistMovies = async () => {
    if (!user) return;
    
    setIsLoadingWatchlist(true);
    clearError();
    
    try {
      const movieIds = await userMoviesService.getWatchlistMovies(user.id);
      setWatchlistMovies(movieIds);
    } catch (err: any) {
      handleError(err, { method: 'fetchWatchlistMovies' });
    } finally {
      setIsLoadingWatchlist(false);
    }
  };
  
  // Funções para gerenciar filmes assistidos
  
  const addToWatched = async (movieId: number, rating?: number) => {
    if (!user || !profile) return;
    
    clearError();
    
    try {
      await userMoviesService.addToWatched(user.id, movieId, rating);
      
      // Atualizar estado local
      if (!watchedMovies.includes(movieId)) {
        setWatchedMovies(prev => [...prev, movieId]);
      }
      
      // Se o filme estava na watchlist, removê-lo
      if (watchlistMovies.includes(movieId)) {
        await removeFromWatchlist(movieId);
      }
      
      // Atualizar estatísticas do usuário
      if (profile.stats) {
        const updatedStats = {
          ...profile.stats,
          movies_watched: profile.stats.movies_watched + 1
        };
        
        await updateProfile({ stats: updatedStats });
      }
    } catch (err) {
      handleError(err, { method: 'addToWatched', movieId });
    }
  };
  
  const removeFromWatched = async (movieId: number) => {
    if (!user || !profile) return;
    
    clearError();
    
    try {
      await userMoviesService.removeFromWatched(user.id, movieId);
      
      // Atualizar estado local
      setWatchedMovies(prev => prev.filter(id => id !== movieId));
      
      // Atualizar estatísticas do usuário
      if (profile.stats && profile.stats.movies_watched > 0) {
        const updatedStats = {
          ...profile.stats,
          movies_watched: profile.stats.movies_watched - 1
        };
        
        await updateProfile({ stats: updatedStats });
      }
    } catch (err) {
      handleError(err, { method: 'removeFromWatched', movieId });
    }
  };
  
  // Funções para gerenciar favoritos
  
  const addToFavorites = async (movieId: number) => {
    if (!user) return;
    
    clearError();
    
    try {
      if (!favoriteMovies.includes(movieId)) {
        await userMoviesService.addToFavorites(user.id, movieId);
        setFavoriteMovies(prev => [...prev, movieId]);
      }
    } catch (err) {
      handleError(err, { method: 'addToFavorites', movieId });
    }
  };
  
  const removeFromFavorites = async (movieId: number) => {
    if (!user) return;
    
    clearError();
    
    try {
      await userMoviesService.removeFromFavorites(user.id, movieId);
      setFavoriteMovies(prev => prev.filter(id => id !== movieId));
    } catch (err) {
      handleError(err, { method: 'removeFromFavorites', movieId });
    }
  };
  
  // Funções para gerenciar watchlist
  
  const addToWatchlist = async (movieId: number) => {
    if (!user || !profile) return;
    
    // Não pode adicionar à watchlist se já foi assistido
    if (watchedMovies.includes(movieId)) return;
    
    clearError();
    
    try {
      if (!watchlistMovies.includes(movieId)) {
        await userMoviesService.addToWatchlist(user.id, movieId);
        setWatchlistMovies(prev => [...prev, movieId]);
        
        // Atualizar estatísticas do usuário
        if (profile.stats) {
          const updatedStats = {
            ...profile.stats,
            watchlist_count: (profile.stats.watchlist_count || 0) + 1
          };
          
          await updateProfile({ stats: updatedStats });
        }
      }
    } catch (err) {
      handleError(err, { method: 'addToWatchlist', movieId });
    }
  };
  
  const removeFromWatchlist = async (movieId: number) => {
    if (!user || !profile) return;
    
    clearError();
    
    try {
      await userMoviesService.removeFromWatchlist(user.id, movieId);
      
      // Atualizar estado local
      setWatchlistMovies(prev => prev.filter(id => id !== movieId));
      
      // Atualizar estatísticas do usuário
      if (profile.stats && profile.stats.watchlist_count > 0) {
        const updatedStats = {
          ...profile.stats,
          watchlist_count: profile.stats.watchlist_count - 1
        };
        
        await updateProfile({ stats: updatedStats });
      }
    } catch (err) {
      handleError(err, { method: 'removeFromWatchlist', movieId });
    }
  };
  
  // Atualização de gêneros favoritos
  
  const updateFavoriteGenres = async (genreIds: number[]) => {
    if (!user) return;
    
    clearError();
    
    try {
      await profileService.updateFavoriteGenres(user.id, genreIds);
      
      if (profile && profile.app_settings) {
        const updatedSettings = {
          ...profile.app_settings,
          favorite_genres: genreIds
        };
        
        setProfile({
          ...profile,
          app_settings: updatedSettings
        });
      }
    } catch (err) {
      handleError(err, { method: 'updateFavoriteGenres' });
    }
  };
  
  return {
    profile,
    isLoading,
    error,
    updateProfile,
    updateProfileImage,
    
    watchedMovies,
    favoriteMovies,
    watchlistMovies,
    
    isLoadingWatched,
    isLoadingFavorites,
    isLoadingWatchlist,
    
    fetchProfile,
    fetchWatchedMovies,
    fetchFavoriteMovies,
    fetchWatchlistMovies,
    
    addToWatched,
    removeFromWatched,
    addToFavorites,
    removeFromFavorites,
    addToWatchlist,
    removeFromWatchlist,
    
    updateFavoriteGenres
  };
};