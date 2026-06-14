'use client'
import { signIn } from 'next-auth/react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function CTA() {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-gutter relative z-10">
        <Card className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden flex flex-col items-center border-white/5 ring-0 border-0 bg-transparent shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
          {/* Inner accent ring */}
          <div className="absolute inset-0 border border-primary/5 rounded-3xl pointer-events-none"></div>
          
          <Badge variant="outline" className="inline-flex items-center gap-2 px-3 py-1 h-auto rounded-full bg-primary/10 border-primary/20 mb-6 z-10 text-primary">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Executive Autopilot</span>
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight max-w-2xl z-10">
            Reclaim Your Time Today
          </h2>
          
          <p className="text-sm md:text-base text-on-surface-variant mb-10 max-w-lg leading-relaxed z-10 font-normal">
            Join 5,000+ executives who have automated their communication and reclaimed 10+ hours every week.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 z-10">
            <Button 
              onClick={handleAuth}
              className="h-11 px-8 rounded-full bg-primary text-black font-semibold text-xs hover:scale-95 transition-all duration-200 glow-button flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/15 border-0"
            >
              Start Your Free Trial <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Button>
            <Button 
              onClick={handleAuth}
              variant="outline"
              className="h-11 px-8 rounded-full bg-white/5 hover:bg-white/10 border-white/10 text-white font-semibold text-xs transition-colors duration-200 cursor-pointer"
            >
              Request a Demo
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
