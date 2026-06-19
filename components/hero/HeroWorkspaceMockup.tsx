'use client'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export function HeroWorkspaceMockup() {
  return (
    <div className="lg:col-span-6 relative perspective-[2000px] w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 12, rotateY: -12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, rotateX: 6, rotateY: -6, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        whileHover={{ rotateX: 0, rotateY: 0, scale: 1.02, transition: { duration: 0.6, ease: "easeOut" } }}
        className="relative w-full max-w-[480px] md:max-w-none glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Window Header */}
        <div className="bg-surface-panel px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
          </div>
          <div className="font-mono text-[9px] text-on-surface/40 tracking-wider">Klar Workspace</div>
          <div className="w-8"></div>
        </div>

        {/* Workspace Body */}
        <div className="p-4 bg-surface-sidebar min-h-[380px] flex gap-4">
          {/* Sidebar */}
          <div className="w-14 flex flex-col gap-6 py-4 items-center border-r border-white/5 shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
            <span className="material-symbols-outlined text-on-surface/30 text-[20px]">calendar_today</span>
            <span className="material-symbols-outlined text-on-surface/30 text-[20px]">smart_toy</span>
            <span className="material-symbols-outlined text-on-surface/30 text-[20px]">monitoring</span>
          </div>

          {/* Content Panel */}
          <div className="flex-1 py-2 flex flex-col gap-3">
            <div className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Inbox — Recent</div>

            {/* Inbox Rows */}
            <div className="flex flex-col gap-2.5">
              <div className="bg-surface-card/60 p-4 rounded-xl border border-white/5 flex justify-between items-center group shadow-md shadow-black/20">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-bold text-white text-xs truncate">Client Portfolio Review</span>
                  <span className="text-[10px] text-on-surface/50 truncate">From: Jonathan Sterling</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary text-[8px] px-2 py-0.5 rounded-full border border-primary/20 font-bold uppercase tracking-wider shrink-0 shadow-[0_0_10px_rgba(242,202,80,0.1)] h-auto"
                >
                  AI Draft Ready
                </Badge>
              </div>

              <div className="bg-surface-card/20 p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-60">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-bold text-white text-xs truncate">Quarterly Board Meeting</span>
                  <span className="text-[10px] text-on-surface/50 truncate">From: Sarah Vance</span>
                </div>
              </div>

              <div className="bg-surface-card/10 p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-40">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-bold text-white text-xs truncate">Strategy Update</span>
                  <span className="text-[10px] text-on-surface/50 truncate">From: Michael Chen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Agent Logs */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut"
        }}
        className="absolute -right-4 -bottom-6 md:-right-8 md:bottom-50 w-60 md:w-64 surface-panel rounded-2xl p-4 shadow-2xl border-l-2 border-primary z-30"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          <span className="font-mono text-[9px] text-primary uppercase font-bold tracking-wider">Agent Active</span>
        </div>
        <div className="space-y-1.5 font-mono text-[10px] text-left">
          <div className="text-on-surface/60">&gt; Analyzing 47 emails...</div>
          <div className="text-on-surface/60">&gt; Found scheduling conflict</div>
          <div className="text-primary font-bold">&gt; Rescheduling Client Call...</div>
          <div className="text-on-surface/60">&gt; 3 drafts generated.</div>
        </div>
      </motion.div>
    </div>
  )
}
