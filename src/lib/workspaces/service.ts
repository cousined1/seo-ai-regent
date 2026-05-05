import { getPrismaClient } from "@/lib/db";

function getDb() {
  const client = getPrismaClient();
  if (!client) {
    throw new Error("Database not configured");
  }
  return client;
}

export interface CreateWorkspaceInput {
  name: string;
  ownerId: string;
}

export async function createWorkspace(input: CreateWorkspaceInput) {
  const db = getDb();
  const trimmedName = input.name.trim();

  if (trimmedName.length < 2) {
    throw new Error("Workspace name must be at least 2 characters");
  }

  if (trimmedName.length > 100) {
    throw new Error("Workspace name must be under 100 characters");
  }

  return db.workspace.create({
    data: {
      name: trimmedName,
      ownerId: input.ownerId,
    },
  });
}

export async function getWorkspaceById(workspaceId: string, userId: string) {
  const db = getDb();
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      sites: true,
      _count: {
        select: {
          keywords: true,
          clusters: true,
        },
      },
    },
  });

  if (!workspace || workspace.ownerId !== userId) {
    return null;
  }

  return workspace;
}

export async function listUserWorkspaces(userId: string) {
  const db = getDb();
  return db.workspace.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      sites: true,
      _count: {
        select: {
          keywords: true,
          clusters: true,
        },
      },
    },
  });
}

export async function verifyWorkspaceAccess(workspaceId: string, userId: string) {
  const db = getDb();
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
  });

  if (!workspace || workspace.ownerId !== userId) {
    return false;
  }

  return true;
}
