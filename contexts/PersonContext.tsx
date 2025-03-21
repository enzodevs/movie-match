// Contexto para pessoas (atores, diretores, etc.)

import React, { createContext, useContext, ReactNode } from 'react';
import { Person, PersonCredits, PersonImages } from '~/types';
import { usePerson } from '~/hooks/usePerson';

interface PersonContextType {
  // Cache
  personDetails: Record<number, Person>;
  personCredits: Record<number, PersonCredits>;
  personImages: Record<number, PersonImages>;
  
  // Estados de carregamento
  isLoadingDetails: Record<number, boolean>;
  isLoadingCredits: Record<number, boolean>;
  isLoadingImages: Record<number, boolean>;
  
  // Funções
  fetchPersonDetails: (personId: number) => Promise<Person | null>;
  fetchPersonCredits: (personId: number) => Promise<PersonCredits | null>;
  fetchPersonImages: (personId: number) => Promise<PersonImages | null>;
  clearPersonCache: () => void;
}

const PersonContext = createContext<PersonContextType | undefined>(undefined);

export const PersonProvider = ({ children }: { children: ReactNode }) => {
  const person = usePerson();
  
  return (
    <PersonContext.Provider value={person}>
      {children}
    </PersonContext.Provider>
  );
};

export const usePersonContext = () => {
  const context = useContext(PersonContext);
  if (context === undefined) {
    throw new Error('usePersonContext must be used within a PersonProvider');
  }
  return context;
};
