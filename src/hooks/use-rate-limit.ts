'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCountdown } from '@/hooks/use-countdown';

export interface RateLimitState {
  limit: number;
  remaining: number;
  reset: number;
}

const REFRESH_INTERVAL = 30_000;

async function fetchRateLimitState(): Promise<RateLimitState> {
  const res = await fetch('/api/ratelimit', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch rate limit status');
  }
  const data = (await res.json()) as RateLimitState;
  return data;
}

export function useRateLimit() {
  const [state, setState] = useState<RateLimitState | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchRateLimitState();
      setState((prev) =>
        prev &&
        prev.limit === next.limit &&
        prev.remaining === next.remaining &&
        prev.reset === next.reset
          ? prev
          : next
      );
    } catch {
      // keep last known state so the UI never crashes when Upstash is unreachable
    }
  }, []);

  useEffect(() => {
    const initial = setTimeout(refresh, 0);
    const id = setInterval(refresh, REFRESH_INTERVAL);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [refresh]);

  const limit = state?.limit ?? 10;
  const remaining = state?.remaining ?? limit;
  const reset = state?.reset ?? 0;
  const isLimited = remaining <= 0 && reset > 0;

  const { secondsLeft, isExpired } = useCountdown(isLimited ? reset : null);

  const decrementRemaining = useCallback(() => {
    setState((prev) => (prev ? { ...prev, remaining: Math.max(0, prev.remaining - 1) } : prev));
  }, []);

  return {
    rateLimit: state,
    limit,
    remaining,
    reset,
    isLimited,
    secondsLeft,
    isExpired,
    refresh,
    decrementRemaining,
  };
}