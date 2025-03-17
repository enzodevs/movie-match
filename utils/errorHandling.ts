// Funções para tratamento de erros

/**
 * Obtém uma mensagem de erro amigável
 * @param error Erro
 * @returns Mensagem de erro
 */
export const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'Ocorreu um erro desconhecido';
  };
  
  /**
   * Processa erros comuns de autenticação
   * @param error Erro
   * @returns Mensagem de erro amigável
   */
  export const getAuthErrorMessage = (error: any): string => {
    const message = getErrorMessage(error);
    
    if (message.includes('Invalid login credentials')) {
      return 'Email ou senha incorretos';
    }
    
    if (message.includes('already registered')) {
      return 'Este email já está registrado';
    }
    
    if (message.includes('weak password')) {
      return 'A senha é muito fraca';
    }
    
    if (message.includes('network request failed')) {
      return 'Falha na conexão. Verifique sua internet.';
    }
    
    return message;
  };
  