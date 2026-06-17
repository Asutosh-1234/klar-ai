'use client'

import React from "react";
import { ShortcutsHelpModalProps } from "@/lib/types";
import { ShortcutRow, KeyBadge } from "./ShortcutRow";
import { SHORTCUTS } from "@/lib/config/shortcuts";

export function ShortcutsHelpModal({ isOpen, onClose }: ShortcutsHelpModalProps) {
  if (!isOpen) return null;

  const navigationShortcuts = SHORTCUTS.filter(s => s.category === "navigation");
  const actionShortcuts = SHORTCUTS.filter(s => s.category === "action");

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
              {navigationShortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.id} label={shortcut.label}>
                  {shortcut.displayKeys.map((keyGroup, groupIdx) => (
                    <React.Fragment key={groupIdx}>
                      {groupIdx > 0 && <span className="text-[9px] opacity-40">or</span>}
                      {keyGroup.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          {kIdx > 0 && <span className="text-[9px] opacity-45">➔</span>}
                          <KeyBadge size="sm">{k}</KeyBadge>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </ShortcutRow>
              ))}
            </div>
          </div>

          {/* Actions Group */}
          <div>
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-3 opacity-80">Global Actions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {actionShortcuts.map((shortcut) => (
                <ShortcutRow key={shortcut.id} label={shortcut.label}>
                  {shortcut.displayKeys.map((keyGroup, groupIdx) => (
                    <React.Fragment key={groupIdx}>
                      {groupIdx > 0 && <span className="text-[9px] opacity-40">or</span>}
                      {keyGroup.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          {kIdx > 0 && <span className="text-[9px] opacity-45">/</span>}
                          <KeyBadge size="md">{k}</KeyBadge>
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </ShortcutRow>
              ))}
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
