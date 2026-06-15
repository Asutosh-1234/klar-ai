'use client'

import { useEffect, useRef, useState } from 'react';

interface GoogleEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  end?: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
  }[];
}

export function AetherCalendarView() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for creating an event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState(() => {
    // Default to tomorrow's date
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    return tom.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hours = [
    '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM',
    '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  // Align dates with Mon 12 - Sun 18 (June 2026 week from Stitch screens)
  const days = [
    { name: 'Mon', date: 12, isToday: false, dateObj: new Date('2026-06-15') },
    { name: 'Tue', date: 13, isToday: true, dateObj: new Date('2026-06-16') },
    { name: 'Wed', date: 14, isToday: false, dateObj: new Date('2026-06-17') },
    { name: 'Thu', date: 15, isToday: false, dateObj: new Date('2026-06-18') },
    { name: 'Fri', date: 16, isToday: false, dateObj: new Date('2026-06-19') },
    { name: 'Sat', date: 17, isToday: false, dateObj: new Date('2026-06-20') },
    { name: 'Sun', date: 18, isToday: false, dateObj: new Date('2026-06-21') },
  ];

  const fetchCalendarEvents = async () => {
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 530;
    }
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;

    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${eventDate}T${startTime}:00`).toISOString();
      const endDateTime = new Date(`${eventDate}T${endTime}:00`).toISOString();

      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: {
            summary,
            description,
            start: { dateTime: startDateTime },
            end: { dateTime: endDateTime }
          }
        })
      });

      if (res.ok) {
        setSummary('');
        setDescription('');
        setIsModalOpen(false);
        fetchCalendarEvents();
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/calendar?id=${eventId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCalendarEvents();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  // Helper to map event to column (Mon = 0, ..., Sun = 6) and position offsets
  const getPositionForEvent = (event: GoogleEvent) => {
    const startStr = event.start?.dateTime || event.start?.date;
    const endStr = event.end?.dateTime || event.end?.date;
    if (!startStr || !endStr) return null;

    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    // Limit events to the displayed week (June 15 - June 21, 2026)
    const weekStart = new Date('2026-06-15T00:00:00');
    const weekEnd = new Date('2026-06-21T23:59:59');
    if (startDate < weekStart || startDate > weekEnd) {
      return null;
    }

    // Get Day index (Mon = 0, ..., Sun = 6)
    // Javascript getDay() Sun=0, Mon=1...
    const day = startDate.getDay();
    const dayIndex = day === 0 ? 6 : day - 1;

    // Start hour and minute
    const startHour = startDate.getHours();
    const startMinute = startDate.getMinutes();

    // Since our list starts at 1 AM (index 0)
    const hourIndex = startHour - 1;
    const topPx = (hourIndex + startMinute / 60) * 64;

    // Duration
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

  const activeEvents = events;

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
              <div></div>

              {/* Horizontal Hour Gridlines */}
              <div className="absolute inset-0 pointer-events-none">
                {hours.map((_, idx) => (
                  <div key={idx} className="h-16 border-b border-white/3 w-full"></div>
                ))}
              </div>

              {/* Render Calendar Events */}
              {activeEvents.map((evt) => {
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(evt.id);
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

              {/* Current Time Indicator (Red line) - Tuesday 10:45 AM */}
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

        {/* Priority Meetings list from Google Calendar */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-40">Priority Meetings</h3>
          <div className="space-y-4">
            {activeEvents.slice(0, 3).map((evt) => {
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

      {/* Floating Action Button for Schedule creation */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform gold-glow z-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Event Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-primary/20 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <h3 className="text-sm font-semibold text-white">Create Calendar Event</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-on-surface-variant hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Board Alignment"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Description</label>
                <textarea
                  placeholder="Details of the event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Time (Start - End)</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded px-1.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                    <span className="text-[10px] opacity-40">-</span>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded px-1.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 bg-primary hover:brightness-110 text-on-primary rounded font-bold text-xs active:scale-[0.98] transition-all cursor-pointer flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Creating...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-xs">add</span>
                      <span>Schedule Event</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
