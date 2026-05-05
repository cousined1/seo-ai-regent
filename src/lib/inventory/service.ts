import { getPrismaClient } from "@/lib/db";
import { scoreContent } from "@/lib/scoring/content-score";
import { scoreGeo } from "@/lib/scoring/geo-score";
import { detectContentIssues, extractPageMetadata } from "@/lib/inventory/import";
import { calculateRefreshImpact, generateRefreshRecommendations } from "@/lib/inventory/refresh-engine";
import type { ImportSource } from "@prisma/client";

function getDb() {
  const client = getPrismaClient();
  if (!client) {
    throw new Error("Database not configured");
  }
  return client;
}

export async function importUrls(
  siteId: string,
  urls: string[],
  source: ImportSource = "MANUAL",
) {
  const db = getDb();

  const site = await db.site.findUnique({
    where: { id: siteId },
  });

  if (!site) {
    throw new Error("Site not found");
  }

  const created = await Promise.all(
    urls.map((url) =>
      db.contentInventoryItem.upsert({
        where: { url },
        create: {
          siteId,
          url,
          importedFrom: source,
        },
        update: {},
      }),
    ),
  );

  return created;
}

export async function scoreInventoryItem(inventoryItemId: string) {
  const db = getDb();

  const item = await db.contentInventoryItem.findUnique({
    where: { id: inventoryItemId },
    include: { site: true },
  });

  if (!item || !item.bodyText) {
    throw new Error("Inventory item not found or has no content");
  }

  const keyword = item.title ?? item.url;
  const geoResult = scoreGeo(item.bodyText);
  const contentScoreResult = scoreContent(keyword, item.bodyText, geoResult.score.overall);

  const snapshot = await db.contentScoreSnapshot.create({
    data: {
      inventoryItemId,
      contentScore: Math.round(contentScoreResult.overall),
      geoScore: Math.round(geoResult.score.overall),
      wordCount: item.bodyText.split(/\s+/).filter(Boolean).length,
      readability: contentScoreResult.readability,
      scoreBreakdown: JSON.parse(JSON.stringify({
        content: contentScoreResult,
        geo: geoResult.score,
        citability: geoResult.citability,
      })),
    },
  });

  const issues = detectContentIssues({
    url: item.url,
    title: item.title,
    metaDescription: item.metaDescription,
    bodyText: item.bodyText,
    wordCount: snapshot.wordCount,
  });

  return {
    snapshot,
    contentScore: contentScoreResult,
    geoScore: geoResult.score,
    issues,
  };
}

export async function createRefreshBrief(inventoryItemId: string) {
  const db = getDb();

  const latestSnapshot = await db.contentScoreSnapshot.findFirst({
    where: { inventoryItemId },
    orderBy: { snapshotDate: "desc" },
  });

  if (!latestSnapshot) {
    throw new Error("No score snapshot found. Score the content first.");
  }

  const item = await db.contentInventoryItem.findUnique({
    where: { id: inventoryItemId },
  });

  if (!item) {
    throw new Error("Inventory item not found");
  }

  const issues = detectContentIssues({
    url: item.url,
    title: item.title,
    metaDescription: item.metaDescription,
    bodyText: item.bodyText ?? "",
    wordCount: latestSnapshot.wordCount,
  });

  const issueTypes = issues.map((i) => i.type);
  const impactScore = calculateRefreshImpact({
    contentScore: latestSnapshot.contentScore,
    geoScore: latestSnapshot.geoScore,
    issueCount: issueTypes.length,
    hasTraffic: false,
  });

  const recommendations = generateRefreshRecommendations(
    latestSnapshot.contentScore,
    latestSnapshot.geoScore,
    issueTypes,
  );

  const brief = await db.contentBrief.create({
    data: {
      inventoryItemId,
      recommendations: JSON.parse(JSON.stringify(recommendations)),
      targetScore: Math.min(100, latestSnapshot.contentScore + 20),
      status: "DRAFT",
    },
  });

  return {
    brief,
    issues,
    impactScore,
    currentScores: {
      content: latestSnapshot.contentScore,
      geo: latestSnapshot.geoScore,
    },
  };
}

export async function getInventoryWithScores(siteId: string, userId: string) {
  const db = getDb();

  const site = await db.site.findUnique({
    where: { id: siteId },
    include: { workspace: true },
  });

  if (!site || !site.workspace || site.workspace.ownerId !== userId) {
    return null;
  }

  const items = await db.contentInventoryItem.findMany({
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

  return items.map((item) => {
    const latestScore = item.scoreSnapshots[0];
    const latestBrief = item.briefs[0];

    return {
      id: item.id,
      url: item.url,
      title: item.title,
      metaDescription: item.metaDescription,
      importedFrom: item.importedFrom,
      createdAt: item.createdAt,
      contentScore: latestScore?.contentScore ?? null,
      geoScore: latestScore?.geoScore ?? null,
      hasBrief: !!latestBrief,
      briefStatus: latestBrief?.status ?? null,
    };
  });
}
