import { useState } from "react";
import { ComposeAttachment, GmailMessage } from "@/lib/types";
import { getHeader, getMessageBody, getAttachments } from "@/lib/utils/gmail";

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
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  const handleSaveDraft = async (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();
    setValidationErrors({});
    setIsSavingDraft(true);

    try {
      const url = "/api/gmail/drafts";
      const method = activeDraftId ? "PUT" : "POST";
      const bodyPayload = activeDraftId
        ? { draftId: activeDraftId, to: composeTo, subject: composeSubject, body: composeBody, attachments }
        : { to: composeTo, subject: composeSubject, body: composeBody, attachments };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
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
      setActiveDraftId(null);
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

      let draftId = activeDraftId;

      // 1. Create/Save or Update the Draft first
      if (activeDraftId) {
        const resUpdate = await fetch("/api/gmail/drafts", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            draftId: activeDraftId,
            to: composeTo,
            subject: composeSubject,
            body: composeBody,
            attachments,
          }),
        });

        const dataUpdate = await resUpdate.json();
        if (!resUpdate.ok) {
          if (dataUpdate.details) {
            setValidationErrors(dataUpdate.details);
          } else {
            alert(dataUpdate.error || "Failed to update draft");
          }
          setIsSending(false);
          return;
        }
      } else {
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

        draftId = dataSave.draft?.id;
      }

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
      setActiveDraftId(null);
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
    setActiveDraftId(null);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    setAttachments([]);
    setValidationErrors({});
    setIsComposeOpen(true);
  };

  const openComposeForDraft = async (msg: GmailMessage) => {
    setValidationErrors({});
    setActiveDraftId(msg.draftId || null);
    setComposeTo(getHeader(msg, "to") || "");
    setComposeSubject(getHeader(msg, "subject") || "");
    setComposeBody(getMessageBody(msg.payload) || "");
    setIsComposeOpen(true);

    const msgAttachments = getAttachments(msg);
    if (msgAttachments.length > 0) {
      setAttachments(
        msgAttachments.map((att) => ({
          filename: att.filename,
          mimeType: att.mimeType,
          size: att.size,
          content: "",
        }))
      );

      const loadedAttachments = await Promise.all(
        msgAttachments.map(async (att) => {
          try {
            const res = await fetch(
              `/api/gmail/attachment?messageId=${att.messageId}&attachmentId=${att.attachmentId}&filename=${encodeURIComponent(
                att.filename
              )}`
            );
            if (!res.ok) throw new Error("Failed to fetch attachment content");
            const arrayBuffer = await res.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            const base64 = btoa(binary);
            return {
              filename: att.filename,
              mimeType: att.mimeType,
              size: att.size,
              content: base64,
            };
          } catch (err) {
            console.error(`Error loading attachment content for draft:`, err);
            return {
              filename: att.filename,
              mimeType: att.mimeType,
              size: att.size,
              content: "",
            };
          }
        })
      );
      setAttachments(loadedAttachments);
    } else {
      setAttachments([]);
    }
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
    activeDraftId,
    handleSaveDraft,
    handleSendDraft,
    handleSendCompose,
    openCompose,
    openComposeForDraft,
  };
}
