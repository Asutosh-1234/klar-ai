'use client'

import React from 'react';

export function CalendarConnectState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-surface-container-lowest text-on-surface text-center relative h-full">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>
      <div className="relative max-w-md w-full glass-card rounded-2xl p-8 flex flex-col items-center z-10">
        <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 gold-glow animate-pulse">
          <span className="material-symbols-outlined text-3xl">calendar_today</span>
        </div>
        <h2 className="text-sm font-bold text-white mb-2 tracking-tight uppercase">
          Connect Google Calendar
        </h2>
        <p className="text-on-surface-variant text-[11px] leading-relaxed mb-6 font-normal">
          Enable Klar AI to schedule, list, and modify events on your primary calendar. Synchronize your agenda for optimal focus blocks and workflow recommendations.
        </p>

        <div className="w-full border-t border-white/5 pt-5 mb-6 text-left">
          <h4 className="text-[9px] font-bold text-white uppercase tracking-wider mb-3 opacity-60">
            Requested Permissions:
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-[10px] text-on-surface-variant font-normal">
              <span className="material-symbols-outlined text-primary text-xs shrink-0">check_circle</span>
              <span>View your calendar schedule and event details</span>
            </li>
            <li className="flex items-start gap-2 text-[10px] text-on-surface-variant font-normal">
              <span className="material-symbols-outlined text-primary text-xs shrink-0">check_circle</span>
              <span>Create, edit, and delete calendar invites</span>
            </li>
            <li className="flex items-start gap-2 text-[10px] text-on-surface-variant font-normal">
              <span className="material-symbols-outlined text-primary text-xs shrink-0">check_circle</span>
              <span>Manage invitations and attendee response lists</span>
            </li>
          </ul>
        </div>

        <a
          href="/api/connect?plugin=googlecalendar"
          className="w-full py-2.5 bg-primary hover:brightness-110 active:scale-[0.98] transition-all text-background rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(242,202,80,0.2)] hover:shadow-[0_6px_20px_rgba(242,202,80,0.3)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-xs font-bold">link</span>
          Connect Google Calendar
        </a>
      </div>
    </div>
  );
}
