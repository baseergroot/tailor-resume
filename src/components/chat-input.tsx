'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import {
  RiArrowUpLine,
  RiWrenchLine,
  RiStopCircleLine,
  RiTimerFlashFill,
} from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { RateLimitBadge, formatCountdown } from '@/components/rate-limit-badge';
import type { RateLimitState } from '@/hooks/use-rate-limit';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  status: 'ready' | 'submitted' | 'streaming' | 'error';
  onStop?: () => void;
  placeholder?: string;
  rateLimit: RateLimitState | null;
  secondsLeft: number;
  isLimited: boolean;
  onRateLimitExpire: () => void;
  hydrating?: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  status,
  onStop,
  placeholder = 'Ask AI Agent anything...',
  rateLimit,
  secondsLeft,
  isLimited,
  onRateLimitExpire,
  hydrating = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === 'submitted' || status === 'streaming';
  const isDisabled = isLoading || isLimited || hydrating;

  // Auto-adjust height of textarea up to max 200px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isDisabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
      {/* Rate Limit Exceeded Banner */}
      {isLimited && (
        <div className="mb-2 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs sm:text-sm font-medium animate-pulse select-none">
          <RiTimerFlashFill className="w-4 h-4 shrink-0 animate-spin [animation-duration:2s]" />
          <span>
            Rate limit reached. Wait <span className="font-bold tabular-nums">{formatCountdown(secondsLeft)}</span> for the
            limit to reset before sending more messages.
          </span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() && !isDisabled) {
            onSubmit();
          }
        }}
        className={cn(
          'relative rounded-2xl border border-border/80 bg-card shadow-lg transition-all focus-within:border-ring/60 focus-within:ring-2 focus-within:ring-ring/20',
          (isLoading || isLimited) && 'opacity-90',
          isLimited && 'border-red-500/40'
        )}
      >
        {/* Input Textarea */}
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
              hydrating
                ? 'Loading conversation…'
                : isLimited
                  ? 'Rate limit reached — please wait to send more messages'
                  : placeholder
            }
          rows={1}
          disabled={isDisabled}
          className="min-h-[56px] max-h-[200px] border-0 bg-transparent px-4 py-3.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:border-0 shadow-none"
        />

        {/* Bottom Bar inside Input Card */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          {/* Active Status Badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium select-none px-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[11px]">
              <RiWrenchLine className="w-3 h-3 text-emerald-500" /> MCP Tools Enabled
            </span>
            <RateLimitBadge
              rateLimit={rateLimit}
              secondsLeft={secondsLeft}
              isLimited={isLimited}
              onExpire={onRateLimitExpire}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={onStop}
                className="h-9 w-9 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10"
                title="Stop generating"
              >
                <RiStopCircleLine className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isDisabled}
                className={cn(
                  'h-9 w-9 rounded-xl transition-all',
                  input.trim() && !isLimited
                    ? 'bg-foreground text-background hover:bg-foreground/90'
                    : 'bg-muted text-muted-foreground hover:bg-muted'
                )}
                title={isLimited ? 'Rate limit reached' : 'Send message'}
              >
                <RiArrowUpLine className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Footer Disclaimer */}
      <p className="mt-2 text-center text-[11px] text-muted-foreground/70 select-none">
        AI Agent can make mistakes. Verify important info.
      </p>
    </div>
  );
}
