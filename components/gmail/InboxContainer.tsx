'use client'

import { useGmailInbox } from "@/lib/hooks/gmail/useGmailInbox";
import { useGmailDrafts } from "@/lib/hooks/gmail/useGmailDrafts";
import { InboxSidebar } from "./InboxSidebar";
import { ComposeModal } from "./ComposeModal";
import { MailList } from "./MailList";
import { MailDetails } from "./MailDetails";
import { AICommandCenter } from "./AICommandCenter";
import { AetherCalendarView } from "./AetherCalendarView";
import { AetherPurchasesView } from "./AetherPurchasesView";
import { AetherAgentsView } from "./AetherAgentsView";
import { AetherSettingsView } from "./AetherSettingsView";

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

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!["CALENDAR", "PURCHASES", "AGENTS", "SETTINGS"].includes(selectedFolder)) {
      fetchEmails(searchQuery);
    }
  };

  const getSearchPlaceholder = () => {
    switch (selectedFolder) {
      case "CALENDAR":
        return "Search events or agents...";
      case "PURCHASES":
        return "Search transactions, invoices, or vendors...";
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
                type="text"
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary/40 placeholder:text-outline transition-all text-shadow-zinc-600 font-body-md"
              />
            </div>
          </form>

          <div className="flex items-center gap-4 text-on-surface-variant ml-4 shrink-0">
            {!["CALENDAR", "PURCHASES", "AGENTS", "SETTINGS"].includes(selectedFolder) && (
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
            <button className="hover:text-primary transition-colors material-symbols-outlined cursor-pointer">settings</button>
            <button className="hover:text-primary transition-colors material-symbols-outlined cursor-pointer">help</button>
          </div>
        </header>

        {/* Content Area Rendering */}
        <div className="flex flex-1 overflow-hidden min-w-0">
          {selectedFolder === "CALENDAR" ? (
            <AetherCalendarView />
          ) : selectedFolder === "PURCHASES" ? (
            <AetherPurchasesView />
          ) : selectedFolder === "AGENTS" ? (
            <AetherAgentsView />
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
                isSplitView={isSplitView}
              />

              {/* Email Details Pane */}
              {selectedMessage && (
                <MailDetails
                  message={selectedMessage}
                  sendingDraftId={sendingDraftId}
                  onSendDraft={handleSendDraft}
                  onClose={() => setSelectedMessage(null)}
                  onDelete={deleteMessage}
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

    </div>
  );
}
