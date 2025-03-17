// Hook para autenticação

import { useState, useEffect } from 'react';
import { User } from '~/types';
import { authService } from '~/services/api/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Buscar usuário atual ao inicializar
    const checkUser = async () => {
      try {
        const supabaseUser = await authService.getCurrentUser();
        setUser(authService.mapUser(supabaseUser));
      } catch (err) {
        console.error('Error checking current user:', err);
        setError('Failed to get current user');
      } finally {
        setIsLoading(false);
      }
    };

    // Configurar listener de mudanças na autenticação
    const unsubscribe = authService.onAuthStateChange((supabaseUser) => {
      setUser(authService.mapUser(supabaseUser));
      setIsLoading(false);
    });

    checkUser();

    // Limpar listener ao desmontar
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user: supabaseUser } = await authService.signIn(email, password);
      const mappedUser = authService.mapUser(supabaseUser);
      setUser(mappedUser);
      return mappedUser;
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user: supabaseUser } = await authService.signUp(email, password);
      const mappedUser = authService.mapUser(supabaseUser);
      setUser(mappedUser);
      return mappedUser;
    } catch (err: any) {
      console.error('Error signing up:', err);
      setError(err.message || 'Failed to sign up');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
      setUser(null);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.resetPassword(email);
    } catch (err: any) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword
  };
};