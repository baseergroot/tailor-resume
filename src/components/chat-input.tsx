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
  placeholder = 'Ask AI anything about resume tailoring...',
  rateLimit,
  secondsLeft,
  isLimited,
  onRateLimitExpire,
  hydrating = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === 'submitted' || status === 'streaming';
  const isDisabled = isLoading || isLimited || hydrating;

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
      {/* Rate Limit Banner */}
      {isLimited && (
        <div className="mb-2 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-mm-error/30 bg-mm-error/5 text-mm-error text-xs sm:text-sm font-medium animate-pulse select-none">
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
          'relative rounded-2xl border border-mm-hairline bg-mm-canvas transition-all focus-within:border-mm-blue-deep focus-within:border-2',
          (isLoading || isLimited) && 'opacity-90',
          isLimited && 'border-mm-error/40'
        )}
      >
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            hydrating
              ? 'Loading conversation...'
              : isLimited
                ? 'Rate limit reached — please wait to send more messages'
                : placeholder
          }
          rows={1}
          disabled={isDisabled}
          className="min-h-[56px] max-h-[200px] border-0 bg-transparent px-4 py-3.5 text-sm sm:text-base text-mm-ink placeholder:text-mm-stone focus-visible:ring-0 focus-visible:border-0 shadow-none"
        />

        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1">
          {/* Status */}
          <div className="flex items-center gap-1.5 text-xs text-mm-steel font-medium select-none px-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-mm-surface text-[11px]">
              <RiWrenchLine className="w-3 h-3 text-mm-success-text" /> AI Tools Enabled
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
                variant="destructive"
                onClick={onStop}
                className="h-9 w-9"
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
                  'h-9 w-9 transition-all',
                  input.trim() && !isLimited
                    ? 'bg-mm-primary text-white hover:bg-mm-charcoal'
                    : 'bg-mm-surface text-mm-muted hover:bg-mm-surface'
                )}
                title={isLimited ? 'Rate limit reached' : 'Send message'}
              >
                <RiArrowUpLine className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </form>

      {/* Disclaimer */}
      <p className="mt-2 text-center text-[11px] text-mm-muted select-none">
        AI can make mistakes. Verify important info.
      </p>
    </div>
  );
}
