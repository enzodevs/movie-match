// Serviço centralizado para tratamento de erros

import { getErrorMessage, getAuthErrorMessage } from '~/utils/errorHandling';

// Tipos de erro para categorização
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  NOT_FOUND = 'not_found',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown'
}

// Interface para erro estruturado
export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  code?: string;
  context?: Record<string, any>;
}

/**
 * Serviço para tratamento centralizado de erros
 */
export const errorService = {
  /**
   * Detecta o tipo de erro com base na mensagem ou código
   * @param error Erro original
   * @returns Tipo de erro categorizado
   */
  detectErrorType(error: any): ErrorType {
    const message = getErrorMessage(error).toLowerCase();
    const code = error?.code || '';
    
    // Erros de rede
    if (
      message.includes('network') || 
      message.includes('internet') ||
      message.includes('offline') ||
      message.includes('connection')
    ) {
      return ErrorType.NETWORK;
    }
    
    // Erros de autenticação
    if (
      message.includes('auth') ||
      message.includes('login') ||
      message.includes('password') ||
      message.includes('credentials') ||
      message.includes('token') ||
      code.includes('auth/')
    ) {
      return ErrorType.AUTH;
    }
    
    // Erros de validação
    if (
      message.includes('valid') ||
      message.includes('required') ||
      message.includes('missing')
    ) {
      return ErrorType.VALIDATION;
    }
    
    // Erros de servidor
    if (
      message.includes('server') ||
      message.includes('500') ||
      message.includes('timeout')
    ) {
      return ErrorType.SERVER;
    }
    
    // Erros de não encontrado
    if (
      message.includes('not found') ||
      message.includes('404') ||
      code.includes('not-found')
    ) {
      return ErrorType.NOT_FOUND;
    }
    
    // Erros de permissão
    if (
      message.includes('permission') ||
      message.includes('access') ||
      message.includes('forbidden') ||
      message.includes('403')
    ) {
      return ErrorType.PERMISSION;
    }
    
    // Erro desconhecido
    return ErrorType.UNKNOWN;
  },
  
  /**
   * Processa um erro e retorna um objeto estruturado
   * @param error Erro original
   * @param context Contexto adicional opcional
   * @returns Erro estruturado
   */
  processError(error: any, context?: Record<string, any>): AppError {
    const type = this.detectErrorType(error);
    let message = getErrorMessage(error);
    
    // Para erros de autenticação, usar mensagens mais amigáveis
    if (type === ErrorType.AUTH) {
      message = getAuthErrorMessage(error);
    }
    
    return {
      type,
      message,
      originalError: error,
      code: error?.code,
      context
    };
  },
  
  /**
   * Obtém uma mensagem amigável para o usuário com base no tipo de erro
   * @param error Erro estruturado ou original
   * @returns Mensagem amigável para o usuário
   */
  getUserFriendlyMessage(error: AppError | any): string {
    // Se já for um AppError, usar diretamente
    if (error && 'type' in error) {
      return error.message;
    }
    
    // Processar o erro primeiro
    const processedError = this.processError(error);
    
    switch (processedError.type) {
      case ErrorType.NETWORK:
        return 'Falha na conexão com a internet. Verifique sua conexão e tente novamente.';
        
      case ErrorType.AUTH:
        return processedError.message; // Já foi processado por getAuthErrorMessage
        
      case ErrorType.VALIDATION:
        return 'Alguns campos contêm informações inválidas. Verifique os dados e tente novamente.';
        
      case ErrorType.SERVER:
        return 'O servidor está enfrentando problemas. Tente novamente mais tarde.';
        
      case ErrorType.NOT_FOUND:
        return 'O conteúdo solicitado não foi encontrado.';
        
      case ErrorType.PERMISSION:
        return 'Você não tem permissão para acessar este conteúdo.';
        
      case ErrorType.UNKNOWN:
      default:
        return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
    }
  },
  
  /**
   * Exibe o erro no console com informações detalhadas
   * @param error Erro estruturado ou original
   * @param source Fonte do erro (componente, serviço, etc.)
   */
  logError(error: AppError | any, source?: string): void {
    // Se não for um AppError, processar primeiro
    const processedError = 'type' in error 
      ? error 
      : this.processError(error);
    
    // Construir mensagem de log
    const logPrefix = source ? `[${source}]` : '[Error]';
    
    console.error(
      `${logPrefix} ${processedError.type.toUpperCase()}: ${processedError.message}`,
      {
        code: processedError.code,
        context: processedError.context,
        originalError: processedError.originalError
      }
    );
  }
};