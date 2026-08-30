'use client';

import {
  RiAddLine,
  RiChat3Line,
  RiSidebarFoldLine,
  RiSunLine,
  RiMoonLine,
  RiUserLine,
  RiWrenchLine,
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
      {/* Click-away Backdrop — dims on mobile, invisible on desktop, always closes */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:bg-transparent md:backdrop-blur-none"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-sidebar-border',
          isOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:pointer-events-none'
        )}
      >
        {/* Top Actions Header */}
        <div className="flex items-center justify-between p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
            title="Close sidebar"
          >
            <RiSidebarFoldLine className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNewChat}
            className="text-muted-foreground hover:text-foreground"
            title="New Chat"
          >
            <RiAddLine className="w-5 h-5" />
          </Button>
        </div>

        {/* New Chat Button Card */}
        <div className="px-3 pb-2">
          <Button
            variant="outline"
            onClick={onNewChat}
            className="w-full justify-between h-10 px-3 rounded-xl bg-sidebar-accent/50 hover:bg-sidebar-accent border-sidebar-border text-sidebar-foreground text-sm font-medium transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Logo className="w-5 h-5 rounded-md shrink-0" size={20} />
              <span>New chat</span>
            </div>
            <span className="text-[11px] text-muted-foreground font-mono px-1.5 py-0.5 rounded bg-background border border-border">
              ⌘K
            </span>
          </Button>
        </div>

        {/* MCP Status Indicator */}
        <div className="px-3 py-1.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
            <RiWrenchLine className="w-3.5 h-3.5" />
            <span className="font-medium">MCP Tools Ready</span>
            <span className="ml-auto flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Chat Threads History */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div>
            <div className="px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
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
                        ? 'bg-sidebar-accent text-sidebar-foreground font-medium'
                        : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    )}
                  >
                    <RiChat3Line className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-sidebar-foreground" />
                    <span className="truncate flex-1">{chat.title}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                  No previous chats yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Footer & Theme Toggle */}
        <div className="p-3 border-t border-sidebar-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent/60 transition-colors flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 font-medium text-xs">
              <RiUserLine className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-sidebar-foreground truncate">
                Workspace User
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                Scheduling Assistant
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="text-muted-foreground hover:text-foreground shrink-0"
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
