import { expect, test } from "@playwright/test";

test.describe("auth and billing browser flows", () => {
  test("registers a new account from the live register page", async ({ page }) => {
    await page.route("**/api/auth/register", async (route) => {
      const payload = route.request().postDataJSON() as {
        name: string;
        email: string;
        password: string;
      };

      expect(payload).toMatchObject({
        name: "Editor User",
        email: "editor@seoairegent.com",
        password: "very-secure-password",
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "user-1",
          email: payload.email,
          role: "MEMBER",
          plan: "FREE",
        }),
      });
    });

    await page.goto("/register");
    await expect(page.locator('main[data-e2e-ready="true"]')).toBeVisible();

    await page.getByLabel("Name").fill("Editor User");
    await page.getByLabel("Email").fill("editor@seoairegent.com");
    await page.getByLabel("Password").fill("very-secure-password");
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText(/account created for editor@seoairegent\.com/i)).toBeVisible();
  });

  test("signs in and resets a password from the live login page", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      const payload = route.request().postDataJSON() as {
        email: string;
        password: string;
        otp: string;
      };

      expect(payload).toMatchObject({
        email: "editor@seoairegent.com",
        password: "very-secure-password",
        otp: "",
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: {
            id: "user-1",
            email: payload.email,
            role: "MEMBER",
            plan: "EDITOR",
          },
        }),
      });
    });

    await page.goto("/login");
    await expect(page.locator('main[data-e2e-ready="true"]')).toBeVisible();

    await page.getByLabel("Email").fill("editor@seoairegent.com");
    await page.getByLabel("Password").fill("very-secure-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText(/signed in as editor@seoairegent\.com/i)).toBeVisible();

    await page.route("**/api/auth/password/reset", async (route) => {
      const payload = route.request().postDataJSON() as {
        token: string;
        password: string;
      };

      expect(payload).toEqual({
        token: "reset-token-123",
        password: "an even newer password",
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/login?resetToken=reset-token-123");
    await expect(page.locator('main[data-e2e-ready="true"]')).toBeVisible();

    await page.getByLabel("New password").fill("an even newer password");
    await page.getByRole("button", { name: "Reset password" }).click();

    await expect(page.getByText(/password updated\. sign in with the new password\./i)).toBeVisible();
  });

  test("loads the billing page and exercises checkout, portal, and sign-out", async ({ page }) => {
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          authenticated: true,
          user: {
            email: "editor@seoairegent.com",
            role: "MEMBER",
            plan: "EDITOR",
          },
        }),
      });
    });

    await page.route("**/api/billing/checkout", async (route) => {
      const payload = route.request().postDataJSON() as {
        planId: string;
      };

      expect(payload).toEqual({
        planId: "EDITOR",
      });

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          checkoutUrl: "http://127.0.0.1:3000/account/billing?checkout=editor",
        }),
      });
    });

    await page.route("**/api/billing/portal", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          portalUrl: "http://127.0.0.1:3000/account/billing?portal=1",
        }),
      });
    });

    await page.route("**/api/auth/logout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/account/billing");
    await expect(page.locator('main[data-e2e-ready="true"]')).toBeVisible();

    await expect(page.getByText("editor@seoairegent.com")).toBeVisible();
    await expect(page.getByText(/role: member \/ plan: editor/i)).toBeVisible();

    await page.getByRole("button", { name: /editor plan/i }).click();
    await page.waitForURL("**/account/billing?checkout=editor");

    await page.getByRole("button", { name: "Open billing portal" }).click();
    await page.waitForURL("**/account/billing?portal=1");

    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page.getByText("Signed out.")).toBeVisible();
    await expect(page.getByText(/sign in first to start checkout or open the customer portal\./i)).toBeVisible();
  });
});
