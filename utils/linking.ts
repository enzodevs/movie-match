// Utilitários para compartilhamento e links externos

import { Share, Linking, Platform } from 'react-native';
import { Movie } from '~/types';
import { APP_NAME } from './constants';

/**
 * Compartilha um filme
 * @param movie Filme
 * @param message Mensagem personalizada (opcional)
 * @returns Resultado do compartilhamento
 */
export const shareMovie = async (movie: Movie, message?: string): Promise<boolean> => {
  try {
    const shareMessage = message || 
      `Confira "${movie.title}" no ${APP_NAME}!\n` +
      `Nota: ${movie.vote_average.toFixed(1)}/10`;
    
    const result = await Share.share({
      message: shareMessage,
    });
    
    return result.action !== Share.dismissedAction;
  } catch (error) {
    console.error('Error sharing movie:', error);
    return false;
  }
};

/**
 * Abre uma URL externa
 * @param url URL
 * @returns Se a URL foi aberta com sucesso
 */
export const openExternalUrl = async (url: string): Promise<boolean> => {
  try {
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      await Linking.openURL(url);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error opening URL:', error);
    return false;
  }
};