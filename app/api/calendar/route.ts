import { NextResponse, NextRequest } from "next/server";
import { getSessionTenantId } from "@/lib/auth/session";
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEventsFromDb,
} from "@/lib/services/calendar.service";

export async function GET(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeMin = searchParams.get("timeMin") || undefined;
    const timeMax = searchParams.get("timeMax") || undefined;
    const query = searchParams.get("q") || undefined;
    const useDb = searchParams.get("db") === "true";

    let events;
    if (useDb) {
      events = await searchEventsFromDb(tenantId, query);
    } else {
      events = await getAllEvents(tenantId, timeMin, timeMax);
    }

    return NextResponse.json({ events, connected: true });
  } catch (error: any) {
    const isAuthMissing =
      error?.name === "AuthMissingError" ||
      error?.message?.includes("auth-missing") ||
      error?.pluginId === "googlecalendar" ||
      (typeof error === "object" && error !== null && "pluginId" in error);

    if (isAuthMissing) {
      return NextResponse.json({ events: [], connected: false });
    }

    console.error("Error in GET /api/calendar:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { event } = body;

    if (!event || !event.summary || !event.start || !event.end) {
      return NextResponse.json(
        { error: "Missing required event fields (summary, start, end)" },
        { status: 400 }
      );
    }

    const created = await createEvent(tenantId, event);
    return NextResponse.json({ success: true, event: created });
  } catch (error: any) {
    const isAuthMissing =
      error?.name === "AuthMissingError" ||
      error?.message?.includes("auth-missing") ||
      error?.pluginId === "googlecalendar" ||
      (typeof error === "object" && error !== null && "pluginId" in error);

    if (isAuthMissing) {
      return NextResponse.json({ error: "auth-missing", connected: false }, { status: 400 });
    }

    console.error("Error in POST /api/calendar:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, event } = body;

    if (!id || !event) {
      return NextResponse.json({ error: "Missing event id or update fields" }, { status: 400 });
    }

    const updated = await updateEvent(tenantId, id, event);
    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    const isAuthMissing =
      error?.name === "AuthMissingError" ||
      error?.message?.includes("auth-missing") ||
      error?.pluginId === "googlecalendar" ||
      (typeof error === "object" && error !== null && "pluginId" in error);

    if (isAuthMissing) {
      return NextResponse.json({ error: "auth-missing", connected: false }, { status: 400 });
    }

    console.error("Error in PATCH /api/calendar:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tenantId = await getSessionTenantId(request);
    if (!tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    await deleteEvent(tenantId, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    const isAuthMissing =
      error?.name === "AuthMissingError" ||
      error?.message?.includes("auth-missing") ||
      error?.pluginId === "googlecalendar" ||
      (typeof error === "object" && error !== null && "pluginId" in error);

    if (isAuthMissing) {
      return NextResponse.json({ error: "auth-missing", connected: false }, { status: 400 });
    }

    console.error("Error in DELETE /api/calendar:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
