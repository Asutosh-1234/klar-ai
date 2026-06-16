export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  pendingDelete?: {
    emailId: string;
    subject: string;
    sender: string;
  } | null;
  deleteState?: 'pending' | 'deleting' | 'deleted' | 'cancelled';
}

export interface LimitInfo {
  planName: string;
  limit: number;
  used: number;
}
