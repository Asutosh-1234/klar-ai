'use client'

import * as React from "react";

interface ComposeRecipientsProps {
  composeTo: string;
  setComposeTo: (val: string) => void;
  showCc: boolean;
  setShowCc: (val: boolean) => void;
  showBcc: boolean;
  setShowBcc: (val: boolean) => void;
  composeCc: string;
  setComposeCc: (val: string) => void;
  composeBcc: string;
  setComposeBcc: (val: string) => void;
}

export function ComposeRecipients({
  composeTo,
  setComposeTo,
  showCc,
  setShowCc,
  showBcc,
  setShowBcc,
  composeCc,
  setComposeCc,
  composeBcc,
  setComposeBcc,
}: ComposeRecipientsProps) {
  return (
    <>
      {/* Recipients (To) field */}
      <div className="flex items-center px-4 py-2.5 border-b border-white/5 relative group">
        <span className="text-xs text-on-surface-variant/70 w-8 select-none">To</span>
        <input
          type="text"
          value={composeTo}
          onChange={(e) => setComposeTo(e.target.value)}
          placeholder="recipients"
          className="bg-transparent flex-1 text-xs text-white focus:outline-none placeholder-on-surface-variant/30"
        />
        <div className="flex gap-2 text-[10px] text-on-surface-variant/60">
          <button
            type="button"
            onClick={() => setShowCc(!showCc)}
            className={`hover:text-primary transition-colors hover:underline ${showCc ? 'text-primary font-semibold' : ''}`}
          >
            Cc
          </button>
          <button
            type="button"
            onClick={() => setShowBcc(!showBcc)}
            className={`hover:text-primary transition-colors hover:underline ${showBcc ? 'text-primary font-semibold' : ''}`}
          >
            Bcc
          </button>
        </div>
      </div>

      {/* CC Field */}
      {showCc && (
        <div className="flex items-center px-4 py-2 border-b border-white/5">
          <span className="text-xs text-on-surface-variant/70 w-8 select-none">Cc</span>
          <input
            type="text"
            value={composeCc}
            onChange={(e) => setComposeCc(e.target.value)}
            placeholder="cc recipients"
            className="bg-transparent flex-1 text-xs text-white focus:outline-none placeholder-on-surface-variant/30"
          />
        </div>
      )}

      {/* BCC Field */}
      {showBcc && (
        <div className="flex items-center px-4 py-2 border-b border-white/5">
          <span className="text-xs text-on-surface-variant/70 w-8 select-none">Bcc</span>
          <input
            type="text"
            value={composeBcc}
            onChange={(e) => setComposeBcc(e.target.value)}
            placeholder="bcc recipients"
            className="bg-transparent flex-1 text-xs text-white focus:outline-none placeholder-on-surface-variant/30"
          />
        </div>
      )}
    </>
  );
}
