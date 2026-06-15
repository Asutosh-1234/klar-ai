'use client'

import * as React from "react";
import { useState } from "react";
import dynamic from "next/dynamic";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[350px] bg-surface-card border border-white/10 rounded-xl flex items-center justify-center text-xs text-on-surface-variant">
      Loading picker...
    </div>
  )
});

interface ComposeToolbarProps {
  isSending: boolean;
  isSavingDraft: boolean;
  onSend: () => Promise<void>;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmojiSelect: (emoji: string) => void;
}

export function ComposeToolbar({
  isSending,
  isSavingDraft,
  onSend,
  onClose,
  fileInputRef,
  handleFileChange,
  onEmojiSelect,
}: ComposeToolbarProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="px-4 py-3 bg-surface-panel border-t border-white/5 flex items-center justify-between">
      {/* Left Side: Send and Attachment formatting options */}
      <div className="flex items-center gap-1.5">
        {/* Send Button Group */}
        <div className="flex items-center bg-primary hover:brightness-105 transition-all text-surface-sidebar rounded-full overflow-hidden shadow-[0_4px_12px_rgba(242,202,80,0.15)]">
          <button
            type="button"
            disabled={isSending || isSavingDraft}
            onClick={async (e) => {
              e.preventDefault();
              await onSend();
            }}
            className="pl-4 pr-3 py-2 text-xs font-bold active:scale-[0.98] transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
          <div className="w-px h-5 bg-surface-sidebar/20" />
          <button
            type="button"
            disabled={isSending || isSavingDraft}
            className="pr-3 pl-2 py-2 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="More send options"
          >
            <span className="material-symbols-outlined text-[14px] font-bold">arrow_drop_down</span>
          </button>
        </div>

        {/* Formatting */}
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Formatting options"
        >
          <span className="material-symbols-outlined text-lg">text_format</span>
        </button>

        {/* Attachment paperclip */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer relative"
          title="Attach files"
        >
          <span className="material-symbols-outlined text-lg">attach_file</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
        </button>

        {/* Placeholders */}
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Insert link"
        >
          <span className="material-symbols-outlined text-lg">link</span>
        </button>

        {/* Emoji Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              showEmojiPicker ? 'text-primary bg-white/5' : 'text-on-surface-variant hover:text-white hover:bg-white/5'
            }`}
            title="Insert emoji"
          >
            <span className="material-symbols-outlined text-lg">mood</span>
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl border border-white/10 rounded-xl overflow-hidden bg-[#0F131A]">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  onEmojiSelect(emojiData.emoji);
                  setShowEmojiPicker(false);
                }}
                theme={"dark" as any}
                skinTonesDisabled
                searchDisabled
                width={300}
                height={350}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Insert files using Drive"
        >
          <span className="material-symbols-outlined text-lg">add_to_drive</span>
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Insert photo"
        >
          <span className="material-symbols-outlined text-lg">image</span>
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Toggle confidential mode"
        >
          <span className="material-symbols-outlined text-lg">lock_person</span>
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="Insert signature"
        >
          <span className="material-symbols-outlined text-lg">edit_note</span>
        </button>
        <button
          type="button"
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          title="More options"
        >
          <span className="material-symbols-outlined text-lg">more_vert</span>
        </button>
      </div>

      {/* Right Side: Save Draft and Discard Trash can */}
      <div className="flex items-center gap-1.5">
        <button
          type="submit"
          disabled={isSavingDraft || isSending}
          className="px-3.5 py-1.5 border border-white/6 hover:border-white/12 text-white rounded-lg text-[10px] font-semibold hover:bg-white/4 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Save draft"
        >
          {isSavingDraft ? "Saving..." : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          title="Discard draft"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </div>
  );
}
