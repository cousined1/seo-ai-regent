import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { createSite, listWorkspaceSites } from "@/lib/sites/verification";

export async function POST(request: Request) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  try {
    const body = await request.json();

    if (!body.workspaceId || !body.url) {
      return NextResponse.json(
        { error: "workspaceId and url are required" },
        { status: 400 },
      );
    }

    const site = await createSite({
      workspaceId: body.workspaceId,
      url: body.url,
    });

    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const url = new URL(request.url);
  const workspaceId = url.searchParams.get("workspaceId");

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId query parameter is required" },
      { status: 400 },
    );
  }

  try {
    const sites = await listWorkspaceSites(workspaceId, authenticated.user.id);
    return NextResponse.json({ sites });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list sites" },
      { status: 500 },
    );
  }
}
