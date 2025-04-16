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
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data as UserProfile || null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  },

  /**
   * Verifica se um usuário existe na tabela auth.users
   * @param userId ID do usuário
   * @returns Se o usuário existe
   */
  async checkUserExists(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('check_user_exists', { user_id: userId });
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  },

  /**
   * Cria um novo perfil de usuário
   * @param profile Dados do perfil
   * @returns Se o perfil foi criado com sucesso
   */
  async createProfile(profile: UserProfile): Promise<boolean> {
    try {
      // Verifica se usuário existe na tabela auth.users
      const userExists = await this.checkUserExists(profile.id);
      
      if (!userExists) {
        console.error('Cannot create profile: User does not exist in auth.users');
        return false;
      }
      
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
      console.log("[updateProfileImage] Starting with params:", { userId, imageUri });
      
      // Verificar se a URI é válida
      if (!imageUri) {
        console.log("[updateProfileImage] Invalid image URI:", imageUri);
        return null;
      }
      
      // Extrair a extensão do arquivo
      const uriParts = imageUri.split('.');
      const fileExt = uriParts.length > 1 ? uriParts.pop() : 'jpg';
      console.log("[updateProfileImage] Extracted file extension:", fileExt);
      
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      console.log("[updateProfileImage] Created file path:", filePath);
      
      // Converter URI para Blob
      console.log("[updateProfileImage] About to fetch image from URI");
      try {
        const response = await fetch(imageUri);
        console.log("[updateProfileImage] Fetch response status:", response.status);
        
        if (!response.ok) {
          console.log("[updateProfileImage] Fetch failed:", response.statusText);
          return null;
        }
        
        const blob = await response.blob();
        console.log("[updateProfileImage] Created blob with size:", blob.size);
        
        // Blob vazio
        if (blob.size === 0) {
          console.log("[updateProfileImage] Warning: Blob size is 0");
        }
      
        // Upload para o bucket
        console.log("[updateProfileImage] Starting upload to Supabase storage");
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-pictures')
          .upload(filePath, blob, {
            contentType: `image/${fileExt}`,
            cacheControl: '3600'
          });
        
        console.log("[updateProfileImage] Upload result:", { uploadData, uploadError });
        
        if (uploadError) {
          console.log("[updateProfileImage] Upload error:", JSON.stringify(uploadError));
          throw uploadError;
        }
        
        // URL pública
        console.log("[updateProfileImage] Getting public URL");
        const { data: urlData } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(filePath);
        
        console.log("[updateProfileImage] Public URL:", urlData.publicUrl);
        
        return urlData.publicUrl;
      } catch (fetchError) {
        console.log("[updateProfileImage] Error in fetch/upload process:", fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('[updateProfileImage] Error:', error);
      if (error instanceof Error) {
        console.error('[updateProfileImage] Error details:', { 
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.error('[updateProfileImage] Unknown error type:', typeof error);
      }
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
  },

  async createOrUpdateProfile(profile: UserProfile): Promise<boolean> {
    try {
      // Implementa uma estratégia de tentativa com retry
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          // Primeiro verificamos se o perfil já existe
          const { data: existingProfile, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('id', profile.id)
            .maybeSingle();
          
          if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
          }
          
          if (existingProfile) {
            // Se o perfil existir, atualizamos
            const { error: updateError } = await supabase
              .from('users')
              .update(profile)
              .eq('id', profile.id);
            
            if (updateError) throw updateError;
          } else {
            // Antes de inserir, verificamos novamente se o usuário existe em auth.users
            const userExists = await this.checkUserExists(profile.id);
            if (!userExists) {
              console.warn(`User ${profile.id} does not exist in auth.users. Waiting and retrying...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              retryCount++;
              continue;
            }
            
            // Se não existir na tabela users mas existir em auth.users, inserimos
            try {
              const { error: insertError } = await supabase
                .from('users')
                .insert(profile);
              
              if (insertError) {
                // Se for erro de chave duplicada, significa que o perfil foi criado em outro processo
                // então tentamos atualizar em vez de inserir
                if (insertError.code === '23505') {
                  const { error: updateError } = await supabase
                    .from('users')
                    .update(profile)
                    .eq('id', profile.id);
                  
                  if (updateError) throw updateError;
                } else {
                  throw insertError;
                }
              }
            } catch (e: any) {
              if (e.code === '23505') {
                // Chave duplicada, tentamos atualizar
                const { error: updateError } = await supabase
                  .from('users')
                  .update(profile)
                  .eq('id', profile.id);
                
                if (updateError) throw updateError;
              } else {
                throw e;
              }
            }
          }
          
          // Se chegou aqui, a operação foi bem-sucedida
          return true;
        } catch (e: any) {
          // Se for o último retry, propaga o erro
          if (retryCount === maxRetries - 1) {
            throw e;
          }
          
          console.warn(`Attempt ${retryCount + 1} failed, retrying...`, e);
          // Espera um tempo antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 1000));
          retryCount++;
        }
      }
      
      return false; // Não deveria chegar aqui
    } catch (error) {
      console.error('Error creating/updating profile:', error);
      return false;
    }
  }
};