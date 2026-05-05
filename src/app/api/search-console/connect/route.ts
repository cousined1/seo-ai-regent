import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { requireWorkspaceAccess } from "@/lib/workspaces/access";
import {
  encryptJsonCredentials,
  CredentialEncryptionError,
} from "@/lib/security/credentials";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workspaceId, propertyUrl, accessToken, refreshToken } = body as {
      workspaceId: string;
      propertyUrl: string;
      accessToken: string;
      refreshToken: string;
    };

    const access = await requireWorkspaceAccess(req, workspaceId);
    if (access instanceof NextResponse) {
      return access;
    }

    if (!propertyUrl || !accessToken) {
      return NextResponse.json(
        { error: "propertyUrl and accessToken are required" },
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

    let encryptedTokens: string;
    try {
      encryptedTokens = encryptJsonCredentials({ accessToken, refreshToken });
    } catch (error) {
      if (error instanceof CredentialEncryptionError) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      throw error;
    }

    const connection = await prisma.searchConsoleConnection.upsert({
      where: {
        workspaceId_propertyUrl: { workspaceId, propertyUrl },
      },
      update: {
        encryptedTokens,
        syncStatus: "CONNECTED",
      },
      create: {
        workspaceId,
        propertyUrl,
        encryptedTokens,
        syncStatus: "CONNECTED",
      },
      select: {
        id: true,
        propertyUrl: true,
        syncStatus: true,
        lastSyncAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ connection });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect Search Console" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

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

    const connections = await prisma.searchConsoleConnection.findMany({
      where: { workspaceId: access.workspace.id },
      select: {
        id: true,
        propertyUrl: true,
        syncStatus: true,
        lastSyncAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ connections });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}
