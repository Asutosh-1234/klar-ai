'use client'

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  composeTo: string;
  setComposeTo: (to: string) => void;
  composeSubject: string;
  setComposeSubject: (subject: string) => void;
  composeBody: string;
  setComposeBody: (body: string) => void;
  validationErrors: { to?: string[]; body?: string[] };
  isSavingDraft: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-card border border-white/10 rounded-2xl bg-[#0F0F16] p-6 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">New Draft</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors duration-150 cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              To:
            </label>
            <input
              type="text"
              placeholder="recipient@domain.com"
              value={composeTo}
              onChange={(e) => setComposeTo(e.target.value)}
              className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 ${
                validationErrors.to
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-white/10 focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
            {validationErrors.to && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.to[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Subject:
            </label>
            <input
              type="text"
              placeholder="Draft Subject"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
              Message:
            </label>
            <textarea
              placeholder="Write your draft content here..."
              rows={8}
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className={`w-full bg-white/5 border rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 resize-none ${
                validationErrors.body
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-white/10 focus:border-primary/40 focus:ring-primary/20"
              }`}
            />
            {validationErrors.body && (
              <p className="text-red-400 text-xs mt-1">{validationErrors.body[0]}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-white/10 text-white rounded-full text-xs font-semibold hover:bg-white/5 transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSavingDraft}
              className="px-6 py-2.5 bg-primary-container hover:scale-95 transition-transform duration-200 text-white rounded-full text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer glow-button"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              {isSavingDraft ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
