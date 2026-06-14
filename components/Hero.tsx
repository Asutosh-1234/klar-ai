'use client'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { HeroCommandBar } from './hero/HeroCommandBar'
import { HeroSocialProof } from './hero/HeroSocialProof'
import { HeroWorkspaceMockup } from './hero/HeroWorkspaceMockup'

export function Hero() {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  return (
    <section className="relative min-h-[710px] flex items-center justify-center px-gutter overflow-hidden bg-background">
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
          >
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 px-3 py-1.5 h-auto rounded-full bg-white/5 border-white/10 mb-6 backdrop-blur-sm text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="font-mono text-[9px] uppercase tracking-widest font-bold">The Future of Work</span>
            </Badge>
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
          <HeroCommandBar />

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.60 }}
            className="flex gap-4 mb-10"
          >
            <Button
              onClick={handleAuth}
              className="h-11 px-6 rounded-full bg-primary text-black font-semibold text-xs hover:scale-[0.98] transition-all duration-200 glow-button flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/10 border-0"
            >
              Get Started <span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>arrow_forward</span>
            </Button>
            <Button
              onClick={handleAuth}
              variant="outline"
              className="h-11 px-6 rounded-full bg-transparent border-white/20 text-white font-semibold text-xs hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
            >
              Request Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <HeroSocialProof />
        </div>

        {/* Right Column: Visual Dashboard Mockup */}
        <HeroWorkspaceMockup />
      </div>
    </section>
  )
}
