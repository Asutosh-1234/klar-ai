'use client'

import { ComposeModalProps } from "@/lib/types";

export function ComposeModal({
  isOpen,
  onClose,
  composeTo,
  setComposeTo,
  composeSubject,
  setComposeSubject,
  composeBody,
  setComposeBody,
  validationErrors,
  isSavingDraft,
  onSubmit,
}: ComposeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs transition-all duration-300">
      <div className="w-full max-w-lg glass-card border border-white/6 rounded-xl bg-surface-card p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col glow-accent">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-sm font-semibold text-white tracking-tight">New Draft</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors duration-150 cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-left relative z-10">
          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              To:
            </label>
            <input
              type="text"
              placeholder="recipient@domain.com"
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              className={`w-full bg-white/2 border rounded-lg px-3.5 py-2 text-xs text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 ${
                validationErrors.to
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                  : "border-white/6 focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
            {validationErrors.to && (
              <p className="text-red-400 text-[10px] mt-1">{validationErrors.to[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Subject:
            </label>
            <input
              type="text"
              placeholder="Draft Subject"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="w-full bg-white/2 border border-white/6 rounded-lg px-3.5 py-2 text-xs text-white placeholder-on-surface-variant/40 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Message:
            </label>
            <textarea
              placeholder="Write your draft content here..."
              rows={8}
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className={`w-full bg-white/2 border rounded-lg p-3.5 text-xs text-white placeholder-on-surface-variant/40 focus:outline-none focus:ring-1 resize-none ${
                validationErrors.body
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                  : "border-white/6 focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
            {validationErrors.body && (
              <p className="text-red-400 text-[10px] mt-1">{validationErrors.body[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-2.5 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-white/6 text-white rounded-lg text-xs font-semibold hover:bg-white/4 hover:border-white/10 transition-all duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingDraft}
              className="px-5 py-2 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_4px_12px_rgba(139,92,246,0.2)]"
            >
              <span className="material-symbols-outlined text-xs">save</span>
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
