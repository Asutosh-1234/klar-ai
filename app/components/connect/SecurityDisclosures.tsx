export function SecurityDisclosures() {
  return (
    <div className="glass-card rounded-xl p-8 border border-white/6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.4)] relative overflow-hidden glow-accent">
      <div className="flex items-center gap-2.5 mb-5 relative z-10">
        <span className="material-symbols-outlined text-primary text-xl">security</span>
        <h3 className="text-sm font-semibold text-white tracking-tight">
          Data Security & Privacy Disclosures
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed text-on-surface-variant relative z-10 font-normal">
        <div>
          <h4 className="font-semibold text-white mb-1.5">1. Scope of Access</h4>
          <p>
            Klar AI will only read, modify, or compose data in response to commands you explicitly submit via keyboard shortcuts or natural language instruction. We do not continuously poll or train global models on your raw message content.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1.5">2. Encryption Standards</h4>
          <p>
            All authentication credentials, OAuth tokens, and session secrets are encrypted end-to-end using double-key cryptography (KEK/DEK patterns) with AES-256-GCM. Storage is fully isolated by tenant keys.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-1.5">3. Revocation & Control</h4>
          <p>
            You retain complete control of your integrations. You can revoke access at any time from your Google Account Security Dashboard. Revoking access immediately destroys all stored access keys in our database.
          </p>
        </div>
      </div>

      <div className="border-t border-white/4 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-[10px] text-on-surface-variant/70 leading-normal max-w-xl font-normal">
          By proceeding to authorize either Google Gmail or Google Calendar, you agree to grant the requested permissions to Klar AI and accept our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
        </p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Secure OAuth 2.0 SSL
        </span>
      </div>
    </div>
  );
}
