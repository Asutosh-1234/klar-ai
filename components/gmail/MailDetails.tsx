'use client'

import * as React from "react";
import { getHeader, getSenderInitials, formatDate, getMessageBody, getSenderName } from "@/lib/utils/gmail";
import { 
  GmailMessage, 
  MailActionBarProps, 
  MailHeaderProps, 
  MailBodyProps, 
  MailReplyBarProps, 
  MailDetailsProps 
} from "@/lib/types";

// Helper function to extract and format the iframe source document
const getIframeSrcDoc = (msg: GmailMessage) => {
  const rawBody = getMessageBody(msg.payload);
  if (!rawBody) return `<p style="font-family: sans-serif; color: #a0a0a0; background-color: transparent; padding: 20px;">No message body preview available.</p>`;

  const hasHtml = /<[a-z][\s\S]*>/i.test(rawBody);
  if (hasHtml) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            html {
              filter: invert(0.9) hue-rotate(180deg);
              background-color: transparent !important;
              color: #202020 !important;
              transition: color 0.15s ease, background-color 0.15s ease;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 12px;
              line-height: 1.6;
              font-size: 15px;
              background-color: transparent !important;
              color: #FAF9FB !important;
            }
            a { color: #8B5CF6 !important; }
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

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            background-color: transparent !important;
            color: #E4E1E9 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 12px;
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


export function MailActionBar({
  onClose,
  onArchive,
  onDelete,
  onToggleRead,
  isUnread,
  draftId,
  sendingDraftId,
  onSendDraft,
  isArchived = false,
}: MailActionBarProps) {
  return (
    <div className="h-12 px-6 flex items-center justify-between border-b border-white/5 shrink-0 bg-[#0A0A0F] z-10">
      <div className="flex items-center gap-6">
        <button
          onClick={onClose}
          className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          title="Back"
        >
          arrow_back
        </button>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onArchive}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer"
            title={isArchived ? "Move to Inbox" : "Archive"}
          >
            {isArchived ? "unarchive" : "archive"}
          </button>
          <button
            onClick={onDelete}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer"
            title="Delete"
          >
            delete
          </button>
        </div>

        <div className="w-px h-4 bg-white/10 mx-1"></div>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleRead}
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer"
            title={isUnread ? "Mark as Read" : "Mark as Unread"}
          >
            {isUnread ? "drafts" : "mail"}
          </button>
          <button
            className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer"
            title="Snooze"
          >
            schedule
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {draftId && (
          <button
            type="button"
            onClick={() => onSendDraft(draftId)}
            disabled={sendingDraftId === draftId}
            className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white text-[11px] font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.25)]"
          >
            <span className="material-symbols-outlined text-xs">send</span>
            {sendingDraftId === draftId ? "Sending..." : "Send Draft"}
          </button>
        )}
        <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer">
          more_vert
        </button>
      </div>
    </div>
  );
}


export function MailHeader({
  subject,
  avatarInitials,
  senderName,
  from,
  to,
  dateVal,
}: MailHeaderProps) {
  return (
    <div className="w-full border-b border-white/5 bg-[#0A0A0F] px-6 py-4 shrink-0 flex justify-center z-10 shadow-md">
      <div className="w-full max-w-[800px]">
        <h2 className="font-headline-md text-xl md:text-2xl font-bold mb-3 text-white leading-tight">
          {subject}
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#12121A] flex items-center justify-center border border-white/5 shrink-0 text-sm font-bold text-primary">
            {avatarInitials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white truncate">{senderName}</span>
              <span className="text-xs text-on-surface-variant/60 truncate">&lt;{from}&gt;</span>
            </div>
            <div className="text-xs text-on-surface-variant">To: {to}</div>
          </div>
          <div className="text-xs text-on-surface-variant shrink-0">
            {formatDate(dateVal)}
          </div>
        </div>
      </div>
    </div>
  );
}


export function MailBody({
  message,
  handleIframeLoad,
}: MailBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex flex-col items-center">
      {/* Main Content Card */}
      <div className="w-full max-w-[800px] rounded-2xl bg-surface-card border border-white/5 p-6 md:p-8 shadow-2xl relative">
        <iframe
          title="Email Body"
          srcDoc={getIframeSrcDoc(message)}
          onLoad={handleIframeLoad}
          className="w-full min-h-[300px] border-0 bg-transparent transition-all duration-300"
          sandbox="allow-popups allow-same-origin"
        />
      </div>
    </div>
  );
}


export function MailReplyBar({ onReplyClick, onForwardClick }: MailReplyBarProps) {
  return (
    <div className="w-full border-t border-white/5 bg-[#0A0A0F] px-6 py-4 shrink-0 flex justify-center z-10">
      <div className="w-full max-w-[800px] flex gap-4">
        <div 
          onClick={onReplyClick}
          className="flex-1 rounded-xl bg-surface-card border border-white/5 p-4 flex items-center gap-4 cursor-text hover:border-primary/30 transition-all"
        >
          <span className="material-symbols-outlined text-on-surface-variant">reply</span>
          <span className="text-on-surface-variant/60 text-xs font-body-md">Reply to sender...</span>
        </div>
        <div 
          onClick={onForwardClick}
          className="w-12 h-12 rounded-xl bg-surface-card border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary cursor-pointer transition-all shrink-0"
        >
          <span className="material-symbols-outlined">forward</span>
        </div>
      </div>
    </div>
  );
}


export function MailDetails({
  message,
  sendingDraftId,
  onSendDraft,
  onClose,
  onArchive,
  onDelete,
  onToggleRead,
  isArchived = false,
}: MailDetailsProps) {
  if (!message) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8 gap-3 bg-[#0A0A0F]">
        <span className="material-symbols-outlined text-4xl opacity-30">drafts</span>
        <p className="text-xs font-medium opacity-65">Select an email from the inbox list to read it</p>
      </div>
    );
  }

  const subject = getHeader(message, "subject") || "(No Subject)";
  const from = getHeader(message, "from") || "";
  const to = getHeader(message, "to") || "";
  const dateVal = message.internalDate ? parseInt(String(message.internalDate)) : getHeader(message, "date") || "";

  const isDraft = !!message.draftId;
  const senderName = isDraft ? "Draft Authored by You" : getSenderName(from);
  const avatarInitials = isDraft ? "DR" : getSenderInitials(from);
  const isUnread = message.labelIds?.includes("UNREAD");

  const handleArchive = () => {
    if (onArchive) {
      onArchive(message.id!);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(message.id!);
    onClose();
  };

  const handleToggleRead = () => {
    if (onToggleRead) {
      onToggleRead(message.id!, !!isUnread);
      onClose();
    }
  };

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    const iframe = e.currentTarget;
    if (iframe) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          iframe.style.height = "100px";
          const scrollHeight = Math.max(
            doc.body.scrollHeight,
            doc.documentElement.scrollHeight,
            doc.body.offsetHeight,
            doc.documentElement.offsetHeight
          );
          iframe.style.height = `${scrollHeight + 20}px`;
        }
      } catch (error) {
        console.error("Error resizing iframe:", error);
        iframe.style.height = "600px";
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0A0A0F] relative h-full overflow-hidden">
      {/* Action Bar */}
      <MailActionBar
        onClose={onClose}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onToggleRead={handleToggleRead}
        isUnread={!!isUnread}
        draftId={message.draftId || null}
        sendingDraftId={sendingDraftId}
        onSendDraft={onSendDraft}
        isArchived={isArchived}
      />

      {/* Static Email Header Info */}
      <MailHeader
        subject={subject}
        avatarInitials={avatarInitials}
        senderName={senderName}
        from={from}
        to={to}
        dateVal={dateVal}
      />

      {/* Scrollable Email Body Content */}
      <MailBody
        message={message}
        handleIframeLoad={handleIframeLoad}
      />

      {/* Static Quick Reply Bar */}
      <MailReplyBar />
    </div>
  );
}
