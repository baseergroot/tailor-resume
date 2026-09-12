'use client';

import {
  RiAddLine,
  RiChat3Line,
  RiSidebarFoldLine,
  RiSunLine,
  RiMoonLine,
  RiUserLine,
  RiToolsLine,
} from '@remixicon/react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  history: ChatHistoryItem[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  history,
  activeChatId,
  onSelectChat,
  isDarkMode,
  onToggleTheme,
}: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:bg-transparent md:backdrop-blur-none"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-mm-canvas text-mm-charcoal transition-all duration-300 ease-in-out border-r border-mm-hairline',
          isOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-mm-steel hover:text-mm-ink"
            title="Close sidebar"
          >
            <RiSidebarFoldLine className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="text-mm-steel hover:text-mm-ink"
            title="New Chat"
          >
            <RiAddLine className="w-5 h-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pb-2">
          <Button
            variant="secondary"
            onClick={onNewChat}
            className="w-full justify-between h-10 px-3 bg-mm-surface border-mm-hairline text-mm-charcoal text-sm font-medium"
          >
            <div className="flex items-center gap-2.5">
              <Logo className="w-5 h-5 rounded-md shrink-0" size={20} />
              <span>New chat</span>
            </div>
            <span className="text-[11px] text-mm-muted font-mono px-1.5 py-0.5 rounded bg-mm-canvas border border-mm-hairline">
              ⌘K
            </span>
          </Button>
        </div>

        {/* Tools Status */}
        <div className="px-3 py-1.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-mm-success-bg border border-mm-success-text/20 text-mm-success-text text-xs">
            <RiToolsLine className="w-3.5 h-3.5" />
            <span className="font-medium">AI Tools Ready</span>
            <span className="ml-auto flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mm-success-text opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mm-success-text"></span>
            </span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div>
            <div className="px-3 text-[11px] font-semibold text-mm-muted uppercase tracking-wider mb-1.5">
              Recent Chats
            </div>
            <div className="space-y-1">
              {history.length > 0 ? (
                history.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-all truncate group',
                      activeChatId === chat.id
                        ? 'bg-mm-surface text-mm-ink font-medium'
                        : 'text-mm-steel hover:bg-mm-surface/50 hover:text-mm-charcoal'
                    )}
                  >
                    <RiChat3Line className="w-4 h-4 shrink-0 text-mm-muted group-hover:text-mm-charcoal" />
                    <span className="truncate flex-1">{chat.title}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-xs text-mm-muted text-center">
                  No previous chats yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-mm-hairline flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-mm-surface transition-colors flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-mm-primary text-white flex items-center justify-center shrink-0 font-medium text-xs">
              <RiUserLine className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-mm-charcoal truncate">
                Workspace User
              </span>
              <span className="text-[10px] text-mm-muted truncate">
                Resume Assistant
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="text-mm-steel hover:text-mm-ink shrink-0"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <RiSunLine className="w-4 h-4" />
            ) : (
              <RiMoonLine className="w-4 h-4" />
            )}
          </Button>
        </div>
      </aside>
    </>
  );
}
