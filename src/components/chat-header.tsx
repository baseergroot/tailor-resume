'use client';

import {
  RiAddLine,
  RiSunLine,
  RiMoonLine,
  RiMenuUnfoldLine,
} from '@remixicon/react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { RateLimitBadge } from '@/components/rate-limit-badge';
import type { RateLimitState } from '@/hooks/use-rate-limit';

interface ChatHeaderProps {
  onNewChat: () => void;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  rateLimit: RateLimitState | null;
  secondsLeft: number;
  isLimited: boolean;
  onRateLimitExpire: () => void;
}

export function ChatHeader({
  onNewChat,
  onToggleSidebar,
  isDarkMode,
  onToggleTheme,
  rateLimit,
  secondsLeft,
  isLimited,
  onRateLimitExpire,
}: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 bg-background/85 backdrop-blur-md border-b border-border/40 select-none">
      {/* Brand & Model Info */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Chat History Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-muted-foreground hover:text-foreground shrink-0"
          title="Chat History"
        >
          <RiMenuUnfoldLine className="w-4 h-4" />
        </Button>

        {/* Brand Icon Badge */}
        <Logo className="w-8 h-8 rounded-xl shadow-xs shrink-0" size={32} />

        {/* Title */}
        <span className="font-bold text-sm sm:text-base text-foreground tracking-tight truncate hidden xs:inline-block">
          Baseer Agent
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Rate Limit Badge */}
        <RateLimitBadge
          rateLimit={rateLimit}
          secondsLeft={secondsLeft}
          isLimited={isLimited}
          onExpire={onRateLimitExpire}
        />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleTheme}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-muted-foreground hover:text-foreground"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <RiSunLine className="w-4 h-4" />
          ) : (
            <RiMoonLine className="w-4 h-4" />
          )}
        </Button>

        {/* New Chat Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNewChat}
          className="gap-1.5 text-xs font-semibold rounded-xl h-8 sm:h-9 px-2.5 sm:px-3.5 border-border/80 shadow-2xs"
          title="Start New Chat"
        >
          <RiAddLine className="w-4 h-4" />
          <span className="hidden xs:inline">New Chat</span>
        </Button>
      </div>
    </header>
  );
}

