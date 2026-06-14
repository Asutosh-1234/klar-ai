import { useState } from "react";

interface UseGmailDraftsProps {
  onDraftSaved: () => void;
  onDraftSent: () => void;
}

export function useGmailDrafts({ onDraftSaved, onDraftSent }: UseGmailDraftsProps) {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ to?: string[]; body?: string[] }>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [sendingDraftId, setSendingDraftId] = useState<string | null>(null);

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    setIsSavingDraft(true);

    try {
      const res = await fetch("/api/gmail/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          body: composeBody,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          setValidationErrors(data.details);
        } else {
          alert(data.error || "Failed to save draft");
        }
        return;
      }

      // Success
      setIsComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      onDraftSaved();
    } catch (err) {
      console.error(err);
      alert("Error saving draft");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSendDraft = async (draftId: string) => {
    if (sendingDraftId) return;
    setSendingDraftId(draftId);

    try {
      const res = await fetch("/api/gmail/drafts/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draftId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send draft");
      }

      alert("Draft sent successfully!");
      onDraftSent();
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Error sending draft";
      alert(errMsg);
    } finally {
      setSendingDraftId(null);
    }
  };

  const openCompose = () => {
    setValidationErrors({});
    setIsComposeOpen(true);
  };

  return {
    isComposeOpen,
    setIsComposeOpen,
    composeTo,
    setComposeTo,
    composeSubject,
    setComposeSubject,
    composeBody,
    setComposeBody,
    validationErrors,
    setValidationErrors,
    isSavingDraft,
    sendingDraftId,
    handleSaveDraft,
    handleSendDraft,
    openCompose,
  };
}
