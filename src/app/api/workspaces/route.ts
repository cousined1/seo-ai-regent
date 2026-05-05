import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { createWorkspace, listUserWorkspaces } from "@/lib/workspaces/service";

export async function GET(request: Request) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  try {
    const workspaces = await listUserWorkspaces(authenticated.user.id);
    return NextResponse.json({ workspaces });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list workspaces" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  try {
    const body = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Workspace name is required" },
        { status: 400 },
      );
    }

    const workspace = await createWorkspace({
      name: body.name,
      ownerId: authenticated.user.id,
    });

    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 },
    );
  }
}
