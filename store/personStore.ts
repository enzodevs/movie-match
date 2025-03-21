// Módulo de estado para armazenar detalhes, creditos e imagens de pessoas

import { create } from 'zustand';
import { tmdbApi } from '~/services/api';
import { Person, PersonCredits, PersonImages } from '~/types/person';

interface PersonState {
  // Cache de detalhes de pessoas
  personDetails: Record<number, Person>;
  personCredits: Record<number, PersonCredits>;
  personImages: Record<number, PersonImages>;
  
  // Loading estados
  isLoadingDetails: Record<number, boolean>;
  isLoadingCredits: Record<number, boolean>;
  isLoadingImages: Record<number, boolean>;
  
  // Ações
  fetchPersonDetails: (personId: number) => Promise<Person | null>;
  fetchPersonCredits: (personId: number) => Promise<PersonCredits | null>;
  fetchPersonImages: (personId: number) => Promise<PersonImages | null>;
  clearPersonCache: () => void;
}

export const usePersonStore = create<PersonState>((set, get) => ({
  // Cache de detalhes
  personDetails: {},
  personCredits: {},
  personImages: {},
  
  // Loading estados
  isLoadingDetails: {},
  isLoadingCredits: {},
  isLoadingImages: {},
  
  // Funções para buscar dados
  fetchPersonDetails: async (personId: number) => {
    const { personDetails } = get();

    if (personDetails[personId]) {
      return personDetails[personId];
    }

    set((state) => ({
      isLoadingDetails: { ...state.isLoadingDetails, [personId]: true },
    }));

    try {
      const data = await tmdbApi.person.getDetails(personId);

      if (data) {
        set((state) => ({
          personDetails: { ...state.personDetails, [personId]: data },
          isLoadingDetails: { ...state.isLoadingDetails, [personId]: false },
        }));
        return data;
      } else {
        set((state) => ({
          isLoadingDetails: { ...state.isLoadingDetails, [personId]: false },
        }));
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch person details:", error);
      set((state) => ({
        isLoadingDetails: { ...state.isLoadingDetails, [personId]: false },
      }));
      return null;
    }
  },
  
  fetchPersonCredits: async (personId: number) => {
    const { personCredits } = get();

    if (personCredits[personId]) {
      return personCredits[personId];
    }

    set((state) => ({
      isLoadingCredits: { ...state.isLoadingCredits, [personId]: true },
    }));

    try {
      const data = await tmdbApi.person.getMovieCredits(personId);
      if (data) {
        set((state) => ({
          personCredits: { ...state.personCredits, [personId]: data },
          isLoadingCredits: { ...state.isLoadingCredits, [personId]: false },
        }));
        return data;
      } else {
        set((state) => ({
          isLoadingCredits: { ...state.isLoadingCredits, [personId]: false },
        }));
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch person credits:", error);
      set((state) => ({
        isLoadingCredits: { ...state.isLoadingCredits, [personId]: false },
      }));
      return null;
    }
  },
  
  fetchPersonImages: async (personId: number) => {
    const { personImages } = get();

    if (personImages[personId]) {
      return personImages[personId];
    }

    set((state) => ({
      isLoadingImages: { ...state.isLoadingImages, [personId]: true },
    }));

    try {
      const data = await tmdbApi.person.getImages(personId);

      if (data) {
        set((state) => ({
          personImages: { ...state.personImages, [personId]: data },
          isLoadingImages: { ...state.isLoadingImages, [personId]: false },
        }));
        return data;
      } else {
        set((state) => ({
          isLoadingImages: { ...state.isLoadingImages, [personId]: false },
        }));
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch person images:", error);
      set((state) => ({
        isLoadingImages: { ...state.isLoadingImages, [personId]: false },
      }));
      return null;
    }
  },
  
  clearPersonCache: () => {
    set({ 
      personDetails: {},
      personCredits: {},
      personImages: {}
    });
  },
}));