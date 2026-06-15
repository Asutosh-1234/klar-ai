'use client'

import { useRef, useState } from "react";
import { ComposeModalProps } from "@/lib/types";
import { ComposeHeader } from "./ComposeHeader";
import { ComposeRecipients } from "./ComposeRecipients";
import { ComposeAttachments } from "./ComposeAttachments";
import { ComposeToolbar } from "./ComposeToolbar";

export function ComposeModal({
  isOpen,
  onClose,
  composeTo,
  setComposeTo,
  composeSubject,
  setComposeSubject,
  composeBody,
  setComposeBody,
  attachments,
  setAttachments,
  validationErrors,
  isSavingDraft,
  isSending,
  onSubmit,
  onSendCompose,
}: ComposeModalProps) {
  const [windowState, setWindowState] = useState<'normal' | 'minimized' | 'maximized'>('normal');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [composeCc, setComposeCc] = useState("");
  const [composeBcc, setComposeBcc] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setComposeBody(composeBody + emoji);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setComposeBody(before + emoji + after);

    // Focus back on the textarea and set cursor position right after the inserted emoji
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        setAttachments((prev) => [
          ...prev,
          {
            filename: file.name,
            mimeType: file.type || "application/octet-stream",
            content: base64,
            size: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    // Reset file input value so same file can be attached again
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>
      {/* Backdrop - only visible in maximized mode */}
      {windowState === 'maximized' && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 transition-all duration-300 pointer-events-auto" 
          onClick={onClose} 
        />
      )}

      {/* Compose Window Container */}
      <div 
        className={`fixed z-50 bg-[#0F131A] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col transition-all duration-300 pointer-events-auto ${
          windowState === 'minimized'
            ? 'bottom-0 right-12 w-[280px] h-10 rounded-t-xl overflow-hidden'
            : windowState === 'maximized'
            ? 'inset-10 m-auto w-[85%] h-[85%] max-w-5xl max-h-[800px] rounded-xl overflow-hidden'
            : 'bottom-0 right-12 w-[580px] h-[550px] rounded-t-xl overflow-hidden'
        }`}
      >
        {/* Title Bar Header */}
        <ComposeHeader
          subject={composeSubject}
          windowState={windowState}
          setWindowState={setWindowState}
          onClose={onClose}
        />

        {/* Validation Errors Header Banner */}
        {windowState !== 'minimized' && (validationErrors.to || validationErrors.body) && (
          <div className="px-4 py-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-[10px] font-medium flex flex-col gap-0.5">
            {validationErrors.to && <p>• {validationErrors.to[0]}</p>}
            {validationErrors.body && <p>• {validationErrors.body[0]}</p>}
          </div>
        )}

        {/* Compose Form */}
        {windowState !== 'minimized' && (
          <form onSubmit={onSubmit} className="flex-1 flex flex-col min-h-0 text-left relative z-10">
            {/* Recipients (To, CC, BCC) fields */}
            <ComposeRecipients
              composeTo={composeTo}
              setComposeTo={setComposeTo}
              showCc={showCc}
              setShowCc={setShowCc}
              showBcc={showBcc}
              setShowBcc={setShowBcc}
              composeCc={composeCc}
              setComposeCc={setComposeCc}
              composeBcc={composeBcc}
              setComposeBcc={setComposeBcc}
            />

            {/* Subject field */}
            <div className="flex items-center px-4 py-2.5 border-b border-white/5">
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Subject"
                className="bg-transparent w-full text-xs text-white focus:outline-none placeholder-on-surface-variant/30 font-medium"
              />
            </div>

            {/* Message Body Input & Attachment list container */}
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar p-4">
              <textarea
                ref={textareaRef}
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                placeholder="Write your email here..."
                className="flex-1 bg-transparent text-xs text-white outline-none resize-none min-h-[120px] placeholder-on-surface-variant/20 leading-relaxed"
              />

              {/* Attachments Section */}
              <ComposeAttachments
                attachments={attachments}
                onRemove={removeAttachment}
              />
            </div>

            {/* Bottom Actions Toolbar */}
            <ComposeToolbar
              isSending={isSending}
              isSavingDraft={isSavingDraft}
              onSend={onSendCompose}
              onClose={onClose}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              onEmojiSelect={handleEmojiSelect}
            />
          </form>
        )}
      </div>
    </>
  );
}
