'use client';

import { useEffect, useRef } from 'react';
import { RiFlashlightFill } from '@remixicon/react';
import { cn } from '@/lib/utils';
import type { RateLimitState } from '@/hooks/use-rate-limit';

interface RateLimitBadgeProps {
  rateLimit: RateLimitState | null;
  secondsLeft: number;
  isLimited: boolean;
  onExpire: () => void;
}

export function formatCountdown(seconds: number) {
  const s = Math.max(0, seconds);
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const ss = (s % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

export function RateLimitBadge({ rateLimit, secondsLeft, isLimited, onExpire }: RateLimitBadgeProps) {
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (isLimited && secondsLeft === 0 && !notifiedRef.current) {
      notifiedRef.current = true;
      onExpire();
    }
    if (!isLimited) {
      notifiedRef.current = false;
    }
  }, [isLimited, secondsLeft, onExpire]);

  if (!rateLimit) return null;

  const { limit, remaining } = rateLimit;
  const ratio = limit > 0 ? remaining / limit : 0;
  const tone =
    ratio > 0.4
      ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/25 bg-emerald-500/10'
      : ratio > 0.15
        ? 'text-amber-600 dark:text-amber-400 border-amber-500/25 bg-amber-500/10'
        : 'text-red-600 dark:text-red-400 border-red-500/25 bg-red-500/10';
  const barTone =
    ratio > 0.4 ? 'bg-emerald-500' : ratio > 0.15 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-colors select-none shrink-0',
        tone,
        isLimited && 'animate-pulse'
      )}
      title={isLimited ? 'Rate limit reached. Resets when the timer ends.' : 'Messages remaining per 20 minutes'}
    >
      <RiFlashlightFill className="w-3.5 h-3.5 shrink-0" />
      <span className="text-[11px] font-semibold whitespace-nowrap tabular-nums">
        {isLimited ? `Resets in ${formatCountdown(secondsLeft)}` : `${remaining}/${limit} left`}
      </span>
      <span className="hidden xs:inline-block w-8 h-1 rounded-full bg-foreground/10 overflow-hidden">
        <span
          className={cn('block h-full rounded-full transition-all duration-500', barTone)}
          style={{ width: `${Math.max(4, ratio * 100)}%` }}
        />
      </span>
    </div>
  );
}