import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="glass-card rounded-2xl p-8 hover:bg-white/5 hover:border-primary/20 ring-0 border-0 bg-transparent transition-all duration-300 group shadow-none">
      <CardHeader className="p-0 mb-6 gap-0">
        <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-colors">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>
            {icon}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CardTitle className="font-headline-md text-headline-md text-on-background mb-3 font-semibold leading-normal">
          {title}
        </CardTitle>
        <CardDescription className="text-on-surface-variant text-sm font-normal leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export function Features() {
  const featuresList = [
    {
      icon: "forum",
      title: "AI Agent Chat",
      description: "Converse with your inbox. Ask it to find specific threads, summarize long emails, or draft replies based on minimal context."
    },
    {
      icon: "keyboard",
      title: "Keyboard-first",
      description: "Never touch your mouse. Navigate, archive, reply, and trigger complex workflows instantly via intuitive global hotkeys."
    },
    {
      icon: "sync",
      title: "Real-time sync",
      description: "Zero latency. Changes made in Klar instantly reflect in Gmail and Google Calendar. True bi-directional synchronization."
    },
    {
      icon: "calendar_month",
      title: "Unified view",
      description: "Your schedule and messages in one continuous interface. Contextualize emails alongside your upcoming meetings."
    }
  ];

  return (
    <section id="features" className="py-section-gap">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="mb-20">
          <h2 className="font-headline-lg text-headline-lg font-semibold mb-4 text-on-background">Engineered for focus.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">Everything you need to manage your communications, without the visual noise of traditional email clients.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuresList.map((feature, idx) => (
            <FeatureCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
