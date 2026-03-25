import { useEffect, useCallback, useRef } from 'react';
import type { Direction } from '../data/types.ts';

interface UseInputOptions {
  onDirection: (dir: Direction) => void;
  enabled?: boolean;
}

export function useInput({ onDirection, enabled = true }: UseInputOptions) {
  const onDirRef = useRef(onDirection);
  useEffect(() => {
    onDirRef.current = onDirection;
  }, [onDirection]);

  // Keyboard
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        onDirRef.current(dir);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled]);

  // Touch DPad callback
  const handleDPad = useCallback((dir: Direction) => {
    if (!enabled) return;
    onDirRef.current(dir);
  }, [enabled]);

  return { handleDPad };
}
