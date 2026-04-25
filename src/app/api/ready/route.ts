import { getDatabaseBoundary } from "@/lib/db";
import { getServerEnv } from "@/lib/env";

export async function GET() {
  const env = getServerEnv();
  const database = getDatabaseBoundary(env);

  return Response.json({
    status: "ready",
    dependencies: {
      database: {
        configured: database.configured,
        reason: database.reason,
      },
      serper: {
        configured: Boolean(env.serperApiKey),
      },
    },
  });
}
