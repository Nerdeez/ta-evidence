/**
 * E2e tests for the signup screen.
 */

import { expect, test } from '@playwright/test';
import {
  e2eSignupCredentials as bindE2eSignupCredentials,
  type E2eSignupCredentialsBinder,
} from '@ta/auth/testing';
import { account, db, user } from '@ta/db';
import { eq } from 'drizzle-orm';

/** Better Auth rows expected after email/password signup (this suite only). */
async function getSignupDbState(
  email: string,
  signupBinder?: Pick<E2eSignupCredentialsBinder, 'trackCreatedUser'>,
) {
  const [dbUser] = await db.select().from(user).where(eq(user.email, email));

  if (!dbUser) {
    return { user: undefined, accounts: [] };
  }

  const accounts = await db.select().from(account).where(eq(account.userId, dbUser.id));

  signupBinder?.trackCreatedUser(email);

  return { user: dbUser, accounts };
}

test.describe('signup', () => {
  const e2eSignupCredentials = bindE2eSignupCredentials();

  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('visits the signup page', async ({ page }) => {
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
  });

  test('registers a new user and persists auth rows in the database', async ({
    page,
  }, testInfo) => {
    const { name, email, password } = e2eSignupCredentials(testInfo.workerIndex);

    await page.getByLabel('Name').fill(name);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByLabel('Confirm password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/verify-email$/);
    await expect(page.getByRole('heading', { name: 'Verify your email' })).toBeVisible();

    const { user: dbUser, accounts } = await getSignupDbState(email, e2eSignupCredentials);

    expect(dbUser).toBeDefined();
    if (!dbUser) {
      return;
    }

    expect(dbUser).toMatchObject({
      name,
      email,
      emailVerified: false,
    });

    expect(accounts).toHaveLength(1);
    const credentialAccount = accounts[0];
    expect(credentialAccount).toBeDefined();
    if (!credentialAccount) {
      return;
    }

    expect(credentialAccount).toMatchObject({
      userId: dbUser.id,
      providerId: 'credential',
      accountId: dbUser.id,
    });
    expect(credentialAccount.password).toBeTruthy();
  });
});
