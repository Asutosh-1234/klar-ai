export function SocialProof() {
  return (
    <section className="py-20 border-y border-white/5 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-gutter text-center">
        <p className="font-label-caps text-label-caps text-on-surface-variant mb-8 uppercase tracking-widest">
          Trusted by elite engineering teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
          {/* Placeholder Logos */}
          <div className="h-8 flex items-center font-bold text-xl tracking-tighter">ACME CORP</div>
          <div className="h-8 flex items-center font-bold text-xl tracking-tighter">GLOBAL INC</div>
          <div className="h-8 flex items-center font-bold text-xl tracking-tighter">NEXUS</div>
          <div className="h-8 flex items-center font-bold text-xl tracking-tighter">PULSE</div>
        </div>
      </div>
    </section>
  )
}
