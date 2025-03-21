// Utilitários para validação

/**
 * Valida um endereço de e-mail
 * @param email Endereço de e-mail
 * @returns Se o e-mail é válido
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Valida uma senha (mínimo 6 caracteres)
   * @param password Senha
   * @returns Se a senha é válida
   */
  export const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
  };
  
  /**
   * Valida se duas senhas são iguais
   * @param password Senha
   * @param confirmPassword Confirmação de senha
   * @returns Se as senhas são iguais
   */
  export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  };