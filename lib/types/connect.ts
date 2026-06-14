export interface ConnectUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export interface ConnectHeaderProps {
  user: ConnectUser;
  isGmailConnected: boolean;
}
