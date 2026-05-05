import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { importUrls } from "@/lib/inventory/service";
import type { ImportSource } from "@prisma/client";

export async function POST(request: Request) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  try {
    const body = await request.json();

    if (!body.siteId || !body.urls || !Array.isArray(body.urls)) {
      return NextResponse.json(
        { error: "siteId and urls array are required" },
        { status: 400 },
      );
    }

    const source = (body.source ?? "MANUAL") as ImportSource;
    const items = await importUrls(body.siteId, body.urls, source);

    return NextResponse.json({ items, count: items.length }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to import URLs" },
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
  const siteId = url.searchParams.get("siteId");

  if (!siteId) {
    return NextResponse.json(
      { error: "siteId query parameter is required" },
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

  try {
    const site = await prisma.site.findUnique({
      where: { id: siteId },
      include: { workspace: true },
    });

    if (!site || !site.workspace || site.workspace.ownerId !== authenticated.user.id) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    const items = await prisma.contentInventoryItem.findMany({
      where: { siteId },
      include: {
        scoreSnapshots: {
          orderBy: { snapshotDate: "desc" },
          take: 1,
        },
        briefs: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = items.map((item) => ({
      id: item.id,
      url: item.url,
      title: item.title,
      metaDescription: item.metaDescription,
      importedFrom: item.importedFrom,
      createdAt: item.createdAt,
      contentScore: item.scoreSnapshots[0]?.contentScore ?? null,
      geoScore: item.scoreSnapshots[0]?.geoScore ?? null,
      hasBrief: item.briefs.length > 0,
      briefStatus: item.briefs[0]?.status ?? null,
    }));

    return NextResponse.json({ items: formatted, total: formatted.length });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to list inventory" },
      { status: 500 },
    );
  }
}
