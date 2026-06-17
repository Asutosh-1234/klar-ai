'use client'

import { useState, useEffect, useRef } from "react";
import { useGmailInbox } from "@/lib/hooks/gmail/useGmailInbox";
import { useGmailDrafts } from "@/lib/hooks/gmail/useGmailDrafts";
import { InboxSidebar } from "./InboxSidebar";
import { ComposeModal } from "../gmail/ComposeModal";
import { MailList } from "../gmail/MailList";
import { MailDetails } from "../gmail/MailDetails";
import { AICommandCenter } from "./AICommandCenter";
import { AetherCalendarView } from "../calendar/AetherCalendarView";
import { AetherAgentsView } from "../agents/AetherAgentsView";
import { AetherSettingsView } from "./AetherSettingsView";
import { ShortcutsHelpModal } from "./ShortcutsHelpModal";
import { SHORTCUTS } from "@/lib/config/shortcuts";

import { UserProfile, InboxContainerProps } from "@/lib/types";

export function InboxContainer({ user }: InboxContainerProps) {
  const {
    messages,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    selectedCategory,
    setSelectedCategory,
    selectedMessage,
    setSelectedMessage,
    archiveMessage,
    deleteMessage,
    toggleReadStatus,
    unarchiveMessages,
    fetchEmails,
  } = useGmailInbox();

  const {
    isComposeOpen,
    setIsComposeOpen,
    composeTo,
    setComposeTo,
    composeSubject,
    setComposeSubject,
    composeBody,
    setComposeBody,
    attachments,
    setAttachments,
    validationErrors,
    isSavingDraft,
    isSending,
    sendingDraftId,
    handleSaveDraft,
    handleSendDraft,
    handleSendCompose,
    openCompose,
    openComposeForDraft,
  } = useGmailDrafts({
    onDraftSaved: () => {
      setSelectedFolder("DRAFT");
      fetchEmails("", "DRAFT");
    },
    onDraftSent: () => {
      setSelectedMessage(null);
      fetchEmails();
    },
  });

  const isSplitView = !!selectedMessage;

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const lastKeyPressedRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // 1. Direct Ctrl + key combination (simultaneous)
      if (e.ctrlKey && !e.altKey && !e.metaKey) {
        const match = SHORTCUTS.find(s => s.ctrlKey === key);
        if (match && match.category === "navigation") {
          setSelectedFolder(match.id);
          setSelectedMessage(null);
          e.preventDefault();
          return;
        }
      }

      // 2. Sequential key navigation (using lastKeyPressedRef)
      if (lastKeyPressedRef.current === "g" || lastKeyPressedRef.current === "control") {
        const match = SHORTCUTS.find(s => s.seqKey === key);
        if (match && match.category === "navigation") {
          setSelectedFolder(match.id);
          setSelectedMessage(null);
          e.preventDefault();
          lastKeyPressedRef.current = null;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          return;
        }
        // If a sequence key was initiated but not followed by a matching sequence key
        if (key !== "g" && key !== "control") {
          lastKeyPressedRef.current = null;
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
      }

      // 3. Single key action shortcuts
      const composeShortcut = SHORTCUTS.find(s => s.id === "COMPOSE");
      if (composeShortcut?.singleKeys?.includes(key)) {
        e.preventDefault();
        openCompose();
        return;
      }

      const helpShortcut = SHORTCUTS.find(s => s.id === "HELP");
      if (helpShortcut?.singleKeys?.includes(key)) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        return;
      }

      const closeShortcut = SHORTCUTS.find(s => s.id === "CLOSE");
      if (closeShortcut?.singleKeys?.includes(key)) {
        if (isHelpOpen) {
          setIsHelpOpen(false);
          return;
        }
        if (isComposeOpen) {
          setIsComposeOpen(false);
          return;
        }
        if (selectedMessage) {
          setSelectedMessage(null);
          return;
        }
      }

      const prevMailShortcut = SHORTCUTS.find(s => s.id === "PREV_MAIL");
      if (prevMailShortcut?.singleKeys?.includes(key)) {
        if (messages.length > 0) {
          e.preventDefault();
          const currentIndex = selectedMessage ? messages.findIndex(m => m.id === selectedMessage.id) : -1;
          const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : 0;
          if (prevIndex >= 0 && prevIndex < messages.length) {
            setSelectedMessage(messages[prevIndex]);
          }
        }
        return;
      }

      const nextMailShortcut = SHORTCUTS.find(s => s.id === "NEXT_MAIL");
      if (nextMailShortcut?.singleKeys?.includes(key)) {
        if (messages.length > 0) {
          e.preventDefault();
          const currentIndex = selectedMessage ? messages.findIndex(m => m.id === selectedMessage.id) : -1;
          const nextIndex = currentIndex + 1 < messages.length ? currentIndex + 1 : currentIndex;
          if (nextIndex >= 0 && nextIndex < messages.length) {
            setSelectedMessage(messages[nextIndex]);
          }
        }
        return;
      }

      const archiveMailShortcut = SHORTCUTS.find(s => s.id === "ARCHIVE_MAIL");
      if (archiveMailShortcut?.singleKeys?.includes(key)) {
        if (selectedMessage && selectedMessage.id) {
          e.preventDefault();
          archiveMessage(selectedMessage.id);
          setSelectedMessage(null);
        }
        return;
      }

      const deleteMailShortcut = SHORTCUTS.find(s => s.id === "DELETE_MAIL");
      if (deleteMailShortcut?.singleKeys?.includes(key)) {
        if (selectedMessage && selectedMessage.id) {
          e.preventDefault();
          deleteMessage(selectedMessage.id);
          setSelectedMessage(null);
        }
        return;
      }

      const focusSearchShortcut = SHORTCUTS.find(s => s.id === "FOCUS_SEARCH");
      if (focusSearchShortcut?.singleKeys?.includes(key)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Track sequence initiator keys
      if (key === "g" || key === "control") {
        lastKeyPressedRef.current = key;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          lastKeyPressedRef.current = null;
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [openCompose, isHelpOpen, isComposeOpen, selectedMessage, setSelectedFolder, setSelectedMessage, messages, archiveMessage, deleteMessage]);

  const onSearchSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!["CALENDAR", "AGENTS", "SETTINGS"].includes(selectedFolder)) {
      fetchEmails(searchQuery);
    }
  };

  const getSearchPlaceholder = () => {
    switch (selectedFolder) {
      case "CALENDAR":
        return "Search events or agents...";
      case "AGENTS":
        return "Search active agents...";
      case "SETTINGS":
        return "Search configuration options...";
      default:
        return "Search mail and attachments...";
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-on-background">
      
      {/* Sidebar Navigation */}
      <InboxSidebar
        user={user}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        onComposeClick={openCompose}
        onSyncClick={() => fetchEmails(searchQuery)}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-background relative">
        {/* TopNavBar */}
        <header className="flex justify-between items-center w-full px-6 h-16 bg-background border-b border-white/5 z-40 shrink-0">
          <form onSubmit={onSearchSubmit} className="flex items-center flex-1 max-w-2xl">
            <div className="relative w-full border border-white/10 rounded-lg bg-surface-sidebar">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary/40 placeholder:text-outline transition-all text-shadow-zinc-600 font-body-md"
              />
            </div>
          </form>

          <div className="flex items-center gap-4 text-on-surface-variant ml-4 shrink-0">
            {!["CALENDAR", "AGENTS", "SETTINGS"].includes(selectedFolder) && (
              <div className="flex gap-6 mr-6">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    fetchEmails("");
                  }}
                  className={`font-label-caps text-xs tracking-wider transition-colors cursor-pointer ${
                    !searchQuery ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary opacity-80 hover:opacity-100"
                  }`}
                >
                  All Mail
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("is:unread");
                    fetchEmails("is:unread");
                  }}
                  className={`font-label-caps text-xs tracking-wider transition-colors cursor-pointer ${
                    searchQuery === "is:unread" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary opacity-80 hover:opacity-100"
                  }`}
                >
                  Unread
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("is:starred");
                    fetchEmails("is:starred");
                  }}
                  className={`font-label-caps text-xs tracking-wider transition-colors cursor-pointer ${
                    searchQuery === "is:starred" ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary opacity-80 hover:opacity-100"
                  }`}
                >
                  Flagged
                </button>
              </div>
            )}
            <div className="relative group flex items-center justify-center">
              <button 
                onClick={() => {
                  setSelectedFolder("SETTINGS");
                  setSelectedMessage(null);
                }}
                className="hover:text-primary transition-colors material-symbols-outlined cursor-pointer p-1"
              >
                settings
              </button>
              <div className="absolute top-full right-0 mt-2 hidden group-hover:flex bg-surface-sidebar border border-white/10 text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap font-mono z-50 flex-col gap-0.5 items-end">
                <span className="text-on-surface font-semibold text-[9px]">Settings</span>
                <span className="text-primary text-[8px]">Ctrl+O / g+o</span>
              </div>
            </div>
            
            <div className="relative group flex items-center justify-center">
              <button 
                onClick={() => setIsHelpOpen(true)}
                className="hover:text-primary transition-colors material-symbols-outlined cursor-pointer p-1"
              >
                help
              </button>
              <div className="absolute top-full right-0 mt-2 hidden group-hover:flex bg-surface-sidebar border border-white/10 text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap font-mono z-50 flex-col gap-0.5 items-end">
                <span className="text-on-surface font-semibold text-[9px]">Shortcuts Help</span>
                <span className="text-primary text-[8px]">? / h</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area Rendering */}
        <div className="flex flex-1 overflow-hidden min-w-0">
          {selectedFolder === "CALENDAR" ? (
            <AetherCalendarView />
          ) : selectedFolder === "AGENTS" ? (
            <AetherAgentsView user={user} />
          ) : selectedFolder === "SETTINGS" ? (
            <AetherSettingsView />
          ) : (
            <>
              {/* Email List Pane */}
              <MailList
                messages={messages}
                loading={loading}
                error={error}
                selectedMessage={selectedMessage}
                onSelectMessage={setSelectedMessage}
                selectedFolder={selectedFolder}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                archiveMessage={archiveMessage}
                deleteMessage={deleteMessage}
                toggleReadStatus={toggleReadStatus}
                unarchiveMessages={unarchiveMessages}
                isSplitView={isSplitView}
                onEditDraft={openComposeForDraft}
              />

              {/* Email Details Pane */}
              {selectedMessage && (
                <MailDetails
                  message={selectedMessage}
                  sendingDraftId={sendingDraftId}
                  onSendDraft={handleSendDraft}
                  onEditDraft={openComposeForDraft}
                  onClose={() => setSelectedMessage(null)}
                  onDelete={deleteMessage}
                  onArchive={selectedFolder === "ARCHIVE" ? (id) => unarchiveMessages([id]) : archiveMessage}
                  onToggleRead={toggleReadStatus}
                  isArchived={selectedFolder === "ARCHIVE"}
                />
              )}
            </>
          )}
        </div>

        {/* Floating AI Command Center overlay on primary Inbox view */}
        {selectedFolder === "INBOX" && <AICommandCenter />}
      </main>

      {/* Compose Draft Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        composeTo={composeTo}
        setComposeTo={setComposeTo}
        composeSubject={composeSubject}
        setComposeSubject={setComposeSubject}
        composeBody={composeBody}
        setComposeBody={setComposeBody}
        attachments={attachments}
        setAttachments={setAttachments}
        validationErrors={validationErrors}
        isSavingDraft={isSavingDraft}
        isSending={isSending}
        onSubmit={handleSaveDraft}
        onSendCompose={handleSendCompose}
      />

      {/* Keyboard Shortcuts Help Modal */}
      <ShortcutsHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

    </div>
  );
}
