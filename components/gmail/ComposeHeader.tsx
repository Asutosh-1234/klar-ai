'use client'

import * as React from "react";

interface ComposeHeaderProps {
  subject: string;
  windowState: 'normal' | 'minimized' | 'maximized';
  setWindowState: (state: 'normal' | 'minimized' | 'maximized') => void;
  onClose: () => void;
}

export function ComposeHeader({
  subject,
  windowState,
  setWindowState,
  onClose,
}: ComposeHeaderProps) {
  return (
    <div 
      onClick={() => {
        if (windowState === 'minimized') {
          setWindowState('normal');
        }
      }}
      className={`flex justify-between items-center px-4 py-2.5 bg-[#161B24] border-b border-white/5 cursor-pointer select-none ${
        windowState === 'minimized' ? 'hover:bg-[#1E2530]' : ''
      }`}
    >
      <span className="text-xs font-semibold text-white tracking-tight">
        {subject ? subject : "New Message"}
      </span>
      <div className="flex items-center gap-1.5 relative z-10" onClick={(e) => e.stopPropagation()}>
        {/* Minimize */}
        <button
          type="button"
          onClick={() => setWindowState(windowState === 'minimized' ? 'normal' : 'minimized')}
          className="text-on-surface-variant hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/5"
          title="Minimize"
        >
          <span className="material-symbols-outlined text-[16px]">remove</span>
        </button>
        {/* Maximize */}
        <button
          type="button"
          onClick={() => setWindowState(windowState === 'maximized' ? 'normal' : 'maximized')}
          className="text-on-surface-variant hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/5"
          title={windowState === 'maximized' ? 'Exit full screen' : 'Full screen'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {windowState === 'maximized' ? 'close_fullscreen' : 'open_in_full'}
          </span>
        </button>
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant hover:text-white transition-colors cursor-pointer w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/5"
          title="Save & close"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
