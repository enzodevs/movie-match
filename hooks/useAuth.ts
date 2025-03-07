// Hook para autenticação com Supabase - gerencia estado de autenticação e operações de login/logout

import { supabase } from '../utils/supabase';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
    
  // Estado para armazenar os dados do usuário atual (null quando não autenticado)
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Escuta mudanças no estado de autenticação (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Atualiza o estado com o usuário da sessão ou null se não estiver autenticado
      setUser(session?.user || null);
    });

    // Função de limpeza que é executada quando o componente é desmontado
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Função para autenticar usuário com email e senha
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  // Função para fazer logout do usuário atual
  const signOut = async () => {
    await supabase.auth.signOut();
    // Não precisa atualizar o estado user aqui, pois o listener do onAuthStateChange fará isso
  };

  // Função para criar uma nova conta de usuário
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data; // Retorna dados do usuário recém-criado
  };

  // Função para iniciar o processo de recuperação de senha
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  // Retorna o usuário atual e funções
  return { user, signIn, signOut, signUp, resetPassword };
};