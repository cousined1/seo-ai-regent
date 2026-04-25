import { NextResponse } from "next/server";

import { getDemoWorkspacePayload } from "@/lib/scoring/demo-data";

export async function GET() {
  return NextResponse.json(getDemoWorkspacePayload());
}
