import { NextResponse } from "next/server";

import { getPrismaClient } from "@/lib/db";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function resetRateLimitBuckets() {
  buckets.clear();
}

function getClientAddress(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "local"
  );
}

export async function enforceRateLimit(
  request: Request,
  options: {
    bucket: string;
    limit: number;
    windowMs: number;
  },
) {
  const key = `${options.bucket}:${getClientAddress(request)}`;
  const now = Date.now();
  const client = getPrismaClient();

  if (client) {
    const result = await client.$transaction(async (tx) => {
      const updated = await tx.rateLimitWindow.updateMany({
        where: {
          bucketKey: key,
          resetAt: {
            gt: new Date(now),
          },
          count: {
            lt: options.limit,
          },
        },
        data: {
          count: {
            increment: 1,
          },
        },
      });

      if (updated.count > 0) {
        return null;
      }

      const current = await tx.rateLimitWindow.findUnique({
        where: {
          bucketKey: key,
        },
      });

      if (current && current.resetAt.getTime() > now && current.count >= options.limit) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Retry after the current window resets.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(
                Math.max(1, Math.ceil((current.resetAt.getTime() - now) / 1000)),
              ),
            },
          },
        );
      }

      await tx.rateLimitWindow.upsert({
        where: {
          bucketKey: key,
        },
        create: {
          bucketKey: key,
          count: 1,
          resetAt: new Date(now + options.windowMs),
        },
        update: {
          count: 1,
          resetAt: new Date(now + options.windowMs),
        },
      });

      return null;
    });

    return result;
  }

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return null;
  }

  if (current.count >= options.limit) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Retry after the current window resets.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, Math.ceil((current.resetAt - now) / 1000))),
        },
      },
    );
  }

  current.count += 1;
  buckets.set(key, current);
  return null;
}
