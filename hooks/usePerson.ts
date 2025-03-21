// Hook refatorado para gerenciar informações de pessoas (atores, diretores, etc.)

import { useState, useCallback } from 'react';
import { Person, PersonCredits, PersonImages } from '~/types';
import { tmdbApi } from '~/services/api';

export const usePerson = () => {
  // Cache
  const [personDetails, setPersonDetails] = useState<Record<number, Person>>({});
  const [personCredits, setPersonCredits] = useState<Record<number, PersonCredits>>({});
  const [personImages, setPersonImages] = useState<Record<number, PersonImages>>({});
  
  // Estados de carregamento
  const [isLoadingDetails, setIsLoadingDetails] = useState<Record<number, boolean>>({});
  const [isLoadingCredits, setIsLoadingCredits] = useState<Record<number, boolean>>({});
  const [isLoadingImages, setIsLoadingImages] = useState<Record<number, boolean>>({});
  
  // Detalhes da pessoa
  const fetchPersonDetails = useCallback(async (personId: number) => {
    // Retornar detalhes do cache se disponíveis
    if (personDetails[personId]) {
      return personDetails[personId];
    }
    
    // Definir estado de carregamento
    setIsLoadingDetails(prev => ({ ...prev, [personId]: true }));
    
    try {
      const person = await tmdbApi.person.getDetails(personId);
      
      // Atualizar cache
      setPersonDetails(prev => ({ ...prev, [personId]: person }));
      return person;
    } catch (err) {
      console.error(`Error fetching person details for ID ${personId}:`, err);
      return null;
    } finally {
      setIsLoadingDetails(prev => ({ ...prev, [personId]: false }));
    }
  }, [personDetails]);
  
  // Créditos da pessoa
  const fetchPersonCredits = useCallback(async (personId: number) => {
    // Retornar créditos do cache se disponíveis
    if (personCredits[personId]) {
      return personCredits[personId];
    }
    
    // Definir estado de carregamento
    setIsLoadingCredits(prev => ({ ...prev, [personId]: true }));
    
    try {
      const credits = await tmdbApi.person.getMovieCredits(personId);
      
      // Atualizar cache
      setPersonCredits(prev => ({ ...prev, [personId]: credits }));
      return credits;
    } catch (err) {
      console.error(`Error fetching person credits for ID ${personId}:`, err);
      return null;
    } finally {
      setIsLoadingCredits(prev => ({ ...prev, [personId]: false }));
    }
  }, [personCredits]);
  
  // Imagens da pessoa
  const fetchPersonImages = useCallback(async (personId: number) => {
    // Retornar imagens do cache se disponíveis
    if (personImages[personId]) {
      return personImages[personId];
    }
    
    // Definir estado de carregamento
    setIsLoadingImages(prev => ({ ...prev, [personId]: true }));
    
    try {
      const images = await tmdbApi.person.getImages(personId);
      
      // Atualizar cache
      setPersonImages(prev => ({ ...prev, [personId]: images }));
      return images;
    } catch (err) {
      console.error(`Error fetching person images for ID ${personId}:`, err);
      return null;
    } finally {
      setIsLoadingImages(prev => ({ ...prev, [personId]: false }));
    }
  }, [personImages]);
  
  // Limpar cache
  const clearPersonCache = () => {
    setPersonDetails({});
    setPersonCredits({});
    setPersonImages({});
  };
  
  return {
    // Dados
    personDetails,
    personCredits,
    personImages,
    
    // Estados de carregamento
    isLoadingDetails,
    isLoadingCredits,
    isLoadingImages,
    
    // Funções
    fetchPersonDetails,
    fetchPersonCredits,
    fetchPersonImages,
    clearPersonCache
  };
};