'use client'

import React from "react";
import { ShortcutsHelpModalProps } from "@/lib/types";
import { ShortcutRow, KeyBadge } from "./ShortcutRow";

export function ShortcutsHelpModal({ isOpen, onClose }: ShortcutsHelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-999 flex items-center justify-center p-4">
      <div className="bg-surface-container border border-primary/20 rounded-xl max-w-2xl w-full p-6 shadow-2xl animate-fadeIn text-on-surface">
        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">keyboard</span>
            <h3 className="text-sm font-bold tracking-wide text-white uppercase">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-white cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Navigation Group */}
          <div>
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 opacity-80">
              Navigation Shortcuts (Simultaneous or Sequential)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <ShortcutRow label="Go to Inbox">
                <KeyBadge>Ctrl+I</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>i</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Starred">
                <KeyBadge>Ctrl+S</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>s</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Sent">
                <KeyBadge>Ctrl+E</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>e</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Drafts">
                <KeyBadge>Ctrl+D</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>d</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Archive">
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>r</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Purchases">
                <KeyBadge>Ctrl+P</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>p</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Calendar">
                <KeyBadge>Ctrl+C</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>c</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Agents">
                <KeyBadge>Ctrl+A</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>a</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Go to Settings">
                <KeyBadge>Ctrl+O</KeyBadge>
                <span className="text-[9px] opacity-40">or</span>
                <KeyBadge>g</KeyBadge>
                <span className="text-[9px] opacity-45">➔</span>
                <KeyBadge>o</KeyBadge>
              </ShortcutRow>
            </div>
          </div>

          {/* Actions Group */}
          <div>
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 opacity-80">Global Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <ShortcutRow label="Compose New Email">
                <KeyBadge size="md">n</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Toggle Help Dialog">
                <KeyBadge size="md">?</KeyBadge>
                <span className="text-[10px] opacity-40">/</span>
                <KeyBadge size="md">h</KeyBadge>
              </ShortcutRow>

              <ShortcutRow label="Close Panel / Modal">
                <KeyBadge size="md">Esc</KeyBadge>
              </ShortcutRow>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-[10px] text-on-surface-variant opacity-50">
            Shortcuts are disabled inside active input fields and textareas.
          </p>
        </div>
      </div>
    </div>
  );
}
