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

function getGradientAvatarStyle(name: string) {
  const gradientPalettes = [
    ["#8B5CF6", "#C7D2FE"], // Violet to Light Indigo
    ["#6366F1", "#A5B4FC"], // Indigo to Lavender
    ["#3B82F6", "#93C5FD"], // Blue to Light Blue
    ["#EC4899", "#FBCFE8"], // Pink to Rose
    ["#F59E0B", "#FCD34D"], // Amber to Light Gold
    ["#10B981", "#6EE7B7"], // Emerald to Teal
    ["#14B8A6", "#99F6E4"], // Teal to Mint
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradientPalettes.length;
  const [c1, c2] = gradientPalettes[index];

  return {
    background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
    color: "#050508", // Dark text for high contrast against gradient
  };
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
    <div className="lg:col-span-4 flex flex-col bg-surface-panel border border-white/[0.04] rounded-xl overflow-hidden h-full shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      {/* Search Header */}
      <form onSubmit={onSearchSubmit} className="p-4 border-b border-white/[0.04] flex items-center gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-md pl-9 pr-4 py-2 text-xs text-white placeholder-on-surface-variant/60 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-150"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[11px] font-semibold rounded-md border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200 cursor-pointer"
        >
          Go
        </button>
      </form>

      {/* Email Items Scroll Area */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03] custom-scrollbar">
        {loading ? (
          // Skeleton states
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="py-5 px-4 flex gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-white/[0.04] shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-white/[0.04] rounded w-24" />
                  <div className="h-2 bg-white/[0.04] rounded w-10" />
                </div>
                <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                <div className="h-2.5 bg-white/[0.04] rounded w-full" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="p-6 text-center text-error text-xs font-medium">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-10 text-center text-on-surface-variant flex flex-col items-center justify-center h-full gap-3 opacity-60">
            <span className="material-symbols-outlined text-3xl">mail</span>
            <p className="text-xs font-medium">No emails found in this folder</p>
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
            const avatarName = isDraft ? "Draft" : displayName;

            return (
              <div
                key={msg.id}
                onClick={() => onSelectMessage(msg)}
                className={`py-5 px-4 flex gap-3 cursor-pointer hover:bg-white/[0.02] border-l-2 transition-all duration-150 text-left ${
                  isSelected 
                    ? "bg-white/[0.04] border-l-primary" 
                    : "border-l-transparent hover:border-l-primary/30"
                }`}
              >
                {/* Sender Avatar */}
                <div 
                  style={getGradientAvatarStyle(avatarName)}
                  className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold shadow-sm"
                >
                  {avatarInitials}
                </div>

                {/* Mail Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-xs font-semibold text-white truncate max-w-[130px]">
                      {displayName}
                    </h4>
                    <span className="text-[10px] text-on-surface-variant whitespace-nowrap font-medium">
                      {formatDate(dateVal)}
                    </span>
                  </div>
                  <p className={`text-xs truncate mb-1 ${
                    isSelected ? "text-white font-medium" : "text-on-surface/90"
                  }`}>
                    {subject}
                  </p>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
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
