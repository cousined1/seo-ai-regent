import { PrismaClient } from "@prisma/client";

import { getConfigErrorMessage, getServerEnv, type ServerEnv } from "@/lib/env";

export interface DatabaseBoundary {
  provider: "prisma";
  configured: boolean;
  client: PrismaClient | null;
  reason: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __rankforgePrismaClient: PrismaClient | undefined;
}

let productionPrismaClient: PrismaClient | null = null;

function createPrismaClient(databaseUrl: string): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
}

export function getPrismaClient(env: ServerEnv = getServerEnv()) {
  if (!env.databaseUrl) {
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    if (!productionPrismaClient) {
      productionPrismaClient = createPrismaClient(env.databaseUrl);
    }

    return productionPrismaClient;
  }

  if (!globalThis.__rankforgePrismaClient) {
    globalThis.__rankforgePrismaClient = createPrismaClient(env.databaseUrl);
  }

  return globalThis.__rankforgePrismaClient;
}

export function getDatabaseBoundary(env: ServerEnv = getServerEnv()): DatabaseBoundary {
  if (!env.databaseUrl) {
    return {
      provider: "prisma",
      configured: false,
      client: null,
      reason: getConfigErrorMessage("DATABASE_URL"),
    };
  }

  return {
    provider: "prisma",
    configured: true,
    client: getPrismaClient(env),
    reason: "DATABASE_URL is configured and Prisma runtime activation is ready.",
  };
}
