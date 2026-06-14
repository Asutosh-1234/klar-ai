import { corsair } from "@/corsair";
import { prisma } from "../config/prisma";
import ENV from "../config/ENV";
import type { GmailServiceTypes } from "@/app/lib/types";

export const getAllMails = async (params: GmailServiceTypes) => {
  const mails = await corsair.withTenant(params.tenentId).gmail.api.messages.list({
    userId: params.userId,
    q: params.q,
    maxResults: params.maxResults,
    pageToken: params.pageToken,
    labelIds: params.labelIds,
    includeSpamTrash: params.includeSpamTrash
  })
  return mails.messages || []
}


export const getAllDraftMails = async(tenantId: string, userId?: string)=>{
  const mails = await corsair.withTenant(tenantId).gmail.api.drafts.list({
    userId: userId || "me"
  })
  return mails.drafts || []
}
