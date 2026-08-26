import { NextRequest, NextResponse } from "next/server";
import { saveNotePdf } from "../../utils/hubPersistence";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "../../utils/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    const id = String(form.get("id") ?? "");
    const file = form.get("file");

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF allowed" }, { status: 400 });
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be under 8MB" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await saveNotePdf(id, file.name, bytes);

    return NextResponse.json({
      ok: true,
      url: result.url,
      mode: result.mode,
      fileName: file.name,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
