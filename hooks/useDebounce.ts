// Hook para debounce de valores (util para pesquisas, etc)

import { useState, useEffect } from 'react';

/**
 * Hook para criar um valor com debounce
 * @param value Valor a ser debounced
 * @param delay Tempo de atraso em milissegundos
 * @returns Valor após o debounce
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura timer para atualizar o valor após o atraso
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timer se o valor mudar antes do atraso
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}