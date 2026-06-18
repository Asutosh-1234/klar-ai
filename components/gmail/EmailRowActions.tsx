'use client'

import { EmailRowActionsProps } from "@/lib/types";

export function EmailRowActions({
  isUnread,
  onArchive,
  onDelete,
  onToggleRead,
  className = "",
  isArchived = false,
  isDraft = false,
  onEdit,
}: EmailRowActionsProps) {
  return (
    <div className={`flex items-center justify-end gap-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${className}`}>
      {isDraft ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          title="Edit Draft"
          className="text-on-surface-variant hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onArchive();
          }}
          title={isArchived ? "Move to Inbox" : "Archive"}
          className="text-on-surface-variant hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">
            {isArchived ? "unarchive" : "archive"}
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete"
        className="text-on-surface-variant hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
      {!isDraft && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead();
          }}
          title={isUnread ? "Mark as Read" : "Mark as Unread"}
          className="text-on-surface-variant hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">
            {isUnread ? "drafts" : "mail"}
          </span>
        </button>
      )}
    </div>
  );
}
