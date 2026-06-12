'use client'

import { GmailMessage, getHeader, getSenderInitials, formatDate, getMessageBody, getSenderName } from "@/app/lib/utils/gmail";

interface MailDetailsProps {
  message: GmailMessage | null;
  sendingDraftId: string | null;
  onSendDraft: (draftId: string) => void;
}

function getGradientAvatarStyle(name: string) {
  const gradientPalettes = [
    ["#8B5CF6", "#C7D2FE"],
    ["#6366F1", "#A5B4FC"],
    ["#3B82F6", "#93C5FD"],
    ["#EC4899", "#FBCFE8"],
    ["#F59E0B", "#FCD34D"],
    ["#10B981", "#6EE7B7"],
    ["#14B8A6", "#99F6E4"],
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradientPalettes.length;
  const [c1, c2] = gradientPalettes[index];

  return {
    background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
    color: "#050508",
  };
}

export function MailDetails({
  message,
  sendingDraftId,
  onSendDraft,
}: MailDetailsProps) {
  if (!message) {
    return (
      <div className="lg:col-span-6 flex flex-col items-center justify-center text-on-surface-variant p-8 gap-3 bg-surface-panel border border-white/[0.04] rounded-xl h-full shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <span className="material-symbols-outlined text-4xl opacity-30">drafts</span>
        <p className="text-xs font-medium opacity-65">Select an email from the inbox list to read it</p>
      </div>
    );
  }

  const getIframeSrcDoc = (msg: GmailMessage) => {
    const rawBody = getMessageBody(msg.payload);
    if (!rawBody) return `<p style="font-family: sans-serif; color: #a0a0a0;">No message body preview available.</p>`;

    const hasHtml = /<[a-z][\s\S]*>/i.test(rawBody);
    if (hasHtml) {
      // Inject CSS dark inversion filter and force background
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              html {
                filter: invert(0.9) hue-rotate(180deg);
                background-color: #FAF9FB !important;
                color: #202020 !important;
                transition: color 0.15s ease, background-color 0.15s ease;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 24px;
                line-height: 1.6;
                font-size: 15px;
              }
              a { color: #4F46E5 !important; }
              /* Re-invert media elements to keep them normal */
              img, svg, video, [style*="background-image"] {
                filter: invert(1.1) hue-rotate(180deg) !important;
              }
            </style>
          </head>
          <body>
            ${rawBody}
          </body>
        </html>
      `;
    }

    // Fallback simple dark styling for plain text email
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              background-color: #0A0A10 !important;
              color: #E4E1E9 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 24px;
              line-height: 1.65;
              font-size: 14px;
              white-space: pre-wrap;
              word-break: break-word;
            }
            a { color: #A78BFA !important; }
          </style>
        </head>
        <body>${rawBody}</body>
      </html>
    `;
  };

  const subject = getHeader(message, "subject") || "(No Subject)";
  const from = getHeader(message, "from");
  const to = getHeader(message, "to");
  const dateVal = message.internalDate ? parseInt(String(message.internalDate)) : getHeader(message, "date");

  const isDraft = !!message.draftId;
  const senderName = isDraft ? "Draft Authored by You" : getSenderName(from);
  const avatarName = isDraft ? "Draft" : senderName;
  const avatarInitials = isDraft ? "DR" : getSenderInitials(from);

  return (
    <div className="lg:col-span-6 flex flex-col bg-surface-panel border border-white/[0.04] rounded-xl overflow-hidden h-full shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Message Headers Header */}
        <div className="p-6 border-b border-white/[0.04] bg-white/[0.01]">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h2 className="text-sm font-semibold text-white tracking-tight leading-tight text-left flex-1">
              {subject}
            </h2>
            {message.draftId && (
              <button
                type="button"
                onClick={() => onSendDraft(message.draftId!)}
                disabled={sendingDraftId === message.draftId}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold rounded-md transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-[0_4px_12px_rgba(139,92,246,0.15)]"
              >
                <span className="material-symbols-outlined text-xs">send</span>
                {sendingDraftId === message.draftId ? "Sending..." : "Send Draft"}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <div 
              style={getGradientAvatarStyle(avatarName)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm"
            >
              {avatarInitials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-white truncate">
                  {senderName}
                </p>
                <p className="text-[10px] text-on-surface-variant font-medium">
                  {formatDate(dateVal)}
                </p>
              </div>
              <p className="text-[11px] text-on-surface-variant/80 mt-0.5 truncate">
                To: {to}
              </p>
            </div>
          </div>
        </div>

        {/* Message Body Iframe */}
        <div className="flex-1 bg-[#0A0A10] relative">
          <iframe
            title="Email Body"
            srcDoc={getIframeSrcDoc(message)}
            className="w-full h-full border-0 bg-transparent"
            sandbox="allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
