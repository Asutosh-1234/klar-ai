'use client'
import { signIn } from 'next-auth/react'

export function Hero() {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  return (
    <section className="relative min-h-[921px] flex flex-col items-center justify-center px-gutter overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-50"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">V2.0 is now live</span>
        </div>

        <h1 className="font-display-xl text-display-xl text-gradient mb-6">
          Your inbox,<br/>on autopilot
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Klar AI is the intelligent agent that manages your Gmail and Calendar via natural language and keyboard shortcuts. Built for absolute speed.
        </p>

        <div className="flex gap-4 mb-20">
          <button 
            onClick={handleAuth}
            className="px-8 py-4 rounded-full bg-primary-container text-white font-semibold hover:scale-95 transition-all duration-200 glow-button flex items-center gap-2 cursor-pointer"
          >
            Get Started <span className="material-symbols-outlined" style={{ fontSize: '1.2em' }}>arrow_forward</span>
          </button>
          <button 
            className="px-8 py-4 rounded-full bg-transparent border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-200 cursor-pointer"
          >
            View Demo
          </button>
        </div>

        {/* 3D Mockup Container */}
        <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[600px] [perspective:2000px] mb-8">
          <div className="absolute inset-0 bg-surface-container rounded-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden transform [transform:rotateX(15deg)_rotateY(-10deg)_scale(0.95)] transition-transform duration-700 hover:[transform:rotateX(5deg)_rotateY(0deg)_scale(1)] flex flex-col">
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-surface-container-highest">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-white/20"></div>
              </div>
              <div className="mx-auto px-4 py-1 rounded bg-black/40 font-mono text-xs text-on-surface-variant">⌘K to search commands</div>
            </div>
            
            {/* Mockup Body */}
            <div className="flex-1 flex bg-[#0d0d12] p-6 gap-6 relative">
              {/* Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-2">
                <div className="h-8 rounded bg-white/5 w-full"></div>
                <div className="h-8 rounded bg-white/5 w-3/4"></div>
                <div className="h-8 rounded bg-white/5 w-5/6"></div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-4 text-left">
                {/* Search/Input */}
                <div className="h-14 rounded-xl bg-surface border border-white/10 flex items-center px-4 shadow-[0_0_15px_rgba(88,86,214,0.1)]">
                  <span className="material-symbols-outlined text-primary mr-3">bolt</span>
                  <span className="font-mono text-sm text-on-surface-variant">Reschedule my meeting with Alex to tomorrow at 2 PM...</span>
                </div>
                
                {/* List items */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5 flex items-center px-4 opacity-100"></div>
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5 flex items-center px-4 opacity-80"></div>
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5 flex items-center px-4 opacity-60"></div>
                  <div className="h-16 rounded-lg bg-white/5 border border-white/5 flex items-center px-4 opacity-40"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
