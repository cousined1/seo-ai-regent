import { beforeEach, describe, expect, it, vi } from "vitest";

const findUserByEmailMock = vi.fn();
const createPasswordResetTokenRecordMock = vi.fn();
const sendPasswordResetEmailMock = vi.fn();
const enforceRateLimitMock = vi.fn();

vi.mock("@/lib/auth/store", () => ({
  findUserByEmail: findUserByEmailMock,
  createPasswordResetTokenRecord: createPasswordResetTokenRecordMock,
}));

vi.mock("@/lib/auth/email", () => ({
  sendPasswordResetEmail: sendPasswordResetEmailMock,
}));

vi.mock("@/lib/http/rate-limit", () => ({
  enforceRateLimit: enforceRateLimitMock,
}));

describe("password reset request route", () => {
  beforeEach(() => {
    findUserByEmailMock.mockReset();
    createPasswordResetTokenRecordMock.mockReset();
    sendPasswordResetEmailMock.mockReset();
    enforceRateLimitMock.mockReset();
    enforceRateLimitMock.mockResolvedValue(null);
    process.env.DATABASE_URL = "postgresql://demo:demo@localhost:5432/rankforge";
  });

  it("sends a real reset email and does not expose a preview token", async () => {
    findUserByEmailMock.mockResolvedValue({
      id: "user_123",
      email: "editor@seoairegent.com",
    });
    createPasswordResetTokenRecordMock.mockResolvedValue({
      id: "reset_123",
    });
    sendPasswordResetEmailMock.mockResolvedValue(undefined);

    const { POST } = await import("@/app/api/auth/password/request/route");
    const response = await POST(
      new Request("http://localhost/api/auth/password/request", {
        method: "POST",
        body: JSON.stringify({
          email: "editor@seoairegent.com",
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
    });
    expect(sendPasswordResetEmailMock).toHaveBeenCalledWith({
      to: "editor@seoairegent.com",
      resetToken: expect.any(String),
    });
    expect("resetTokenPreview" in payload).toBe(false);
  });

  it("returns a delivery error when the email provider fails", async () => {
    findUserByEmailMock.mockResolvedValue({
      id: "user_123",
      email: "editor@seoairegent.com",
    });
    createPasswordResetTokenRecordMock.mockResolvedValue({
      id: "reset_123",
    });
    sendPasswordResetEmailMock.mockRejectedValue(new Error("Reset email delivery failed."));

    const { POST } = await import("@/app/api/auth/password/request/route");
    const response = await POST(
      new Request("http://localhost/api/auth/password/request", {
        method: "POST",
        body: JSON.stringify({
          email: "editor@seoairegent.com",
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toMatch(/delivery failed/i);
  });
});
