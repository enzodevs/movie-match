// Hook para responder a media queries (tamanho da tela, etc)

import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

type MediaQueryCallback = (dimensions: { width: number; height: number }) => boolean;

/**
 * Hook para responder a mudanças no tamanho da tela
 * @param query Função de callback que retorna um booleano com base nas dimensões
 * @returns Resultado da query
 */
export function useMediaQuery(query: MediaQueryCallback): boolean {
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
  const [matches, setMatches] = useState<boolean>(query(dimensions));

  useEffect(() => {
    const handleDimensionsChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
      setMatches(query(window));
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionsChange);

    return () => {
      subscription.remove();
    };
  }, [query]);

  return matches;
}