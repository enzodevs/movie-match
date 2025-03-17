// Serviço para a API do TMDb

import { Movie, MovieCredits, Person, PersonCredits, PersonImages } from '~/types';

// Configurações da API
const API_TOKEN = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const LANGUAGE = 'pt-BR';
const REGION = 'BR';

// Opções padrão para todas as requisições
const defaultOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
};

/**
 * Realiza uma chamada à API do TMDb
 * @param endpoint Endpoint da API
 * @param params Parâmetros da requisição
 * @returns Resultado da requisição
 */
async function fetchFromApi<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  try {
    // Construir query string a partir dos parâmetros
    const queryParams = new URLSearchParams({
      language: LANGUAGE,
      ...params
    }).toString();

    const url = `${BASE_URL}${endpoint}?${queryParams}`;
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from TMDb API: ${endpoint}`, error);
    throw error;
  }
}

interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

/**
 * Serviço para filmes
 */
export const movieService = {
  /**
   * Busca filmes populares
   * @param page Número da página
   * @returns Lista de filmes populares
   */
  async getPopular(page = 1): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/movie/popular', {
      page,
      region: REGION
    });
  },

  /**
   * Busca filmes em tendência do dia
   * @returns Lista de filmes em tendência
   */
  async getTrending(): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/trending/movie/day');
  },

  /**
   * Busca filmes em tendência da semana
   * @returns Lista de filmes em tendência da semana
   */
  async getTrendingWeekly(): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/trending/movie/week');
  },

  /**
   * Busca filmes em cartaz
   * @param page Número da página
   * @returns Lista de filmes em cartaz
   */
  async getNowPlaying(page = 1): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/movie/now_playing', {
      page,
      region: REGION
    });
  },

  /**
   * Busca próximos lançamentos
   * @param page Número da página
   * @returns Lista de próximos lançamentos
   */
  async getUpcoming(page = 1): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/movie/upcoming', {
      page,
      region: REGION
    });
  },

  /**
   * Busca filmes mais bem avaliados
   * @param page Número da página
   * @returns Lista de filmes mais bem avaliados
   */
  async getTopRated(page = 1): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/movie/top_rated', {
      page,
      region: REGION
    });
  },

  /**
   * Busca detalhes de um filme
   * @param movieId ID do filme
   * @returns Detalhes do filme
   */
  async getDetails(movieId: number): Promise<Movie> {
    return fetchFromApi<Movie>(`/movie/${movieId}`);
  },

  /**
   * Busca créditos de um filme
   * @param movieId ID do filme
   * @returns Créditos do filme
   */
  async getCredits(movieId: number): Promise<MovieCredits> {
    return fetchFromApi<MovieCredits>(`/movie/${movieId}/credits`);
  },

  /**
   * Busca filmes similares
   * @param movieId ID do filme
   * @returns Lista de filmes similares
   */
  async getSimilar(movieId: number): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>(`/movie/${movieId}/similar`);
  },

  /**
   * Pesquisa filmes
   * @param query Termo de pesquisa
   * @param page Número da página
   * @returns Resultados da pesquisa
   */
  async search(query: string, page = 1): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/search/movie', {
      query,
      page
    });
  },

  /**
   * Busca filmes por gênero
   * @param genreId ID do gênero
   * @param page Número da página
   * @returns Lista de filmes do gênero
   */
  async getByGenre(genreId: number, page = 1): Promise<MovieResponse> {
    return fetchFromApi<MovieResponse>('/discover/movie', {
      with_genres: genreId.toString(),
      page,
      region: REGION
    });
  }
};

/**
 * Serviço para pessoas (atores, diretores, etc.)
 */
export const personService = {
  /**
   * Busca detalhes de uma pessoa
   * @param personId ID da pessoa
   * @returns Detalhes da pessoa
   */
  async getDetails(personId: number): Promise<Person> {
    return fetchFromApi<Person>(`/person/${personId}`);
  },

  /**
   * Busca créditos de filmes de uma pessoa
   * @param personId ID da pessoa
   * @returns Créditos da pessoa
   */
  async getMovieCredits(personId: number): Promise<PersonCredits> {
    return fetchFromApi<PersonCredits>(`/person/${personId}/movie_credits`);
  },

  /**
   * Busca imagens de uma pessoa
   * @param personId ID da pessoa
   * @returns Imagens da pessoa
   */
  async getImages(personId: number): Promise<PersonImages> {
    return fetchFromApi<PersonImages>(`/person/${personId}/images`, {
      // Não inclui language para receber todas as imagens disponíveis
      language: ''
    });
  }
};

// Exportar todos os serviços
export const tmdbApi = {
  movie: movieService,
  person: personService
};

