// # Funções para consumir a API do TMDb

const API_TOKEN = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Configurações de localização
const LANGUAGE = 'pt-BR';
const REGION = 'BR';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
};

/**
 * Busca filmes populares em português do Brasil
 */
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?language=${LANGUAGE}&region=${REGION}&page=${page}`, 
      options
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return { results: [] };
  }
};

/**
 * Busca detalhes de um filme específico em português do Brasil
 */
export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?language=${LANGUAGE}`, 
      options
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Failed to fetch movie details for ID ${movieId}:`, error);
    return null;
  }
};

/**
 * Busca filmes em cartaz nos cinemas do Brasil
 */
export const fetchNowPlayingMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?language=${LANGUAGE}&region=${REGION}&page=${page}`, 
      options
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Failed to fetch now playing movies:", error);
    return { results: [] };
  }
};

/**
 * Busca próximos lançamentos para o Brasil
 */
export const fetchUpcomingMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?language=${LANGUAGE}&region=${REGION}&page=${page}`, 
      options
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Failed to fetch upcoming movies:", error);
    return { results: [] };
  }
};

/**
 * Busca filmes em tendência do dia em português do Brasil
 */
export const fetchTrendingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/day?language=${LANGUAGE}`,
      options
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return { results: [] };
  }
};