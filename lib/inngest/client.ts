import { Inngest } from "inngest";

// Initialize Inngest client
export const inngest = new Inngest({
  id: "klar-os",
  eventKey: process.env.INNGEST_EVENT_KEY || "noop",
});
