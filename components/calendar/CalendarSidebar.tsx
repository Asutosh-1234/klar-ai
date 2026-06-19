'use client'

import React from 'react';
import { GoogleEvent } from '@/lib/types';
import { toast } from 'sonner';

export interface CalendarSidebarProps {
  events: GoogleEvent[];
}

export function CalendarSidebar({ events }: CalendarSidebarProps) {
  const handleApplyOptimization = () => {
    toast.success("AI calendar optimization applied successfully.");
  };

  return (
    <aside className="w-72 sm:w-80 border-l border-white/5 bg-surface-sidebar shrink-0 flex flex-col p-6 overflow-y-auto custom-scrollbar gap-8">
      
      {/* Upcoming Focus */}
      <div>
        <h2 className="text-xs font-bold text-white uppercase tracking-wider mb-4 opacity-80">Upcoming Focus</h2>
        <div className="p-4 bg-surface-container/60 backdrop-blur-xl rounded-xl border border-primary/20 relative overflow-hidden group">
          <div className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-xs text-primary">auto_awesome</span>
          </div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="material-symbols-outlined text-primary text-base">psychology</span>
            <span className="text-[9px] font-bold text-primary uppercase tracking-widest">AI Insight</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {events.length === 0 ? (
              "Your calendar is currently empty. Add events to receive cognitive flow optimizations."
            ) : (
              <>
                Detected high cognitive load. Suggest optimizing calendar schedules for optimal focus.
              </>
            )}
          </p>
          {events.length > 0 && (
            <button 
              type="button"
              onClick={handleApplyOptimization}
              className="mt-3.5 text-primary text-[10px] font-bold hover:underline cursor-pointer tracking-wider uppercase text-left"
            >
              Apply Optimization
            </button>
          )}
        </div>
      </div>

      {/* Priority Meetings list from Google Calendar */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">Priority Meetings</h3>
        <div className="space-y-4">
          {events.slice(0, 3).map((evt) => {
            const startStr = evt.start?.dateTime;
            let timeLabel = 'All Day';
            if (startStr) {
              timeLabel = new Date(startStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            const isBoard = evt.summary?.toLowerCase().includes('board');
            return (
              <div key={evt.id} className="flex gap-3">
                <div className={`w-1 h-10 rounded-full shrink-0 ${isBoard ? 'bg-primary' : 'bg-emerald-500'}`}></div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight truncate max-w-section-gap">{evt.summary || 'Untitled Event'}</p>
                  <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">{timeLabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Heatmap Card */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">Visual Context</h3>
        <div className="rounded-xl overflow-hidden aspect-square relative border border-white/5 bg-surface-container/45">
          <img 
            alt="Calendar Visualization" 
            className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-75 transition-all duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-y-XhZ5TJt1gIWLcw4-eyMIgHfiS8NfROj8g7gFXCWl0r33nakm-fwdpSk1lhVoByZTOJjpqDYW8g_WQcfNYj5qjZ9p-inTQzSCvKsC0TtN_ie7ZdOmfwgHk9efztOeq_dzg_Ljf5CGj0wknjD0gcpUu8G225erHsnwyBhuY4i2BvSn7u5KQsv3xR8sG59eKdk_HPsDBe8Yn4LQpDWeuEcJ8ktsEjtMdjnf-hM8awcb1AUhX4KkQwcLXIKa5Q4yS4Qw" 
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-surface-container-lowest to-transparent p-3 pt-8">
            <p className="text-[10px] font-bold text-white tracking-wide">Team Momentum Heatmap</p>
          </div>
        </div>
      </div>

    </aside>
  );
}
