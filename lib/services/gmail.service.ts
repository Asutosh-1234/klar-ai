import { corsair } from "@/corsair";
import type { GmailServiceTypes } from "@/lib/types";

class AuthMissingError extends Error {
  pluginId = "gmail";

  constructor(message: string) {
    super(message);
    this.name = "AuthMissingError";
  }
}

function normalizeGmailError(error: unknown): never {
  const err = error as any;
  const message = typeof err === "string" ? err : err?.message ?? "";
  const errorCode = err?.error;
  const errorDescription = err?.error_description ?? err?.errorDescription ?? "";

  if (
    errorCode === "invalid_grant" ||
    message.includes("invalid_grant") ||
    message.includes("expired or revoked") ||
    errorDescription.includes("expired or revoked")
  ) {
    throw new AuthMissingError("auth-missing");
  }

  throw error;
}

async function handleGmailCall<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error: unknown) {
    normalizeGmailError(error);
  }
}

export const getAllMails = async (params: GmailServiceTypes) => {
  if (!params.userId && !params.pageToken && !params.includeSpamTrash && !params.labelIds) {
    throw new Error("input required");
  }
  
  const mails = await handleGmailCall(
    corsair.withTenant(params.tenentId).gmail.api.messages.list({
      userId: params.userId,
      q: params.q,
      maxResults: params.maxResults,
      pageToken: params.pageToken,
      labelIds: params.labelIds,
      includeSpamTrash: params.includeSpamTrash,
    })
  );

  return mails.messages || [];
}


export const getAllDraftMails = async (tenantId: string, userId?: string) => {
  const mails = await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.drafts.list({
      userId: userId || "me",
    })
  );
  return mails.drafts || [];
}

export const getMessageDetails = async (
  tenantId: string,
  messageId: string,
  format?: "minimal" | "full" | "raw" | "metadata"
) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.messages.get({
      id: messageId,
      format: format || undefined,
    })
  );
}

export const modifyMessage = async (
  tenantId: string,
  messageId: string,
  labels: { addLabelIds?: string[]; removeLabelIds?: string[] }
) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.messages.modify({
      id: messageId,
      addLabelIds: labels.addLabelIds,
      removeLabelIds: labels.removeLabelIds,
    })
  );
}

export const trashMessage = async (tenantId: string, messageId: string) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.messages.trash({
      id: messageId,
    })
  );
}

export const getDraftDetails = async (
  tenantId: string,
  draftId: string,
  format?: "minimal" | "full" | "raw" | "metadata"
) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.drafts.get({
      id: draftId,
      format: format || undefined,
    })
  );
}

export const createDraft = async (tenantId: string, rawMime: string, threadId?: string) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.drafts.create({
      draft: {
        message: {
          raw: rawMime,
          threadId: threadId || undefined,
        },
      },
    })
  );
}

export const updateDraft = async (tenantId: string, draftId: string, rawMime: string) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.drafts.update({
      id: draftId,
      draft: {
        message: {
          raw: rawMime,
        },
      },
    })
  );
}

export const sendDraft = async (tenantId: string, draftId: string) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.drafts.send({
      id: draftId,
    })
  );
}

export const getArchivedMails = async (params: GmailServiceTypes) => {
  const query = params.q ? `in:archive ${params.q}` : "in:archive";
  const mails = await handleGmailCall(
    corsair.withTenant(params.tenentId).gmail.api.messages.list({
      userId: params.userId,
      q: query,
      maxResults: params.maxResults,
      pageToken: params.pageToken,
      includeSpamTrash: params.includeSpamTrash,
    })
  );
  return mails.messages || [];
}

export const removeFromArchive = async (tenantId: string, messageIds: string[]) => {
  if (Array.isArray(messageIds)) {
    await Promise.all(
      messageIds.map(async (messageId) => {
        await handleGmailCall(
          corsair.withTenant(tenantId).gmail.api.messages.modify({
            id: messageId,
            addLabelIds: ["INBOX"],
          })
        );
      })
    );
  }
}

export const getAllSentMails = async (params: GmailServiceTypes) => {
  const query = params.q ? `in:sent ${params.q}` : "in:sent";
  const mails = await handleGmailCall(
    corsair.withTenant(params.tenentId).gmail.api.messages.list({
      userId: params.userId,
      q: query,
      maxResults: params.maxResults,
      pageToken: params.pageToken,
      includeSpamTrash: params.includeSpamTrash,
    })
  );
  return mails.messages || [];
}

/**
 * Reads emails from the local database synced by Corsair.
 */
export const searchMailsFromDb = async (tenantId: string, q?: string) => {
  const dbMessages = await corsair.withTenant(tenantId).gmail.db.messages.search({
    data: {},
  });

  let messages = dbMessages.map((msg) => ({
    ...msg.data,
    id: msg.entity_id,
  }));

  if (q) {
    const lowerQ = q.toLowerCase();

    const hasInboxFilter = lowerQ.includes("label:inbox") || lowerQ.includes("in:inbox");
    const hasSentFilter = lowerQ.includes("label:sent") || lowerQ.includes("in:sent");
    const hasStarredFilter = lowerQ.includes("is:starred") || lowerQ.includes("label:starred");
    const hasTrashFilter = lowerQ.includes("label:trash") || lowerQ.includes("in:trash");
    const hasSpamFilter = lowerQ.includes("label:spam") || lowerQ.includes("in:spam");
    const hasCategoryPrimary = lowerQ.includes("category:primary");

    messages = messages.filter((msg: any) => {
      const labels = msg.labelIds || [];
      const lowerLabels = labels.map((l: string) => l.toLowerCase());

      if (hasInboxFilter && !lowerLabels.includes("inbox")) return false;
      if (hasSentFilter && !lowerLabels.includes("sent")) return false;
      if (hasStarredFilter && !lowerLabels.includes("starred")) return false;
      if (hasTrashFilter && !lowerLabels.includes("trash")) return false;
      if (hasSpamFilter && !lowerLabels.includes("spam")) return false;
      if (hasCategoryPrimary) {
        const otherCategories = ["category_updates", "category_promotions", "category_social", "category_forums"];
        if (otherCategories.some(cat => lowerLabels.includes(cat))) {
          return false;
        }
      }

      const searchKeywords = q
        .split(/\s+/)
        .filter(word => !word.includes("label:") && !word.includes("category:") && !word.includes("in:") && !word.includes("is:"))
        .join(" ")
        .trim();

      if (searchKeywords) {
        const lowerKeywords = searchKeywords.toLowerCase();
        const subjectMatch = (msg.subject || "").toLowerCase().includes(lowerKeywords);
        const snippetMatch = (msg.snippet || "").toLowerCase().includes(lowerKeywords);
        const bodyMatch = (msg.body || "").toLowerCase().includes(lowerKeywords);
        const fromMatch = (msg.from || "").toLowerCase().includes(lowerKeywords);
        const toMatch = (msg.to || "").toLowerCase().includes(lowerKeywords);

        return subjectMatch || snippetMatch || bodyMatch || fromMatch || toMatch;
      }

      return true;
    });
  }

  messages.sort((a: any, b: any) => {
    const timeA = a.internalDate ? new Date(a.internalDate).getTime() : 0;
    const timeB = b.internalDate ? new Date(b.internalDate).getTime() : 0;
    return timeB - timeA;
  });

  return messages;
};
