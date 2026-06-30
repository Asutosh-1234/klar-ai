import { listEmailsTool, sendEmailTool, requestEmailDeletionTool } from "./gmail";
import { listCalendarEventsTool, createCalendarEventTool, deleteCalendarEventTool } from "./calendar";

export {
  listEmailsTool,
  sendEmailTool,
  requestEmailDeletionTool,
  listCalendarEventsTool,
  createCalendarEventTool,
  deleteCalendarEventTool
};

export function getAiTools({
  tenantId,
  onRequestEmailDeletion,
}: {
  tenantId: string;
  onRequestEmailDeletion?: (info: { emailId: string; subject: string; sender: string }) => void;
}) {
  return {
    listEmails: listEmailsTool(tenantId),
    sendEmail: sendEmailTool(tenantId),
    requestEmailDeletion: requestEmailDeletionTool(onRequestEmailDeletion),
    listCalendarEvents: listCalendarEventsTool(tenantId),
    createCalendarEvent: createCalendarEventTool(tenantId),
    deleteCalendarEvent: deleteCalendarEventTool(tenantId),
  };
}
