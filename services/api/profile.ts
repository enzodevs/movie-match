// Serviço para gerenciar perfis de usuários no Supabase

import { supabase } from '~/utils/supabase';
import { UserProfile } from '~/types';

/**
 * Serviço para gerenciar perfis de usuários
 */
export const profileService = {
  /**
   * Obtém o perfil de um usuário
   * @param userId ID do usuário
   * @returns Perfil do usuário ou null se não existir
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Cria um novo perfil de usuário
   * @param profile Dados do perfil
   * @returns Se o perfil foi criado com sucesso
   */
  async createProfile(profile: UserProfile): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .insert(profile);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating profile:', error);
      return false;
    }
  },

  /**
   * Atualiza o perfil de um usuário
   * @param userId ID do usuário
   * @param profileData Dados do perfil a serem atualizados
   * @returns Se o perfil foi atualizado com sucesso
   */
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  /**
   * Atualiza a imagem de perfil de um usuário
   * @param userId ID do usuário
   * @param imageUri URI da imagem
   * @returns URL pública da imagem ou null se houver erro
   */
  async updateProfileImage(userId: string, imageUri: string): Promise<string | null> {
    try {
      // Extrair a extensão do arquivo
      const fileExt = imageUri.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Converter URI para Blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Upload para o bucket 'profile-pictures'
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, blob);
      
      if (uploadError) throw uploadError;
      
      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error updating profile image:', error);
      return null;
    }
  },

  /**
   * Atualiza os gêneros favoritos de um usuário
   * @param userId ID do usuário
   * @param genreIds IDs dos gêneros favoritos
   * @returns Se os gêneros foram atualizados com sucesso
   */
  async updateFavoriteGenres(userId: string, genreIds: number[]): Promise<boolean> {
    try {
      // Primeiro, obter o perfil atual
      const profile = await this.getProfile(userId);
      
      if (!profile) throw new Error('Profile not found');
      
      // Atualizar configurações do app
      const appSettings = {
        ...(profile.app_settings || {}),
        favorite_genres: genreIds
      };
      
      // Atualizar perfil
      const success = await this.updateProfile(userId, {
        app_settings: appSettings
      });
      
      return success;
    } catch (error) {
      console.error('Error updating favorite genres:', error);
      return false;
    }
  }
};