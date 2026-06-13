'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'

export function Hero() {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  const [typedText, setTypedText] = useState('')
  const fullText = "Reply to all client emails and reschedule tomorrow's meetings."

  useEffect(() => {
    let index = 0
    let isDeleting = false
    let timer: NodeJS.Timeout

    const tick = () => {
      const current = fullText.slice(0, index)
      setTypedText(current)

      if (!isDeleting) {
        index++
        if (index > fullText.length) {
          isDeleting = true
          timer = setTimeout(tick, 1000) // Pause at the end
        } else {
          timer = setTimeout(tick, 50) // Typing speed
        }
      } else {
        index--
        if (index < 0) {
          isDeleting = false
          timer = setTimeout(tick, 500) // Pause before restarting
        } else {
          timer = setTimeout(tick, 30) // Deleting speed
        }
      }
    }

    tick()
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative min-h-[921px] flex items-center justify-center py-24 px-gutter overflow-hidden bg-background">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>

      {/* Floating Animated Radial Glows */}
      <div className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[110px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-[20%] right-[20%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '-6s' }}></div>

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        {/* Left Column: Heading, command bar and CTAs */}
        <div className="lg:col-span-6 text-left flex flex-col items-start z-10">
          {/* Entrance tag badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">The Future of Work</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-white"
          >
            Your Executive AI Assistant <span className="text-primary block md:inline">For Email &amp; Calendar</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="text-base md:text-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed font-normal"
          >
            Manage emails, schedule meetings, organize your calendar, and automate work using natural language. Experience the luxury of absolute focus.
          </motion.p>

          {/* Command Bar Centerpiece */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="w-full glass-panel gold-glow rounded-xl p-4 flex items-center gap-3 max-w-xl relative group transition-all duration-300 border border-white/10 bg-[#192029]/60 backdrop-blur-xl mb-8"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">comment</span>
            <div className="flex-1 text-xs md:text-sm text-on-surface/90 font-medium font-mono min-w-0 truncate">
              <span>{typedText}</span><span className="command-cursor"></span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <span className="bg-surface-card px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono font-bold">⌘</span>
              <span className="bg-surface-card px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-mono font-bold">K</span>
            </div>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.60 }}
            className="flex gap-4 mb-10"
          >
            <button
              onClick={handleAuth}
              className="px-6 py-3 rounded-full bg-primary text-black font-semibold text-xs hover:scale-95 transition-all duration-200 glow-button flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10"
            >
              Get Started <span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>arrow_forward</span>
            </button>
            <button
              onClick={handleAuth}
              className="px-6 py-3 rounded-full bg-transparent border border-white/20 text-white font-semibold text-xs hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Request Demo
            </button>
          </motion.div>

          {/* Social Proof avatars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-surface-card shadow-lg">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJHj5C3rmaZFTeZj9ErBV2co6jpaYhF6hoyjbOOdLRE9riMZHmDcVvVbu0A6YaWJoHIeW-Eqvw-W6YhpTWyzPJUxQxX-go_kyMzbrs8VuHkat4r-7P5Q7v4R_CuS7f4OqGFU8rT7iQM75UUGOQ4rVWqNUfj-RwNEHGMAxSnGFu9raoVRT-2XQw9C4ZxFiCAJA3hnThEuqD8avqipiVCfVr7unJFWH2WqVKkatefnQDM69RRDAHWIqt" alt="Executive" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background overflow-hidden bg-surface-card shadow-lg">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXu8xZ7P4bQ2sF2WZCDh5X2lj_rQR_cGgx-MhAGC8JEzrRMhE57rGqjtamnWtjg_2WZqKTGJ1aLpD6RBN6viplWu7Wnn__JRLyFV_u5N8yospB-zv3M6cnV3oIdaddw9IRJ0_9X7JF0lxiTCBA5DT1S89NUxYjM_wKP5oGy0bhqPW4nT2XSSeC2VxTHWIPkdPhE-mrN95YBEMm8u0INYg0xv2OHQMA80rS1N8o-AbZppWPlThSVARiE" alt="Executive" className="w-full h-full object-cover" />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-background bg-primary-container flex items-center justify-center shadow-lg border-primary/20">
                <span className="text-primary font-bold text-[9px]">+5k</span>
              </div>
            </div>
            <span className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-wider">Trusted by Fortune 500 Leaders</span>
          </motion.div>
        </div>

        {/* Right Column: Visual Dashboard Mockup */}
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
              <div className="font-mono text-[9px] text-on-surface/40 tracking-wider">Aether Workspace</div>
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
                    <span className="bg-primary/10 text-primary text-[8px] px-2 py-0.5 rounded-full border border-primary/20 font-bold uppercase tracking-wider shrink-0 shadow-[0_0_10px_rgba(242,202,80,0.1)]">
                      AI Draft Ready
                    </span>
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
              duration: 4 ,
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
      </div>
    </section>
  )
}
