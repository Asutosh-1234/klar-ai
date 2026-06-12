import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { SocialProof } from "@/app/components/SocialProof";
import { Features } from "@/app/components/Features";
import { CTA } from "@/app/components/CTA";
import { Pricing } from "@/app/components/Pricing";
import { Footer } from "@/app/components/Footer";

import { getServerSession } from "next-auth";
import { authProvider } from "@/app/lib/auth/config";

export default async function Home() {
  const session = await getServerSession(authProvider);

  return (
    <div className="relative min-h-screen bg-background text-on-background flex flex-col pt-20">
      <Navbar session={session} />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Features />
        <CTA />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
