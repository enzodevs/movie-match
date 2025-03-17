// Tipos relacionados à autenticação

export interface User {
    id: string;
    email: string | undefined;
    aud?: string;
    role?: string;
    app_metadata?: Record<string, any>;
    user_metadata?: Record<string, any>;
    created_at?: string;
  }
  
  export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
  }