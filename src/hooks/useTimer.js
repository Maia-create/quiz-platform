import { useState, useEffect, useRef } from "react";

export function useTimer(seconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpireRef.current();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  return timeLeft;
}