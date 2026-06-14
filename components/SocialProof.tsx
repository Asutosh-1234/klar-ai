export function SocialProof() {
  return (
    <section className="py-16 border-y border-white/5 bg-surface-sidebar/40 relative overflow-hidden">
      {/* Background subtle gradient glow */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary/2 to-transparent pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-gutter text-center relative z-10">
        <p className="font-label-caps text-[10px] text-on-surface-variant/60 mb-8 uppercase tracking-[0.2em] font-semibold">
          Trusted by elite teams at top engineering organizations
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
          {/* Stripe Logo */}
          <div className="h-6 flex items-center transition-all duration-300">
            <svg className="h-5 w-auto fill-current text-on-surface-variant/50 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] cursor-pointer" viewBox="0 0 80 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.6 9.8c0-.8.7-1.2 1.9-1.2 1.6 0 3.4.6 4.4 1.2V6.2C9.8 5.7 8 5.4 6.3 5.4 2.4 5.4 0 7.5 0 10.9c0 5.3 7.3 4.4 7.3 6.9 0 .9-.8 1.3-2.1 1.3-1.8 0-3.8-.8-4.9-1.5v3.7c1.3.6 3.2 1 4.9 1 4 0 6.6-2.1 6.6-5.6 0-5.7-7.2-4.7-7.2-6.9zM18.8 6.2v3.3h-2.2v6.6c0 .8.5 1.2 1.1 1.2.4 0 .8-.1 1.1-.2v3.1c-.6.3-1.5.4-2.4.4-2.4 0-3.9-1.3-3.9-3.9V9.5h-1.8V6.2h1.8V2.3l4.1-1.2v5.1h2.2zm4.3 3.6c.7-.8 1.9-1.4 3.3-1.4.3 0 .7 0 .9.1V12c-.4-.1-.8-.1-1.2-.1-1.7 0-3 1.1-3 3.1v5.6h-4.1V9.8h3.8v1.3l.3-1.1zm11.7-8.2c0 1.2-1 2.2-2.2 2.2s-2.2-1-2.2-2.2c0-1.2 1-2.2 2.2-2.2s2.2 1 2.2 2.2zm.1 8.2v10.9h-4.1V9.8h4.1zm13.1 0c.9-1.1 2.3-1.6 3.8-1.6 3.1 0 5.3 2.5 5.3 6.3 0 3.9-2.2 6.4-5.3 6.4-1.5 0-2.9-.6-3.8-1.6v6.2h-4.1V9.8h3.8v1.3zm0 4.8c0 1.7 1 2.8 2.5 2.8s2.5-1.1 2.5-2.8c0-1.7-1-2.8-2.5-2.8s-2.5 1.1-2.5 2.8zm19.9-1.2c-.2-2.3-1.9-3.6-4.6-3.6-3.4 0-5.6 2.5-5.6 6.3 0 3.7 2.2 6.3 5.4 6.3 2.2 0 4.1-.9 5.1-2.3l-2.4-1.6c-.6.8-1.5 1.2-2.5 1.2-1.3 0-2.3-.8-2.5-2.1h9.9c.1-.5.2-1 .2-1.5v-2.7zm-7.2-1.2c.2-1.1 1.1-1.9 2.3-1.9s2.1.8 2.3 1.9h-4.6z" />
            </svg>
          </div>

          {/* Linear Logo */}
          <div className="h-6 flex items-center transition-all duration-300">
            <svg className="h-5 w-auto fill-current text-on-surface-variant/50 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] cursor-pointer" viewBox="0 0 80 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0a10 10 0 1 0 10 10A10 10 0 0 0 10 0zm0 17.5a7.5 7.5 0 1 1 7.5-7.5 7.5 7.5 0 0 1-7.5 7.5z M26 5h3v10h-3zm14 0v1.5a3 3 0 0 0-2.5-1.5 5 5 0 0 0 0 10 3 3 0 0 0 2.5-1.5V15h3V5zm-2.5 7a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5zm11.5-7h3v1.5a3 3 0 0 1 2.5-1.5V8a3 3 0 0 0-2.5 1.5V15h-3zm13.5 0h-3v10h3v-4.5a2.5 2.5 0 0 1 5 0V15h3V9.5a5.5 5.5 0 0 0-8-4.5z" />
            </svg>
          </div>

          {/* Figma Logo */}
          <div className="h-6 flex items-center transition-all duration-300">
            <svg className="h-5 w-auto fill-current text-on-surface-variant/50 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] cursor-pointer" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 0c2.2 0 4 1.8 4 4v4H4c-2.2 0-4-1.8-4-4s1.8-4 4-4zm8 0c2.2 0 4 1.8 4 4v4h-4c-2.2 0-4-1.8-4-4s1.8-4 4-4zm0 8v4c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4h4zm4 0c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4V8h4zm0-8h3c2.2 0 4 1.8 4 4s-1.8 4-4 4h-3V0z M30 5h3v10h-3zm14 0v1.5a3 3 0 0 0-2.5-1.5 5 5 0 0 0 0 10 3 3 0 0 0 2.5-1.5V15h3V5zm-2.5 7a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z" />
            </svg>
          </div>

          {/* Vercel Logo */}
          <div className="h-6 flex items-center transition-all duration-300">
            <svg className="h-4 w-auto fill-current text-on-surface-variant/50 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] cursor-pointer" viewBox="0 0 116 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M57.5 0L115 100H0L57.5 0Z" />
            </svg>
            <span className="text-white/60 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-wider ml-2 font-mono">Vercel</span>
          </div>

          {/* GitHub Logo */}
          <div className="h-6 flex items-center transition-all duration-300">
            <svg className="h-5 w-auto fill-current text-on-surface-variant/50 hover:text-white transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] cursor-pointer" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span className="text-white/60 hover:text-white transition-colors duration-300 text-xs font-semibold uppercase tracking-wider ml-2 font-mono">GitHub</span>
          </div>
        </div>
      </div>
    </section>
  )
}
