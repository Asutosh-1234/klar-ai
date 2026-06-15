import * as React from "react";
import { GmailMessage } from "./gmail";
import { UserProfile } from "./user";

export interface ComposeAttachment {
  filename: string;
  mimeType: string;
  content: string; // base64 string
  size: number;
}

export interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  composeTo: string;
  setComposeTo: (to: string) => void;
  composeSubject: string;
  setComposeSubject: (subject: string) => void;
  composeBody: string;
  setComposeBody: (body: string) => void;
  attachments: ComposeAttachment[];
  setAttachments: React.Dispatch<React.SetStateAction<ComposeAttachment[]>>;
  validationErrors: { to?: string[]; body?: string[] };
  isSavingDraft: boolean;
  isSending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSendCompose: () => Promise<void>;
}

export interface MailActionBarProps {
  onClose: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onToggleRead: () => void;
  isUnread: boolean;
  draftId: string | null;
  sendingDraftId: string | null;
  onSendDraft: (draftId: string) => void;
}

export interface MailHeaderProps {
  subject: string;
  avatarInitials: string;
  senderName: string;
  from: string;
  to: string;
  dateVal: number | string;
}

export interface MailBodyProps {
  message: GmailMessage;
  handleIframeLoad: (e: React.SyntheticEvent<HTMLIFrameElement>) => void;
}

export interface MailReplyBarProps {
  onReplyClick?: () => void;
  onForwardClick?: () => void;
}

export interface MailDetailsProps {
  message: GmailMessage | null;
  sendingDraftId: string | null;
  onSendDraft: (draftId: string) => void;
  onClose: () => void;
  onArchive?: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleRead?: (id: string, currentlyUnread: boolean) => void;
}

export interface MailListProps {
  messages: GmailMessage[];
  loading: boolean;
  error: string | null;
  selectedMessage: GmailMessage | null;
  onSelectMessage: (msg: GmailMessage | null) => void;
  selectedFolder: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  archiveMessage: (id: string) => void;
  deleteMessage: (id: string) => void;
  toggleReadStatus: (id: string, currentlyUnread: boolean) => void;
  isSplitView: boolean;
}

export interface InboxSidebarProps {
  user: UserProfile;
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  onComposeClick: () => void;
  onSyncClick: () => void;
}

export interface InboxContainerProps {
  user: UserProfile;
}

export interface EmailStarProps {
  isStarred: boolean;
  onToggle?: () => void;
}

export interface EmailSenderProps {
  name: string;
  isUnread: boolean;
  className?: string;
}

export interface EmailRowActionsProps {
  isUnread: boolean;
  onArchive: () => void;
  onDelete: () => void;
  onToggleRead: () => void;
  className?: string;
}

export interface EmailCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export interface EmailTextContentProps {
  subject: string;
  snippet: string;
  isUnread: boolean;
  className?: string;
}

export interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ShortcutRowProps {
  label: string;
  children: React.ReactNode;
}

export interface KeyBadgeProps {
  children: React.ReactNode;
  size?: 'sm' | 'md';
}
