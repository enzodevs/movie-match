// Hook para verificar se é a primeira renderização

import { useRef } from 'react';

/**
 * Hook para verificar se é a primeira renderização do componente
 * @returns Booleano indicando se é a primeira renderização
 */
export function useIsFirstRender(): boolean {
  const isFirstRender = useRef(true);

  if (isFirstRender.current) {
    isFirstRender.current = false;
    return true;
  }

  return false;
}