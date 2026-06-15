'use client'

import { useState } from 'react';

export function AICommandCenter() {
  const [command, setCommand] = useState('');
  const [aiStatus, setAiStatus] = useState<string | null>(null);

  const handleActionClick = (actionText: string) => {
    setCommand(actionText);
    setAiStatus(null);
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setAiStatus('Analyzing command...');
    setTimeout(() => {
      if (command.toLowerCase().includes('lumina')) {
        setAiStatus('Drafting response to Lumina Global: "Reviewing Q4 strategic materials, sending brief shortly."');
      } else if (command.toLowerCase().includes('lead')) {
        setAiStatus('Summarized 5 active leads: Priority partnership with Fortune 500 company is ready for negotiation.');
      } else {
        setAiStatus(`Aether executed command: "${command}". Optimization parameters successfully updated.`);
      }
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-surface-container/80 backdrop-blur-xl rounded-xl shadow-2xl p-4 border border-primary/20 z-50 transform transition-all duration-300 translate-y-0 hover:-translate-y-1">
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="font-label-md text-primary font-semibold text-xs tracking-wider uppercase">AI Assistant Online</span>
        </div>
        <button 
          onClick={() => setAiStatus(null)} 
          className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xs">close</span>
        </button>
      </div>

      {/* Insight Summary */}
      <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
        I&apos;ve summarized <span className="text-white font-semibold">12 new insights</span> from your morning communications. Ready to prioritize?
      </p>

      {/* Quick Action Buttons */}
      <div className="flex flex-col gap-2 mb-4">
        <button
          onClick={() => handleActionClick('Draft response to Lumina')}
          className="w-full text-left bg-surface-container-highest/60 hover:bg-surface-container-highest px-3 py-2 rounded text-xs text-on-surface flex items-center justify-between transition-colors border border-white/5 cursor-pointer font-medium"
        >
          <span>&ldquo;Draft response to Lumina&rdquo;</span>
          <span className="material-symbols-outlined text-sm opacity-40">arrow_forward</span>
        </button>
        <button
          onClick={() => handleActionClick('Summarize latest lead info')}
          className="w-full text-left bg-surface-container-highest/60 hover:bg-surface-container-highest px-3 py-2 rounded text-xs text-on-surface flex items-center justify-between transition-colors border border-white/5 cursor-pointer font-medium"
        >
          <span>&ldquo;Summarize latest lead info&rdquo;</span>
          <span className="material-symbols-outlined text-sm opacity-40">arrow_forward</span>
        </button>
      </div>

      {/* Interactive Status Messages */}
      {aiStatus && (
        <div className="mb-4 p-2.5 rounded bg-primary/10 border border-primary/20 text-[11px] text-primary leading-normal animate-fadeIn">
          {aiStatus}
        </div>
      )}

      {/* Command Input Form */}
      <form onSubmit={handleSendCommand} className="relative">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Command Aether..."
          className="w-full bg-surface-container-lowest border border-primary/20 rounded-lg pl-3 pr-10 py-2 font-label-md text-xs text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/40"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">send</span>
        </button>
      </form>
    </div>
  );
}
