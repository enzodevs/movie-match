import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import axios from 'https://deno.land/x/axiod@0.26.2/mod.ts';

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
const ALLOWED_METHODS = ['POST', 'OPTIONS'];
const MAX_BODY_SIZE = 1024; // 1KB
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  // Handle pre-flight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    // Validate HTTP method
    if (!ALLOWED_METHODS.includes(req.method)) {
      return new Response(
        JSON.stringify({ error: `Método ${req.method} não permitido` }),
        { status: 405, headers: CORS_HEADERS }
      );
    }

    // Validate API key
    if (!TMDB_API_KEY) {
      console.error('Chave da API TMDB não encontrada');
      return new Response(
        JSON.stringify({ error: 'Erro de configuração do servidor' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await req.json({ limit: MAX_BODY_SIZE });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'JSON inválido no corpo da requisição' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Validate genre parameter
    const { genre } = body;
    if (!genre || !/^\d+(?:,\d+)*$/.test(genre.toString())) {
      return new Response(
        JSON.stringify({ error: 'Parâmetro genre inválido ou ausente' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Fetch from TMDB
    const response = await axios.get(
      'https://api.themoviedb.org/3/discover/movie',
      {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genre,
          language: 'pt-BR',
          page: 1
        },
        timeout: 5000
      }
    );

    return new Response(
      JSON.stringify(response.data.results),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro:', error);
    
    if (error.response) {
      return new Response(
        JSON.stringify({ 
          error: 'Erro na API TMDB',
          status: error.response.status,
          details: error.response.data 
        }),
        { 
          status: error.response.status,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Erro interno no servidor' }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});