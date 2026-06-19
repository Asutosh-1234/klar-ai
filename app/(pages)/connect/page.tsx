import { getServerSession } from "next-auth";
import { authProvider } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/config/prisma";
import { ConnectHeader } from "@/components/connect/ConnectHeader";
import { IntegrationCard } from "@/components/connect/IntegrationCard";
import { SecurityDisclosures } from "@/components/connect/SecurityDisclosures";
import Link from "next/link";

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
      <ConnectHeader user={session.user} isGmailConnected={isGmailConnected} />

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-gutter py-12 flex flex-col gap-10 w-full">
        {isGmailConnected && isCalendarConnected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_35px_rgba(242,202,80,0.1)]">
              <span className="material-symbols-outlined text-primary text-4xl font-bold">check_circle</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-3">
              Klar OS Workspace is Ready
            </h1>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-8 max-w-xs opacity-80">
              Your Gmail and Google Calendar are successfully synchronized. Klar OS is ready to orchestrate your communications, summarize schedules, and automate actions.
            </p>
            <Link
              href="/index"
              className="w-full py-3.5 bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all text-surface-sidebar rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(242,202,80,0.25)] hover:shadow-[0_6px_20px_rgba(242,202,80,0.35)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs font-bold">rocket_launch</span>
              Enter Klar OS Workspace
            </Link>
          </div>
        ) : (
          <>
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
              <IntegrationCard
                title="Google Gmail"
                description="Allows Klar to fetch, label, compose, and send emails on your behalf based on natural language input."
                icon="mail"
                isConnected={isGmailConnected}
                scopes={[
                  "Read and view email threads & metadata",
                  "Modify labels, mark read/unread, and archive threads",
                  "Compose drafts and send replies",
                ]}
                connectUrl="/api/connect?plugin=gmail"
                connectedAction={{
                  type: "link",
                  text: "Go to Gmail Inbox",
                  href: "/index",
                }}
                connectActionText="Connect Gmail"
              />

              {/* Calendar Card */}
              <IntegrationCard
                title="Google Calendar"
                description="Enables Klar to schedule, modify, list, and delete event invites in response to scheduling commands."
                icon="calendar_today"
                isConnected={isCalendarConnected}
                scopes={[
                  "View your calendar schedule and event details",
                  "Create, schedule, edit, and delete calendar invites",
                  "Manage invitations and responder lists",
                ]}
                connectUrl="/api/connect?plugin=googlecalendar"
                connectedAction={{
                  type: "button",
                  text: "Calendar Connected",
                }}
                connectActionText="Connect Calendar"
              />
            </div>
          </>
        )}

        {/* Terms, Conditions & Privacy Disclosures */}
        <SecurityDisclosures />
      </main>
    </div>
  );
}