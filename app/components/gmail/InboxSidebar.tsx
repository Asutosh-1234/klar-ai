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
    <div className="lg:col-span-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
      <button
        onClick={onComposeClick}
        className="flex items-center justify-center gap-2 px-4 py-3.5 mb-2 rounded-xl bg-primary-container text-white font-bold text-sm hover:scale-95 transition-transform duration-200 glow-button text-center cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">edit</span>
        Compose
      </button>

      {folders.map((folder) => (
        <button
          key={folder.id}
          onClick={() => setSelectedFolder(folder.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left font-medium text-sm cursor-pointer ${
            selectedFolder === folder.id
              ? "bg-primary-container text-white font-semibold"
              : "text-on-surface-variant hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="material-symbols-outlined text-xl">{folder.icon}</span>
          {folder.label}
        </button>
      ))}

      <hr className="border-white/5 my-2" />

      <button
        onClick={onSyncClick}
        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">refresh</span>
        Sync Mail
      </button>
    </div>
  );
}
