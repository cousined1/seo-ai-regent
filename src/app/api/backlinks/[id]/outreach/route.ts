import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { generateOutreachTemplate } from "@/lib/backlinks/discovery";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, notes, template, siteName, siteUrl, senderName } = body as {
      status: string;
      notes?: string;
      template?: boolean;
      siteName?: string;
      siteUrl?: string;
      senderName?: string;
    };

    if (!id || !status) {
      return NextResponse.json(
        { error: "opportunityId and status are required" },
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

    const opportunity = await prisma.backlinkOpportunity.findUnique({
      where: { id },
    });

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }

    let outreachTemplate = null;
    if (template && siteName && siteUrl && senderName) {
      const da = opportunity.domainAuthority || 0;
      const scoredOpp = {
        source: {
          url: opportunity.sourceUrl,
          domain: opportunity.sourceDomain,
          domainAuthority: opportunity.domainAuthority || undefined,
          pageAuthority: opportunity.pageAuthority || undefined,
          relevance: (opportunity.relevance as "high" | "medium" | "low") || "medium",
          context: opportunity.provenance,
        },
        score: da,
        priority: (da >= 70 ? "high" : da >= 40 ? "medium" : "low") as "high" | "medium" | "low",
      };

      outreachTemplate = generateOutreachTemplate(scoredOpp, {
        siteName,
        siteUrl,
        senderName,
      });
    }

    const log = await prisma.outreachLog.create({
      data: {
        opportunityId: id,
        status: status as any,
        notes: notes || null,
        template: outreachTemplate
          ? JSON.stringify(outreachTemplate)
          : null,
      },
    });

    await prisma.backlinkOpportunity.update({
      where: { id },
      data: { status: status as any },
    });

    return NextResponse.json({
      log,
      template: outreachTemplate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to log outreach" },
      { status: 500 }
    );
  }
}
