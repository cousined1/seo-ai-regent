import { getPrismaClient } from "@/lib/db";
import type { VerificationMethod } from "@prisma/client";

function getDb() {
  const client = getPrismaClient();
  if (!client) {
    throw new Error("Database not configured");
  }
  return client;
}

export function generateVerificationToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyHtmlTag(html: string, token: string): Promise<boolean> {
  if (!html || !token) {
    return false;
  }

  const metaPattern = new RegExp(
    `<meta[^>]+name=["']seo-ai-regent-verification["'][^>]+content=["']${token}["'][^>]*/?>`,
    "i",
  );
  const altPattern = new RegExp(
    `<meta[^>]+content=["']${token}["'][^>]+name=["']seo-ai-regent-verification["'][^>]*/?>`,
    "i",
  );

  return metaPattern.test(html) || altPattern.test(html);
}

export async function verifyDnsTxt(records: string[], token: string): Promise<boolean> {
  if (!records || records.length === 0 || !token) {
    return false;
  }

  const expectedRecord = `seo-ai-regent-verification=${token}`;
  return records.some((record) => record.includes(expectedRecord));
}

export function getVerificationInstructions(method: VerificationMethod, token: string): string {
  switch (method) {
    case "HTML_TAG":
      return `Add this meta tag to the <head> section of your site's homepage:

<meta name="seo-ai-regent-verification" content="${token}" />

Once added, click Verify to confirm ownership.`;

    case "DNS_TXT":
      return `Add this TXT record to your domain's DNS configuration:

Host: @ (or your domain)
Type: TXT
Value: seo-ai-regent-verification=${token}

DNS changes may take up to 48 hours to propagate. Once added, click Verify.`;

    case "FILE_UPLOAD":
      return `Create a file at this path on your server:

/.well-known/seo-ai-regent-verification

The file should contain only this text:

${token}

Once uploaded, click Verify to confirm ownership.`;

    default:
      return "Unknown verification method.";
  }
}

export interface CreateSiteInput {
  workspaceId: string;
  url: string;
}

export async function createSite(input: CreateSiteInput) {
  const db = getDb();
  const normalizedUrl = normalizeSiteUrl(input.url);

  if (!isValidSiteUrl(normalizedUrl)) {
    throw new Error("Invalid site URL. Must be a valid HTTP or HTTPS URL.");
  }

  return db.site.create({
    data: {
      workspaceId: input.workspaceId,
      url: normalizedUrl,
    },
    include: {
      verification: true,
    },
  });
}

export async function startVerification(siteId: string, method: VerificationMethod) {
  const db = getDb();
  const site = await db.site.findUnique({
    where: { id: siteId },
    include: { verification: true },
  });

  if (!site) {
    throw new Error("Site not found");
  }

  const token = generateVerificationToken();

  if (site.verification) {
    return db.siteVerification.update({
      where: { siteId },
      data: {
        method,
        token,
        verifiedAt: null,
      },
    });
  }

  return db.siteVerification.create({
    data: {
      siteId,
      method,
      token,
    },
  });
}

export async function completeVerification(siteId: string) {
  const db = getDb();
  const now = new Date();

  const [site, verification] = await Promise.all([
    db.site.update({
      where: { id: siteId },
      data: {
        status: "VERIFIED",
        verifiedAt: now,
      },
    }),
    db.siteVerification.update({
      where: { siteId },
      data: { verifiedAt: now },
    }),
  ]);

  return { site, verification };
}

export async function getSiteWithVerification(siteId: string, userId: string) {
  const db = getDb();
  const site = await db.site.findUnique({
    where: { id: siteId },
    include: {
      verification: true,
      workspace: true,
    },
  });

  if (!site || !site.workspace || site.workspace.ownerId !== userId) {
    return null;
  }

  return site;
}

export async function listWorkspaceSites(workspaceId: string, userId: string) {
  const db = getDb();
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== userId) {
    return [];
  }

  return db.site.findMany({
    where: { workspaceId },
    include: {
      verification: true,
      _count: {
        select: {
          crawlJobs: true,
          crawledUrls: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

function normalizeSiteUrl(url: string): string {
  let normalized = url.trim();

  if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
    normalized = `https://${normalized}`;
  }

  try {
    const parsed = new URL(normalized);
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return normalized;
  }
}

function isValidSiteUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
