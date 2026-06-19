'use client'

import React, { useState } from 'react';

export interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: {
    summary: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
  }) => Promise<void>;
}

export function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        summary,
        description,
        eventDate,
        startTime,
        endTime
      });
      setSummary('');
      setDescription('');
    } catch (err) {
      console.error('Failed to submit event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container border border-primary/20 rounded-xl max-w-sm w-full p-6 shadow-2xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
          <h3 className="text-sm font-semibold text-white">Create Calendar Event</h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-on-surface-variant hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}
