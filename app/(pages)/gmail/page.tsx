import { getServerSession } from "next-auth";
import { authProvider } from "@/app/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/config/prisma";
import Image from "next/image";
import { SignOutButton } from "@/components/SignOutButton";
import { InboxContainer } from "@/components/gmail/InboxContainer";


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

  if (isGmailConnected) {
    return (
      <div className="relative h-screen bg-background text-on-background flex flex-col font-sans overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20"></div>
        <main className="relative z-10 flex-1 flex flex-col overflow-hidden h-full">
          <InboxContainer
            user={{
              name: session.user?.name || null,
              email: session.user?.email || null,
              image: session.user?.image || null,
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-background text-on-background flex flex-col font-sans overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/4 bg-surface-sidebar/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/connect" className="text-on-surface-variant hover:text-white transition-colors duration-200 flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="font-medium">Dashboard</span>
            </a>
            <span className="text-white/10 text-xs">|</span>
            <div className="text-sm font-semibold tracking-tight text-gradient">
              Klar Inbox
            </div>
          </div>
          <div className="flex items-center gap-3">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "Avatar"}
                width={28}
                height={28}
                className="rounded-full border border-white/8"
              />
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">
                {session.user?.name}
              </p>
              <p className="text-[10px] text-on-surface-variant/80 leading-none mt-1">
                {session.user?.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl w-full mx-auto px-6 py-6 overflow-hidden h-[calc(100vh-4rem)]">
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="glass-card rounded-xl p-8 max-w-md text-center border border-white/6 flex flex-col items-center shadow-[0_12px_40px_rgba(0,0,0,0.5)] glow-accent">
            <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">mail_lock</span>
            </div>
            <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">Gmail Account Not Connected</h2>
            <p className="text-on-surface-variant text-xs mb-6 leading-relaxed max-w-xs">
              Connect your Google Account to authorize Klar AI to fetch, analyze, and help manage your emails using natural language.
            </p>
            <a
              href="/connect"
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_12px_rgba(139,92,246,0.2)] flex items-center gap-1.5"
            >
              Connect Gmail <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
