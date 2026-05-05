import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import {
  prioritizeOpportunities,
  extractDomain,
  type BacklinkSource,
} from "@/lib/backlinks/discovery";
import { requireWorkspaceAccess } from "@/lib/workspaces/access";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, sources } = body as {
      workspaceId: string;
      sources: Array<{
        url: string;
        domainAuthority?: number;
        pageAuthority?: number;
        relevance?: string;
        context: string;
        contactEmail?: string;
        contactName?: string;
      }>;
    };

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }

    if (!sources || !Array.isArray(sources)) {
      return NextResponse.json(
        { error: "sources array is required" },
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

    const backlinkSources: BacklinkSource[] = sources.map((s) => ({
      url: s.url,
      domain: extractDomain(s.url),
      domainAuthority: s.domainAuthority,
      pageAuthority: s.pageAuthority,
      relevance: (s.relevance as "high" | "medium" | "low") || "medium",
      context: s.context,
      contactEmail: s.contactEmail,
      contactName: s.contactName,
    }));

    const prioritized = prioritizeOpportunities(backlinkSources);

    const created = await Promise.all(
      prioritized.map((opp) =>
        prisma.backlinkOpportunity.create({
          data: {
            workspaceId,
            sourceUrl: opp.source.url,
            sourceDomain: opp.source.domain,
            domainAuthority: opp.source.domainAuthority || null,
            pageAuthority: opp.source.pageAuthority || null,
            relevance: opp.source.relevance || null,
            provenance: opp.source.context,
            contactEmail: opp.source.contactEmail || null,
            contactName: opp.source.contactName || null,
          },
        })
      )
    );

    return NextResponse.json({
      count: created.length,
      opportunities: created,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to discover backlink opportunities" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");
    const status = searchParams.get("status");

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const where: Record<string, unknown> = { workspaceId };
    if (status) where.status = status;

    const opportunities = await prisma.backlinkOpportunity.findMany({
      where,
      orderBy: [{ domainAuthority: "desc" }],
      include: {
        _count: {
          select: { outreachLogs: true },
        },
      },
    });

    const summary = {
      total: opportunities.length,
      identified: opportunities.filter(
        (o) => o.status === "IDENTIFIED"
      ).length,
      outreachSent: opportunities.filter(
        (o) => o.status === "OUTREACH_SENT"
      ).length,
      linkAcquired: opportunities.filter(
        (o) => o.status === "LINK_ACQUIRED"
      ).length,
      avgAuthority:
        opportunities.length > 0
          ? Math.round(
              opportunities.reduce(
                (sum, o) => sum + (o.domainAuthority || 0),
                0
              ) / opportunities.length
            )
          : 0,
    };

    return NextResponse.json({ opportunities, summary });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch backlink opportunities" },
      { status: 500 }
    );
  }
}
