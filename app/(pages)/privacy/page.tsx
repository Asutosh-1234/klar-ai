import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authProvider } from "@/lib/auth/config";
import Link from "next/link";

export default async function PrivacyPolicy() {
  const session = await getServerSession(authProvider);

  return (
    <div className="relative min-h-screen bg-background text-on-background flex flex-col pt-16">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-20"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
      
      <Navbar session={session} />

      <main className="flex-1 max-w-container-max mx-auto px-gutter w-full py-16 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant/70 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-on-surface-variant">Privacy Policy</span>
        </div>

        {/* Hero Header */}
        <div className="text-left mb-12">
          <h1 className="text-display-xl-mobile sm:text-headline-lg lg:text-display-xl text-gradient mb-4">
            Privacy Policy
          </h1>
          <p className="text-on-surface-variant/80 max-w-2xl text-body-lg">
            At Klar AI, we build intelligence with integrity. Learn how we handle your data, protect your privacy, and secure your integrations.
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-on-surface-variant/60">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
              Last updated: June 18, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
              SOC2 Type II Certified
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Navigation Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-3 p-4 glass-card rounded-xl border border-white/5 bg-surface-sidebar/50 backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 px-2">Table of Contents</h3>
              <a href="#introduction" className="text-xs text-on-surface-variant hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/5">1. Introduction</a>
              <a href="#data-collection" className="text-xs text-on-surface-variant hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/5">2. Information We Collect</a>
              <a href="#data-usage" className="text-xs text-on-surface-variant hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/5">3. How We Use Information</a>
              <a href="#data-sharing" className="text-xs text-on-surface-variant hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/5">4. Sharing and Disclosure</a>
              <a href="#data-security" className="text-xs text-on-surface-variant hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/5">5. Security Standards</a>
              <a href="#your-rights" className="text-xs text-on-surface-variant hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/5">6. Controls and Rights</a>
              <a href="#contact-us" className="text-xs text-on-surface-variant hover:text-white transition-colors py-1.5 px-2 rounded hover:bg-white/5">7. Contact Information</a>
            </div>
          </aside>

          {/* Privacy Content */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl border border-white/5 bg-surface-panel/30 backdrop-blur-md p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] glow-accent flex flex-col gap-10 text-left">
              
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-24">
                <h2 className="text-headline-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">01.</span> Introduction
                </h2>
                <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed">
                  <p>
                    Klar AI ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, store, and share information in connection with our intelligent email and calendar operating system, including the Klar AI application, browser extensions, and associated services (collectively, the "Service").
                  </p>
                  <p>
                    By accessing or using the Service, you agree to the terms of this Privacy Policy and our Terms of Service. If you do not agree with any terms in this policy, please do not connect your accounts or use our Service.
                  </p>
                </div>
              </section>

              {/* Data Collection */}
              <section id="data-collection" className="scroll-mt-24">
                <h2 className="text-headline-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">02.</span> Information We Collect
                </h2>
                <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed">
                  <p>
                    To provide intelligent automation, natural language shortcuts, and agentic workflows, Klar AI connects to your communication services (such as Gmail and Google Calendar) using secure OAuth 2.0 integration protocols. We collect the following categories of information:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <strong className="text-white">Account Registration Information:</strong> Your name, email address, avatar, and billing information (processed securely via Stripe).
                    </li>
                    <li>
                      <strong className="text-white">Google Integration Data:</strong> When authorized by you, we access Gmail metadata (headers, sender, recipient, subject, time), email content (snippets, body, attachments), and Google Calendar events (summaries, descriptions, participants, schedules).
                    </li>
                    <li>
                      <strong className="text-white">Embeddings & Natural Language Context:</strong> To enable context-aware search and natural language commands, we generate vector embeddings of email snippets and calendar events. These embeddings are stored securely in a local pgvector database.
                    </li>
                    <li>
                      <strong className="text-white">Usage Statistics:</strong> Log data regarding your interactions with Klar AI, including shortcut usage, UI navigation paths, and features clicked, to help improve product performance.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Data Usage */}
              <section id="data-usage" className="scroll-mt-24">
                <h2 className="text-headline-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">03.</span> How We Use Information
                </h2>
                <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed">
                  <p>
                    Klar AI uses your data strictly to power the features you interact with. Specifically, we use the collected data for:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <strong className="text-white">Providing Service Features:</strong> Synthesizing email summaries, executing keyboard shortcuts, and generating suggestions for responses.
                    </li>
                    <li>
                      <strong className="text-white">Contextual Semantic Search:</strong> Matching natural language queries against your calendar and email embeddings to return highly relevant context.
                    </li>
                    <li>
                      <strong className="text-white">Service Improvement:</strong> Diagnostics, bug fixes, and optimization of latency and command-line parsing performance.
                    </li>
                  </ul>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg mt-4">
                    <p className="text-xs font-semibold text-white flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-primary text-base">privacy_tip</span>
                      Strict Advertising Prohibition
                    </p>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      We never use your email body content, attachments, calendar events, or personal information for advertising, marketing, or general promotional purposes. We do not sell or rent your information to third-party brokers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Sharing and Disclosure */}
              <section id="data-sharing" className="scroll-mt-24">
                <h2 className="text-headline-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">04.</span> Sharing and Disclosure
                </h2>
                <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed">
                  <p>
                    We only share your information under the following limited circumstances:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <strong className="text-white">AI Processing Subprocessors:</strong> We send text chunks (such as email bodies) to our secure AI processing partners (e.g. Google Gemini, OpenRouter) to generate summarizations and response options. These partners are legally bound by strict data processing agreements and do not retain your data for model training.
                    </li>
                    <li>
                      <strong className="text-white">Service Providers:</strong> Secure infrastructure hosting (AWS, Neon DB) and payment handling (Stripe).
                    </li>
                    <li>
                      <strong className="text-white">Legal Obligations:</strong> If required by law, regulation, or a valid legal request from public authorities.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Security Standards */}
              <section id="data-security" className="scroll-mt-24">
                <h2 className="text-headline-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">05.</span> Security Standards
                </h2>
                <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed">
                  <p>
                    We treat security as our core feature. We implement the following industry-grade safeguards:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <strong className="text-white">OAuth Integration:</strong> We do not store your Google passwords. All credentials are held as secure, revocable OAuth tokens.
                    </li>
                    <li>
                      <strong className="text-white">Data Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We utilize a secure key-encryption-key (KEK) pattern for multi-tenant isolation.
                    </li>
                    <li>
                      <strong className="text-white">SOC 2 Type II:</strong> Klar AI is SOC2 Type II audited to guarantee our security, confidentiality, and processing integrity meet rigorous controls.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Your Controls and Rights */}
              <section id="your-rights" className="scroll-mt-24">
                <h2 className="text-headline-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">06.</span> Controls and Rights
                </h2>
                <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed">
                  <p>
                    You retain full ownership and control over your information:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <strong className="text-white">Revoking Access:</strong> You can disconnect your Gmail or Calendar account at any time via the integrations dashboard. This immediately invalidates the OAuth tokens on our servers.
                    </li>
                    <li>
                      <strong className="text-white">Account Deletion:</strong> You can request complete deletion of your account and all associated email/calendar cache and vector databases by contacting our support team.
                    </li>
                    <li>
                      <strong className="text-white">GDPR & CCPA Compliance:</strong> Depending on your location, you have the right to access, correct, delete, or limit the processing of your personal data.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Contact Us */}
              <section id="contact-us" className="scroll-mt-24">
                <h2 className="text-headline-md font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-primary font-mono text-sm">07.</span> Contact Information
                </h2>
                <div className="text-on-surface-variant text-body-md space-y-4 leading-relaxed">
                  <p>
                    If you have questions, concerns, or requests regarding this Privacy Policy or our security practices, please contact our Data Protection Officer at:
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-white/3 border border-white/5 space-y-1 text-sm">
                    <p className="font-semibold text-white">Klar AI Security & Privacy Team</p>
                    <p>Email: <a href="mailto:security@klar.ai" className="text-primary hover:underline">security@klar.ai</a></p>
                    <p>Address: 100 Pine Street, Suite 1250, San Francisco, CA 94111</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
