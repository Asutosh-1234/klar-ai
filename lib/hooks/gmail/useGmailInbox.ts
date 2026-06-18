import { useState, useEffect, useCallback } from "react";
import { GmailMessage } from "@/lib/types";

export function useGmailInbox() {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("INBOX");
  const [selectedCategory, setSelectedCategory] = useState("primary");
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (query = "", label = selectedFolder, category = selectedCategory) => {
    if (["CALENDAR", "AGENTS", "SETTINGS"].includes(label)) {
      setLoading(false);
      setMessages([]);
      setSelectedMessage(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let res;
      if (label === "DRAFT") {
        res = await fetch(`/api/gmail/drafts`);
      } else if (label === "ARCHIVE") {
        let url = `/api/gmail/archive`;
        if (query) {
          url += `?q=${encodeURIComponent(query)}`;
        }
        res = await fetch(url);
      } else {
        let q = "";
        if (label === "INBOX") {
          q = `label:INBOX category:${category}`;
        } else if (label === "SENT") {
          q = "label:SENT";
        } else if (label === "STARRED") {
          q = "is:starred";
        } else if (label === "TRASH") {
          q = "label:TRASH";
        } else if (label === "SPAM") {
          q = "label:SPAM";
        }

        if (query) {
          q = q ? `${q} ${query}` : query;
        }
        res = await fetch(`/api/gmail?q=${encodeURIComponent(q)}`);
      }

      if (res.status === 204) {
        setMessages([]);
        setSelectedMessage(null);
        setLoading(false);
        return;
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
  }, [selectedFolder, selectedCategory]);

  const archiveMessage = useCallback(async (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    setSelectedMessage(prev => prev?.id === messageId ? null : prev);
    try {
      const res = await fetch("/api/gmail/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, action: "archive" })
      });
      if (!res.ok) throw new Error("Failed to archive");
    } catch (err) {
      console.error(err);
      fetchEmails();
    }
  }, [fetchEmails]);

  const deleteMessage = useCallback(async (messageId: string) => {
    setMessages(prev => prev.filter(m => m.id !== messageId));
    setSelectedMessage(prev => prev?.id === messageId ? null : prev);
    try {
      const res = await fetch("/api/gmail/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, action: "delete" })
      });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
      fetchEmails();
    }
  }, [fetchEmails]);

  const toggleReadStatus = useCallback(async (messageId: string, currentlyUnread: boolean) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        const labelIds = m.labelIds || [];
        return {
          ...m,
          labelIds: currentlyUnread 
            ? labelIds.filter(l => l !== "UNREAD")
            : [...labelIds, "UNREAD"]
        };
      }
      return m;
    }));
    try {
      const action = currentlyUnread ? "markRead" : "markUnread";
      const res = await fetch("/api/gmail/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, action })
      });
      if (!res.ok) throw new Error("Failed to toggle read state");
    } catch (err) {
      console.error(err);
      fetchEmails();
    }
  }, [fetchEmails]);

  const unarchiveMessages = useCallback(async (messageIds: string[]) => {
    if (selectedFolder === "ARCHIVE") {
      setMessages(prev => prev.filter(m => !m.id || !messageIds.includes(m.id)));
      setSelectedMessage(prev => prev?.id && messageIds.includes(prev.id) ? null : prev);
    }
    try {
      const res = await fetch("/api/gmail/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds })
      });
      if (!res.ok) throw new Error("Failed to move to inbox");
    } catch (err) {
      console.error(err);
      fetchEmails();
    }
  }, [selectedFolder, fetchEmails]);

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
    selectedCategory,
    setSelectedCategory,
    selectedMessage,
    setSelectedMessage,
    archiveMessage,
    deleteMessage,
    toggleReadStatus,
    unarchiveMessages,
    fetchEmails,
  };
}
