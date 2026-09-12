'use client';

import { useState } from 'react';
import {
  RiCalendarCheckLine,
  RiCheckLine,
  RiCloseLine,
  RiMailLine,
  RiTimeLine,
  RiTimeZoneLine,
  RiUser3Line,
} from '@remixicon/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ChatActionHandler = (text: string) => void;

type ToolApprovalHandler = (approval: {
  id: string;
  approved: boolean;
  reason?: string;
}) => void | PromiseLike<void>;

type AvailabilityOutput = {
  slots?: string[];
  message?: string;
};

type AvailabilityPart = {
  type: 'tool-checkAvailableSlots';
  toolCallId: string;
  state: string;
  input?: {
    date?: string;
  };
  output?: AvailabilityOutput;
  errorText?: string;
};

type BookingInput = {
  clientName?: string;
  clientEmail?: string;
  startTime?: string;
  timeZone?: string;
};

type BookingOutput = {
  success?: boolean;
  message?: string;
  bookingId?: string;
  bookingUrl?: string;
};

type BookingPart = {
  type: 'tool-bookAppointment';
  toolCallId: string;
  state: string;
  input?: BookingInput;
  output?: BookingOutput;
  errorText?: string;
  approval?: {
    id: string;
    approved?: boolean;
    reason?: string;
    isAutomatic?: boolean;
  };
};

function getBrowserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

const POPULAR_TIME_ZONES = [
  'Asia/Karachi',
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Australia/Sydney',
];

function timeZoneLabel(timeZone: string) {
  try {
    const offset =
      new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'shortOffset' })
        .formatToParts(new Date())
        .find((part) => part.type === 'timeZoneName')?.value ?? '';
    const city = timeZone.split('/').pop()?.replace(/_/g, ' ') ?? timeZone;
    return `${city} (${offset})`;
  } catch {
    return timeZone;
  }
}

function formatSlot(value: string, timeZone = getBrowserTimeZone()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(date);
}

function formatDate(value: string, timeZone = getBrowserTimeZone()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone,
  }).format(date);
}

function groupSlotsByDate(slots: string[], timeZone: string) {
  return slots.reduce<Record<string, string[]>>((groups, slot) => {
    const key = formatDate(slot, timeZone);
    groups[key] = [...(groups[key] ?? []), slot];
    return groups;
  }, {});
}

export function AvailabilitySlotPicker({
  part,
  disabled,
  onSelectSlot,
}: {
  part: AvailabilityPart;
  disabled: boolean;
  onSelectSlot: ChatActionHandler;
}) {
  const [timeZone, setTimeZone] = useState(getBrowserTimeZone);

  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return (
      <div className="my-2 inline-flex items-center gap-2 rounded-md border border-mm-success-text/20 bg-mm-success-bg px-2.5 py-1 text-xs font-medium text-mm-success-text">
        <RiTimeLine className="h-3.5 w-3.5 animate-spin" />
        Checking availability...
      </div>
    );
  }

  if (part.state === 'output-error') {
    return (
      <div className="my-2 rounded-md border border-mm-error/30 bg-mm-error/10 px-3 py-2 text-xs text-mm-error">
        Could not load availability: {part.errorText}
      </div>
    );
  }

  if (part.state !== 'output-available') return null;

  const slots = part.output?.slots ?? [];

  if (slots.length === 0) {
    return (
      <Card className="my-3 max-w-xl">
        <CardContent className="p-3 text-sm text-mm-steel">
          {part.output?.message || 'No open slots were returned for this date.'}
        </CardContent>
      </Card>
    );
  }

  const groupedSlots = groupSlotsByDate(slots, timeZone);
  const timeZoneOptions = [timeZone, ...POPULAR_TIME_ZONES.filter((tz) => tz !== timeZone)];

  return (
    <Card className="my-3 max-w-xl">
      <CardHeader className="space-y-2 p-3 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <RiCalendarCheckLine className="h-4 w-4 text-mm-primary" />
          Available slots
        </CardTitle>

        <label className="flex items-center gap-2 text-xs text-mm-steel">
          <RiTimeZoneLine className="h-3.5 w-3.5 shrink-0" />
          <span className="font-medium">Your timezone</span>
          <select
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            disabled={disabled}
            className="h-7 flex-1 rounded-lg border border-mm-hairline bg-mm-surface px-2 text-xs font-medium text-mm-ink outline-none focus-visible:border-mm-blue-deep focus-visible:ring-2 focus-visible:ring-mm-blue/20 disabled:opacity-50"
            title="Choose the timezone for the slot times below"
          >
            {timeZoneOptions.map((tz) => (
              <option key={tz} value={tz}>
                {timeZoneLabel(tz)}
              </option>
            ))}
          </select>
        </label>
      </CardHeader>
      <CardContent className="space-y-3 p-3 pt-0">
        {Object.entries(groupedSlots).map(([dateLabel, daySlots]) => (
          <div key={dateLabel} className="space-y-2">
            <div className="text-xs font-medium text-mm-steel">{dateLabel}</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {daySlots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={disabled}
                  onClick={() =>
                    onSelectSlot(
                      `I want to book this slot: ${slot}. My timezone is ${timeZone}.`
                    )
                  }
                  className="h-auto min-h-10 justify-start rounded-xl px-3 py-2 text-left whitespace-normal"
                  title="Select this slot"
                >
                  <RiTimeLine className="h-4 w-4" />
                  <span>{formatSlot(slot, timeZone)}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-mm-surface px-2.5 py-2">
      <div className="mt-0.5 text-mm-steel">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase text-mm-muted">{label}</div>
        <div className="break-words text-sm text-mm-ink">{value}</div>
      </div>
    </div>
  );
}

export function BookingApproval({
  part,
  disabled,
  onApproval,
}: {
  part: BookingPart;
  disabled: boolean;
  onApproval: ToolApprovalHandler;
}) {
  const input = part.input ?? {};
  const visitorTimeZone = input.timeZone || getBrowserTimeZone();
  const startTime = input.startTime || '';
  const visitorTime = startTime ? formatSlot(startTime, visitorTimeZone) : 'Missing time';
  const karachiTime = startTime ? formatSlot(startTime, 'Asia/Karachi') : 'Missing time';

  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return (
      <div className="my-2 inline-flex items-center gap-2 rounded-md border border-mm-success-text/20 bg-mm-success-bg px-2.5 py-1 text-xs font-medium text-mm-success-text">
        <RiCalendarCheckLine className="h-3.5 w-3.5 animate-spin" />
        Preparing booking review...
      </div>
    );
  }

  if (part.state === 'approval-requested') {
    return (
      <Card className="my-3 max-w-xl">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <RiCalendarCheckLine className="h-4 w-4 text-mm-primary" />
            Confirm booking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-3 pt-0">
          <div className="grid gap-2 sm:grid-cols-2">
            <DetailRow
              icon={<RiUser3Line className="h-4 w-4" />}
              label="Name"
              value={input.clientName || 'Missing name'}
            />
            <DetailRow
              icon={<RiMailLine className="h-4 w-4" />}
              label="Email"
              value={input.clientEmail || 'Missing email'}
            />
            <DetailRow
              icon={<RiTimeLine className="h-4 w-4" />}
              label={visitorTimeZone}
              value={visitorTime}
            />
            <DetailRow
              icon={<RiTimeLine className="h-4 w-4" />}
              label="Asia/Karachi"
              value={karachiTime}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              disabled={disabled}
              onClick={() => onApproval({ id: part.approval!.id, approved: true })}
              className="h-9 rounded-full"
              title="Confirm booking"
            >
              <RiCheckLine className="h-4 w-4" />
              Confirm
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() =>
                onApproval({
                  id: part.approval!.id,
                  approved: false,
                  reason: 'User declined from the chat UI.',
                })
              }
              className="h-9 rounded-full"
              title="Cancel booking"
            >
              <RiCloseLine className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (part.state === 'approval-responded') {
    const approved = part.approval?.approved;
    return (
      <div
        className={cn(
          'my-2 inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium',
          approved
            ? 'border-mm-success-text/20 bg-mm-success-bg text-mm-success-text'
            : 'border-mm-hairline bg-mm-surface text-mm-steel'
        )}
      >
        {approved ? <RiCheckLine className="h-3.5 w-3.5" /> : <RiCloseLine className="h-3.5 w-3.5" />}
        {approved ? 'Booking approved. Confirming...' : 'Booking cancelled.'}
      </div>
    );
  }

  if (part.state === 'output-available') {
    const output = part.output ?? {};
    return (
      <Card className="my-3 max-w-xl">
        <CardContent className="space-y-2 p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <RiCheckLine className="h-4 w-4 text-mm-primary" />
            {output.success === false ? 'Booking not completed' : 'Booking confirmed'}
          </div>
          {output.message && (
            <p className="text-sm text-mm-steel">{output.message}</p>
          )}
          {output.bookingUrl && (
            <a
              href={output.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'rounded-full')}
            >
              Open booking
            </a>
          )}
        </CardContent>
      </Card>
    );
  }

  if (part.state === 'output-error') {
    return (
      <div className="my-2 rounded-md border border-mm-error/30 bg-mm-error/10 px-3 py-2 text-xs text-mm-error">
        Booking failed: {part.errorText}
      </div>
    );
  }

  if (part.state === 'output-denied') {
    return (
      <div className="my-2 inline-flex items-center gap-2 rounded-md border border-mm-hairline bg-mm-surface px-2.5 py-1 text-xs font-medium text-mm-steel">
        <RiCloseLine className="h-3.5 w-3.5" />
        Booking cancelled.
      </div>
    );
  }

  return null;
}
