// Provedor geral para todos os contextos

import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ProfileProvider } from './ProfileContext';
import { MovieProvider } from './MovieContext';
import { PersonProvider } from './PersonContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <MovieProvider>
          <PersonProvider>
            {children}
          </PersonProvider>
        </MovieProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};