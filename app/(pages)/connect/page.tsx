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
    <div className="relative min-h-screen bg-[#0A0A0F] text-on-background flex flex-col font-sans">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40"></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-gutter h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="font-headline-md text-headline-md font-bold tracking-tighter text-gradient">
              Klar AI
            </div>
            {isGmailConnected && (
              <a href="/gmail" className="hidden sm:flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-white transition-colors duration-200">
                <span className="material-symbols-outlined text-sm">mail</span>
                Gmail Inbox
              </a>
            )}
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

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-gutter py-12 flex flex-col gap-12 w-full">
        {/* Title Area */}
        <div className="text-center md:text-left max-w-3xl">
          <h1 className="text-display-xl-mobile md:text-headline-lg text-gradient font-bold tracking-tight mb-4">
            Connect your Workspace
          </h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            Link Gmail and Google Calendar to empower Klar AI to manage your schedule, summarize conversations, and draft responses.
          </p>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gmail Card */}
          <div className={`glass-card rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 border ${
            isGmailConnected ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 hover:border-primary/30'
          }`}>
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-400 text-3xl">mail</span>
                </div>
                {isGmailConnected ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Connected ✓
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-on-surface-variant border border-white/10">
                    Not Connected
                  </span>
                )}
              </div>

              <h2 className="text-headline-md font-semibold text-white mb-2 text-left">
                Google Gmail
              </h2>
              <p className="text-on-surface-variant text-sm mb-6 text-left">
                Allows Klar to fetch, label, compose, and send emails on your behalf based on natural language input.
              </p>

              <div className="border-t border-white/5 pt-6 mb-8 text-left">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Requested Scopes:</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">check</span>
                    Read and view email threads & metadata
                  </li>
                  <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">check</span>
                    Modify labels, mark read/unread, and archive threads
                  </li>
                  <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">check</span>
                    Compose drafts and send replies
                  </li>
                </ul>
              </div>
            </div>

            {isGmailConnected ? (
              <a
                href="/gmail"
                className="w-full py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-center flex items-center justify-center gap-2 transition-colors duration-200 glow-button"
              >
                Go to Gmail Inbox <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            ) : (
              <a
                href="/api/connect?plugin=gmail"
                className="w-full py-4 rounded-full bg-primary-container text-white font-semibold hover:scale-95 transition-transform duration-200 glow-button text-center flex items-center justify-center gap-2"
              >
                Connect Gmail <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            )}
          </div>

          {/* Calendar Card */}
          <div className={`glass-card rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 border ${
            isCalendarConnected ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 hover:border-primary/30'
          }`}>
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-400 text-3xl">calendar_today</span>
                </div>
                {isCalendarConnected ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Connected ✓
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-on-surface-variant border border-white/10">
                    Not Connected
                  </span>
                )}
              </div>

              <h2 className="text-headline-md font-semibold text-white mb-2 text-left">
                Google Calendar
              </h2>
              <p className="text-on-surface-variant text-sm mb-6 text-left">
                Enables Klar to schedule, modify, list, and delete event invites in response to scheduling commands.
              </p>

              <div className="border-t border-white/5 pt-6 mb-8 text-left">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Requested Scopes:</h4>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">check</span>
                    View your calendar schedule and event details
                  </li>
                  <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">check</span>
                    Create, schedule, edit, and delete calendar invites
                  </li>
                  <li className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-base">check</span>
                    Manage invitations and responder lists
                  </li>
                </ul>
              </div>
            </div>

            {isCalendarConnected ? (
              <button disabled className="w-full py-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold cursor-not-allowed text-center">
                Calendar Account Connected
              </button>
            ) : (
              <a
                href="/api/connect?plugin=googlecalendar"
                className="w-full py-4 rounded-full bg-primary-container text-white font-semibold hover:scale-95 transition-transform duration-200 glow-button text-center flex items-center justify-center gap-2"
              >
                Connect Calendar <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            )}
          </div>
        </div>

        {/* Terms, Conditions & Privacy Disclosures */}
        <div className="glass-card rounded-2xl p-8 border border-white/10 text-left">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl">security</span>
            <h3 className="text-headline-md font-semibold text-white">
              Data Security & Privacy Disclosures
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-relaxed text-on-surface-variant">
            <div>
              <h4 className="font-semibold text-white mb-2">1. Scope of Access</h4>
              <p>
                Klar AI will only read, modify, or compose data in response to commands you explicitly submit via keyboard shortcuts or natural language instruction. We do not continuously poll or train global models on your raw message content.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">2. Encryption Standards</h4>
              <p>
                All authentication credentials, OAuth tokens, and session secrets are encrypted end-to-end using double-key cryptography (KEK/DEK patterns) with AES-256-GCM. Storage is fully isolated by tenant keys.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">3. Revocation & Control</h4>
              <p>
                You retain complete control of your integrations. You can revoke access at any time from your Google Account Security Dashboard. Revoking access immediately destroys all stored access keys in our database.
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-on-surface-variant/70 leading-normal max-w-2xl">
              By proceeding to authorize either Google Gmail or Google Calendar, you agree to grant the requested permissions to Klar AI and accept our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
            </p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Secure OAuth 2.0 SSL
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}