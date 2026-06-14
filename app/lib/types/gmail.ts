export interface GmailMessagePart {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailMessagePart[];
}

export interface GmailMessage {
  id?: string;
  threadId?: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string | number;
  draftId?: string;
  payload?: {
    headers?: { name: string; value: string }[];
    body?: { data?: string };
    parts?: GmailMessagePart[];
  };
}

export interface GmailServiceTypes {
  tenentId: string;
  userId?: string | undefined;
  q?: string | undefined;
  maxResults?: number | undefined;
  pageToken?: string | undefined;
  labelIds?: string[] | undefined;
  includeSpamTrash?: boolean | undefined;
}
