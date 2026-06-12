import { useState, useEffect, useCallback } from "react";
import { GmailMessage } from "@/app/lib/utils/gmail";

export function useGmailInbox() {
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
      let res;
      if (label === "DRAFT") {
        res = await fetch(`/api/gmail/drafts`);
      } else {
        let q = "";
        if (label === "INBOX") q = "label:INBOX";
        else if (label === "SENT") q = "label:SENT";
        else if (label === "TRASH") q = "label:TRASH";
        else if (label === "SPAM") q = "label:SPAM";

        if (query) {
          q = q ? `${q} ${query}` : query;
        }
        res = await fetch(`/api/gmail?q=${encodeURIComponent(q)}`);
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch emails: ${res.statusText}`);
      }
      const data = await res.json();

      if (label === "DRAFT") {
        const mappedDrafts = (data.drafts || []).map((d: { id: string; message?: GmailMessage }) => ({
          ...d.message,
          draftId: d.id,
          id: d.message?.id || d.id
        }));
        setMessages(mappedDrafts);
        if (mappedDrafts.length > 0) {
          setSelectedMessage(mappedDrafts[0]);
        } else {
          setSelectedMessage(null);
        }
      } else {
        setMessages(data.messages || []);
        if (data.messages && data.messages.length > 0) {
          setSelectedMessage(data.messages[0]);
        } else {
          setSelectedMessage(null);
        }
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

  return {
    messages,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    selectedMessage,
    setSelectedMessage,
    fetchEmails,
  };
}
