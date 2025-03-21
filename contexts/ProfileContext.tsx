// Contexto para perfil do usuário

import React, { createContext, useContext, ReactNode } from 'react';
import { UserProfile } from '~/types';
import { useProfile } from '~/hooks/useProfile';
import { AppError } from '~/services/errorService';

interface ProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: AppError | null;
  watchedMovies: number[];
  favoriteMovies: number[];
  watchlistMovies: number[];
  isLoadingWatched: boolean;
  isLoadingFavorites: boolean;
  isLoadingWatchlist: boolean;

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

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const profile = useProfile();
  
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};