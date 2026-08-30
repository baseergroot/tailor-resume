'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from 'ai';
import { ChatHeader } from '@/components/chat-header';
import { ChatMessage } from '@/components/chat-message';
import { ChatInput } from '@/components/chat-input';
import { Card } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { useChatHistory } from '@/hooks/use-chat-history';
import { Logo } from '@/components/logo';
import {
  RiCodeSSlashLine,
  RiRobot2Line,
  RiBriefcase4Line,
  RiCalendarCheckLine,
  RiLoader4Line,
} from '@remixicon/react';

interface ChatViewProps {
  initialChatId?: string;
  isNewChatRoute?: boolean;
}

export function ChatView({ initialChatId, isNewChatRoute = false }: ChatViewProps) {
  const router = useRouter();
  const { rateLimit, secondsLeft, isLimited, refresh } = useRateLimit();
  const { chatId, history, createNewChat, registerMessage } =
    useChatHistory(initialChatId);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydratedChatId, setHydratedChatId] = useState<string>(
    isNewChatRoute ? chatId : ''
  );
  const [input, setInput] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const hydrated = isNewChatRoute || hydratedChatId === chatId;

  const {
    messages,
    sendMessage,
    setMessages,
    status,
    stop,
    addToolApprovalResponse,
  } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    onError: (error) => {
      // Any chat failure (e.g. 429 rate limit) may have consumed a token — re-sync state.
      refresh();
      // The SDK fires onError without inserting a message, so surface it in the thread.
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Sorry, something went wrong. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          role: 'assistant',
          parts: [{ type: 'text', text: errorMessage }],
        },
      ]);
    },
  });

  // Load persisted messages ONLY when viewing a specific chat id route (not on / fresh chat)
  useEffect(() => {
    if (isNewChatRoute || !chatId) {
      return;
    }

    let cancelled = false;
    fetch(`/api/chat/${encodeURIComponent(chatId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(data.messages);
        }
      })
      .catch(() => {
        // DB unreachable — continue with empty chat rather than bricking UI
      })
      .finally(() => {
        if (!cancelled) setHydratedChatId(chatId);
      });

    return () => {
      cancelled = true;
    };
  }, [chatId, isNewChatRoute, setMessages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewChat = useCallback(() => {
    if (isNewChatRoute) {
      const newId = createNewChat();
      setMessages([]);
      setHydratedChatId(newId);
      window.history.replaceState(null, '', '/');
    } else {
      router.push('/');
    }
  }, [createNewChat, isNewChatRoute, router, setMessages]);

  const handleSelectChat = useCallback(
    (id: string) => {
      if (id === chatId) return;
      router.push(`/${id}`);
    },
    [chatId, router]
  );

  // Initialize theme class on <html> element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Keyboard shortcut ⌘K / Ctrl+K for New Chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSendMessage = useCallback(
    (textToSend?: string) => {
      if (!hydrated || isLimited) return;
      const query = textToSend || input;
      if (!query.trim()) return;

      // Track the chat in the sidebar registry; first message becomes its title.
      registerMessage(chatId, messages.length === 0 ? query.trim().slice(0, 48) : undefined);

      // If user started from '/', update browser URL to /:chatId so it's directly shareable / refreshable
      if (isNewChatRoute && messages.length === 0) {
        window.history.pushState(null, '', `/${chatId}`);
      }

      // Optimistically decrement the local counter; the server re-syncs via polling.
      refresh();
      // Send text message via Vercel AI SDK
      sendMessage({ text: query.trim() });
      setInput('');
    },
    [chatId, hydrated, input, isLimited, isNewChatRoute, messages.length, refresh, registerMessage, sendMessage]
  );

  const isActionDisabled =
    isLimited || !hydrated || (status !== 'ready' && status !== 'error');

  const quickPrompts = [
    {
      icon: RiCodeSSlashLine,
      title: 'Core Tech Stack',
      subtitle: 'Next.js, TypeScript, Node.js, Redis, MongoDB & Gemini AI',
      query: 'What technologies and architecture does Baseer specialize in?',
    },
    {
      icon: RiRobot2Line,
      title: 'AI Agent Engineering',
      subtitle: 'Explore how this scheduling agent & custom tools were built',
      query: 'Tell me about the AI agent projects Baseer has built.',
    },
    {
      icon: RiBriefcase4Line,
      title: 'Discuss a Project / Freelance',
      subtitle: 'Talk through an idea, custom software build, or collaboration',
      query: "I have a project idea I'd like to discuss with Baseer.",
    },
    {
      icon: RiCalendarCheckLine,
      title: 'Schedule a 15-min Call',
      subtitle: 'Find open calendar slots converted to your local timezone',
      query: 'Check available slots for a quick 15-minute intro call.',
    },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground antialiased selection:bg-primary/20 pt-2 sm:pt-3">
      {/* Chat History Sidebar (closed by default) */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onNewChat={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
        history={history.map((chat) => ({
          id: chat.id,
          title: chat.title,
          date: new Date(chat.updatedAt).toLocaleDateString(),
        }))}
        activeChatId={chatId}
        onSelectChat={(id) => {
          handleSelectChat(id);
          setSidebarOpen(false);
        }}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Top Mobile-Friendly Header */}
      <ChatHeader
        onNewChat={handleNewChat}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        rateLimit={rateLimit}
        secondsLeft={secondsLeft}
        isLimited={isLimited}
        onRateLimitExpire={refresh}
      />

      {/* Main Full-Width Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* Chat Body */}
        <main className="flex-1 overflow-y-auto flex flex-col scrollbar-thin">
          {messages.length === 0 && !hydrated ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <RiLoader4Line className="w-6 h-6 animate-spin" />
              <p className="text-sm">Loading conversation…</p>
            </div>
          ) : messages.length === 0 ? (
            /* Empty State: Centered Greeting */
            <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full my-auto">
              {/* Logo / Badge */}
              <Logo size={48} className="w-12 h-12 rounded-2xl shadow-lg shadow-emerald-950/40 mb-4" />

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground text-center mb-2">
                Chat with Baseer&apos;s AI Assistant
              </h1>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
                Explore full-stack &amp; AI agent projects, discuss freelance work, or schedule a quick intro call.
              </p>

              {/* Quick Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-6">
                {quickPrompts.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <Card
                      key={idx}
                      onClick={() => handleSendMessage(prompt.query)}
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-all border-border/60 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="text-xs font-semibold text-foreground group-hover:text-foreground">
                            {prompt.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {prompt.subtitle}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Trajectory: Streamed Messages List */
            <div className="flex-1 py-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onSendAction={handleSendMessage}
                  onToolApproval={addToolApprovalResponse}
                  isActionDisabled={isActionDisabled}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Chat Input — pinned below the scroll area so it never scrolls with messages */}
        <div className="shrink-0 bg-gradient-to-t from-background via-background/95 to-transparent pt-4">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={() => handleSendMessage()}
            status={status}
            onStop={stop}
            rateLimit={rateLimit}
            secondsLeft={secondsLeft}
            isLimited={isLimited}
            onRateLimitExpire={refresh}
            hydrating={!hydrated}
          />
        </div>
      </div>
    </div>
  );
}
