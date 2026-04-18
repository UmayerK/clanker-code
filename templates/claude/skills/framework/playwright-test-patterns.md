---
name: playwright-test-patterns
description: Page objects, wait on elements not time, snapshot stable states only.
triggers: playwright, e2e, browser test, page object, selector, flake
---

## Problem
E2E tests that couple to CSS classes, sleep for timing, or snapshot animations are flaky and hated. Patterns fix most of this.

## Rule
- Use role- and label-based locators (`getByRole`, `getByLabel`) over CSS.
- Wait on expected UI state, never `waitForTimeout` except last resort.
- Wrap pages in Page Object classes for reusable flows and selectors.
- Snapshot only stable DOM/visual states; mask timestamps, avatars, animations.
- Seed data via API/DB, not by clicking through the UI.
- Run tests in isolation (fresh storage state) to prevent cross-test coupling.

## Example
```ts
// login.page.ts
export class LoginPage {
  constructor(private page: Page) {}
  async login(email: string, pwd: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(pwd);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await this.page.getByRole('heading', { name: 'Dashboard' }).waitFor();
  }
}

// test
test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await new LoginPage(page).login('a@b.c', 'pw');
  await expect(page).toHaveURL('/dashboard');
});
```
