import { NextResponse } from "next/server";

import { requireSameOrigin } from "@/lib/auth/csrf";
import { withDebugAccess } from "@/lib/debug/responses";
import { invalidateSnapshots } from "@/lib/debug/snapshot-invalidation";
import { recordSnapshotInvalidationEvent } from "@/lib/observability/cache-metrics";

export async function POST(request: Request) {
  const originCheck = requireSameOrigin(request);

  if (originCheck) {
    return originCheck;
  }

  let body: { keyword?: unknown; content?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const keyword = typeof body.keyword === "string" ? body.keyword.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  return withDebugAccess(request, async () => {
    if (!keyword) {
      return NextResponse.json(
        {
          error: "keyword is required. Provide a keyword to invalidate persisted snapshots.",
        },
        { status: 400 },
      );
    }

    const result = await invalidateSnapshots({
      keyword,
      content: content || undefined,
    });

    if ("error" in result) {
      return NextResponse.json(
        {
          error: result.error,
        },
        { status: result.status },
      );
    }

    await recordSnapshotInvalidationEvent(result);

    return result;
  });
}
