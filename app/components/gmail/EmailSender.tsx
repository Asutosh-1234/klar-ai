'use client'

interface EmailSenderProps {
  name: string;
  isUnread: boolean;
  className?: string;
}

export function EmailSender({ name, isUnread, className = "" }: EmailSenderProps) {
  return (
    <div className={`w-40 shrink-0 text-sm truncate pr-4 ${isUnread ? "font-bold text-white" : "text-on-surface-variant font-normal"} ${className}`}>
      {name}
    </div>
  );
}
