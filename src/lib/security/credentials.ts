import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const KEY_BYTES = 32;
const FORMAT_VERSION = "v1";

export class CredentialEncryptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CredentialEncryptionError";
  }
}

function deriveKey(rawKey: string): Buffer {
  if (!rawKey || rawKey.trim().length === 0) {
    throw new CredentialEncryptionError(
      "CREDENTIAL_ENCRYPTION_KEY is not configured. Add a 32+ character secret to the server environment.",
    );
  }

  const trimmed = rawKey.trim();

  try {
    const decoded = Buffer.from(trimmed, "base64");
    if (decoded.length === KEY_BYTES) {
      return decoded;
    }
  } catch {
    // fall through to hash derivation
  }

  if (trimmed.length < 32) {
    throw new CredentialEncryptionError(
      "CREDENTIAL_ENCRYPTION_KEY must be at least 32 characters or a base64-encoded 32-byte key.",
    );
  }

  return createHash("sha256").update(trimmed, "utf8").digest();
}

function readKeyFromEnv(): Buffer {
  return deriveKey(process.env.CREDENTIAL_ENCRYPTION_KEY ?? "");
}

export function encryptCredentials(plaintext: string): string {
  const key = readKeyFromEnv();
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    FORMAT_VERSION,
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptCredentials(payload: string): string {
  const parts = payload.split(":");
  if (parts.length !== 4 || parts[0] !== FORMAT_VERSION) {
    throw new CredentialEncryptionError("Unrecognized credential payload format");
  }

  const [, ivB64, tagB64, dataB64] = parts;
  const key = readKeyFromEnv();
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const data = Buffer.from(dataB64, "base64");

  if (iv.length !== IV_BYTES) {
    throw new CredentialEncryptionError("Invalid IV length");
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
  return plaintext.toString("utf8");
}

export function encryptJsonCredentials(value: unknown): string {
  return encryptCredentials(JSON.stringify(value));
}

export function decryptJsonCredentials<T = unknown>(payload: string): T {
  return JSON.parse(decryptCredentials(payload)) as T;
}
