'use client'

import { useState, useEffect, useRef } from 'react';
import { UserProfile } from '@/lib/types';
import { toast } from 'sonner';

export interface AetherAgentsViewProps {
  user?: UserProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  proposedStep?: {
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    executed?: boolean;
    dismissed?: boolean;
  } | null;
}

interface Specialist {
  id: 'strategy' | 'calendar' | 'mail';
  name: string;
  role: string;
  description: string;
  icon: string;
  status: 'Active' | 'Idle' | 'Optimizing';
  time: string;
  avatarBg: string;
  borderColor: string;
  pulseColor: string;
  precisionMode: string;
}

const SPECIALISTS: Specialist[] = [
  {
    id: 'strategy',
    name: 'Strategy Lead',
    role: 'Strategy Coordinator',
    description: 'Coordinates workspace data across mail and calendar.',
    icon: 'insights',
    status: 'Active',
    time: '2m',
    avatarBg: 'bg-primary/10 border-primary/30 text-primary',
    borderColor: 'border-l-primary',
    pulseColor: 'bg-primary',
    precisionMode: 'High Precision Mode'
  },
  {
    id: 'calendar',
    name: 'Scheduling Assistant',
    role: 'Calendar Planner',
    description: 'Check schedule, conflicts and event optimization.',
    icon: 'event_note',
    status: 'Active',
    time: '14m',
    avatarBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500',
    borderColor: 'border-l-emerald-500',
    pulseColor: 'bg-emerald-500',
    precisionMode: 'Optimize Focus'
  },
  {
    id: 'mail',
    name: 'Mail Analyst',
    role: 'Mail Specialist',
    description: 'Summarize, search and draft replies for your emails.',
    icon: 'inbox',
    status: 'Active',
    time: '1h',
    avatarBg: 'bg-amber-400/10 border-amber-400/30 text-amber-400',
    borderColor: 'border-l-amber-400',
    pulseColor: 'bg-amber-400',
    precisionMode: 'Deep Scan Mode'
  }
];

function FormattedText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, idx) => {
        let content = line;

        // Pattern for bold text: **text**
        const boldRegex = /\*\*(.*?)\*\*/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(content)) !== null) {
          if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index));
          }
          parts.push(
            <strong key={match.index} className="text-white font-bold">
              {match[1]}
            </strong>
          );
          lastIndex = boldRegex.lastIndex;
        }
        if (lastIndex < content.length) {
          parts.push(content.substring(lastIndex));
        }

        const renderedContent = parts.length > 0 ? parts : content;

        // Check if bullet point (- or *)
        if (line.startsWith("- ") || line.startsWith("* ")) {
          const listText = line.substring(2);
          const listParts = [];
          let listLastIndex = 0;
          let listMatch;

          while ((listMatch = boldRegex.exec(listText)) !== null) {
            if (listMatch.index > listLastIndex) {
              listParts.push(listText.substring(listLastIndex, listMatch.index));
            }
            listParts.push(
              <strong key={listMatch.index} className="text-white font-bold">
                {listMatch[1]}
              </strong>
            );
            listLastIndex = boldRegex.lastIndex;
          }
          if (listLastIndex < listText.length) {
            listParts.push(listText.substring(listLastIndex));
          }

          return (
            <ul key={idx} className="list-disc pl-5 my-0.5 space-y-1">
              <li className="text-on-surface-variant font-normal text-xs leading-relaxed">
                {listParts.length > 0 ? listParts : listText}
              </li>
            </ul>
          );
        }

        if (line.trim() === "") {
          return <div key={idx} className="h-1.5" />;
        }

        return (
          <p key={idx} className="text-xs text-on-surface leading-relaxed font-normal">
            {renderedContent}
          </p>
        );
      })}
    </div>
  );
}

export function AetherAgentsView({ user }: AetherAgentsViewProps) {
  const [activeId, setActiveId] = useState<'strategy' | 'calendar' | 'mail'>('strategy');
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    strategy: [
      {
        id: 'init-strategy',
        sender: 'ai',
        text: "Good morning. I've coordinated your workspace data. Ask me any comprehensive questions about your upcoming strategy, emails, or schedules.",
        timestamp: '10:30 AM'
      }
    ],
    calendar: [
      {
        id: 'init-calendar',
        sender: 'ai',
        text: "Hello. I am your Scheduling Assistant. I can check your calendar events, look for conflicts, or schedule meetings for you.",
        timestamp: '10:30 AM'
      }
    ],
    mail: [
      {
        id: 'init-mail',
        sender: 'ai',
        text: "Welcome. I am your Mail Analyst. I have indexed your inbox. You can ask me to find specific emails, summarize threads, or draft responses.",
        timestamp: '10:30 AM'
      }
    ]
  });

  const activeSpecialist = SPECIALISTS.find(s => s.id === activeId) || SPECIALISTS[0];

  const inputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Focus command bar with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto scroll thread to bottom
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeId, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userText = inputValue;
    setInputValue("");

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeString
    };

    setMessages(prev => ({
      ...prev,
      [activeId]: [...prev[activeId], userMsg]
    }));

    setLoading(true);

    const history = (messages[activeId] || [])
      .filter(m => !m.id.startsWith("init-") && m.text.trim() !== "")
      .map(m => ({
        role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text
      }));

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialistId: activeId,
          message: userText,
          history
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("No response stream reader available.");
      }

      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      const aiMsgId = `ai-${Date.now()}`;
      // Add initial empty message
      setMessages(prev => ({
        ...prev,
        [activeId]: [...prev[activeId], {
          id: aiMsgId,
          sender: 'ai',
          text: "",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      }));

      // Set loading false since we started streaming the chunks
      setLoading(false);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array(), { stream: !done });
        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.type === "text") {
              setMessages(prev => {
                const list = prev[activeId].map(msg => {
                  if (msg.id === aiMsgId) {
                    return {
                      ...msg,
                      text: msg.text + parsed.content
                    };
                  }
                  return msg;
                });
                return {
                  ...prev,
                  [activeId]: list
                };
              });
            } else if (parsed.type === "proposedStep") {
              setMessages(prev => {
                const list = prev[activeId].map(msg => {
                  if (msg.id === aiMsgId) {
                    return {
                      ...msg,
                      proposedStep: parsed.content
                    };
                  }
                  return msg;
                });
                return {
                  ...prev,
                  [activeId]: list
                };
              });
            }
          } catch (e) {
            console.error("Error parsing NDJSON line:", e, line);
          }
        }
      }
    } catch (err: any) {
      console.error("Chat streaming failed:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `Failed to connect or stream: ${err.message || String(err)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [activeId]: [...prev[activeId], errorMsg]
      }));
      setLoading(false);
    }
  };

  const handleAction = (messageId: string, actionType: 'execute' | 'dismiss') => {
    setMessages(prev => {
      const list = prev[activeId].map(msg => {
        if (msg.id === messageId && msg.proposedStep) {
          return {
            ...msg,
            proposedStep: {
              ...msg.proposedStep,
              executed: actionType === 'execute',
              dismissed: actionType === 'dismiss'
            }
          };
        }
        return msg;
      });
      return {
        ...prev,
        [activeId]: list
      };
    });

    if (actionType === 'execute') {
      toast.success("Action approved and executed successfully.");
    } else {
      toast.info("Proposed step dismissed.");
    }
  };

  const handleExport = () => {
    toast.success(`Exported ${activeSpecialist.name} Chat Session to PDF.`);
  };

  const filteredSpecialists = SPECIALISTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userName = user?.name || "Marcus Vane";
  const userImage = user?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuBIYwpZKiz8a8H8tGbL2-ou1o1HMEulNKClAygiW-IpcY9lCuuV2f9_B06geUA1oJUz8N4wifjuIMGdaKJxXFSNgixQ7xklW4VTlwxHwV3JyyFwxU85H_H4bOCiOsQPhkI0iSFZO-_L4Ky83LFUsaPOQqmkHsxPmUjh9jp_p07htlPQyFvu_hJgJKx8YPKD-9Mv7yrUy6LO2YZs9MEZ145JeqCGP182lLC707gMbD6IlLTSaWGc4pvl";

  return (
    <div className="flex-1 flex flex-row overflow-hidden bg-surface-container-lowest text-on-surface h-full relative">
      
      {/* Inner Sidebar: AI Specialists */}
      <aside className="w-80 h-full bg-surface-sidebar border-r border-white/5 flex flex-col overflow-hidden shrink-0 select-none">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/5 bg-surface-container-low/30">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Specialists</span>
            <button 
              onClick={() => toast.info("Creating custom specialists requires Enterprise tier permissions.")}
              className="material-symbols-outlined text-primary hover:scale-105 active:scale-95 transition-all text-lg cursor-pointer"
            >
              add_circle
            </button>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-on-surface-variant/50">
              search
            </span>
            <input 
              className="w-full bg-surface-container/60 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-on-surface-variant/30" 
              placeholder="Find Specialist..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Specialists List */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3">
          {filteredSpecialists.length === 0 ? (
            <div className="px-6 py-4 text-center text-xs text-on-surface-variant/40">
              No matching specialists found
            </div>
          ) : (
            filteredSpecialists.map((spec) => {
              const isActive = spec.id === activeId;
              return (
                <div 
                  key={spec.id}
                  onClick={() => setActiveId(spec.id)}
                  className={`px-6 py-4 mb-1 cursor-pointer transition-all flex items-center gap-4 ${
                    isActive 
                      ? 'bg-primary/5 border-r-2 border-primary' 
                      : 'hover:bg-white/3'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                    isActive ? spec.avatarBg : 'bg-white/5 border-white/5 text-on-surface-variant'
                  }`}>
                    <span className="material-symbols-outlined text-lg" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                      {spec.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                      {spec.name}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant/60 truncate mt-0.5">
                      {spec.description}
                    </p>
                  </div>
                  <div className="text-[9px] text-on-surface-variant/40 shrink-0 font-medium">
                    {spec.time}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </aside>

      {/* Chat Workspace */}
      <section className="flex-1 flex flex-col relative h-full min-w-0">
        
        {/* Workspace Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-surface-sidebar/45 backdrop-blur-md border-b border-white/5 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${activeSpecialist.pulseColor} animate-pulse`}></div>
            <span className="text-sm font-bold text-white tracking-tight">
              {activeSpecialist.name}
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 ml-2 font-bold uppercase tracking-wider">
              {activeSpecialist.precisionMode}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toast.info("History view is currently being aggregated.")}
              className="p-1.5 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">history</span>
            </button>
            <button 
              onClick={() => toast.info("Agent config is fully optimized.")}
              className="p-1.5 rounded-lg hover:bg-white/5 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">more_vert</span>
            </button>
            <button 
              onClick={handleExport}
              className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-background px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <span className="material-symbols-outlined text-xs">share</span>
              Export
            </button>
          </div>
        </header>

        {/* Conversation Thread */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center px-8 py-8 gap-6 bg-surface-container-lowest/40">
          
          {/* Timestamp Divider */}
          <div className="w-full max-w-3xl flex items-center justify-center gap-4 opacity-20 py-2 select-none">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Today</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Chat Messages */}
          {messages[activeId]?.map((msg) => {
            const isAI = msg.sender === 'ai';
            if (isAI) {
              return (
                <div key={msg.id} className="w-full max-w-3xl flex gap-4 group">
                  
                  {/* AI Avatar */}
                  <div className={`w-8 h-8 rounded-lg ${activeSpecialist.avatarBg} flex items-center justify-center shrink-0 shadow-lg gold-glow`}>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bolt
                    </span>
                  </div>

                  {/* AI Content */}
                  <div className="flex-1 space-y-3">
                    <div className={`glass-panel p-5 rounded-2xl border-l-4 ${activeSpecialist.borderColor} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent opacity-10 pointer-events-none"></div>
                      <FormattedText text={msg.text} />
                    </div>

                    {/* AI Action Card */}
                    {msg.proposedStep && (
                      <div className="max-w-md bg-surface-sidebar border border-white/5 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg animate-fade-in-up">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                        
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-lg">assignment_turned_in</span>
                          <h5 className="text-xs font-bold text-white">Proposed Next Step</h5>
                        </div>
                        
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">
                          {msg.proposedStep.description}
                        </p>
                        
                        {msg.proposedStep.executed ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
                            <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                            <span>{msg.proposedStep.primaryAction} Approved &amp; Executed</span>
                          </div>
                        ) : msg.proposedStep.dismissed ? (
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 font-semibold mt-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg w-fit">
                            <span className="material-symbols-outlined text-sm">cancel</span>
                            <span>Proposed Step Dismissed</span>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-1 relative z-10">
                            <button 
                              onClick={() => handleAction(msg.id, 'execute')}
                              className="flex-1 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-[10px] uppercase tracking-wider hover:bg-primary hover:text-background transition-all cursor-pointer"
                            >
                              {msg.proposedStep.primaryAction}
                            </button>
                            <button 
                              onClick={() => handleAction(msg.id, 'dismiss')}
                              className="px-3 py-1.5 rounded-lg bg-white/3 border border-white/10 text-on-surface-variant font-bold text-[10px] uppercase tracking-wider hover:bg-white/8 hover:text-white transition-all cursor-pointer"
                            >
                              {msg.proposedStep.secondaryAction}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            } else {
              return (
                <div key={msg.id} className="w-full max-w-3xl flex gap-4 justify-end">
                  <div className="flex-1 flex flex-col items-end">
                    <div className="bg-surface-sidebar border border-white/5 px-5 py-3 rounded-2xl max-w-xl shadow-md">
                      <FormattedText text={msg.text} />
                    </div>
                    <span className="text-[9px] text-on-surface-variant/40 mt-1.5 mr-1 font-medium select-none">
                      Delivered • {msg.timestamp}
                    </span>
                  </div>
                  
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10 select-none bg-white/5 flex items-center justify-center font-bold text-primary text-xs">
                    {userImage ? (
                      <img alt={userName} className="w-full h-full object-cover" src={userImage} />
                    ) : (
                      userName.substring(0, 2).toUpperCase()
                    )}
                  </div>
                </div>
              );
            }
          })}

          {/* AI Typing Indicator */}
          {loading && (
            <div className="w-full max-w-3xl flex gap-4 items-center">
              <div className={`w-8 h-8 rounded-lg ${activeSpecialist.avatarBg} flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-base">bolt</span>
              </div>
              <div className="flex gap-1 items-center p-3.5 bg-white/3 border border-white/5 rounded-2xl">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>

        {/* Command Input Bar */}
        <form onSubmit={handleSendMessage} className="px-8 pb-8 flex justify-center shrink-0 select-none">
          <div className="w-full max-w-3xl relative">
            <div className="command-bar-container glass-panel rounded-2xl flex flex-col p-2 transition-all focus-within:ring-1 focus-within:ring-primary/50 relative z-20">
              
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-2 mb-1 border-b border-white/5 pb-1 opacity-40">
                <button 
                  type="button"
                  onClick={() => toast.info("Attachments are not supported in trial tier.")}
                  className="p-1 rounded-lg hover:bg-white/5 transition-all material-symbols-outlined text-base hover:text-white cursor-pointer"
                >
                  attach_file
                </button>
                <button 
                  type="button"
                  onClick={() => toast.info("Voice control is available on desktop client.")}
                  className="p-1 rounded-lg hover:bg-white/5 transition-all material-symbols-outlined text-base hover:text-white cursor-pointer"
                >
                  mic
                </button>
                <button 
                  type="button"
                  onClick={() => toast.info("Aether vision processing is disabled.")}
                  className="p-1 rounded-lg hover:bg-white/5 transition-all material-symbols-outlined text-base hover:text-white cursor-pointer"
                >
                  image
                </button>
                <div className="h-3.5 w-px bg-white/10 mx-1"></div>
                <button 
                  type="button"
                  onClick={() => toast.info("Model: google/gemini-2.5-flash")}
                  className="p-1 rounded-lg hover:bg-white/5 transition-all material-symbols-outlined text-base hover:text-white cursor-pointer"
                >
                  model_training
                </button>
              </div>

              <div className="flex items-center px-3 py-2">
                <input 
                  ref={inputRef}
                  className="flex-1 bg-transparent border-none text-xs text-on-surface focus:ring-0 placeholder:text-on-surface-variant/40 outline-none pr-4" 
                  placeholder={`Command ${activeSpecialist.name}...`} 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={loading}
                />
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 rounded border border-white/10">
                    <span className="text-[9px] font-bold uppercase opacity-40">⌘</span>
                    <span className="text-[9px] font-bold uppercase opacity-40">K</span>
                  </div>
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || loading}
                    className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-lg hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:active:scale-100 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base font-bold">arrow_upward</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </form>

        {/* Ambient Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/3 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/2 blur-[100px]"></div>
        </div>

      </section>

    </div>
  );
}
