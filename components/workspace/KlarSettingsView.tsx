'use client'

import { useState } from 'react';

export function KlarSettingsView() {
  const [model, setModel] = useState('klar-1.5-pro');
  const [notifications, setNotifications] = useState(true);
  const [autoDraft, setAutoDraft] = useState(true);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-surface text-on-surface custom-scrollbar">
      <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="material-symbols-outlined text-sm">settings</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Klar System Parameters</span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-white">Settings</h2>
          <p className="text-xs text-on-surface-variant mt-2 max-w-md opacity-80 leading-relaxed">
            Configure Klar Executive Operating System defaults, AI models, and email/calendar synchronization.
          </p>
        </div>

        {/* Configurations Box */}
        <div className="bg-surface-container/60 border border-white/5 rounded-xl p-6 flex flex-col gap-6 shadow-lg">
          
          {/* Model Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-white">AI Intelligence Engine</h3>
              <p className="text-[11px] text-on-surface-variant opacity-60 mt-1">Select the active LLM powering email response drafts & scheduling suggestions.</p>
            </div>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="bg-surface-container-lowest border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary select-none cursor-pointer"
            >
              <option value="klar-1.5-pro">Klar 1.5 Pro Ultra (Default)</option>
              <option value="klar-1.5-flash">Klar 1.5 Flash (Low Latency)</option>
              <option value="gemini-experimental">Gemini Experimental (Advanced Reasoning)</option>
            </select>
          </div>

          {/* Sync frequency & status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
            <div>
              <h3 className="text-sm font-semibold text-white">Realtime Synchronization</h3>
              <p className="text-[11px] text-on-surface-variant opacity-60 mt-1">Status of Google Workspace integration tokens and real-time email listeners.</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Active Tokens Connected
              </span>
              <button className="px-3 py-1.5 bg-surface-container-highest border border-white/5 hover:bg-white/5 text-xs rounded text-white cursor-pointer transition-colors">
                Refresh Connection
              </button>
            </div>
          </div>

          {/* Preferences Toggles */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">Agent Toggles</h4>
            
            {/* Auto-Draft */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h5 className="text-xs font-semibold text-white">Auto-Draft Responses</h5>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">Background agent drafts replies in drafts folder when high priority messages arrive.</p>
              </div>
              <input
                type="checkbox"
                checked={autoDraft}
                onChange={(e) => setAutoDraft(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-transparent text-primary focus:ring-primary/40 focus:ring-offset-surface cursor-pointer"
              />
            </div>

            {/* AI Notifications */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h5 className="text-xs font-semibold text-white">Push Cognitive Insights</h5>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">Display toast notifications when Klar optimizes calendars or flags billing run-rates.</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 bg-transparent text-primary focus:ring-primary/40 focus:ring-offset-surface cursor-pointer"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
