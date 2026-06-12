'use client'

import { useState, useEffect, useCallback } from "react";

interface GmailMessagePart {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailMessagePart[];
}

interface GmailMessage {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string | number;
  payload?: {
    headers?: { name: string; value: string }[];
    body?: { data?: string };
    parts?: GmailMessagePart[];
  };
}

export function InboxContainer() {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("INBOX");
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (query = "", label = selectedFolder) => {
    setLoading(true);
    setError(null);
    try {
      // Build search query incorporating the label
      let q = "";
      if (label === "INBOX") q = "label:INBOX";
      else if (label === "SENT") q = "label:SENT";
      else if (label === "DRAFT") q = "label:DRAFT";
      else if (label === "TRASH") q = "label:TRASH";
      else if (label === "SPAM") q = "label:SPAM";

      if (query) {
        q = q ? `${q} ${query}` : query;
      }

      const res = await fetch(`/api/gmail?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch emails: ${res.statusText}`);
      }
      const data = await res.json();
      setMessages(data.messages || []);
      
      // Auto-select first email if available
      if (data.messages && data.messages.length > 0) {
        setSelectedMessage(data.messages[0]);
      } else {
        setSelectedMessage(null);
      }
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Something went wrong while loading your emails.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmails();
  }, [fetchEmails]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmails(searchQuery);
  };

  const getHeader = (msg: GmailMessage | null, name: string) => {
    if (!msg) return "";
    const headers = msg.payload?.headers || [];
    return headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === name.toLowerCase())?.value || "";
  };

  const decodeBase64 = (str: string) => {
    try {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return str;
    }
  };

  const getMessageBody = (payload: GmailMessage['payload'] | GmailMessagePart | undefined): string => {
    if (!payload) return "";
    if (payload.body?.data) {
      return decodeBase64(payload.body.data);
    }
    if (payload.parts) {
      // Find HTML first
      const htmlPart = payload.parts.find((p) => p.mimeType === "text/html");
      if (htmlPart?.body?.data) {
        return decodeBase64(htmlPart.body.data);
      }
      // Then plain text
      const plainPart = payload.parts.find((p) => p.mimeType === "text/plain");
      if (plainPart?.body?.data) {
        return decodeBase64(plainPart.body.data);
      }
      // Check for nested parts
      for (const part of payload.parts) {
        if (part.parts) {
          const body = getMessageBody(part);
          if (body) return body;
        }
      }
    }
    return "";
  };

  const getSenderInitials = (fromHeader: string) => {
    if (!fromHeader) return "G";
    // Extract name if in format "Name <email@domain.com>"
    const nameMatch = fromHeader.match(/^"([^"]+)"|^\s*([^<]+)/);
    const name = nameMatch ? (nameMatch[1] || nameMatch[2]).trim() : fromHeader;
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getSenderName = (fromHeader: string) => {
    if (!fromHeader) return "Unknown Sender";
    const nameMatch = fromHeader.match(/^"([^"]+)"|^\s*([^<]+)/);
    return nameMatch ? (nameMatch[1] || nameMatch[2]).trim() : fromHeader;
  };

  const formatDate = (dateVal: string | number | undefined) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getIframeSrcDoc = (msg: GmailMessage) => {
    const rawBody = getMessageBody(msg.payload);
    if (!rawBody) return `<p style="font-family: sans-serif; color: #a0a0a0;">No message body preview available.</p>`;

    // If it's HTML, return it, injecting dark mode support so it looks great inside the page
    const hasHtml = /<[a-z][\s\S]*>/i.test(rawBody);
    if (hasHtml) {
      // We wrap the HTML content to style its scrollbar and ensure text wraps properly
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
              /* Force transparency and default light-colored text for generic emails */
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

    // Otherwise wrap plain text
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

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] h-[calc(100vh-12rem)] relative">
      
      {/* Sidebar Folders */}
      <div className="lg:col-span-2 flex flex-col gap-2">
        <button
          onClick={() => setSelectedFolder("INBOX")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm ${
            selectedFolder === "INBOX" ? "bg-primary-container text-white font-semibold" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-xl">inbox</span>
          Inbox
        </button>
        <button
          onClick={() => setSelectedFolder("SENT")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm ${
            selectedFolder === "SENT" ? "bg-primary-container text-white font-semibold" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-xl">send</span>
          Sent
        </button>
        <button
          onClick={() => setSelectedFolder("DRAFT")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm ${
            selectedFolder === "DRAFT" ? "bg-primary-container text-white font-semibold" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-xl">draft</span>
          Drafts
        </button>
        <button
          onClick={() => setSelectedFolder("TRASH")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm ${
            selectedFolder === "TRASH" ? "bg-primary-container text-white font-semibold" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-xl">delete</span>
          Trash
        </button>
        <button
          onClick={() => setSelectedFolder("SPAM")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm ${
            selectedFolder === "SPAM" ? "bg-primary-container text-white font-semibold" : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-xl">report</span>
          Spam
        </button>

        <hr className="border-white/5 my-2" />

        <button
          onClick={() => fetchEmails(searchQuery)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors duration-200"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Sync Mail
        </button>
      </div>

      {/* Email List Pane */}
      <div className="lg:col-span-4 flex flex-col glass-card border border-white/10 rounded-2xl overflow-hidden bg-background/20">
        
        {/* Search Header */}
        <form onSubmit={handleSearchSubmit} className="p-4 border-b border-white/10 flex items-center gap-2">
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
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-full transition-colors duration-200"
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
              const subject = getHeader(msg, "subject") || "(No Subject)";
              const isSelected = selectedMessage?.id === msg.id;
              const dateVal = msg.internalDate ? parseInt(String(msg.internalDate)) : getHeader(msg, "date");

              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors duration-150 text-left ${
                    isSelected ? "bg-white/10 border-l-2 border-primary-container" : ""
                  }`}
                >
                  {/* Sender Initials Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary/20 shrink-0 flex items-center justify-center text-xs font-bold text-primary">
                    {getSenderInitials(from)}
                  </div>

                  {/* Mail Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="text-sm font-semibold text-white truncate max-w-[130px]">
                        {getSenderName(from)}
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

      {/* Email Details Pane */}
      <div className="lg:col-span-6 flex flex-col glass-card border border-white/10 rounded-2xl overflow-hidden bg-background/20 h-full">
        {selectedMessage ? (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Message Headers Header */}
            <div className="p-6 border-b border-white/10 bg-white/2">
              <h2 className="text-lg font-bold text-white mb-4 text-left">
                {getHeader(selectedMessage, "subject") || "(No Subject)"}
              </h2>
              
              <div className="flex items-center gap-3 text-left">
                <div className="w-12 h-12 rounded-full bg-primary-container/30 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                  {getSenderInitials(getHeader(selectedMessage, "from"))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold text-white truncate">
                      {getHeader(selectedMessage, "from")}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {formatDate(selectedMessage.internalDate ? parseInt(String(selectedMessage.internalDate)) : getHeader(selectedMessage, "date"))}
                    </p>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    To: {getHeader(selectedMessage, "to")}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Body Iframe */}
            <div className="flex-1 bg-black/20 relative">
              <iframe
                title="Email Body"
                srcDoc={getIframeSrcDoc(selectedMessage)}
                className="w-full h-full border-0"
                sandbox="allow-popups"
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-8 gap-3">
            <span className="material-symbols-outlined text-5xl opacity-30">drafts</span>
            <p className="text-sm font-medium">Select an email from the inbox list to read it</p>
          </div>
        )}
      </div>

    </div>
  );
}
