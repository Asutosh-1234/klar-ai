'use client'

import React from "react";
import { SHORTCUTS } from "@/lib/config/shortcuts";

interface KeyCapProps {
  children: React.ReactNode;
}

function KeyCap({ children }: KeyCapProps) {
  return (
    <kbd className="inline-flex items-center justify-center px-2 py-1 bg-surface-sidebar border border-white/10 rounded-md font-mono text-[11px] text-primary shadow-[0_2px_4px_rgba(0,0,0,0.4)] min-w-gutter">
      {children}
    </kbd>
  );
}

export function ShortcutsOverview() {
  const navigationShortcuts = SHORTCUTS.filter(s => s.category === "navigation");
  const actionShortcuts = SHORTCUTS.filter(s => s.category === "action");

  return (
    <section id="shortcuts" className="py-section-gap bg-linear-to-b from-transparent via-surface-sidebar/30 to-transparent relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-container-max mx-auto px-gutter relative z-10">
        <div className="mb-16 text-center md:text-left">
          <span className="text-label-caps text-xs text-primary font-bold tracking-widest mb-3 block">EFFORTLESS CONTROL</span>
          <h2 className="font-headline-lg text-headline-lg font-semibold mb-4 text-white">
            Command Klar at the speed of thought.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Klar OS is built around a keyboard-first philosophy. Use hotkeys to fly through your communication pipeline and trigger background workflows instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Navigation Card */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">explore</span>
              <h3 className="text-lg font-semibold text-white">Navigation Hotkeys</h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Use either the instant <code className="text-primary font-mono bg-white/5 px-1 py-0.5 rounded">Ctrl + Key</code> combination or the sequential <code className="text-primary font-mono bg-white/5 px-1 py-0.5 rounded">g</code> followed by the target key.
            </p>

            <div className="space-y-4">
              {navigationShortcuts.map((shortcut) => (
                <div key={shortcut.id} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0 hover:bg-white/1 px-2 rounded-lg transition-colors">
                  <span className="text-sm text-on-surface-variant">{shortcut.label}</span>
                  <div className="flex items-center gap-3">
                    {shortcut.displayKeys.map((keyGroup, groupIdx) => (
                      <React.Fragment key={groupIdx}>
                        {groupIdx > 0 && <span className="text-[10px] text-on-surface-variant opacity-40">or</span>}
                        <div className="flex items-center gap-1">
                          {keyGroup.map((k, kIdx) => (
                            <React.Fragment key={kIdx}>
                              {kIdx > 0 && <span className="text-[10px] text-on-surface-variant opacity-40">➔</span>}
                              <KeyCap>{k}</KeyCap>
                            </React.Fragment>
                          ))}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Actions Card */}
          <div className="flex flex-col gap-8">
            <div className="glass-card rounded-2xl p-8 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-xl">bolt</span>
                <h3 className="text-lg font-semibold text-white">Global Workspace Actions</h3>
              </div>
              <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                Trigger key workspace actions from anywhere in the application. Shortcuts are automatically deactivated when typing inside input fields or text editors.
              </p>

              <div className="space-y-4">
                {actionShortcuts.map((shortcut) => (
                  <div key={shortcut.id} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0 hover:bg-white/1 px-2 rounded-lg transition-colors">
                    <span className="text-sm text-on-surface-variant">{shortcut.label}</span>
                    <div className="flex items-center gap-3">
                      {shortcut.displayKeys.map((keyGroup, groupIdx) => (
                        <React.Fragment key={groupIdx}>
                          {groupIdx > 0 && <span className="text-[10px] text-on-surface-variant opacity-40">or</span>}
                          <div className="flex items-center gap-1">
                            {keyGroup.map((k, kIdx) => (
                              <KeyCap key={kIdx}>{k}</KeyCap>
                            ))}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-[#121824]/40 border border-primary/10 rounded-2xl p-6 flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">info</span>
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Interactive Help Overlay</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Lost track of a shortcut? Just press <KeyCap>?</KeyCap> or <KeyCap>h</KeyCap> anywhere in Klar OS to trigger the interactive shortcuts overlay dashboard instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
