'use client'

import { useEffect, useRef } from 'react';

export function AetherCalendarView() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to 9:30 AM area (~600px) on load for a better initial view
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 530;
    }
  }, []);

  const hours = [
    '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM',
    '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  const days = [
    { name: 'Mon', date: 12, isToday: false },
    { name: 'Tue', date: 13, isToday: true },
    { name: 'Wed', date: 14, isToday: false },
    { name: 'Thu', date: 15, isToday: false },
    { name: 'Fri', date: 16, isToday: false },
    { name: 'Sat', date: 17, isToday: false },
    { name: 'Sun', date: 18, isToday: false },
  ];

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-surface-container-lowest text-on-surface">
      {/* Calendar Grid Container (Left) */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Days Header */}
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

        {/* Scrolling Grid Timeline */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar relative bg-surface-container-lowest"
        >
          <div className="flex min-h-[1472px] relative"> {/* 23 hours * 64px */}
            
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
              <div></div> {/* Last column without right border */}

              {/* Horizontal Hour Gridlines */}
              <div className="absolute inset-0 pointer-events-none">
                {hours.map((_, idx) => (
                  <div key={idx} className="h-16 border-b border-white/3 w-full"></div>
                ))}
              </div>

              {/* Event Cards (Absolute Positioned Mocks) */}
              
              {/* Event 1: Board Alignment - Tuesday (Col 2) 9:30 AM - 11:00 AM */}
              {/* Top: 9.5 hours * 64px = 608px. Height: 1.5 hours * 64px = 96px */}
              <div 
                className="absolute left-[calc(14.28%+4px)] top-[544px] w-[calc(14.28%-8px)] h-[96px] z-10 bg-surface-container-high/80 backdrop-blur-md border border-primary/20 border-l-4 border-l-primary rounded-lg p-2.5 shadow-lg flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200 cursor-pointer"
                title="Board Alignment"
              >
                <div>
                  <h4 className="font-semibold text-[11px] text-primary truncate leading-tight">Board Alignment</h4>
                  <p className="text-[9px] text-on-surface-variant mt-0.5">09:30 - 11:00</p>
                </div>
                <div className="flex items-center -space-x-1.5 mt-1 overflow-hidden">
                  <div className="w-4 h-4 rounded-full border border-surface-container-high bg-zinc-500 text-[8px] flex items-center justify-center font-bold">MV</div>
                  <div className="w-4 h-4 rounded-full border border-surface-container-high bg-primary/40 text-[8px] flex items-center justify-center font-bold text-white">AV</div>
                </div>
              </div>

              {/* Event 2: Deep Focus Session - Wednesday (Col 3) 11:00 AM - 1:00 PM */}
              {/* Top: 11 hours * 64px = 704px. Height: 2 hours * 64px = 128px */}
              <div 
                className="absolute left-[calc(28.56%+4px)] top-[640px] w-[calc(14.28%-8px)] h-[128px] z-10 bg-surface-container-high/80 backdrop-blur-md border border-emerald-500/20 border-l-4 border-l-emerald-500 rounded-lg p-2.5 shadow-lg flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200 cursor-pointer"
                title="Deep Focus Session"
              >
                <div>
                  <h4 className="font-semibold text-[11px] text-white truncate leading-tight">Deep Focus Session</h4>
                  <p className="text-[9px] text-on-surface-variant mt-0.5">11:00 - 13:00</p>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-xs self-end opacity-60">lock</span>
              </div>

              {/* Current Time Indicator (Red line) - Tuesday 10:45 AM (Col 2) */}
              {/* Top: 10.75 hours * 64px = 688px */}
              <div className="absolute left-0 right-0 top-[624px] flex items-center z-20 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-error ml-[-5px] shadow-[0_0_8px_rgba(255,180,171,0.8)]"></div>
                <div className="h-0.5 flex-1 bg-error/50"></div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Focus Area Side Panel (Right) */}
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
              Detected heavy cognitive load this afternoon. Suggest moving <span className="text-primary font-medium">&ldquo;Project Nexus&rdquo;</span> to tomorrow at 09:00 for optimal flow.
            </p>
            <button className="mt-3.5 text-primary text-[10px] font-bold hover:underline cursor-pointer tracking-wider uppercase">
              Apply Optimization
            </button>
          </div>
        </div>

        {/* Priority Meetings list */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">Priority Meetings</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-1 h-10 bg-primary rounded-full shrink-0"></div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Series D Funding Recap</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">2:00 PM - 3:30 PM</p>
              </div>
            </div>
            <div className="flex gap-3 opacity-60">
              <div className="w-1 h-10 bg-white/20 rounded-full shrink-0"></div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">Weekly Stand-up</p>
                <p className="text-[10px] text-on-surface-variant opacity-60 mt-0.5">4:00 PM - 4:15 PM</p>
              </div>
            </div>
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
    </div>
  );
}
