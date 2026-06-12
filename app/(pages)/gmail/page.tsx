import { getServerSession } from "next-auth";
import { authProvider } from "@/app/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/config/prisma";
import Image from "next/image";
import { SignOutButton } from "@/app/components/SignOutButton";
import { InboxContainer } from "@/app/components/gmail/InboxContainer";


export default async function GmailPage() {
  const session = await getServerSession(authProvider);
  if (!session?.user?.id) {
    redirect("/");
  }

  const tenantId = `usr_${session.user.id}`;

  // Check if Gmail is connected
  const gmailInt = await prisma.corsairIntegration.findFirst({
    where: { name: "gmail" },
  });

  let isGmailConnected = false;
  if (gmailInt) {
    const account = await prisma.corsairAccount.findFirst({
      where: {
        tenantId,
        integrationId: gmailInt.id,
      },
    });
    isGmailConnected = !!account;
  }

  return (
    <div className="relative h-screen bg-[#0A0A0F] text-on-background flex flex-col font-sans overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/connect" className="text-on-surface-variant hover:text-white transition-colors duration-200 flex items-center gap-1">
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <span className="text-white/20">|</span>
            <div className="font-headline-md text-headline-md font-bold tracking-tighter text-gradient">
              Klar Inbox
            </div>
          </div>
          <div className="flex items-center gap-4">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "Avatar"}
                width={36}
                height={36}
                className="rounded-full border border-white/20"
              />
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-white leading-none">
                {session.user.name}
              </p>
              <p className="text-xs text-on-surface-variant leading-none mt-1">
                {session.user.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl w-full mx-auto px-6 py-6 overflow-hidden h-[calc(100vh-5rem)]">
        {!isGmailConnected ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="glass-card rounded-2xl p-10 max-w-lg text-center border border-white/10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-400 text-4xl">mail_lock</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Gmail Account Not Connected</h2>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                Connect your Google Account to authorize Klar AI to fetch, analyze, and help manage your emails using natural language.
              </p>
              <a
                href="/connect"
                className="px-8 py-3 rounded-full bg-primary-container text-white font-semibold hover:scale-95 transition-transform duration-200 glow-button flex items-center gap-2"
              >
                Connect Gmail <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        ) : (
          <InboxContainer />
        )}
      </main>
    </div>
  );
}
