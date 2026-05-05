import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import type { LinkSuggestionStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body as { status: string };

    if (!id || !status) {
      return NextResponse.json(
        { error: "suggestionId and status are required" },
        { status: 400 }
      );
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const suggestion = await prisma.internalLinkSuggestion.update({
      where: { id },
      data: { status: status as LinkSuggestionStatus },
    });

    return NextResponse.json({ suggestion });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update suggestion" },
      { status: 500 }
    );
  }
}
