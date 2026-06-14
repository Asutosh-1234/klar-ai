'use client'

import { signOut } from 'next-auth/react';

import { UserProfile, InboxSidebarProps } from '@/app/lib/types';

export function InboxSidebar({
  user,
  selectedFolder,
  setSelectedFolder,
  onComposeClick,
  onSyncClick,
}: InboxSidebarProps) {
  const folders = [
    { id: "INBOX", label: "Inbox", icon: "inbox" },
    { id: "SENT", label: "Sent", icon: "send" },
    { id: "DRAFT", label: "Drafts", icon: "drafts" },
    { id: "TRASH", label: "Archive", icon: "archive" },
    { id: "SPAM", label: "Spam", icon: "report" },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col h-full py-8 bg-surface-sidebar border-r border-white/5 z-50">
      {/* Brand Header */}
      <div className="px-6 mb-8">
        <h1 className="font-headline-md text-xl font-bold text-white tracking-tight">Klar AI</h1>
        <p className="text-on-surface-variant font-label-caps text-[9px] tracking-widest mt-1">INTELLIGENCE HUB</p>
      </div>

      {/* Compose Button */}
      <div className="px-6 mb-6">
        <button
          onClick={onComposeClick}
          className="w-full py-3 bg-primary-container text-white rounded-full font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-200 active:scale-95 shadow-[0_0_30px_rgba(139,92,246,0.15)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm font-bold">edit</span>
          Compose
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {folders.map((folder) => {
          const isActive = selectedFolder === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`w-full flex items-center px-6 py-2.5 transition-all duration-150 text-left text-xs cursor-pointer ${
                isActive
                  ? "text-primary font-bold border-r-2 border-primary bg-primary/5"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-white font-normal"
              }`}
            >
              <span className={`material-symbols-outlined mr-3 ${isActive ? "text-primary" : "text-on-surface-variant"}`}>
                {folder.icon}
              </span>
              <span className="font-body-md">{folder.label}</span>
            </button>
          );
        })}

        <hr className="border-white/5 my-4" />

        {/* Back to Dashboard Link */}
        <a
          href="/connect"
          className="flex items-center px-6 py-2.5 text-on-surface-variant hover:bg-white/5 hover:text-white transition-all text-xs group"
        >
          <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary">
            arrow_back
          </span>
          <span className="font-body-md">Dashboard</span>
        </a>

        {/* Sync Mail Action */}
        <button
          onClick={onSyncClick}
          className="w-full flex items-center px-6 py-2.5 text-on-surface-variant hover:bg-white/5 hover:text-white transition-all text-xs group text-left cursor-pointer"
        >
          <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary">
            refresh
          </span>
          <span className="font-body-md">Sync Mail</span>
        </button>
      </nav>

      {/* User Profile Card Footer */}
      <div className="mt-auto px-6 flex items-center justify-between gap-2 border-t border-white/5 pt-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant text-base">person</span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-on-surface truncate">{user.name || "User"}</span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Pro Plan</span>
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
