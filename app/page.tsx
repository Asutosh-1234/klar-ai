import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { ShortcutsOverview } from "@/components/ShortcutsOverview";
import { CTA } from "@/components/CTA";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

import { getServerSession } from "next-auth";
import { authProvider } from "@/lib/auth/config";

export default async function Home() {
  const session = await getServerSession(authProvider);


  return (
    <div className="relative min-h-screen bg-background text-on-background flex flex-col pt-16">
      <Navbar session={session} />
      <main className="flex-1">
        <Hero session={session} />
        <SocialProof />
        <Features />
        <ShortcutsOverview />
        <CTA session={session} />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}

