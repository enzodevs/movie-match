// Hook para obter o valor anterior de uma variável

import { useRef, useEffect } from 'react';

/**
 * Hook para obter o valor anterior de uma variável
 * @param value Valor atual
 * @returns Valor anterior
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}