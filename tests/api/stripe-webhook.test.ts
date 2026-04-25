import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const constructEventMock = vi.fn();
const recordProcessedWebhookEventMock = vi.fn();
const updateUserPlanMock = vi.fn();
const headersMock = vi.fn();

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("@/lib/billing/stripe", () => ({
  requireStripeClient: () => ({
    webhooks: {
      constructEvent: constructEventMock,
    },
  }),
}));

vi.mock("@/lib/billing/webhook-events", () => ({
  recordProcessedWebhookEvent: recordProcessedWebhookEventMock,
}));

vi.mock("@/lib/auth/store", () => ({
  updateUserPlan: updateUserPlanMock,
}));

describe("stripe webhook route", () => {
  beforeEach(() => {
    constructEventMock.mockReset();
    recordProcessedWebhookEventMock.mockReset();
    updateUserPlanMock.mockReset();
    headersMock.mockReset();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
  });

  afterEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.STRIPE_SECRET_KEY;
  });

  it("ignores duplicate deliveries after the event receipt already exists", async () => {
    headersMock.mockResolvedValue({
      get: (name: string) => (name === "stripe-signature" ? "sig" : null),
    });
    constructEventMock.mockReturnValue({
      id: "evt_123",
      type: "checkout.session.completed",
      livemode: false,
      data: {
        object: {
          metadata: {
            userId: "user_123",
            planId: "EDITOR",
          },
        },
      },
    });
    recordProcessedWebhookEventMock.mockResolvedValue({
      created: false,
      reason: "duplicate",
    });

    const { POST } = await import("@/app/api/stripe/webhook/route");
    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      received: true,
      duplicate: true,
    });
    expect(updateUserPlanMock).not.toHaveBeenCalled();
  });

  it("updates the user plan on the first valid delivery", async () => {
    headersMock.mockResolvedValue({
      get: (name: string) => (name === "stripe-signature" ? "sig" : null),
    });
    constructEventMock.mockReturnValue({
      id: "evt_123",
      type: "checkout.session.completed",
      livemode: false,
      data: {
        object: {
          metadata: {
            userId: "user_123",
            planId: "EDITORIAL",
          },
        },
      },
    });
    recordProcessedWebhookEventMock.mockResolvedValue({
      created: true,
      reason: null,
    });

    const { POST } = await import("@/app/api/stripe/webhook/route");
    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      received: true,
    });
    expect(updateUserPlanMock).toHaveBeenCalledWith("user_123", "EDITORIAL");
  });
});
