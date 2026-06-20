"use client";

import { motion } from "framer-motion";

export function SecurityDisclosures() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="glass-card rounded-xl p-8 border border-white/5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-hidden glow-accent"
    >
      <div className="flex items-center gap-2.5 mb-6 relative z-10">
        <span className="material-symbols-outlined text-primary text-xl select-none">security</span>
        <h3 className="text-sm font-bold text-white tracking-tight uppercase tracking-widest text-[11px]">
          Data Security & Privacy Disclosures
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed text-on-surface-variant relative z-10 font-normal">
        {/* Card 1 */}
        <div className="p-5 rounded-lg bg-white/[0.005] border border-white/5 hover:border-white/10 hover:bg-white/[0.015] transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined text-primary text-base select-none">visibility</span>
            <h4 className="font-bold text-white text-xs tracking-tight">1. Scope of Access</h4>
          </div>
          <p className="opacity-90 leading-relaxed">
            Klar AI will only read, modify, or compose data in response to commands you explicitly submit via keyboard shortcuts or natural language instruction. We do not continuously poll or train global models on your raw message content.
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-lg bg-white/[0.005] border border-white/5 hover:border-white/10 hover:bg-white/[0.015] transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined text-primary text-base select-none">lock</span>
            <h4 className="font-bold text-white text-xs tracking-tight">2. Encryption Standards</h4>
          </div>
          <p className="opacity-90 leading-relaxed">
            All authentication credentials, OAuth tokens, and session secrets are encrypted end-to-end using double-key cryptography (KEK/DEK patterns) with AES-256-GCM. Storage is fully isolated by tenant keys.
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-lg bg-white/[0.005] border border-white/5 hover:border-white/10 hover:bg-white/[0.015] transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="material-symbols-outlined text-primary text-base select-none">sync_disabled</span>
            <h4 className="font-bold text-white text-xs tracking-tight">3. Revocation & Control</h4>
          </div>
          <p className="opacity-90 leading-relaxed">
            You retain complete control of your integrations. You can revoke access at any time from your Google Account Security Dashboard. Revoking access immediately destroys all stored access keys in our database.
          </p>
        </div>
      </div>

      <div className="border-t border-white/5 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-[10px] text-on-surface-variant/75 leading-relaxed max-w-xl font-normal">
          By proceeding to authorize either Google Gmail or Google Calendar, you agree to grant the requested permissions to Klar AI and accept our <strong className="text-white">Terms of Service</strong> and <strong className="text-white">Privacy Policy</strong>.
        </p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-bold text-primary whitespace-nowrap shadow-[0_0_12px_rgba(242,202,80,0.1)] select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          Secure OAuth 2.0 SSL
        </span>
      </div>
    </motion.div>
  );
}
