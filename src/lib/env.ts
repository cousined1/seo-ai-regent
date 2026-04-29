export interface ServerEnv {
  databaseUrl: string | null;
  serperApiKey: string | null;
  authSessionSecret: string | null;
  authAdminEmail: string | null;
  authAdminPasswordHash: string | null;
  authAdminTotpSecret: string | null;
  authResetTokenSecret: string | null;
  stripeSecretKey: string | null;
  stripeWebhookSecret: string | null;
  stripeEditorPriceId: string | null;
  stripeEditorialPriceId: string | null;
  stripeSyndicatePriceId: string | null;
  resendApiKey: string | null;
  authResetEmailFrom: string | null;
  siteUrl: string | null;
}

function normalizeValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function getServerEnv(
  source: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env,
): ServerEnv {
  return {
    databaseUrl: normalizeValue(source.DATABASE_URL),
    serperApiKey: normalizeValue(source.SERPER_API_KEY),
    authSessionSecret: normalizeValue(source.AUTH_SESSION_SECRET),
    authAdminEmail: normalizeValue(source.AUTH_ADMIN_EMAIL),
    authAdminPasswordHash: normalizeValue(source.AUTH_ADMIN_PASSWORD_HASH),
    authAdminTotpSecret: normalizeValue(source.AUTH_ADMIN_TOTP_SECRET),
    authResetTokenSecret: normalizeValue(source.AUTH_RESET_TOKEN_SECRET),
    stripeSecretKey: normalizeValue(source.STRIPE_SECRET_KEY),
    stripeWebhookSecret: normalizeValue(source.STRIPE_WEBHOOK_SECRET),
    stripeEditorPriceId: normalizeValue(source.STRIPE_EDITOR_PRICE_ID),
    stripeEditorialPriceId: normalizeValue(source.STRIPE_EDITORIAL_PRICE_ID),
    stripeSyndicatePriceId: normalizeValue(source.STRIPE_SYNDICATE_PRICE_ID),
    resendApiKey: normalizeValue(source.RESEND_API_KEY),
    authResetEmailFrom: normalizeValue(source.AUTH_RESET_EMAIL_FROM),
    siteUrl: normalizeValue(source.NEXT_PUBLIC_SITE_URL),
  };
}

export function getConfigErrorMessage(
  setting:
    | "DATABASE_URL"
    | "SERPER_API_KEY"
    | "AUTH_SESSION_SECRET"
    | "STRIPE_SECRET_KEY"
    | "STRIPE_WEBHOOK_SECRET"
    | "AUTH_RESET_TOKEN_SECRET"
    | "RESEND_API_KEY"
    | "AUTH_RESET_EMAIL_FROM"
    | "NEXT_PUBLIC_SITE_URL",
) {
  return `${setting} is not configured. Add ${setting} to the server environment before enabling this integration.`;
}
