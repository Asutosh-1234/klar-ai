'use client'

import { useEffect, useState } from 'react';
import { GoogleEvent } from '@/lib/types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarTimeline } from './CalendarTimeline';
import { CalendarSidebar } from './CalendarSidebar';
import { CalendarConnectState } from './CalendarConnectState';
import { CreateEventModal } from './CreateEventModal';

export function KlarCalendarView() {
  const [events, setEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hours = [
    '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM',
    '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM',
    '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  const [currentDate] = useState(() => new Date());
  const [now, setNow] = useState(() => new Date());

  // Real-time ticking for time indicator
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getStartOfWeek = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const days = Array.from({ length: 7 }).map((_, idx) => {
    const d = getStartOfWeek(new Date(currentDate));
    d.setDate(d.getDate() + idx);
    const isToday = d.toDateString() === new Date().toDateString();
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      isToday,
      dateObj: d,
    };
  });

  const fetchCalendarEvents = async () => {
    try {
      const res = await fetch('/api/calendar');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        setIsConnected(data.connected !== false);
      } else {
        try {
          const errData = await res.json();
          if (errData.connected === false) {
            setIsConnected(false);
          }
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const handleCreateEvent = async (eventData: {
    summary: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
  }) => {
    const startDateTime = new Date(`${eventData.eventDate}T${eventData.startTime}:00`).toISOString();
    const endDateTime = new Date(`${eventData.eventDate}T${eventData.endTime}:00`).toISOString();

    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: {
          summary: eventData.summary,
          description: eventData.description,
          start: { dateTime: startDateTime },
          end: { dateTime: endDateTime }
        }
      })
    });

    if (res.ok) {
      setIsModalOpen(false);
      fetchCalendarEvents();
    } else {
      throw new Error('Failed to create calendar event');
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-surface-container-lowest text-on-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/40">Synchronizing Schedule...</span>
        </div>
      </div>
    );
  }

  if (isConnected === false) {
    return <CalendarConnectState />;
  }

  return (
    <div className="flex-1 flex overflow-hidden h-full bg-surface-container-lowest text-on-surface">
      {/* Calendar Grid Container (Left) */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <CalendarHeader days={days} />
        <CalendarTimeline 
          days={days} 
          hours={hours} 
          events={events} 
          now={now} 
          onDeleteEvent={handleDeleteEvent} 
        />
      </div>

      <CalendarSidebar events={events} />

      {/* Floating Action Button for Schedule creation */}
      <button 
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform gold-glow z-50 cursor-pointer"
      >
        <span className="material-symbols-outlined text-black text-[34px]">add</span>
      </button>

      {/* Event Creation Modal */}
      <CreateEventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateEvent} 
      />
    </div>
  );
}
