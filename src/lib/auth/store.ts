import type { Plan, UserRole } from "@prisma/client";

import { getPrismaClient } from "@/lib/db";
import { getServerEnv } from "@/lib/env";

export interface AuthUserRecord {
  id: string;
  email: string;
  name: string | null;
  passwordHash: string | null;
  role: UserRole;
  plan: Plan;
  mfaSecret: string | null;
  mfaEnabled: boolean;
  sessionVersion: number;
  stripeId: string | null;
}

export interface RegisterInput {
  email: string;
  passwordHash: string;
  name?: string | null;
}

export function isAuthPersistenceConfigured() {
  return Boolean(getPrismaClient());
}

export type RegisterUserResult =
  | { ok: true; user: AuthUserRecord }
  | { ok: false; reason: "persistence-unavailable" }
  | { ok: false; reason: "duplicate" };

export async function registerUser(input: RegisterInput): Promise<RegisterUserResult> {
  const client = getPrismaClient();

  if (!client) {
    return { ok: false, reason: "persistence-unavailable" };
  }

  try {
    const user = await client.user.create({
      data: {
        email: input.email,
        name: input.name ?? null,
        passwordHash: input.passwordHash,
        role: "MEMBER",
        plan: "FREE",
      },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        plan: true,
        mfaSecret: true,
        mfaEnabled: true,
        sessionVersion: true,
        stripeId: true,
      },
    });

    return { ok: true, user };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return { ok: false, reason: "duplicate" };
    }

    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
  const env = getServerEnv();

  if (
    env.authAdminEmail &&
    env.authAdminPasswordHash &&
    email.toLowerCase() === env.authAdminEmail.toLowerCase()
  ) {
    return {
      id: "env-admin",
      email: env.authAdminEmail,
      name: "Environment Admin",
      passwordHash: env.authAdminPasswordHash,
      role: "ADMIN",
      plan: "SYNDICATE",
      mfaSecret: env.authAdminTotpSecret,
      mfaEnabled: Boolean(env.authAdminTotpSecret),
      sessionVersion: 1,
      stripeId: null,
    };
  }

  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  return client.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      role: true,
      plan: true,
      mfaSecret: true,
      mfaEnabled: true,
      sessionVersion: true,
      stripeId: true,
    },
  });
}

export async function findUserById(id: string): Promise<AuthUserRecord | null> {
  if (id === "env-admin") {
    const env = getServerEnv();

    if (!env.authAdminEmail || !env.authAdminPasswordHash) {
      return null;
    }

    return {
      id: "env-admin",
      email: env.authAdminEmail,
      name: "Environment Admin",
      passwordHash: env.authAdminPasswordHash,
      role: "ADMIN",
      plan: "SYNDICATE",
      mfaSecret: env.authAdminTotpSecret,
      mfaEnabled: Boolean(env.authAdminTotpSecret),
      sessionVersion: 1,
      stripeId: null,
    };
  }

  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  return client.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      passwordHash: true,
      role: true,
      plan: true,
      mfaSecret: true,
      mfaEnabled: true,
      sessionVersion: true,
      stripeId: true,
    },
  });
}

export async function setStripeCustomerId(userId: string, stripeId: string) {
  if (userId === "env-admin") {
    return null;
  }

  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  return client.user.updateMany({
    where: {
      id: userId,
      stripeId: null,
    },
    data: {
      stripeId,
    },
  });
}

export async function findUserIdByStripeCustomerId(stripeId: string): Promise<string | null> {
  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  const user = await client.user.findUnique({
    where: {
      stripeId,
    },
    select: {
      id: true,
    },
  });

  return user?.id ?? null;
}

export async function incrementUserSessionVersion(userId: string) {
  if (userId === "env-admin") {
    return null;
  }

  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  return client.user.update({
    where: {
      id: userId,
    },
    data: {
      sessionVersion: {
        increment: 1,
      },
    },
    select: {
      id: true,
      sessionVersion: true,
    },
  });
}

export async function updateUserPlan(userId: string, plan: Plan) {
  if (userId === "env-admin") {
    return null;
  }

  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  return client.user.update({
    where: {
      id: userId,
    },
    data: {
      plan,
    },
  });
}

export async function createPasswordResetTokenRecord(input: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}) {
  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  return client.passwordResetToken.create({
    data: input,
  });
}

export async function consumePasswordResetToken(tokenHash: string) {
  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  const token = await client.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          passwordHash: true,
          role: true,
          plan: true,
          mfaSecret: true,
          mfaEnabled: true,
          sessionVersion: true,
          stripeId: true,
        },
      },
    },
  });

  if (!token || token.usedAt || token.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  return {
    token,
    user: token.user,
  };
}

export async function finalizePasswordReset(input: {
  resetTokenId: string;
  userId: string;
  passwordHash: string;
}) {
  const client = getPrismaClient();

  if (!client) {
    return null;
  }

  return client.$transaction([
    client.passwordResetToken.update({
      where: {
        id: input.resetTokenId,
      },
      data: {
        usedAt: new Date(),
      },
    }),
    client.user.update({
      where: {
        id: input.userId,
      },
      data: {
        passwordHash: input.passwordHash,
        sessionVersion: {
          increment: 1,
        },
      },
    }),
  ]);
}
