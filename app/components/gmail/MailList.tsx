'use client'

import { GmailMessage, getHeader, getSenderName, getSenderInitials, formatDate } from "@/app/lib/utils/gmail";

interface MailListProps {
  messages: GmailMessage[];
  loading: boolean;
  error: string | null;
  selectedMessage: GmailMessage | null;
  onSelectMessage: (msg: GmailMessage) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  selectedFolder: string;
}

export function MailList({
  messages,
  loading,
  error,
  selectedMessage,
  onSelectMessage,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  selectedFolder,
}: MailListProps) {
  return (
    <div className="lg:col-span-4 flex flex-col glass-card border border-white/10 rounded-2xl overflow-hidden bg-background/20 h-full">
      {/* Search Header */}
      <form onSubmit={onSearchSubmit} className="p-4 border-b border-white/10 flex items-center gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 placeholder-on-surface-variant/60"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-full transition-colors duration-200 cursor-pointer"
        >
          Go
        </button>
      </form>

      {/* Email Items Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
        {loading ? (
          // Skeleton states
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="p-4 flex gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-white/10 rounded w-28" />
                  <div className="h-3 bg-white/10 rounded w-12" />
                </div>
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-full" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="p-6 text-center text-error text-sm">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-10 text-center text-on-surface-variant flex flex-col items-center justify-center h-full gap-3">
            <span className="material-symbols-outlined text-4xl opacity-40">mail</span>
            <p className="text-sm font-medium">No emails found in this folder</p>
          </div>
        ) : (
          messages.map((msg) => {
            const from = getHeader(msg, "from");
            const to = getHeader(msg, "to");
            const subject = getHeader(msg, "subject") || "(No Subject)";
            const isSelected = selectedMessage?.id === msg.id;
            const dateVal = msg.internalDate ? parseInt(String(msg.internalDate)) : getHeader(msg, "date");

            const isDraft = selectedFolder === "DRAFT" || !!msg.draftId;
            const displayName = isDraft ? `To: ${to || "Draft"}` : getSenderName(from);
            const avatarInitials = isDraft ? "DR" : getSenderInitials(from);

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg)}
                className={`p-4 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors duration-150 text-left ${
                  isSelected ? "bg-white/10 border-l-2 border-primary-container" : ""
                }`}
              >
                {/* Sender Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary/20 shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                  {avatarInitials}
                </div>

                {/* Mail Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-semibold text-white truncate max-w-[130px]">
                      {displayName}
                    </h4>
                    <span className="text-[11px] text-on-surface-variant whitespace-nowrap">
                      {formatDate(dateVal)}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-on-surface truncate mb-1">
                    {subject}
                  </p>
                  <p className="text-xs text-on-surface-variant line-clamp-2">
                    {msg.snippet}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
