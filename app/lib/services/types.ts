export interface GmailServiceTypes {
  tenentId: string;
  userId?: string | undefined;
  q?: string | undefined;
  maxResults?: number | undefined;
  pageToken?: string | undefined;
  labelIds?: string[] | undefined;
  includeSpamTrash?: boolean | undefined
}