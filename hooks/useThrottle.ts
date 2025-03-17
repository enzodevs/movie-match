// Hook para throttle de valores (útil para eventos frequentes como scroll)

import { useState, useEffect, useRef } from 'react';

/**
 * Hook para criar um valor com throttle
 * @param value Valor a ser throttled
 * @param limit Limite de tempo em milissegundos
 * @returns Valor após o throttle
 */
export function useThrottle<T>(value: T, limit = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}