'use client'

import { GmailMessage, getHeader, getSenderInitials, formatDate, getMessageBody } from "@/app/lib/utils/gmail";

interface MailDetailsProps {
  message: GmailMessage | null;
  sendingDraftId: string | null;
  onSendDraft: (draftId: string) => void;
}

export function MailDetails({
  message,
  sendingDraftId,
  onSendDraft,
}: MailDetailsProps) {
  if (!message) {
    return (
      <div className="lg:col-span-6 flex flex-col items-center justify-center text-on-surface-variant p-8 gap-3 glass-card border border-white/10 rounded-2xl bg-background/20 h-full">
        <span className="material-symbols-outlined text-5xl opacity-30">drafts</span>
        <p className="text-sm font-medium">Select an email from the inbox list to read it</p>
      </div>
    );
  }

  const getIframeSrcDoc = (msg: GmailMessage) => {
    const rawBody = getMessageBody(msg.payload);
    if (!rawBody) return `<p style="font-family: sans-serif; color: #a0a0a0;">No message body preview available.</p>`;

    const hasHtml = /<[a-z][\s\S]*>/i.test(rawBody);
    if (hasHtml) {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                background-color: transparent !important;
                color: #e4e1e9 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 16px;
                line-height: 1.6;
              }
              a { color: #c2c1ff !important; }
              div, p, span, td, table {
                color: inherit !important;
              }
            </style>
          </head>
          <body>
            ${rawBody}
          </body>
        </html>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              background-color: transparent !important;
              color: #e4e1e9 !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 16px;
              line-height: 1.6;
              white-space: pre-wrap;
              word-break: break-word;
            }
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

  return (
    <div className="lg:col-span-6 flex flex-col glass-card border border-white/10 rounded-2xl overflow-hidden bg-background/20 h-full">
      <div className="flex flex-col h-full overflow-hidden">
        {/* Message Headers Header */}
        <div className="p-6 border-b border-white/10 bg-white/2">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-lg font-bold text-white mb-4 text-left">
              {subject}
            </h2>
            {message.draftId && (
              <button
                type="button"
                onClick={() => onSendDraft(message.draftId!)}
                disabled={sendingDraftId === message.draftId}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-full transition-colors duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                {sendingDraftId === message.draftId ? "Sending..." : "Send Draft"}
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-full bg-primary-container/30 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary shrink-0">
              {message.draftId ? "DR" : getSenderInitials(from)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bold text-white truncate">
                  {message.draftId ? "Draft Authored by You" : from}
                </p>
                <p className="text-[11px] text-on-surface-variant">
                  {formatDate(dateVal)}
                </p>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                To: {to}
              </p>
            </div>
          </div>
        </div>

        {/* Message Body Iframe */}
        <div className="flex-1 bg-black/20 relative">
          <iframe
            title="Email Body"
            srcDoc={getIframeSrcDoc(message)}
            className="w-full h-full border-0"
            sandbox="allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
