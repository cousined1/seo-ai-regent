import { describe, expect, it } from "vitest";

import { getDatabaseBoundary, getPrismaClient } from "@/lib/db";
import { getServerEnv } from "@/lib/env";

describe("backend integration boundaries", () => {
  it("reports persistence as not configured when DATABASE_URL is absent", () => {
    const env = getServerEnv({});
    const boundary = getDatabaseBoundary(env);

    expect(boundary.configured).toBe(false);
    expect(boundary.provider).toBe("prisma");
    expect(boundary.reason).toMatch(/database_url/i);
    expect(boundary.client).toBeNull();
  });

  it("marks persistence integration-ready when DATABASE_URL is present", () => {
    const env = getServerEnv({
      DATABASE_URL: "postgresql://demo:demo@localhost:5432/rankforge",
      SERPER_API_KEY: "serper-demo-key",
    });

    const boundary = getDatabaseBoundary(env);

    expect(boundary.configured).toBe(true);
    expect(boundary.client).toBeTruthy();
    expect(boundary.reason).toMatch(/ready/i);
    expect(env.serperApiKey).toBe("serper-demo-key");
  });

  it("reuses one Prisma client singleton for repeated calls", () => {
    const env = getServerEnv({
      DATABASE_URL: "postgresql://demo:demo@localhost:5432/rankforge",
    });

    const firstClient = getPrismaClient(env);
    const secondClient = getPrismaClient(env);

    expect(firstClient).toBeTruthy();
    expect(secondClient).toBeTruthy();
    expect(firstClient).toBe(secondClient);
    expect(getDatabaseBoundary(env).client).toBe(firstClient);
  });
});
