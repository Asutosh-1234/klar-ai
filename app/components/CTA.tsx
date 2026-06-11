'use client'
import { signIn } from 'next-auth/react'

export function CTA() {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  return (
    <section className="py-section-gap border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full w-[800px] h-[800px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="max-w-3xl mx-auto px-gutter text-center relative z-10 flex flex-col items-center">
        <h2 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl mb-6 text-on-background">Take control today.</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">Join thousands of high-performers saving hours every week.</p>
        <button 
          onClick={handleAuth}
          className="px-10 py-5 rounded-full bg-primary-container text-white font-semibold text-lg hover:scale-95 transition-transform duration-200 glow-button flex items-center gap-3 cursor-pointer"
        >
          Get Started Free <span className="material-symbols-outlined">rocket_launch</span>
        </button>
      </div>
    </section>
  )
}
