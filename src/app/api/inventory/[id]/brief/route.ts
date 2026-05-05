import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getPrismaClient } from "@/lib/db";
import { createRefreshBrief } from "@/lib/inventory/service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const inventoryItemId = (await params).id;

  const prisma = getPrismaClient();
  if (!prisma) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 },
    );
  }

  try {
    const item = await prisma.contentInventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: { site: { include: { workspace: true } } },
    });

    if (!item || !item.site || !item.site.workspace || item.site.workspace.ownerId !== authenticated.user.id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const result = await createRefreshBrief(inventoryItemId);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create refresh brief" },
      { status: 500 },
    );
  }
}
