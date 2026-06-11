'use client'
import { signIn } from 'next-auth/react'

export function Pricing() {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  return (
    <section className="py-section-gap bg-background relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-20">
          <h2 className="font-headline-lg text-headline-lg font-semibold mb-4 text-on-background">Simple, transparent pricing.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">Choose the plan that fits your workflow.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="glass-card rounded-2xl p-8 flex flex-col border border-white/10">
            <div className="mb-8 text-left">
              <h3 className="font-headline-md text-headline-md text-on-background mb-2">Starter</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-on-background">$0</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1 text-left">
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Basic AI summaries
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                5 agent tasks/day
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Standard sync
              </li>
            </ul>
            <button 
              onClick={handleAuth}
              className="w-full py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative glass-card rounded-2xl p-8 flex flex-col border-2 border-primary-container bg-primary/5 shadow-[0_0_30px_rgba(88,86,214,0.15)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-container text-white text-xs font-bold rounded-full uppercase tracking-widest">
              Most Popular
            </div>
            <div className="mb-8 text-left">
              <h3 className="font-headline-md text-headline-md text-on-background mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-on-background">$29</span>
                <span className="text-on-surface-variant">/mo</span>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1 text-left">
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Unlimited AI agent tasks
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Priority support
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Advanced keyboard shortcuts
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Custom integrations
              </li>
            </ul>
            <button 
              onClick={handleAuth}
              className="w-full py-4 rounded-full bg-primary-container text-white font-semibold hover:scale-95 transition-all duration-200 glow-button cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-card rounded-2xl p-8 flex flex-col border border-white/10">
            <div className="mb-8 text-left">
              <h3 className="font-headline-md text-headline-md text-on-background mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-on-background">Custom</span>
              </div>
            </div>
            <ul className="flex flex-col gap-4 mb-10 flex-1 text-left">
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Dedicated AI training
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                SAML/SSO
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                Unlimited team seats
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
                White-glove onboarding
              </li>
            </ul>
            <button 
              onClick={handleAuth}
              className="w-full py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
