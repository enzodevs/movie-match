// Hook para gerenciamento de erros

import { useState, useCallback } from 'react';
import { errorService, AppError, ErrorType } from '~/services/errorService';

interface ErrorState {
  error: AppError | null;
  hasError: boolean;
  isNetworkError: boolean;
  isAuthError: boolean;
  isValidationError: boolean;
  isServerError: boolean;
  isNotFoundError: boolean;
  isPermissionError: boolean;
}

const initialErrorState: ErrorState = {
  error: null,
  hasError: false,
  isNetworkError: false,
  isAuthError: false,
  isValidationError: false,
  isServerError: false,
  isNotFoundError: false,
  isPermissionError: false
};

export function useErrorHandler(source?: string) {
  const [errorState, setErrorState] = useState<ErrorState>(initialErrorState);
  
  /**
   * Processa e define um erro
   * @param error Erro a ser processado
   * @param context Contexto adicional opcional
   */
  const handleError = useCallback((error: any, context?: Record<string, any>) => {
    // Processar o erro
    const processedError = errorService.processError(error, context);
    
    // Registrar no console
    errorService.logError(processedError, source);
    
    // Atualizar estado
    setErrorState({
      error: processedError,
      hasError: true,
      isNetworkError: processedError.type === ErrorType.NETWORK,
      isAuthError: processedError.type === ErrorType.AUTH,
      isValidationError: processedError.type === ErrorType.VALIDATION,
      isServerError: processedError.type === ErrorType.SERVER,
      isNotFoundError: processedError.type === ErrorType.NOT_FOUND,
      isPermissionError: processedError.type === ErrorType.PERMISSION
    });
    
    return processedError;
  }, [source]);
  
  /**
   * Limpa o estado de erro
   */
  const clearError = useCallback(() => {
    setErrorState(initialErrorState);
  }, []);
  
  /**
   * Wrapper para executar uma função com tratamento de erro
   * @param fn Função a ser executada
   * @param errorContext Contexto adicional opcional para o erro
   * @returns Função envolvida com tratamento de erro
   */
  const withErrorHandling = useCallback(<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorContext?: Record<string, any>
  ) => {
    return async (...args: Parameters<T>): Promise<ReturnType<T> | null> => {
      try {
        clearError();
        return await fn(...args);
      } catch (error) {
        handleError(error, errorContext);
        return null;
      }
    };
  }, [handleError, clearError]);
  
  /**
   * Obtém uma mensagem amigável para o usuário
   * @returns Mensagem amigável
   */
  const getErrorMessage = useCallback(() => {
    if (!errorState.error) return '';
    return errorService.getUserFriendlyMessage(errorState.error);
  }, [errorState.error]);
  
  return {
    ...errorState,
    handleError,
    clearError,
    withErrorHandling,
    getErrorMessage
  };
}