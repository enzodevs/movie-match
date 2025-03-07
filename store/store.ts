// Zustand para estado global

import { create } from 'zustand';

export interface BearState {
  
  preferences: string[]; // Gêneros preferidos do usuário
  favorites: number[];   // IDs de filmes favoritados
  setPreferences: (prefs: string[]) => void;
  addFavorite: (movieId: number) => void;
  removeFavorite: (movieId: number) => void;

  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
}

export const useStore = create<BearState>((set) => ({
  preferences: [],
  favorites: [],
  setPreferences: (prefs) => set({ preferences: prefs }),
  addFavorite: (movieId) => set((state) => ({ favorites: [...state.favorites, movieId] })),
  removeFavorite: (movieId) => set((state) => ({
    favorites: state.favorites.filter((id) => id !== movieId),
  })),

  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}));
