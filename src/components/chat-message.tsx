'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  RiUser3Line,
  RiFileCopyLine,
  RiCheckLine,
  RiWrenchLine,
} from '@remixicon/react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UIMessage } from '@ai-sdk/react';
import { AvailabilitySlotPicker, BookingApproval } from '@/components/booking-actions';

interface ChatMessageProps {
  message: UIMessage;
  onSendAction: (text: string) => void;
  onToolApproval: (approval: {
    id: string;
    approved: boolean;
    reason?: string;
  }) => void | PromiseLike<void>;
  isActionDisabled: boolean;
}

export function ChatMessage({
  message,
  onSendAction,
  onToolApproval,
  isActionDisabled,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const textContent = message.parts
    ? message.parts
        .filter((part) => part.type === 'text')
        .map((part) => (part as { type: 'text'; text: string }).text)
        .join('')
    : '';

  const handleCopy = () => {
    if (!textContent) return;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'w-full py-5 px-4 md:px-6 transition-colors',
        isUser ? 'bg-transparent' : 'bg-mm-surface/40'
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        {/* Avatar */}
        {isUser ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs bg-mm-surface text-mm-charcoal border-mm-hairline">
            <RiUser3Line className="w-4 h-4" />
          </div>
        ) : (
          <Logo className="w-8 h-8 rounded-xl shrink-0" size={32} />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Role Label */}
          <div className="flex items-center justify-between text-xs text-mm-steel font-medium">
            <span>{isUser ? 'You' : 'AI Assistant'}</span>
            {!isUser && textContent && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopy}
                className="h-6 w-6 text-mm-steel hover:text-mm-ink"
                title="Copy response"
              >
                {copied ? (
                  <RiCheckLine className="w-3.5 h-3.5 text-mm-success-text" />
                ) : (
                  <RiFileCopyLine className="w-3.5 h-3.5" />
                )}
              </Button>
            )}
          </div>

          {/* Body */}
          <div className="text-mm-ink text-sm sm:text-base leading-relaxed break-words markdown-body">
            {message.parts && message.parts.length > 0 ? (
              message.parts.map((part, index) => {
                if (part.type === 'text') {
                  return (
                    <div key={index} className="prose dark:prose-invert max-w-none space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1">
                      <ReactMarkdown>{part.text}</ReactMarkdown>
                    </div>
                  );
                }

                if (part.type === 'tool-checkAvailableSlots') {
                  return (
                    <AvailabilitySlotPicker
                      key={index}
                      part={part as never}
                      disabled={isActionDisabled}
                      onSelectSlot={onSendAction}
                    />
                  );
                }

                if (part.type === 'tool-bookAppointment') {
                  return (
                    <BookingApproval
                      key={index}
                      part={part as never}
                      disabled={isActionDisabled}
                      onApproval={onToolApproval}
                    />
                  );
                }

                if (part.type.startsWith('tool-') || part.type === 'reasoning') {
                  const p = part as { toolName?: string; state?: string; result?: unknown; toolInvocation?: { toolName?: string; state?: string } };
                  const toolName = p.toolName || p.toolInvocation?.toolName || 'tool';
                  const rawState = p.state || p.toolInvocation?.state || '';
                  const isDone = rawState === 'result' || rawState === 'output-available' || rawState === 'complete' || part.type === 'tool-result' || p.result !== undefined;

                  if (isDone) return null;

                  return (
                    <div
                      key={index}
                      className="my-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs bg-mm-success-bg border-mm-success-text/20 text-mm-success-text font-medium select-none"
                    >
                      <RiWrenchLine className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Executing {toolName}...</span>
                    </div>
                  );
                }

                return null;
              })
            ) : (
              <div className="prose dark:prose-invert max-w-none space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1">
                <ReactMarkdown>{textContent}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
