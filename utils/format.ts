// Utilitários para formatação de texto e números

/**
 * Formata um número para exibição como porcentagem
 * @param value Valor (0-100)
 * @param decimalPlaces Casas decimais
 * @returns String formatada com porcentagem
 */
export const formatPercentage = (value: number, decimalPlaces = 1): string => {
    return `${value.toFixed(decimalPlaces)}%`;
  };
  
  /**
   * Formata um número para exibição
   * @param value Valor
   * @param decimalPlaces Casas decimais
   * @returns String formatada
   */
  export const formatNumber = (value: number, decimalPlaces = 0): string => {
    return value.toFixed(decimalPlaces);
  };
  
  /**
   * Trunca um texto para um tamanho máximo com reticências
   * @param text Texto a ser truncado
   * @param maxLength Tamanho máximo
   * @returns Texto truncado
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    
    return `${text.substring(0, maxLength)}...`;
  };
  
  /**
   * Limita o número de palavras em um texto
   * @param text Texto original
   * @param maxWords Número máximo de palavras
   * @returns Texto limitado
   */
  export const limitWords = (text: string, maxWords: number): string => {
    const words = text.split(' ');
    
    if (words.length <= maxWords) return text;
    
    return `${words.slice(0, maxWords).join(' ')}...`;
  };