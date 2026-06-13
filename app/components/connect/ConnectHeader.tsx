import Image from "next/image";
import { SignOutButton } from "@/app/components/SignOutButton";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ConnectHeaderProps {
  user: User;
  isGmailConnected: boolean;
}

export function ConnectHeader({ user, isGmailConnected }: ConnectHeaderProps) {
  return (
    <header className="relative z-10 border-b border-white/4 bg-surface-sidebar/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-gutter h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-sm font-semibold tracking-tight text-gradient">
            Klar AI
          </div>
          {isGmailConnected && (
            <a
              href="/gmail"
              className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-white transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Gmail Inbox
            </a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name || "Avatar"}
              width={28}
              height={28}
              className="rounded-full border border-white/8"
            />
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-none">
              {user.name}
            </p>
            <p className="text-[10px] text-on-surface-variant/80 leading-none mt-1">
              {user.email}
            </p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
