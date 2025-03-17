// Hook para integração de autenticação com TMDb

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves de armazenamento para os tokens
const TMDB_REQUEST_TOKEN_KEY = 'tmdb_request_token';
const TMDB_SESSION_ID_KEY = 'tmdb_session_id';
const TMDB_ACCOUNT_ID_KEY = 'tmdb_account_id';

const API_TOKEN = process.env.EXPO_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_URL_V4 = 'https://api.themoviedb.org/4';

// API comum para ambas as versões
const apiOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`
  }
};

export interface TMDBSession {
  requestToken: string | null;
  sessionId: string | null;
  accountId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useTMDB = () => {
  const { user } = useAuth(); // Integra com o hook de autenticação do Supabase
  const [session, setSession] = useState<TMDBSession>({
    requestToken: null,
    sessionId: null,
    accountId: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });

  // Carregar sessão existente ao inicializar
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSessionId = await AsyncStorage.getItem(TMDB_SESSION_ID_KEY);
        const storedAccountId = await AsyncStorage.getItem(TMDB_ACCOUNT_ID_KEY);
        
        if (storedSessionId && storedAccountId) {
          setSession({
            ...session,
            sessionId: storedSessionId,
            accountId: Number(storedAccountId),
            isAuthenticated: true
          });
        }
      } catch (error) {
        console.error('Erro ao carregar sessão TMDB:', error);
      }
    };

    if (user) {
      loadSession();
    }
  }, [user]);

  // Gerar um novo token de requisição
  const createRequestToken = async (): Promise<string | null> => {
    setSession({ ...session, isLoading: true, error: null });
    
    try {
      const response = await fetch(
        `${BASE_URL}/authentication/token/new`,
        apiOptions
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const requestToken = data.request_token;
      
      // Salvar token para uso posterior
      await AsyncStorage.setItem(TMDB_REQUEST_TOKEN_KEY, requestToken);
      
      setSession({ ...session, requestToken, isLoading: false });
      return requestToken;
    } catch (error) {
      console.error('Erro ao criar token de requisição:', error);
      setSession({ 
        ...session, 
        isLoading: false, 
        error: 'Falha ao obter token de autenticação' 
      });
      return null;
    }
  };

  // Autenticar com usuário e senha (método alternativo à autenticação via redirecionamento)
  const authenticateWithLogin = async (username: string, password: string): Promise<boolean> => {
    if (!session.requestToken) {
      const token = await createRequestToken();
      if (!token) return false;
    }
    
    setSession({ ...session, isLoading: true, error: null });
    
    try {
      const response = await fetch(
        `${BASE_URL}/authentication/token/validate_with_login`,
        {
          ...apiOptions,
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
            request_token: session.requestToken
          }),
          headers: {
            ...apiOptions.headers,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        setSession({ 
          ...session, 
          requestToken: data.request_token, 
          isLoading: false 
        });
        return true;
      } else {
        setSession({ 
          ...session, 
          isLoading: false, 
          error: 'Credenciais inválidas' 
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao autenticar com login:', error);
      setSession({ 
        ...session, 
        isLoading: false, 
        error: 'Falha na autenticação' 
      });
      return false;
    }
  };

  // Criar sessão a partir do token autenticado
  const createSession = async (): Promise<boolean> => {
    if (!session.requestToken) {
      setSession({ 
        ...session, 
        error: 'Token de requisição não disponível' 
      });
      return false;
    }
    
    setSession({ ...session, isLoading: true, error: null });
    
    try {
      const response = await fetch(
        `${BASE_URL}/authentication/session/new`,
        {
          ...apiOptions,
          method: 'POST',
          body: JSON.stringify({
            request_token: session.requestToken
          }),
          headers: {
            ...apiOptions.headers,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success) {
        const sessionId = data.session_id;
        
        // Salvar ID da sessão para uso posterior
        await AsyncStorage.setItem(TMDB_SESSION_ID_KEY, sessionId);
        
        // Obter detalhes da conta para este sessão
        const accountDetails = await fetchAccountDetails(sessionId);
        
        if (accountDetails) {
          // Salvar ID da conta
          await AsyncStorage.setItem(TMDB_ACCOUNT_ID_KEY, accountDetails.id.toString());
          
          setSession({
            ...session,
            sessionId,
            accountId: accountDetails.id,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        } else {
          setSession({
            ...session,
            sessionId,
            isAuthenticated: true,
            isLoading: false
          });
          return true;
        }
      } else {
        setSession({ 
          ...session, 
          isLoading: false, 
          error: 'Falha ao criar sessão' 
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
      setSession({ 
        ...session, 
        isLoading: false, 
        error: 'Falha ao criar sessão' 
      });
      return false;
    }
  };

  // Obter detalhes da conta para uma sessão
  const fetchAccountDetails = async (sessionId: string): Promise<any | null> => {
    try {
      const response = await fetch(
        `${BASE_URL}/account?session_id=${sessionId}`,
        apiOptions
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter detalhes da conta:', error);
      return null;
    }
  };

  // Encerrar sessão
  const deleteSession = async (): Promise<boolean> => {
    if (!session.sessionId) {
      setSession({
        requestToken: null,
        sessionId: null,
        accountId: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      return true;
    }
    
    setSession({ ...session, isLoading: true, error: null });
    
    try {
      const response = await fetch(
        `${BASE_URL}/authentication/session`,
        {
          ...apiOptions,
          method: 'DELETE',
          body: JSON.stringify({
            session_id: session.sessionId
          }),
          headers: {
            ...apiOptions.headers,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Remover tokens salvos
      await AsyncStorage.removeItem(TMDB_REQUEST_TOKEN_KEY);
      await AsyncStorage.removeItem(TMDB_SESSION_ID_KEY);
      await AsyncStorage.removeItem(TMDB_ACCOUNT_ID_KEY);
      
      setSession({
        requestToken: null,
        sessionId: null,
        accountId: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      setSession({ 
        ...session, 
        isLoading: false, 
        error: 'Falha ao encerrar sessão' 
      });
      return false;
    }
  };

  // API V4 específica - obter recomendações para o usuário atual
  const fetchUserRecommendations = async (page = 1): Promise<any | null> => {
    if (!session.accountId || !session.sessionId) {
      setSession({ 
        ...session, 
        error: 'Usuário não autenticado no TMDB' 
      });
      return null;
    }
    
    try {
      const response = await fetch(
        `${BASE_URL_V4}/account/${session.accountId}/movie/recommendations?page=${page}&language=pt-BR`,
        {
          ...apiOptions,
          headers: {
            ...apiOptions.headers,
            // Adicionar session_id ao header para API v4
            'Authorization': `Bearer ${API_TOKEN}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      return null;
    }
  };

  // API V4 - obter watchlist do usuário
  const fetchUserWatchlist = async (page = 1): Promise<any | null> => {
    if (!session.accountId || !session.sessionId) {
      setSession({ 
        ...session, 
        error: 'Usuário não autenticado no TMDB' 
      });
      return null;
    }
    
    try {
      const response = await fetch(
        `${BASE_URL_V4}/account/${session.accountId}/movie/watchlist?page=${page}&language=pt-BR`,
        {
          ...apiOptions,
          headers: {
            ...apiOptions.headers,
            // Adicionar session_id ao header para API v4
            'Authorization': `Bearer ${API_TOKEN}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao obter watchlist:', error);
      return null;
    }
  };

  // Retornar todas as funções e estados necessários
  return {
    session,
    createRequestToken,
    authenticateWithLogin,
    createSession,
    deleteSession,
    fetchUserRecommendations,
    fetchUserWatchlist
  };
};