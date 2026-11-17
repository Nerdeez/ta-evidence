import { Toaster } from '@ta/ui/toast';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import type { DashboardApiKey } from '../api-keys.utils';
import { ApiKeysList, DELETE_API_KEY_SUCCESS_TITLE } from './api-keys-list';

const DELETE_API_KEY_ERROR_MESSAGE = 'Unable to delete this API key. Please try again.';

import { resetDeleteApiKeyActionMock, setDeleteApiKeyActionMock } from './api-keys-list.vitest';

const sampleActiveKey: DashboardApiKey = {
  id: 'key_active',
  name: 'Production',
  maskedKey: 'ta-gRf*****',
  createdAt: new Date('2025-06-01T12:00:00.000Z'),
  lastUsedAt: new Date('2025-06-02T08:00:00.000Z'),
  expiresAt: null,
};

const sampleExpiredKey: DashboardApiKey = {
  id: 'key_expired',
  name: 'Legacy integration',
  maskedKey: 'ta-99*****',
  createdAt: new Date('2024-01-01T08:00:00.000Z'),
  lastUsedAt: new Date('2024-06-01T08:00:00.000Z'),
  expiresAt: new Date('2020-01-01T00:00:00.000Z'),
};

function renderList(activeKeys: DashboardApiKey[], expiredKeys: DashboardApiKey[] = []) {
  return render(
    <>
      <Toaster />
      <ApiKeysList activeKeys={activeKeys} expiredKeys={expiredKeys} />
    </>,
  );
}

describe('ApiKeysList', () => {
  beforeEach(() => {
    resetDeleteApiKeyActionMock();
  });

  afterEach(() => {
    resetDeleteApiKeyActionMock();
  });

  it('shows the empty state when there are no keys', async () => {
    const screen = await renderList([], []);

    await expect.element(screen.getByText('You have not created any API keys yet')).toBeVisible();
  });

  it('renders active and expired sections with row data', async () => {
    const screen = await renderList([sampleActiveKey], [sampleExpiredKey]);

    await expect
      .element(screen.getByRole('heading', { name: 'Active keys', level: 2 }))
      .toBeVisible();
    await expect
      .element(screen.getByRole('heading', { name: 'Expired keys', level: 2 }))
      .toBeVisible();
    await expect.element(screen.getByText('Production')).toBeVisible();
    await expect.element(screen.getByText('Legacy integration')).toBeVisible();
    await expect.element(screen.getByText('ta-gRf*****')).toBeVisible();
    await expect.element(screen.getByText('Active', { exact: true })).toBeVisible();
    await expect.element(screen.getByText('Expired', { exact: true })).toBeVisible();
    await expect.element(screen.getByText('Never', { exact: true })).toBeVisible();
  });

  it('opens the delete confirmation dialog and cancels without removing the row', async () => {
    const screen = await renderList([sampleActiveKey]);

    await screen.getByRole('button', { name: 'Delete Production' }).click();
    const dialog = screen.getByRole('alertdialog');
    await expect.element(dialog).toBeVisible();
    await expect.element(screen.getByText('Delete API key?')).toBeVisible();
    await expect.element(dialog.getByText('ta-gRf*****')).toBeVisible();

    await screen.getByRole('button', { name: 'Cancel' }).click();
    await expect.element(screen.getByText('Production')).toBeVisible();
  });

  it('removes the row and shows a success toast when delete succeeds', async () => {
    setDeleteApiKeyActionMock(async () => {});

    const screen = await renderList([sampleActiveKey]);

    await screen.getByRole('button', { name: 'Delete Production' }).click();
    await screen.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect.element(screen.getByText(DELETE_API_KEY_SUCCESS_TITLE)).toBeVisible();
    await expect.poll(() => screen.getByText('Production').query()).toBeNull();
  });

  it('keeps the row and shows an error toast when delete fails', async () => {
    setDeleteApiKeyActionMock(async () => {
      throw new Error(DELETE_API_KEY_ERROR_MESSAGE);
    });

    const screen = await renderList([sampleActiveKey]);

    await screen.getByRole('button', { name: 'Delete Production' }).click();
    await screen.getByRole('button', { name: 'Delete', exact: true }).click();

    await expect.element(screen.getByText(DELETE_API_KEY_ERROR_MESSAGE)).toBeVisible();
    await expect.element(screen.getByText('Production')).toBeVisible();
  });
});
