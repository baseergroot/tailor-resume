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
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-6 bg-mm-canvas border-b border-mm-hairline-soft select-none">
      {/* Brand & Navigation */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="w-8 h-8 sm:w-9 sm:h-9 text-mm-steel hover:text-mm-ink shrink-0"
          title="Chat History"
        >
          <RiMenuUnfoldLine className="w-4 h-4" />
        </Button>

        {/* Logo */}
        <Logo className="w-8 h-8 rounded-xl shrink-0" size={32} />

        {/* Title */}
        <span className="font-semibold text-sm sm:text-base text-mm-ink tracking-tight truncate hidden xs:inline-block">
          TailorResume
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Rate Limit */}
        <RateLimitBadge
          rateLimit={rateLimit}
          secondsLeft={secondsLeft}
          isLimited={isLimited}
          onExpire={onRateLimitExpire}
        />

        {/* Theme Toggle */}
        <Button
          variant="icon-circular"
          size="icon"
          onClick={onToggleTheme}
          className="w-8 h-8 sm:w-9 sm:h-9 text-mm-steel hover:text-mm-ink"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <RiSunLine className="w-4 h-4" />
          ) : (
            <RiMoonLine className="w-4 h-4" />
          )}
        </Button>

        {/* New Chat */}
        <Button
          variant="default"
          size="sm"
          onClick={onNewChat}
          className="gap-1.5 text-xs font-semibold h-8 sm:h-9 px-3 sm:px-4"
          title="Start New Chat"
        >
          <RiAddLine className="w-4 h-4" />
          <span className="hidden xs:inline">New Chat</span>
        </Button>
      </div>
    </header>
  );
}
