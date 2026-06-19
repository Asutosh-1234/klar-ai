'use client'

import React, { useEffect, useRef } from 'react';
import { GoogleEvent } from '@/lib/types';

export interface CalendarTimelineProps {
  days: {
    name: string;
    date: number;
    isToday: boolean;
    dateObj: Date;
  }[];
  hours: string[];
  events: GoogleEvent[];
  now: Date;
  onDeleteEvent: (eventId: string) => Promise<void>;
}

export function CalendarTimeline({ days, hours, events, now, onDeleteEvent }: CalendarTimelineProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 530;
    }
  }, []);

  const getPositionForEvent = (event: GoogleEvent) => {
    const startStr = event.start?.dateTime || event.start?.date;
    const endStr = event.end?.dateTime || event.end?.date;
    if (!startStr || !endStr) return null;

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    const weekStart = new Date(days[0].dateObj);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(days[6].dateObj);
    weekEnd.setHours(23, 59, 59, 999);
    if (startDate < weekStart || startDate > weekEnd) {
      return null;
    }

    const day = startDate.getDay();
    const dayIndex = day === 0 ? 6 : day - 1;

    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();

    const hourIndex = startHour - 1;
    const topPx = (hourIndex + startMinute / 60) * 64;

    const durationMs = endDate.getTime() - startDate.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    const heightPx = Math.max(durationHours * 64, 32);

    return {
      left: `${dayIndex * 14.28 + 0.5}%`,
      top: `${topPx}px`,
      width: `${14.28 - 1}%`,
      height: `${heightPx}px`,
    };
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto custom-scrollbar relative bg-surface-container-lowest"
    >
      <div className="flex min-h-[1472px] relative">
        
        {/* Hour Labels */}
        <div className="w-16 sm:w-20 shrink-0 flex flex-col text-right pr-3 pt-2 border-r border-white/5 select-none bg-surface-container-lowest/80 backdrop-blur-sm z-10 sticky left-0">
          {hours.map((hour, idx) => (
            <div key={idx} className="h-16 text-[10px] font-semibold text-on-surface-variant opacity-40">
              {hour}
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="flex-1 grid grid-cols-7 relative">
          {/* Vertical Day Gridlines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-r border-white/5 h-full"></div>
          ))}
          <div></div>

          {/* Horizontal Hour Gridlines */}
          <div className="absolute inset-0 pointer-events-none">
            {hours.map((_, idx) => (
              <div key={idx} className="h-16 border-b border-white/3 w-full"></div>
            ))}
          </div>

          {/* Render Calendar Events */}
          {events.map((evt) => {
            const pos = getPositionForEvent(evt);
            if (!pos) return null;

            const isBoard = evt.summary?.toLowerCase().includes('board');
            
            return (
              <div 
                key={evt.id} 
                style={pos}
                className={`absolute z-10 bg-surface-container-high/80 backdrop-blur-md border rounded-lg p-2.5 shadow-lg flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200 group/evt cursor-pointer ${
                  isBoard
                    ? 'border-primary/20 border-l-4 border-l-primary'
                    : 'border-emerald-500/20 border-l-4 border-l-emerald-500'
                }`}
                title={`${evt.summary}: ${evt.description || ''}`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h4 className={`font-semibold text-[11px] truncate leading-tight ${
                      isBoard ? 'text-primary' : 'text-white'
                    }`}>
                      {evt.summary || 'No Title'}
                    </h4>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(evt.id);
                      }}
                      className="text-on-surface-variant hover:text-error opacity-0 group-hover/evt:opacity-100 transition-opacity p-0.5"
                    >
                      <span className="material-symbols-outlined text-[10px]">delete</span>
                    </button>
                  </div>
                  {evt.description && (
                    <p className="text-[9px] text-on-surface-variant/70 truncate mt-0.5">{evt.description}</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[9px] text-on-surface-variant font-mono">
                    {evt.start?.dateTime 
                      ? new Date(evt.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
                      : 'All Day'
                    }
                  </span>
                  {isBoard && (
                    <div className="flex items-center -space-x-1 mt-1 overflow-hidden shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full border border-surface-container-high bg-zinc-500 text-[6px] flex items-center justify-center font-bold">MV</div>
                      <div className="w-3.5 h-3.5 rounded-full border border-surface-container-high bg-primary/40 text-[6px] flex items-center justify-center font-bold text-white">AV</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Dynamic Current Time Indicator */}
          {(() => {
            const todayIndex = days.findIndex(d => d.isToday);
            if (todayIndex === -1) return null;

            const startHour = now.getHours();
            const startMinute = now.getMinutes();

            if (startHour < 1 || startHour > 23) return null;

            const hourIndex = startHour - 1;
            const topPx = (hourIndex + startMinute / 60) * 64;

            return (
              <div 
                style={{ top: `${topPx}px` }}
                className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-error ml-[-5px] shadow-[0_0_8px_rgba(255,180,171,0.8)]"></div>
                <div className="h-0.5 flex-1 bg-error/50"></div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
