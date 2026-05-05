import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import {
  encryptJsonCredentials,
  CredentialEncryptionError,
} from "@/lib/security/credentials";
import type { CmsPlatform } from "@prisma/client";

export async function POST(request: Request) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();

    if (!body.workspaceId || !body.platform || !body.siteUrl || !body.credentials) {
      return NextResponse.json(
        { error: "workspaceId, platform, siteUrl, and credentials are required" },
        { status: 400 },
      );
    }

    const platform = body.platform as CmsPlatform;
    const validPlatforms = ["WORDPRESS", "WEBFLOW", "SHOPIFY", "GHOST", "NOTION", "WEBHOOK"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform. Use: WORDPRESS, WEBFLOW, SHOPIFY, GHOST, NOTION, or WEBHOOK" },
        { status: 400 },
      );
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: body.workspaceId },
    });

    if (!workspace || workspace.ownerId !== authenticated.user.id) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    let encryptedCredentials: string;
    try {
      encryptedCredentials = encryptJsonCredentials(body.credentials);
    } catch (error) {
      if (error instanceof CredentialEncryptionError) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      throw error;
    }

    const connection = await prisma.cmsConnection.create({
      data: {
        workspaceId: body.workspaceId,
        platform,
        name: body.name ?? `${platform} Connection`,
        siteUrl: body.siteUrl,
        encryptedCredentials,
      },
    });

    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create CMS connection" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
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
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace || workspace.ownerId !== authenticated.user.id) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const connections = await prisma.cmsConnection.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const sanitized = connections.map((c) => ({
      id: c.id,
      platform: c.platform,
      name: c.name,
      siteUrl: c.siteUrl,
      status: c.status,
      connectedAt: c.connectedAt,
      lastTestedAt: c.lastTestedAt,
    }));

    return NextResponse.json({ connections: sanitized });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list CMS connections" },
      { status: 500 },
    );
  }
}
