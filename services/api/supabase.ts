// Serviço para autenticação

import { supabase } from '~/utils/supabase';
import { User } from '~/types';

/**
 * Serviço para autenticação
 */
export const authService = {
  /**
   * Faz login com email e senha
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Dados da sessão
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Cria uma nova conta
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Dados da sessão
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  /**
   * Faz logout
   */
  async signOut() {
    await supabase.auth.signOut();
  },

  /**
   * Inicia o processo de recuperação de senha
   * @param email Email do usuário
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  /**
   * Obtém o usuário atual
   * @returns Usuário atual
   */
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  /**
   * Escuta mudanças na autenticação
   * @param callback Função a ser chamada quando houver mudanças
   * @returns Função para cancelar a escuta
   */
  onAuthStateChange(callback: (supabaseUser: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user || null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  },

  /**
   * Mapeia um usuário do Supabase para o tipo User da aplicação
   * @param supabaseUser Usuário do Supabase
   * @returns Usuário da aplicação ou null
   */
  mapUser(supabaseUser: any): User | null {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      app_metadata: supabaseUser.app_metadata,
      user_metadata: supabaseUser.user_metadata,
      created_at: supabaseUser.created_at
    };
  }
};