'use client'

import { useGmailInbox } from "@/app/lib/hooks/gmail/useGmailInbox";
import { useGmailDrafts } from "@/app/lib/hooks/gmail/useGmailDrafts";
import { InboxSidebar } from "./InboxSidebar";
import { ComposeModal } from "./ComposeModal";
import { MailList } from "./MailList";
import { MailDetails } from "./MailDetails";

export function InboxContainer() {
  const {
    messages,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedFolder,
    setSelectedFolder,
    selectedMessage,
    setSelectedMessage,
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
    validationErrors,
    isSavingDraft,
    sendingDraftId,
    handleSaveDraft,
    handleSendDraft,
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

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden relative">
      
      {/* Sidebar Navigation */}
      <InboxSidebar
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        onComposeClick={openCompose}
        onSyncClick={() => fetchEmails(searchQuery)}
      />

      {/* Email List Pane */}
      <MailList
        messages={messages}
        loading={loading}
        error={error}
        selectedMessage={selectedMessage}
        onSelectMessage={setSelectedMessage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          fetchEmails(searchQuery);
        }}
        selectedFolder={selectedFolder}
      />

      {/* Email Details Pane */}
      <MailDetails
        message={selectedMessage}
        sendingDraftId={sendingDraftId}
        onSendDraft={handleSendDraft}
      />

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
        validationErrors={validationErrors}
        isSavingDraft={isSavingDraft}
        onSubmit={handleSaveDraft}
      />

    </div>
  );
}
