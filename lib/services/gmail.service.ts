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

export const getMessageDetails = async (tenantId: string, messageId: string) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.messages.get({
      id: messageId,
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

export const getDraftDetails = async (tenantId: string, draftId: string) => {
  return await handleGmailCall(
    corsair.withTenant(tenantId).gmail.api.drafts.get({
      id: draftId,
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
