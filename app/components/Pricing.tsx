'use client'
import { signIn } from 'next-auth/react'

export function Pricing() {
  const handleAuth = (e: React.MouseEvent) => {
    e.preventDefault()
    signIn('google', { callbackUrl: '/connect' })
  }

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-gutter relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider font-mono">Pricing Plans</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            Chosen by High-Performers
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Select the tier that matches your executive demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Professional Plan */}
          <div className="glass-card interactive-card hover:-translate-y-1 rounded-2xl p-8 flex flex-col border border-white/5 relative overflow-hidden bg-surface-panel/40">
            <div className="mb-8 text-left">
              <span className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block mb-2">Professional</span>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-white tracking-tight">$49</span>
                <span className="text-xs text-on-surface-variant font-medium">/mo</span>
              </div>
              <p className="text-xs text-on-surface-variant">For individuals scaling their focus.</p>
            </div>
            
            <div className="w-full h-px bg-white/5 mb-8"></div>

            <ul className="flex flex-col gap-4 mb-10 flex-1 text-left text-sm">
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                Email &amp; Calendar Drafting
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                1,000 AI Actions / mo
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                Standard Sync Speed
              </li>
            </ul>

            <button 
              onClick={handleAuth}
              className="w-full py-3 rounded-full border border-white/10 text-white font-semibold text-xs hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Executive Plan (Featured Gold) */}
          <div className="relative glass-card interactive-card hover:-translate-y-1 rounded-2xl p-8 flex flex-col border-2 border-primary bg-primary-container shadow-[0_20px_50px_rgba(242,202,80,0.15)] overflow-hidden scale-105">
            {/* Spotlight reflection */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-b from-primary/10 to-transparent pointer-events-none"></div>
            
            <div className="absolute -top-3 px-4 py-1 bg-primary text-black text-[9px] font-bold rounded-full uppercase tracking-wider shadow-md left-1/2 -translate-x-1/2">
              Most Popular
            </div>
            
            <div className="mb-8 text-left relative z-10 mt-2">
              <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider block mb-2">Executive</span>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-white tracking-tight">$149</span>
                <span className="text-xs text-on-surface-variant font-medium">/mo</span>
              </div>
              <p className="text-xs text-on-surface-variant">For power users with executive demands.</p>
            </div>

            <div className="w-full h-px bg-white/10 mb-8 relative z-10"></div>

            <ul className="flex flex-col gap-4 mb-10 flex-1 text-left text-sm relative z-10">
              <li className="flex items-center gap-3 text-on-surface">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                Full Workflow Automation
              </li>
              <li className="flex items-center gap-3 text-on-surface">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                Unlimited AI Actions
              </li>
              <li className="flex items-center gap-3 text-on-surface">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                Priority Agent Processing
              </li>
              <li className="flex items-center gap-3 text-on-surface">
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                Dedicated 24/7 Concierge Support
              </li>
            </ul>

            <button 
              onClick={handleAuth}
              className="w-full py-3.5 rounded-full bg-primary text-black font-semibold text-xs hover:scale-[0.98] transition-all duration-200 glow-button cursor-pointer relative z-10 shadow-[0_0_25px_rgba(242,202,80,0.35)]"
            >
              Go Executive
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="glass-card interactive-card hover:-translate-y-1 rounded-2xl p-8 flex flex-col border border-white/5 relative overflow-hidden bg-surface-panel/40">
            <div className="mb-8 text-left">
              <span className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block mb-2">Enterprise</span>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-white tracking-tight">Custom</span>
              </div>
              <p className="text-xs text-on-surface-variant">For organizations requiring custom scale.</p>
            </div>

            <div className="w-full h-px bg-white/5 mb-8"></div>

            <ul className="flex flex-col gap-4 mb-10 flex-1 text-left text-sm">
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                Dedicated Agent Instances
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                SSO &amp; Advanced Security
              </li>
              <li className="flex items-center gap-3 text-on-surface-variant">
                <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-primary font-bold">check</span>
                </span>
                White-glove Onboarding
              </li>
            </ul>

            <button 
              onClick={handleAuth}
              className="w-full py-3 rounded-full border border-white/10 text-white font-semibold text-xs hover:bg-white/5 transition-all duration-200 cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
