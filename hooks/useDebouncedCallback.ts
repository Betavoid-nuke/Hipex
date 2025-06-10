import { useRef, useCallback } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: any[]) => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}
