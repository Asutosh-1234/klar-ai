'use client'

import React from 'react';

export interface CalendarHeaderProps {
  days: {
    name: string;
    date: number;
    isToday: boolean;
    dateObj: Date;
  }[];
}

export function CalendarHeader({ days }: CalendarHeaderProps) {
  return (
    <div className="flex border-b border-white/5 bg-surface-container-low/50 sticky top-0 z-30 shrink-0">
      <div className="w-16 sm:w-20 border-r border-white/5 shrink-0"></div>
      <div className="flex-1 grid grid-cols-7">
        {days.map((day) => (
          <div 
            key={day.date} 
            className={`py-3 text-center border-r border-white/5 last:border-r-0 ${
              day.isToday ? 'bg-primary/5' : ''
            }`}
          >
            <span className={`block text-[10px] font-bold uppercase tracking-wider ${
              day.isToday ? 'text-primary' : 'text-on-surface-variant opacity-40'
            }`}>
              {day.name}
            </span>
            <span className={`text-base font-semibold ${
              day.isToday ? 'text-primary' : 'text-white'
            }`}>
              {day.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
