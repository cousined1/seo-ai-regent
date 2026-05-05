import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";

export interface WorkspaceAccessContext {
  authenticated: Awaited<ReturnType<typeof requireAuthenticatedUser>>;
  workspace: { id: string; ownerId: string };
}

export async function requireWorkspaceAccess(
  request: Request,
  workspaceId: string | null | undefined,
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId is required" },
      { status: 400 },
    );
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { id: true, ownerId: true },
  });

  if (!workspace || workspace.ownerId !== authenticated.user.id) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  return { authenticated, workspace };
}

export async function requireSiteAccess(request: Request, siteId: string | null | undefined) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  if (!siteId) {
    return NextResponse.json(
      { error: "siteId is required" },
      { status: 400 },
    );
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const site = await prisma.site.findUnique({
    where: { id: siteId },
    select: {
      id: true,
      url: true,
      workspaceId: true,
      workspace: { select: { ownerId: true } },
    },
  });

  if (!site || !site.workspace || site.workspace.ownerId !== authenticated.user.id) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  return { authenticated, site };
}

export async function requireKeywordAccess(request: Request, keywordId: string | null | undefined) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  if (!keywordId) {
    return NextResponse.json(
      { error: "keywordId is required" },
      { status: 400 },
    );
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const keyword = await prisma.keyword.findUnique({
    where: { id: keywordId },
    select: {
      id: true,
      workspaceId: true,
      workspace: { select: { ownerId: true } },
    },
  });

  if (!keyword || !keyword.workspace || keyword.workspace.ownerId !== authenticated.user.id) {
    return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
  }

  return { authenticated, keyword };
}
