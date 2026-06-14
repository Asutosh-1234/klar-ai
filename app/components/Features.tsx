import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export function Features() {
  return (
    <section className="py-section-gap">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="mb-20">
          <h2 className="font-headline-lg text-headline-lg font-semibold mb-4 text-on-background">Engineered for focus.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Everything you need to manage your communications, without the visual noise of traditional email clients.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <Card className="glass-card rounded-2xl p-8 hover:bg-white/5 hover:border-primary/20 ring-0 border-0 bg-transparent transition-all duration-300 group shadow-none">
            <CardHeader className="p-0 mb-6 gap-0">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>forum</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CardTitle className="font-headline-md text-headline-md text-on-background mb-3 font-semibold leading-normal">
                AI Agent Chat
              </CardTitle>
              <CardDescription className="text-on-surface-variant text-sm font-normal leading-relaxed">
                Converse with your inbox. Ask it to find specific threads, summarize long emails, or draft replies based on minimal context.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="glass-card rounded-2xl p-8 hover:bg-white/5 hover:border-primary/20 ring-0 border-0 bg-transparent transition-all duration-300 group shadow-none">
            <CardHeader className="p-0 mb-6 gap-0">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>keyboard</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CardTitle className="font-headline-md text-headline-md text-on-background mb-3 font-semibold leading-normal">
                Keyboard-first
              </CardTitle>
              <CardDescription className="text-on-surface-variant text-sm font-normal leading-relaxed">
                Never touch your mouse. Navigate, archive, reply, and trigger complex workflows instantly via intuitive global hotkeys.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="glass-card rounded-2xl p-8 hover:bg-white/5 hover:border-primary/20 ring-0 border-0 bg-transparent transition-all duration-300 group shadow-none">
            <CardHeader className="p-0 mb-6 gap-0">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>sync</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CardTitle className="font-headline-md text-headline-md text-on-background mb-3 font-semibold leading-normal">
                Real-time sync
              </CardTitle>
              <CardDescription className="text-on-surface-variant text-sm font-normal leading-relaxed">
                Zero latency. Changes made in Klar instantly reflect in Gmail and Google Calendar. True bi-directional synchronization.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Feature 4 */}
          <Card className="glass-card rounded-2xl p-8 hover:bg-white/5 hover:border-primary/20 ring-0 border-0 bg-transparent transition-all duration-300 group shadow-none">
            <CardHeader className="p-0 mb-6 gap-0">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>calendar_month</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <CardTitle className="font-headline-md text-headline-md text-on-background mb-3 font-semibold leading-normal">
                Unified view
              </CardTitle>
              <CardDescription className="text-on-surface-variant text-sm font-normal leading-relaxed">
                Your schedule and messages in one continuous interface. Contextualize emails alongside your upcoming meetings.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
