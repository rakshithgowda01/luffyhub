import { NextRequest, NextResponse } from "next/server";
import { HubMeta } from "../../utils/defaultHubContent";
import { loadHubContent, saveHubContent } from "../../utils/hubPersistence";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../utils/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const meta = await loadHubContent();
    return NextResponse.json(meta, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
      meta?: HubMeta;
    };

    if (
      body.username !== ADMIN_USERNAME ||
      body.password !== ADMIN_PASSWORD
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!body.meta || typeof body.meta !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await saveHubContent(body.meta);
    return NextResponse.json({
      ok: true,
      mode: result.mode,
      updatedAt: body.meta.updatedAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 }
    );
  }
}
