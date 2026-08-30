'use client';

import { useCallback, useState } from 'react';

export interface ChatHistoryItem {
  id: string;
  title: string;
  updatedAt: number;
}

const LIST_KEY = 'scheduler.chat.history';

export function createChatId() {
  return `chat_${crypto.randomUUID()}`;
}

function readList(): ChatHistoryItem[] {
  try {
    const raw = localStorage.getItem(LIST_KEY);
    return raw ? (JSON.parse(raw) as ChatHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function writeList(list: ChatHistoryItem[]) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable (private mode, quota) — history just won't persist
  }
}

export function useChatHistory(initialId?: string) {
  const [createdId, setCreatedId] = useState<string>(() => initialId || createChatId());
  const [history, setHistory] = useState<ChatHistoryItem[]>(() => readList());

  const chatId = initialId || createdId;

  const createNewChat = useCallback(() => {
    const id = createChatId();
    setCreatedId(id);
    return id;
  }, []);

  const setActiveChat = useCallback((id: string) => {
    setCreatedId(id);
  }, []);

  const registerMessage = useCallback((id: string, firstTitle?: string) => {
    setHistory((prev) => {
      const existing = prev.find((chat) => chat.id === id);
      const item: ChatHistoryItem = {
        id,
        title: existing?.title ?? firstTitle ?? 'New chat',
        updatedAt: Date.now(),
      };
      const next = [item, ...prev.filter((chat) => chat.id !== id)].sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
      writeList(next);
      return next;
    });
  }, []);

  const removeChat = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((chat) => chat.id !== id);
      writeList(next);
      return next;
    });
  }, []);

  return { chatId, history, createNewChat, setActiveChat, registerMessage, removeChat };
}