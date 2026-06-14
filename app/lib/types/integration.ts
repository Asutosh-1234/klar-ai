export interface IntegrationCardProps {
  title: string;
  description: string;
  icon: string;
  isConnected: boolean;
  scopes: string[];
  connectUrl: string;
  connectedAction: {
    type: "link" | "button";
    text: string;
    href?: string;
  };
  connectActionText: string;
}
