import { GmailMessage, GmailMessagePart } from "@/lib/types";
export type { GmailMessage, GmailMessagePart };

export const decodeBase64 = (str: string) => {
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

export const getMessageBody = (payload: GmailMessage['payload'] | GmailMessagePart | undefined): string => {
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

export const getHeader = (msg: GmailMessage | null, name: string) => {
  if (!msg) return "";
  const headers = msg.payload?.headers || [];
  return headers.find((h: { name: string; value: string }) => h.name.toLowerCase() === name.toLowerCase())?.value || "";
};

export const getSenderInitials = (fromHeader: string) => {
  if (!fromHeader) return "G";
  const nameMatch = fromHeader.match(/^"([^"]+)"|^\s*([^<]+)/);
  const name = nameMatch ? (nameMatch[1] || nameMatch[2]).trim() : fromHeader;
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const getSenderName = (fromHeader: string) => {
  if (!fromHeader) return "Unknown Sender";
  const nameMatch = fromHeader.match(/^"([^"]+)"|^\s*([^<]+)/);
  return nameMatch ? (nameMatch[1] || nameMatch[2]).trim() : fromHeader;
};

export const formatDate = (dateVal: string | number | undefined) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export interface AttachmentInfo {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId: string;
  messageId: string;
}

export const getAttachments = (msg: GmailMessage): AttachmentInfo[] => {
  const attachments: AttachmentInfo[] = [];

  const traverse = (part: GmailMessagePart) => {
    if (!part) return;
    if (part.filename && part.body?.attachmentId) {
      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType || "application/octet-stream",
        size: part.body.size || 0,
        attachmentId: part.body.attachmentId,
        messageId: msg.id || "",
      });
    }
    if (part.parts) {
      for (const p of part.parts) {
        traverse(p);
      }
    }
  };

  if (msg.payload) {
    traverse(msg.payload as GmailMessagePart);
  }

  return attachments;
};
