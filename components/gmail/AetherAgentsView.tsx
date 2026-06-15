'use client'

import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Idle' | 'Active' | 'Optimizing';
  description: string;
  tasksCompleted: number;
  accuracy: string;
}

export function AetherAgentsView() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'ag_1',
      name: 'Lumina Lead Negotiator',
      role: 'Inbox & Drafts Automation',
      status: 'Active',
      description: 'Automatically analyzes incoming strategic inquiries from Lumina and drafts contextual response suggestions.',
      tasksCompleted: 48,
      accuracy: '99.2%',
    },
    {
      id: 'ag_2',
      name: 'Aether Purchases Auditor',
      role: 'Financial Compliance',
      status: 'Active',
      description: 'Scans and matches email purchase confirmations to Bank transactions, categorizing AWS and OpenAI spend.',
      tasksCompleted: 124,
      accuracy: '98.5%',
    },
    {
      id: 'ag_3',
      name: 'Cognitive Flow Scheduler',
      role: 'Calendar Optimization',
      status: 'Optimizing',
      description: 'Learns user work habits, detects heavy calendar density, and automatically schedules or suggests reschedule flow.',
      tasksCompleted: 12,
      accuracy: '94.0%',
    },
  ]);

  const toggleAgent = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: a.status === 'Idle' ? 'Active' : 'Idle'
        };
      }
      return a;
    }));
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-surface text-on-surface custom-scrollbar">
      <div className="p-8 max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span className="text-[10px] font-bold uppercase tracking-widest">Autonomous Intelligence</span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-white">AI Agents</h2>
          <p className="text-xs text-on-surface-variant mt-2 max-w-md opacity-80 leading-relaxed">
            Monitor and configure Klar&apos;s background intelligence agents orchestrating your business operations.
          </p>
        </div>

        {/* Bento Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface-container/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-28">
            <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">Active Agents</span>
            <span className="text-2xl font-bold text-white">3 <span className="text-xs font-normal text-primary">online</span></span>
          </div>
          <div className="bg-surface-container/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-28">
            <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">Automated Actions</span>
            <span className="text-2xl font-bold text-white">184 <span className="text-xs font-normal text-on-surface-variant">this week</span></span>
          </div>
          <div className="bg-surface-container/60 border border-white/5 rounded-xl p-5 flex flex-col justify-between h-28">
            <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase">Avg. Accuracy</span>
            <span className="text-2xl font-bold text-white">97.2% <span className="text-xs font-normal text-emerald-400">verified</span></span>
          </div>
        </div>

        {/* Agents Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-surface-container/60 border border-white/5 rounded-xl p-6 flex flex-col justify-between relative hover:border-primary/20 transition-all shadow-lg">
              
              {/* Agent Title block */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-base leading-tight">{agent.name}</h3>
                    <p className="text-[10px] text-primary uppercase mt-1 font-semibold tracking-wider">{agent.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`relative flex h-2.5 w-2.5`}>
                      {agent.status !== 'Idle' && (
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          agent.status === 'Active' ? 'bg-primary' : 'bg-amber-400'
                        }`}></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        agent.status === 'Active' 
                          ? 'bg-primary' 
                          : agent.status === 'Optimizing' 
                            ? 'bg-amber-400' 
                            : 'bg-zinc-600'
                      }`}></span>
                    </span>
                    <span className="text-[10px] font-semibold opacity-80 text-white">{agent.status}</span>
                  </div>
                </div>
                
                <p className="text-xs text-on-surface-variant leading-relaxed opacity-80 mb-6">
                  {agent.description}
                </p>
              </div>

              {/* Agent Footer stats */}
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] text-on-surface-variant uppercase opacity-60">Completed</p>
                    <p className="text-xs font-bold text-white font-mono">{agent.tasksCompleted} tasks</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-on-surface-variant uppercase opacity-60">Accuracy</p>
                    <p className="text-xs font-bold text-white font-mono">{agent.accuracy}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleAgent(agent.id)}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                    agent.status === 'Idle' 
                      ? 'bg-primary border-primary text-on-primary hover:brightness-110' 
                      : 'border-white/10 hover:bg-white/5 text-white'
                  }`}
                >
                  {agent.status === 'Idle' ? 'Enable' : 'Disable'}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
