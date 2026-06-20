"use client";

import { IntegrationCardProps } from "@/lib/types";
import Link from "next/link";
import { motion } from "framer-motion";

export function IntegrationCard({
  title,
  description,
  icon,
  isConnected,
  scopes,
  connectUrl,
  connectedAction,
  connectActionText,
}: IntegrationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full h-full glass-card rounded-xl p-8 flex flex-col justify-between interactive-card border glow-accent relative overflow-hidden group ${
        isConnected ? "border-primary/30 bg-primary/[0.02]" : "border-white/5 bg-white/[0.005]"
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300 shadow-[0_0_15px_rgba(242,202,80,0.1)]">
            <span className="material-symbols-outlined text-2xl font-semibold select-none">{icon}</span>
          </div>
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_rgba(242,202,80,0.1)] uppercase tracking-wider select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Active / Synced
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/5 text-on-surface-variant/80 border border-white/10 uppercase tracking-wider select-none">
              Disconnected
            </span>
          )}
        </div>

        <h2 className="text-base font-bold text-white mb-2.5 text-left tracking-tight">
          {title}
        </h2>
        <p className="text-on-surface-variant text-[11px] leading-relaxed mb-6 text-left font-normal opacity-90">
          {description}
        </p>

        <div className="border-t border-white/5 pt-5 mb-6 text-left">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-3.5 opacity-90">
            Requested Scopes:
          </h4>
          <ul className="flex flex-col gap-2.5">
            {scopes.map((scope, index) => (
              <li
                key={index}
                className="flex items-start gap-2.5 text-[11px] text-on-surface-variant font-normal leading-normal hover:text-white transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-primary text-[15px] select-none mt-0.5">
                  done
                </span>
                <span>{scope}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4">
        {isConnected ? (
          connectedAction.type === "link" && connectedAction.href ? (
            <Link
              href={connectedAction.href}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary-hover text-surface-sidebar text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] shadow-[0_4px_16px_rgba(242,202,80,0.15)] hover:shadow-[0_6px_20px_rgba(242,202,80,0.3)] cursor-pointer"
            >
              {connectedAction.text}
              <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform duration-200">
                arrow_forward
              </span>
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-3 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold text-xs cursor-not-allowed text-center flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
              {connectedAction.text}
            </button>
          )
        ) : (
          <a
            href={connectUrl}
            className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 border border-white/10 hover:border-white/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            {connectActionText}
            <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform duration-200">
              arrow_forward
            </span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
