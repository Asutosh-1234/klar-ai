'use client'

import { useState, useEffect, useRef } from "react";
import { getHeader, getSenderName, formatDate, getAttachments } from "@/lib/utils/gmail";
import { GmailMessage, MailListProps } from "@/lib/types";
import { EmailCheckbox } from "./EmailCheckbox";
import { EmailStar } from "./EmailStar";
import { EmailSender } from "./EmailSender";
import { EmailTextContent } from "./EmailTextContent";
import { EmailRowActions } from "./EmailRowActions";



export function MailList({
  messages,
  loading,
  error,
  selectedMessage,
  onSelectMessage,
  selectedFolder,
  selectedCategory,
  setSelectedCategory,
  archiveMessage,
  deleteMessage,
  toggleReadStatus,
  unarchiveMessages,
  isSplitView,
  onEditDraft,
  onRefresh,
}: MailListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedIds([]);
  }, [selectedFolder, selectedCategory]);

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => messages.some(m => m.id === id)));
  }, [messages]);

  const isAllSelected = messages.length > 0 && messages.every(msg => msg.id && selectedIds.includes(msg.id));
  const isSomeSelected = messages.length > 0 && messages.some(msg => msg.id && selectedIds.includes(msg.id)) && !isAllSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectMessage = (id: string, checked: boolean) => {
    setSelectedIds(prev =>
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(messages.map(msg => msg.id).filter((id): id is string => !!id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleBulkArchive = async () => {
    const ids = [...selectedIds];
    setSelectedIds([]);
    if (selectedFolder === "ARCHIVE") {
      await unarchiveMessages(ids);
    } else {
      for (const id of ids) {
        await archiveMessage(id);
      }
    }
  };

  const handleBulkDelete = async () => {
    const ids = [...selectedIds];
    setSelectedIds([]);
    for (const id of ids) {
      await deleteMessage(id);
    }
  };

  const handleBulkToggleRead = async (shouldMarkRead: boolean) => {
    const ids = [...selectedIds];
    setSelectedIds([]);
    for (const id of ids) {
      await toggleReadStatus(id, shouldMarkRead);
    }
  };

  const categories = [
    { id: "primary", label: "Primary", icon: "inbox" },
    { id: "promotions", label: "Promotions", icon: "sell" },
    { id: "social", label: "Social", icon: "group" },
    { id: "updates", label: "Updates", icon: "info" },
  ];

  return (
    <div className={`flex flex-col bg-surface-sidebar h-full transition-all duration-300 ${
      isSplitView ? "w-[400px] border-r border-white/5 shrink-0" : "flex-1"
    }`}>
      {/* Category Tabs / Header */}
      {isSplitView ? (
        // Split view left pane header
        <div className="p-4 flex items-center justify-between border-b border-white/5 shrink-0 bg-surface-sidebar h-12">
          <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase">
            {selectedFolder === "INBOX" ? "Inbox" : selectedFolder.toLowerCase()}
          </span>
          <span className="material-symbols-outlined text-sm text-on-surface-variant cursor-pointer">filter_list</span>
        </div>
      ) : (
        // Full width category tab bar
        selectedFolder === "INBOX" && (
          <section className="px-6 border-b border-white/5 bg-background flex items-center h-12 gap-10 shrink-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-full border-b-2 flex items-center gap-2 px-1 transition-all group cursor-pointer ${
                    isActive
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {cat.icon}
                  </span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              );
            })}
          </section>
        )
      )}

      {/* Action Header (Only in Inbox View) */}
      {!isSplitView && (
        <div className="px-6 py-2 flex items-center gap-4 text-on-surface-variant border-b border-white/5 bg-surface-sidebar z-10 shrink-0 h-10">
          <input
            ref={headerCheckboxRef}
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary/20 cursor-pointer"
          />
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleBulkArchive}
                title={selectedFolder === "ARCHIVE" ? "Move to Inbox" : "Archive selected"}
                className="material-symbols-outlined text-[20px] hover:text-white cursor-pointer"
              >
                {selectedFolder === "ARCHIVE" ? "unarchive" : "archive"}
              </button>
              <button
                onClick={handleBulkDelete}
                title="Delete selected"
                className="material-symbols-outlined text-[20px] hover:text-white cursor-pointer"
              >
                delete
              </button>
              <button
                onClick={() => handleBulkToggleRead(true)}
                title="Mark as read"
                className="material-symbols-outlined text-[20px] hover:text-white cursor-pointer"
              >
                drafts
              </button>
              <button
                onClick={() => handleBulkToggleRead(false)}
                title="Mark as unread"
                className="material-symbols-outlined text-[20px] hover:text-white cursor-pointer"
              >
                mail
              </button>
              <span className="text-xs text-on-surface-variant opacity-80">
                {selectedIds.length} selected
              </span>
            </div>
          ) : (
            <>
              <button
                onClick={onRefresh}
                title="Refresh"
                className={`material-symbols-outlined text-[20px] hover:text-white cursor-pointer ${loading ? 'animate-spin text-primary' : ''}`}
              >
                refresh
              </button>
              <button className="material-symbols-outlined text-[20px] hover:text-white cursor-pointer">more_vert</button>
            </>
          )}
        </div>
      )}

      {/* Email Items Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-surface-sidebar">
        {loading ? (
          // Skeleton states
          Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="py-3 px-6 flex gap-3 animate-pulse items-center border-b border-white/5">
              <div className="w-4 h-4 bg-white/5 rounded shrink-0" />
              <div className="w-4 h-4 bg-white/5 rounded shrink-0" />
              <div className="h-3 bg-white/5 rounded w-28 shrink-0" />
              <div className="h-3 bg-white/5 rounded flex-1" />
              <div className="h-3 bg-white/5 rounded w-10 shrink-0" />
            </div>
          ))
        ) : error ? (
          <div className="p-6 text-center text-error text-xs font-medium">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-10 text-center text-on-surface-variant flex flex-col items-center justify-center h-full gap-3 opacity-60">
            <span className="material-symbols-outlined text-3xl">mail</span>
            <p className="text-xs font-medium">No emails found in this category</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg) => {
              const from = getHeader(msg, "from");
              const to = getHeader(msg, "to");
              const subject = getHeader(msg, "subject") || "(No Subject)";
              const isSelected = selectedMessage?.id === msg.id;
              const dateVal = msg.internalDate ? parseInt(String(msg.internalDate)) : getHeader(msg, "date");

              const isDraft = selectedFolder === "DRAFT" || !!msg.draftId;
              const displayName = isDraft ? `To: ${to || "Draft"}` : getSenderName(from);
              const isUnread = msg.labelIds?.includes("UNREAD");
              const isStarred = msg.labelIds?.includes("STARRED");

              if (isSplitView) {
                // Compact multi-line cards for Split Pane View (from details_design.html)
                return (
                  <div
                    key={msg.id}
                    onClick={() => onSelectMessage(msg)}
                    className={`p-5 hover:bg-white/3 transition-all duration-200 hover:translate-x-1 cursor-pointer border-b border-white/5 relative ${
                      isSelected ? "bg-white/5 border-l-4 border-primary" : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold font-body-md truncate max-w-[220px] ${isUnread ? "text-white" : "text-on-surface-variant"}`}>
                        {displayName}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {getAttachments(msg).length > 0 && (
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/60" title="Has attachments">
                            attachment
                          </span>
                        )}
                        <span className="text-[10px] text-on-surface-variant opacity-60">
                          {formatDate(dateVal)}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm font-semibold truncate mb-1 ${isUnread ? "text-primary font-bold" : "text-on-surface font-semibold"}`}>
                      {subject}
                    </p>
                    <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                      {msg.snippet}
                    </p>
                  </div>
                );
              }

              // Information-dense single-line layout (from inbox_design.html)
              return (
                <div
                  key={msg.id}
                  onClick={() => onSelectMessage(msg)}
                  className={`email-row group flex items-center w-full overflow-hidden h-[42px] px-6 border-l-2 cursor-pointer border-b border-white/3 transition-all duration-150 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-white/2"
                  }`}
                >
                  {/* Checkbox + Star */}
                  <div className="flex items-center gap-4 w-16 shrink-0">
                    <EmailCheckbox
                      checked={msg.id ? selectedIds.includes(msg.id) : false}
                      onChange={(checked) => msg.id && handleSelectMessage(msg.id, checked)}
                    />
                    <EmailStar
                      isStarred={!!isStarred}
                      onToggle={() => {
                        // Gmail label sync/update logic would happen in a real action
                      }}
                    />
                  </div>

                  {/* Sender Name */}
                  <EmailSender name={displayName} isUnread={!!isUnread} />

                  {/* Subject + Snippet on a single line with " - " separator */}
                  <div className="flex-1 flex items-center min-w-0 gap-2 pr-4">
                    <EmailTextContent
                      subject={subject}
                      snippet={msg.snippet || ""}
                      isUnread={!!isUnread}
                    />
                    {getAttachments(msg).length > 0 && (
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 shrink-0" title="Has attachments">
                        attachment
                      </span>
                    )}
                  </div>

                  {/* Date / Hover Actions (Fixed Slot Width: 80px) */}
                  <div className="w-20 shrink-0 flex justify-end text-right relative h-5 items-center">
                    {/* Date */}
                    <span className={`text-xs font-medium group-hover:hidden whitespace-nowrap ${isUnread ? "font-bold text-white" : "text-on-surface-variant"}`}>
                      {formatDate(dateVal)}
                    </span>
                    {/* Action Icons (fade in on hover in same slot) */}
                    <EmailRowActions
                      isUnread={!!isUnread}
                      onArchive={() => selectedFolder === "ARCHIVE" ? unarchiveMessages([msg.id!]) : archiveMessage(msg.id!)}
                      onDelete={() => deleteMessage(msg.id!)}
                      onToggleRead={() => toggleReadStatus(msg.id!, !!isUnread)}
                      isArchived={selectedFolder === "ARCHIVE"}
                      isDraft={isDraft}
                      onEdit={() => onEditDraft?.(msg)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
