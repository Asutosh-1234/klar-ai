import { getServerSession } from "next-auth";
import { authProvider } from "@/app/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/config/prisma";
import { SignOutButton } from "@/app/components/SignOutButton";
import Image from "next/image";

export default async function ConnectPage() {
  const session = await getServerSession(authProvider);
  if (!session?.user?.id) {
    redirect("/");
  }

  const tenantId = `usr_${session.user.id}`;

  // Fetch integration rows to map IDs
  const integrations = await prisma.corsairIntegration.findMany({
    where: {
      name: {
        in: ["gmail", "googlecalendar"],
      },
    },
  });

  const gmailInt = integrations.find((i) => i.name === "gmail");
  const calendarInt = integrations.find((i) => i.name === "googlecalendar");

  // Fetch connected accounts for current tenant
  const accounts = await prisma.corsairAccount.findMany({
    where: {
      tenantId,
      integrationId: {
        in: integrations.map((i) => i.id),
      },
    },
  });

  const isGmailConnected = accounts.some((a) => a.integrationId === gmailInt?.id);
  const isCalendarConnected = accounts.some((a) => a.integrationId === calendarInt?.id);

  return (
    <div className="relative min-h-screen bg-background text-on-background flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/4 bg-surface-sidebar/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-gutter h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm font-semibold tracking-tight text-gradient">
              Klar AI
            </div>
            {isGmailConnected && (
              <a href="/gmail" className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-sm">mail</span>
                Gmail Inbox
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            {session.user.image && (
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
                {session.user.name}
              </p>
              <p className="text-[10px] text-on-surface-variant/80 leading-none mt-1">
                {session.user.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-gutter py-12 flex flex-col gap-10 w-full">
        {/* Title Area */}
        <div className="text-center md:text-left max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-3 leading-tight">
            Connect your Workspace
          </h1>
          <p className="text-xs text-on-surface-variant leading-relaxed font-normal">
            Link Gmail and Google Calendar to empower Klar AI to manage your schedule, summarize conversations, and draft responses.
          </p>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gmail Card */}
          <div className={`glass-card rounded-xl p-8 flex flex-col justify-between interactive-card border glow-accent ${
            isGmailConnected ? 'border-primary/20 bg-primary/5' : 'border-white/4'
          }`}>
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </div>
                {isGmailConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    Connected ✓
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-on-surface-variant border border-white/6">
                    Not Connected
                  </span>
                )}
              </div>

              <h2 className="text-base font-semibold text-white mb-2 text-left">
                Google Gmail
              </h2>
              <p className="text-on-surface-variant text-[11px] leading-relaxed mb-6 text-left font-normal">
                Allows Klar to fetch, label, compose, and send emails on your behalf based on natural language input.
              </p>

              <div className="border-t border-white/4 pt-5 mb-6 text-left">
                <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Requested Scopes:</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-[11px] text-on-surface-variant font-normal">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                    Read and view email threads & metadata
                  </li>
                  <li className="flex items-center gap-2 text-[11px] text-on-surface-variant font-normal">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                    Modify labels, mark read/unread, and archive threads
                  </li>
                  <li className="flex items-center gap-2 text-[11px] text-on-surface-variant font-normal">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                    Compose drafts and send replies
                  </li>
                </ul>
              </div>
            </div>

            {isGmailConnected ? (
              <a
                href="/gmail"
                className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_12px_rgba(139,92,246,0.2)]"
              >
                Go to Gmail Inbox <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            ) : (
              <a
                href="/api/connect?plugin=gmail"
                className="w-full py-2.5 rounded-lg bg-white/4 hover:bg-white/8 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 border border-white/6 hover:border-white/12 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                Connect Gmail <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            )}
          </div>

          {/* Calendar Card */}
          <div className={`glass-card rounded-xl p-8 flex flex-col justify-between interactive-card border glow-accent ${
            isCalendarConnected ? 'border-primary/20 bg-primary/5' : 'border-white/4'
          }`}>
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">calendar_today</span>
                </div>
                {isCalendarConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    Connected ✓
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-on-surface-variant border border-white/6">
                    Not Connected
                  </span>
                )}
              </div>

              <h2 className="text-base font-semibold text-white mb-2 text-left">
                Google Calendar
              </h2>
              <p className="text-on-surface-variant text-[11px] leading-relaxed mb-6 text-left font-normal">
                Enables Klar to schedule, modify, list, and delete event invites in response to scheduling commands.
              </p>

              <div className="border-t border-white/4 pt-5 mb-6 text-left">
                <h4 className="text-[10px] font-semibold text-white uppercase tracking-wider mb-3">Requested Scopes:</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-[11px] text-on-surface-variant font-normal">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                    View your calendar schedule and event details
                  </li>
                  <li className="flex items-center gap-2 text-[11px] text-on-surface-variant font-normal">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                    Create, schedule, edit, and delete calendar invites
                  </li>
                  <li className="flex items-center gap-2 text-[11px] text-on-surface-variant font-normal">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                    Manage invitations and responder lists
                  </li>
                </ul>
              </div>
            </div>

            {isCalendarConnected ? (
              <button disabled className="w-full py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary/80 font-semibold text-xs cursor-not-allowed text-center">
                Calendar Connected
              </button>
            ) : (
              <a
                href="/api/connect?plugin=googlecalendar"
                className="w-full py-2.5 rounded-lg bg-white/4 hover:bg-white/8 text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 border border-white/6 hover:border-white/12 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              >
                Connect Calendar <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            )}
          </div>
        </div>

        {/* Terms, Conditions & Privacy Disclosures */}
        <div className="glass-card rounded-xl p-8 border border-white/6 text-left shadow-[0_4px_24px_rgba(0,0,0,0.4)] relative overflow-hidden glow-accent">
          <div className="flex items-center gap-2.5 mb-5 relative z-10">
            <span className="material-symbols-outlined text-primary text-xl">security</span>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Data Security & Privacy Disclosures
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[11px] leading-relaxed text-on-surface-variant relative z-10 font-normal">
            <div>
              <h4 className="font-semibold text-white mb-1.5">1. Scope of Access</h4>
              <p>
                Klar AI will only read, modify, or compose data in response to commands you explicitly submit via keyboard shortcuts or natural language instruction. We do not continuously poll or train global models on your raw message content.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1.5">2. Encryption Standards</h4>
              <p>
                All authentication credentials, OAuth tokens, and session secrets are encrypted end-to-end using double-key cryptography (KEK/DEK patterns) with AES-256-GCM. Storage is fully isolated by tenant keys.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-1.5">3. Revocation & Control</h4>
              <p>
                You retain complete control of your integrations. You can revoke access at any time from your Google Account Security Dashboard. Revoking access immediately destroys all stored access keys in our database.
              </p>
            </div>
          </div>

          <div className="border-t border-white/4 mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <p className="text-[10px] text-on-surface-variant/70 leading-normal max-w-xl font-normal">
              By proceeding to authorize either Google Gmail or Google Calendar, you agree to grant the requested permissions to Klar AI and accept our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Secure OAuth 2.0 SSL
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}