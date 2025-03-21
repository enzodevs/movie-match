// Utilitários relacionados ao dispositivo

import { Dimensions, Platform, ScaledSize } from 'react-native';

/**
 * Obtém dimensões da tela
 * @returns Dimensões da tela
 */
export const getScreenDimensions = (): ScaledSize => {
  return Dimensions.get('window');
};

/**
 * Verifica se o dispositivo é iOS
 * @returns Se o dispositivo é iOS
 */
export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * Verifica se o dispositivo é Android
 * @returns Se o dispositivo é Android
 */
export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

/**
 * Verifica se o dispositivo é de tela pequena (menor que 375px)
 * @returns Se o dispositivo é de tela pequena
 */
export const isSmallScreen = (): boolean => {
  const { width } = getScreenDimensions();
  return width < 375;
};

/**
 * Calcula a altura proporcional baseada na largura
 * @param width Largura
 * @param ratio Proporção (altura/largura)
 * @returns Altura calculada
 */
export const getHeightFromRatio = (width: number, ratio = 1.5): number => {
  return width * ratio;
};