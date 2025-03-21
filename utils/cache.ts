// Utilitários para cache de imagens e outros dados

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Salva um valor no cache
 * @param key Chave do valor
 * @param value Valor
 */
export const saveToCache = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

/**
 * Obtém um valor do cache
 * @param key Chave do valor
 * @returns Valor ou null se não existir
 */
export const getFromCache = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) as T : null;
  } catch (error) {
    console.error('Error getting from cache:', error);
    return null;
  }
};

/**
 * Remove um valor do cache
 * @param key Chave do valor
 */
export const removeFromCache = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from cache:', error);
  }
};

/**
 * Limpa o cache
 * @param prefix Prefixo opcional para limpar apenas chaves específicas
 */
export const clearCache = async (prefix?: string): Promise<void> => {
  try {
    if (prefix) {
      // Obter todas as chaves
      const keys = await AsyncStorage.getAllKeys();
      // Filtrar chaves pelo prefixo
      const keysToRemove = keys.filter(key => key.startsWith(prefix));
      // Remover chaves
      await AsyncStorage.multiRemove(keysToRemove);
    } else {
      // Limpar todo o cache
      await AsyncStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};