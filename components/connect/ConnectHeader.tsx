"use client";

import Image from "next/image";
import { SignOutButton } from "@/components/SignOutButton";
import Link from "next/link";
import { motion } from "framer-motion";
import { ConnectHeaderProps } from "@/lib/types";

export function ConnectHeader({ user, isGmailConnected }: ConnectHeaderProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return "AI";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-50 border-b border-white/5 bg-surface-sidebar/60 backdrop-blur-xl"
    >
      <div className="max-w-5xl mx-auto px-gutter h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-6 h-6 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary text-[10px] font-black tracking-widest shadow-[0_0_8px_rgba(242,202,80,0.2)] group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300">
              K
            </div>
            <span className="text-sm font-bold tracking-tight text-gradient group-hover:text-white transition-colors duration-300">
              Klar AI
            </span>
          </Link>
          {isGmailConnected && (
            <Link
              href="/index"
              className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-white transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-sm">mail</span>
              Gmail Inbox
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative group">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full border border-primary/20 group-hover:border-primary/50 transition-all duration-300 shadow-[0_0_10px_rgba(242,202,80,0.1)]"
                />
              ) : (
                <div className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shadow-[0_0_10px_rgba(242,202,80,0.15)] select-none">
                  {getInitials(user.name)}
                </div>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-none">
                {user.name}
              </p>
              <p className="text-[10px] text-on-surface-variant/80 leading-none mt-1.5 font-normal">
                {user.email}
              </p>
            </div>
          </div>
          <div className="border-l border-white/10 pl-4 h-6 flex items-center">
            <SignOutButton />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
