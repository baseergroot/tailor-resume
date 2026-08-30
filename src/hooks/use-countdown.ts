'use client';

import { useEffect, useState } from 'react';

export function useCountdown(targetAt: number | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (targetAt == null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetAt]);

  const secondsLeft = targetAt == null ? 0 : Math.max(0, Math.ceil((targetAt - now) / 1000));
  const isExpired = targetAt != null && now >= targetAt;

  return { secondsLeft, isExpired };
}