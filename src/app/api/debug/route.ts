import { getDebugManifest } from "@/lib/debug/manifest";
import { withDebugAccess } from "@/lib/debug/responses";

export async function GET(request: Request) {
  return withDebugAccess(request, () => getDebugManifest());
}
