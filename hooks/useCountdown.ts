import { useEffect, useRef, useState } from "react";

export function useCountdown(startSeconds = 60) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = (from = startSeconds) => {
    setSeconds(from);
  };

  useEffect(() => {
    if (seconds <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [seconds]);

  return { seconds, start, isActive: seconds > 0 };
}
