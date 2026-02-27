import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerReturn {
  timeLeft: number;
  elapsed: number;
  isRunning: boolean;
  start: () => void;
  stop: () => number;
  reset: (seconds?: number) => void;
}

export function useTimer(initialSeconds: number = 15): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(0);
  const intervalRef = useRef<number | null>(null);

  const elapsed = initialSeconds - timeLeft;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, [clearTimer]);

  const stop = useCallback((): number => {
    clearTimer();
    setIsRunning(false);
    return (Date.now() - startTimeRef.current) / 1000;
  }, [clearTimer]);

  const reset = useCallback((seconds?: number) => {
    clearTimer();
    setTimeLeft(seconds ?? initialSeconds);
    setIsRunning(false);
  }, [clearTimer, initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = window.setInterval(() => {
      const secs = (Date.now() - startTimeRef.current) / 1000;
      const left = Math.max(0, initialSeconds - secs);
      setTimeLeft(Math.ceil(left * 10) / 10); // 0.1s precision
      if (left <= 0) {
        clearTimer();
        setIsRunning(false);
      }
    }, 100);
    return clearTimer;
  }, [isRunning, initialSeconds, clearTimer]);

  return { timeLeft, elapsed, isRunning, start, stop, reset };
}
