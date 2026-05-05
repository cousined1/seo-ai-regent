import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { verifyWorkspaceAccess } from "@/lib/workspaces/service";
import type { Intent } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const workspaceId = (await params).id;

  const hasAccess = await verifyWorkspaceAccess(workspaceId, authenticated.user.id);
  if (!hasAccess) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
  const intent = url.searchParams.get("intent") as Intent | null;
  const search = url.searchParams.get("search") ?? "";

  const where: Record<string, unknown> = { workspaceId };

  if (intent) {
    where.intent = intent;
  }

  if (search) {
    where.query = { contains: search, mode: "insensitive" as const };
  }

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  const [keywords, total] = await Promise.all([
    prisma.keyword.findMany({
      where,
      orderBy: { volume: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        cluster: {
          select: { name: true, intent: true },
        },
      },
    }),
    prisma.keyword.count({ where }),
  ]);

  return NextResponse.json({
    keywords,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
