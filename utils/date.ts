// Utilitários datas

/**
 * Formata uma data no formato padrão do Brasil (DD/MM/YYYY)
 * @param dateString String de data (ISO)
 * @returns Data formatada
 */
export const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  /**
   * Extrai o ano de uma data
   * @param dateString String de data (ISO)
   * @returns Ano da data
   */
  export const getYear = (dateString?: string): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };
  
  /**
   * Calcula idade a partir da data de nascimento
   * @param birthdayString String de data de nascimento (ISO)
   * @returns Idade em anos
   */
  export const calculateAge = (birthdayString?: string): number | null => {
    if (!birthdayString) return null;
    
    const birthDate = new Date(birthdayString);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  /**
   * Formata uma data com opções personalizadas
   * @param dateString String de data (ISO)
   * @param options Opções de formatação
   * @returns Data formatada
   */
  export const formatDateWithOptions = (
    dateString?: string,
    options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    }
  ): string => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
  };