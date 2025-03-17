// Hook de utilidades para imagens

import { IMAGE_SIZES } from '~/utils/constants';

export const useImageUtils = () => {
  // Funções para construir URLs de imagens
  const getImageUrl = (path: string | null, size: string = IMAGE_SIZES.POSTER_MEDIUM) => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };
  
  // URLs para posters de filmes
  const getPosterUrl = (posterPath: string | null, fallbackImage = require('~/assets/images/poster-placeholder.png')) => {
    if (!posterPath) return fallbackImage;
    return { uri: getImageUrl(posterPath) };
  };
  
  // URLs para backdrops de filmes
  const getBackdropUrl = (backdropPath: string | null, size: string = IMAGE_SIZES.BACKDROP_LARGE, fallbackImage = require('~/assets/images/backdrop-placeholder.png')) => {
    if (!backdropPath) return fallbackImage;
    return { uri: getImageUrl(backdropPath, size) };
  };
  
  // URLs para imagens de perfil
  const getProfileUrl = (profilePath: string | null, fallbackImage = require('~/assets/images/profile-placeholder.png')) => {
    if (!profilePath) return fallbackImage;
    return { uri: getImageUrl(profilePath, IMAGE_SIZES.PROFILE_MEDIUM) };
  };
  
  return {
    getImageUrl,
    getPosterUrl,
    getBackdropUrl,
    getProfileUrl
  };
};