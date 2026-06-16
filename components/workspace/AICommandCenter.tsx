'use client'

import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  pendingDelete?: {
    emailId: string;
    subject: string;
    sender: string;
  } | null;
  deleteState?: 'pending' | 'deleting' | 'deleted' | 'cancelled';
}

interface LimitInfo {
  planName: string;
  limit: number;
  used: number;
}

export function AICommandCenter() {
  const [isOpen, setIsOpen] = useState(true);
  const [command, setCommand] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hello! I am Aether AI. I can manage your inbox and calendar. Try asking me to send an email, list meetings, or clean up emails.',
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [limitInfo, setLimitInfo] = useState<LimitInfo | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch usage limits
  const fetchLimits = async () => {
    try {
      const res = await fetch('/api/ai/limit');
      if (res.ok) {
        const data = await res.json();
        setLimitInfo(data);
      }
    } catch (err) {
      console.error('Failed to fetch AI limits:', err);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCommand = command.trim();
    if (!cleanCommand || loading) return;

    setCommand('');
    
    // Add user message
    const userMsgId = `user_${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: cleanCommand }]);
    
    setLoading(true);

    try {
      const res = await fetch('/api/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cleanCommand })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          text: data.text,
          pendingDelete: data.pendingDelete,
          deleteState: data.pendingDelete ? 'pending' : undefined
        }]);
        // Update limits from response
        if (data.limitInfo) {
          setLimitInfo(data.limitInfo);
        } else {
          fetchLimits();
        }
      } else {
        setMessages(prev => [...prev, {
          id: `ai_err_${Date.now()}`,
          role: 'assistant',
          text: data.error || 'Failed to process AI command. Please check details.'
        }]);
        fetchLimits();
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: `ai_err_${Date.now()}`,
        role: 'assistant',
        text: 'Connection error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (messageId: string, emailId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleteState: 'deleting' } : m));

    try {
      const res = await fetch('/api/gmail/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: emailId, action: 'delete' })
      });

      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleteState: 'deleted', text: 'Email deleted successfully.' } : m));
      } else {
        const data = await res.json();
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleteState: 'pending', text: `Failed to delete: ${data.error || 'Unknown error'}` } : m));
      }
    } catch (err) {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleteState: 'pending', text: 'Error executing deletion request.' } : m));
    }
  };

  const handleCancelDelete = (messageId: string) => {
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, deleteState: 'cancelled', text: 'Deletion request cancelled.' } : m));
  };

  const suggestions = [
    { text: 'Send email to test@gmail.com saying hello', label: 'Send Email' },
    { text: 'What meetings do I have tomorrow?', label: 'List Meetings' },
    { text: 'Delete Netflix email about subscription', label: 'Delete Email' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-background rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform gold-glow z-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl font-bold">psychology</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 max-h-[480px] bg-surface-container/90 backdrop-blur-xl rounded-xl shadow-2xl border border-primary/20 z-50 flex flex-col overflow-hidden animate-fadeIn">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-surface-container-high/40">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Aether OS Coordinator</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-on-surface-variant hover:text-white transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 custom-scrollbar text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-2.5 leading-normal ${
              msg.role === 'user' 
                ? 'bg-primary/10 border border-primary/20 text-white' 
                : 'bg-surface-container-lowest border border-white/5 text-on-surface-variant'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              
              {/* Deletion Confirmation Flow */}
              {msg.role === 'assistant' && msg.pendingDelete && msg.deleteState === 'pending' && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-red-500">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span className="font-bold text-[9px] uppercase tracking-wider">Confirm Deletion</span>
                  </div>
                  <div className="text-[10px] space-y-1 font-normal opacity-90">
                    <p><span className="font-semibold text-white">Subject:</span> {msg.pendingDelete.subject}</p>
                    <p><span className="font-semibold text-white">Sender:</span> {msg.pendingDelete.sender}</p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleConfirmDelete(msg.id, msg.pendingDelete!.emailId)}
                      className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[9px] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleCancelDelete(msg.id)}
                      className="px-2.5 py-1 bg-white/5 border border-white/10 text-white font-bold rounded text-[9px] hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {msg.role === 'assistant' && msg.deleteState === 'deleting' && (
                <div className="mt-2 text-[10px] text-primary flex items-center gap-2">
                  <span className="animate-spin w-3 h-3 border border-primary/20 border-t-primary rounded-full"></span>
                  <span>Executing trash command...</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start">
            <div className="bg-surface-container-lowest border border-white/5 rounded-lg p-2.5 flex items-center gap-2">
              <span className="animate-spin w-3 h-3 border border-primary/20 border-t-primary rounded-full"></span>
              <span className="text-[10px] text-on-surface-variant font-mono">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Actions (Only show when input is empty and no loading) */}
      {messages.length === 1 && !loading && !command && (
        <div className="px-4 py-2 bg-surface-container-lowest/40 border-t border-white/5 flex flex-col gap-1.5">
          <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-widest mb-0.5">Quick Examples</p>
          <div className="flex flex-col gap-1">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCommand(s.text)}
                className="w-full text-left bg-surface-container-lowest hover:bg-surface-container-high/80 px-2 py-1.5 rounded text-[10px] text-on-surface transition-all border border-white/5 cursor-pointer font-medium flex items-center justify-between"
              >
                <span>{s.label}: &ldquo;{s.text.length > 28 ? s.text.substring(0, 28) + '...' : s.text}&rdquo;</span>
                <span className="material-symbols-outlined text-[10px] text-primary">arrow_forward</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer / Input form */}
      <div className="p-3 border-t border-white/5 bg-surface-container-high/20 flex flex-col gap-2">
        {/* Limit Counter */}
        {limitInfo && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[9px] font-bold text-on-surface-variant/60">
              <span className="uppercase tracking-wider">Plan Limits ({limitInfo.planName})</span>
              <span>{limitInfo.used} / {limitInfo.limit} requests</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, (limitInfo.used / limitInfo.limit) * 100)}%` }}
                className={`h-full rounded transition-all duration-500 ${
                  limitInfo.used >= limitInfo.limit ? 'bg-red-500' : 'bg-primary'
                }`}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSendCommand} className="relative mt-1">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={loading}
            placeholder={limitInfo && limitInfo.used >= limitInfo.limit ? "Limit reached. Upgrade plan." : "Command Aether AI..."}
            className="w-full bg-surface-container-lowest border border-white/10 rounded-lg pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/40 disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={loading || !command.trim() || (limitInfo !== null && limitInfo.used >= limitInfo.limit)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
