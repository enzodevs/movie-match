// Serviço para gerenciar listas de filmes dos usuários no Supabase

import { supabase } from '~/utils/supabase';

/**
 * Serviço para gerenciar listas de filmes dos usuários
 */
export const userMoviesService = {
  /**
   * Obtém o ID do usuário atual
   * @returns ID do usuário atual ou null se não estiver autenticado
   */
  async getCurrentUserId(): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || null;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return null;
    }
  },

  /**
   * Obtém o email do usuário atual
   * @returns Objeto com o email do usuário ou null se não estiver autenticado
   */
  async getCurrentUserEmail(): Promise<{ email: string } | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      return email ? { email } : null;
    } catch (error) {
      console.error('Error getting current user email:', error);
      return null;
    }
  },

  /**
   * Atualiza a avaliação de um filme assistido
   * @param userId ID do usuário
   * @param movieId ID do filme
   * @param rating Nova avaliação
   * @returns Se a atualização foi bem-sucedida
   */
  async updateWatchedMovie(userId: string, movieId: number, rating: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watched_movies')
        .update({ rating })
        .eq('user_id', userId)
        .eq('movie_id', movieId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating watched movie rating:', error);
      return false;
    }
  },

  /**
   * Obtém a lista de filmes assistidos por um usuário
   * @param userId ID do usuário
   * @returns Lista de IDs de filmes
   */
  async getWatchedMovies(userId: string): Promise<number[]> {
    try {
      const { data, error } = await supabase
        .from('watched_movies')
        .select('movie_id')
        .eq('user_id', userId)
        .order('watched_at', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.movie_id);
    } catch (error) {
      console.error('Error fetching watched movies:', error);
      return [];
    }
  },

  /**
   * Obtém a lista de filmes favoritos de um usuário
   * @param userId ID do usuário
   * @returns Lista de IDs de filmes
   */
  async getFavoriteMovies(userId: string): Promise<number[]> {
    try {
      const { data, error } = await supabase
        .from('favorite_movies')
        .select('movie_id')
        .eq('user_id', userId)
        .order('added_at', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.movie_id);
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      return [];
    }
  },

  /**
   * Obtém a watchlist de um usuário
   * @param userId ID do usuário
   * @returns Lista de IDs de filmes
   */
  async getWatchlistMovies(userId: string): Promise<number[]> {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('movie_id')
        .eq('user_id', userId)
        .order('added_at', { ascending: false });
      
      if (error) throw error;
      return data.map(item => item.movie_id);
    } catch (error) {
      console.error('Error fetching watchlist movies:', error);
      return [];
    }
  },

  /**
   * Adiciona um filme à lista de assistidos
   * @param userId ID do usuário
   * @param movieId ID do filme
   * @param rating Avaliação do filme (opcional)
   * @returns Se o filme foi adicionado com sucesso
   */
  async addToWatched(userId: string, movieId: number, rating?: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watched_movies')
        .insert({
          user_id: userId,
          movie_id: movieId,
          rating: rating || null,
          watched_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding to watched:', error);
      return false;
    }
  },

  /**
   * Remove um filme da lista de assistidos
   * @param userId ID do usuário
   * @param movieId ID do filme
   * @returns Se o filme foi removido com sucesso
   */
  async removeFromWatched(userId: string, movieId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watched_movies')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from watched:', error);
      return false;
    }
  },

  /**
   * Adiciona um filme aos favoritos
   * @param userId ID do usuário
   * @param movieId ID do filme
   * @returns Se o filme foi adicionado com sucesso
   */
  async addToFavorites(userId: string, movieId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorite_movies')
        .insert({
          user_id: userId,
          movie_id: movieId,
          added_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  },

  /**
   * Remove um filme dos favoritos
   * @param userId ID do usuário
   * @param movieId ID do filme
   * @returns Se o filme foi removido com sucesso
   */
  async removeFromFavorites(userId: string, movieId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('favorite_movies')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  },

  /**
   * Adiciona um filme à watchlist
   * @param userId ID do usuário
   * @param movieId ID do filme
   * @returns Se o filme foi adicionado com sucesso
   */
  async addToWatchlist(userId: string, movieId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: userId,
          movie_id: movieId,
          added_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      return false;
    }
  },

  /**
   * Remove um filme da watchlist
   * @param userId ID do usuário
   * @param movieId ID do filme
   * @returns Se o filme foi removido com sucesso
   */
  async removeFromWatchlist(userId: string, movieId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      return false;
    }
  }
};