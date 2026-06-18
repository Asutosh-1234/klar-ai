'use client'

import { useRef, useState, useEffect } from "react";
import { ComposeModalProps } from "@/lib/types";
import { ComposeHeader } from "./ComposeHeader";
import { ComposeRecipients } from "./ComposeRecipients";
import { ComposeAttachments } from "./ComposeAttachments";
import { ComposeToolbar } from "./ComposeToolbar";

// TipTap Rich Text Editor imports
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

// Icons for formatting toolbar
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo 
} from "lucide-react";

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

  const [showFormatting, setShowFormatting] = useState(false);

  // Setup TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your email here...",
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: composeBody,
    onUpdate: ({ editor }) => {
      setComposeBody(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "flex-1 bg-transparent text-xs text-white outline-none w-full h-full min-h-[120px] focus:outline-none p-4",
      },
    },
    immediatelyRender: false,
  });

  // Keep editor content in sync with external state updates
  useEffect(() => {
    if (editor && composeBody !== editor.getHTML()) {
      editor.commands.setContent(composeBody);
    }
  }, [composeBody, editor]);

  const handleEmojiSelect = (emoji: string) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji).run();
    } else {
      setComposeBody(composeBody + emoji);
    }
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
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
              <div 
                onClick={() => editor?.commands.focus()} 
                className="flex-1 flex flex-col min-h-[120px] cursor-text text-left"
              >
                <EditorContent editor={editor} className="flex-1 flex flex-col" />
              </div>

              {/* Attachments Section */}
              <ComposeAttachments
                attachments={attachments}
                onRemove={removeAttachment}
              />
            </div>

            {/* Rich Text Formatting Toolbar */}
            {showFormatting && editor && (
              <div className="flex items-center gap-1.5 px-4 py-2 bg-surface-card border-t border-white/5 overflow-x-auto custom-scrollbar shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("bold") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("italic") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Italic"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("underline") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Underline"
                >
                  <UnderlineIcon size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("strike") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Strikethrough"
                >
                  <Strikethrough size={14} />
                </button>
                
                <div className="w-px h-4 bg-white/10 mx-1" />
                
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("codeBlock") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Code Block"
                >
                  <Code size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("bulletList") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Bullet List"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("orderedList") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Numbered List"
                >
                  <ListOrdered size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-all cursor-pointer ${
                    editor.isActive("blockquote") ? "text-primary bg-white/10" : "text-on-surface-variant hover:text-white hover:bg-white/5"
                  }`}
                  title="Blockquote"
                >
                  <Quote size={14} />
                </button>
                
                <div className="w-px h-4 bg-white/10 mx-1" />
                
                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="w-7 h-7 rounded flex items-center justify-center transition-all text-on-surface-variant hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Undo"
                >
                  <Undo size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="w-7 h-7 rounded flex items-center justify-center transition-all text-on-surface-variant hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Redo"
                >
                  <Redo size={14} />
                </button>
              </div>
            )}

            {/* Bottom Actions Toolbar */}
            <ComposeToolbar
              isSending={isSending}
              isSavingDraft={isSavingDraft}
              onSend={onSendCompose}
              onClose={onClose}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
              onEmojiSelect={handleEmojiSelect}
              showFormatting={showFormatting}
              setShowFormatting={setShowFormatting}
            />
          </form>
        )}
      </div>
    </>
  );
}
