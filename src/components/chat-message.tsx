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

  // Extract text content safely from message parts
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
        isUser ? 'bg-transparent' : 'bg-muted/30 dark:bg-muted/10'
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        {/* Avatar */}
        {isUser ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs shadow-xs bg-secondary text-secondary-foreground border-border">
            <RiUser3Line className="w-4 h-4" />
          </div>
        ) : (
          <Logo className="w-8 h-8 rounded-xl shrink-0 shadow-xs" size={32} />
        )}

        {/* Message Content Area */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Role Label */}
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
            <span>{isUser ? 'You' : 'AI Agent'}</span>
            {!isUser && textContent && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleCopy}
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="Copy response"
              >
                {copied ? (
                  <RiCheckLine className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <RiFileCopyLine className="w-3.5 h-3.5" />
                )}
              </Button>
            )}
          </div>

          {/* Body Content */}
          <div className="text-foreground text-sm sm:text-base leading-relaxed break-words markdown-body">
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
                
                // If tool execution is active, show temporary loading indicator. Completely remove once done.
                if (part.type.startsWith('tool-') || part.type === 'reasoning') {
                  const p = part as { toolName?: string; state?: string; result?: unknown; toolInvocation?: { toolName?: string; state?: string } };
                  const toolName = p.toolName || p.toolInvocation?.toolName || 'tool';
                  const rawState = p.state || p.toolInvocation?.state || '';
                  const isDone = rawState === 'result' || rawState === 'output-available' || rawState === 'complete' || part.type === 'tool-result' || p.result !== undefined;

                  // Completely remove badge once execution is complete
                  if (isDone) return null;

                  return (
                    <div
                      key={index}
                      className="my-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium select-none"
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
