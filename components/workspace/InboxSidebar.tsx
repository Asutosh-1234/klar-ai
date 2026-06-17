'use client'

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { InboxSidebarProps } from '@/lib/types';
import { SHORTCUTS } from "@/lib/config/shortcuts";

function getShortcutString(folderId: string): string {
  const shortcut = SHORTCUTS.find(s => s.id === folderId);
  if (!shortcut) return "";
  return shortcut.displayKeys.map(kGroup => kGroup.join("+")).join(" / ");
}

export function InboxSidebar({
  user,
  selectedFolder,
  setSelectedFolder,
  onComposeClick,
  onSyncClick,
}: InboxSidebarProps) {
  const folders = [
    { id: "INBOX", label: "Inbox", icon: "inbox" },
    { id: "STARRED", label: "Starred", icon: "star" },
    { id: "SENT", label: "Sent", icon: "send" },
    { id: "DRAFT", label: "Drafts", icon: "drafts" },
    { id: "ARCHIVE", label: "Archive", icon: "archive" },
    { id: "PURCHASES", label: "Purchases", icon: "shopping_bag" },
    { id: "CALENDAR", label: "Calendar", icon: "calendar_today" },
    { id: "AGENTS", label: "Agents", icon: "smart_toy" },
    { id: "SETTINGS", label: "Settings", icon: "settings" },
  ];

  const composeShortcut = SHORTCUTS.find(s => s.id === "COMPOSE");
  const composeKeyLabel = composeShortcut?.displayKeys?.[0]?.[0] || "N";

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full py-8 bg-surface-container border-r border-white/5 z-50">
      
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <h1 className="font-headline-sm text-lg font-bold text-primary tracking-tight">Aether OS</h1>
        <p className="text-[9px] font-semibold text-on-surface-variant opacity-60 tracking-wider uppercase">Premium AI Agent</p>
      </div>

      {/* Compose Button */}
      <div className="px-6 mb-6">
        <button
          onClick={onComposeClick}
          className="w-full py-3 bg-primary-container text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-200 active:scale-95 shadow-[0_0_20px_rgba(242,202,80,0.1)] cursor-pointer relative group"
        >
          <span className="material-symbols-outlined text-[20px] font-semibold">add</span>
          <span className="font-label-md text-xs">Compose</span>
          <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center bg-black/40 text-primary px-1.5 py-0.5 rounded text-[8px] font-mono border border-white/10 select-none uppercase">
            {composeKeyLabel}
          </div>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {folders.map((folder) => {
          const isActive = selectedFolder === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`w-full flex items-center px-6 py-3 transition-colors duration-200 text-left text-xs cursor-pointer relative group ${
                isActive
                  ? "text-on-surface font-semibold border-l-2 border-primary bg-surface-container-high"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
              }`}
            >
              <span 
                className={`material-symbols-outlined mr-3 text-lg ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {folder.icon}
              </span>
              <span className="font-label-md text-xs">{folder.label}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-white/10 text-primary px-1.5 py-0.5 rounded text-[8px] font-mono border border-white/5 shrink-0 ml-auto select-none">
                {getShortcutString(folder.id)}
              </div>
            </button>
          );
        })}

        <div className="px-6 my-4 border-t border-white/5"></div>

        {/* Back to Connect Dashboard */}
        <Link
          href="/connect"
          className="flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors duration-200 text-xs group"
        >
          <span className="material-symbols-outlined mr-3 text-lg text-on-surface-variant group-hover:text-primary">
            arrow_back
          </span>
          <span className="font-label-md text-xs">Dashboard</span>
        </Link>

        {/* Sync Mail Action */}
        <button
          onClick={onSyncClick}
          className="w-full flex items-center px-6 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors duration-200 text-xs group text-left cursor-pointer"
        >
          <span className="material-symbols-outlined mr-3 text-lg text-on-surface-variant group-hover:text-primary animate-pulse">
            refresh
          </span>
          <span className="font-label-md text-xs">Sync Mail</span>
        </button>
      </nav>

      {/* User Profile Card Footer */}
      <div className="mt-auto px-6 flex items-center justify-between gap-2 border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
            {user?.image ? (
              <img src={user.image} alt={user.name || "Executive"} className="w-full h-full object-cover" />
            ) : (
              <img 
                alt="Executive Profile" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIYwpZKiz8a8H8tGbL2-ou1o1HMEulNKClAygiW-IpcY9lCuuV2f9_B06geUA1oJUz8N4wifjuIMGdaKJxXFSNgixQ7xklW4VTlwxHwV3JyyFwxU85H_H4bOCiOsQPhkI0iSFZO-_L4Ky83LFUsaPOQqmkHsxPmUjh9jp_p07htlPQyFvu_hJgJKx8YPKD-9Mv7yrUy6LO2YZs9MEZ145JeqCGP182lLC707gMbD6IlLTSaWGc4pvl"
              />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-on-surface truncate">{user?.name || "Marcus Vane"}</span>
            <span className="text-[10px] text-on-surface-variant opacity-60 truncate">Chief Strategy Officer</span>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          title="Sign Out"
          className="text-on-surface-variant hover:text-error p-1.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>

    </aside>
  );
}
