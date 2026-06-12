'use client'

interface InboxSidebarProps {
  selectedFolder: string;
  setSelectedFolder: (folder: string) => void;
  onComposeClick: () => void;
  onSyncClick: () => void;
}

export function InboxSidebar({
  selectedFolder,
  setSelectedFolder,
  onComposeClick,
  onSyncClick,
}: InboxSidebarProps) {
  const folders = [
    { id: "INBOX", label: "Inbox", icon: "inbox" },
    { id: "SENT", label: "Sent", icon: "send" },
    { id: "DRAFT", label: "Drafts", icon: "draft" },
    { id: "TRASH", label: "Trash", icon: "delete" },
    { id: "SPAM", label: "Spam", icon: "report" },
  ];

  return (
    <div className="lg:col-span-2 flex flex-col gap-2 p-4 bg-surface-sidebar border border-white/[0.04] rounded-xl h-full shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <button
        onClick={onComposeClick}
        className="flex items-center justify-center gap-2 px-4 py-3 mb-4 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(139,92,246,0.25)] w-full"
      >
        <span className="material-symbols-outlined text-sm font-bold">edit</span>
        Compose
      </button>

      <div className="flex-1 flex flex-col gap-1">
        {folders.map((folder) => {
          const isActive = selectedFolder === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => setSelectedFolder(folder.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left text-xs cursor-pointer ${
                isActive
                  ? "bg-primary-container text-primary border-l-2 border-primary font-medium"
                  : "text-on-surface-variant hover:bg-white/[0.02] hover:text-white font-normal"
              }`}
            >
              <span className="material-symbols-outlined text-lg w-5 h-5 flex items-center justify-center shrink-0">
                {folder.icon}
              </span>
              {folder.label}
            </button>
          );
        })}
      </div>

      <hr className="border-white/[0.04] my-3" />

      <button
        onClick={onSyncClick}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.06] text-[11px] font-semibold text-white bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] active:scale-[0.98] transition-all duration-200 cursor-pointer w-full"
      >
        <span className="material-symbols-outlined text-xs">refresh</span>
        Sync Mail
      </button>
    </div>
  );
}
