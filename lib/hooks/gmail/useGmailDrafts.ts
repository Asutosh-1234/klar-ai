import { useState } from "react";
import { ComposeAttachment } from "@/lib/types";

interface UseGmailDraftsProps {
  onDraftSaved: () => void;
  onDraftSent: () => void;
}

export function useGmailDrafts({ onDraftSaved, onDraftSent }: UseGmailDraftsProps) {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [attachments, setAttachments] = useState<ComposeAttachment[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ to?: string[]; body?: string[] }>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendingDraftId, setSendingDraftId] = useState<string | null>(null);

  const handleSaveDraft = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
          attachments,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          setValidationErrors(data.details);
        } else {
          alert(data.error || "Failed to save draft");
        }
        return null;
      }

      // Success
      setIsComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setAttachments([]);
      onDraftSaved();
      return data.draft;
    } catch (err) {
      console.error(err);
      alert("Error saving draft");
      return null;
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleSendCompose = async () => {
    setValidationErrors({});
    setIsSending(true);

    try {
      // Validate inputs locally first to avoid unnecessary requests
      const errors: { to?: string[]; body?: string[] } = {};
      if (!composeTo) {
        errors.to = ["Please enter a recipient email address"];
      } else if (!/\S+@\S+\.\S+/.test(composeTo)) {
        errors.to = ["Please enter a valid email address"];
      }
      if (!composeBody) {
        errors.body = ["Draft message body cannot be empty"];
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setIsSending(false);
        return;
      }

      // 1. Create and Save the Draft first
      const resSave = await fetch("/api/gmail/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          body: composeBody,
          attachments,
        }),
      });

      const dataSave = await resSave.json();
      if (!resSave.ok) {
        if (dataSave.details) {
          setValidationErrors(dataSave.details);
        } else {
          alert(dataSave.error || "Failed to create draft");
        }
        setIsSending(false);
        return;
      }

      const draftId = dataSave.draft?.id;
      if (!draftId) {
        alert("Failed to retrieve saved draft ID.");
        setIsSending(false);
        return;
      }

      // 2. Send the saved Draft
      const resSend = await fetch("/api/gmail/drafts/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draftId }),
      });

      if (!resSend.ok) {
        const dataSend = await resSend.json();
        throw new Error(dataSend.error || "Failed to send draft");
      }

      // Success
      setIsComposeOpen(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setAttachments([]);
      alert("Email sent successfully!");
      onDraftSent();
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Error sending email";
      alert(errMsg);
    } finally {
      setIsSending(false);
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
    attachments,
    setAttachments,
    validationErrors,
    setValidationErrors,
    isSavingDraft,
    isSending,
    sendingDraftId,
    handleSaveDraft,
    handleSendDraft,
    handleSendCompose,
    openCompose,
  };
}
