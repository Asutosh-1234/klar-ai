import { createEvent } from "../lib/services/calendar.service";
import { prisma } from "../lib/config/prisma";

async function main() {
  const tenantId = "usr_100738087255653606617"; // standard test tenant ID from delete script
  
  console.log("Attempting to create calendar event...");
  try {
    const start = new Date();
    start.setHours(18, 0, 0, 0); // 6 PM today
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 7 PM
    
    const created = await createEvent(tenantId, {
      summary: "Test Meeting",
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() }
    });
    
    console.log("Success! Created event:", created);
  } catch (error: any) {
    console.error("Error creating event:");
    if (error && typeof error === "object") {
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.error(error);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
