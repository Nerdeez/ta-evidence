import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';

import type { DashboardApiKey } from '../api-keys.utils';
import { ApiKeysList } from './api-keys-list';

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

describe('ApiKeysList', () => {
  it('shows the empty state when there are no keys', async () => {
    const screen = await render(<ApiKeysList activeKeys={[]} expiredKeys={[]} />);

    await expect.element(screen.getByText('You have not created any API keys yet')).toBeVisible();
  });

  it('renders active and expired sections with row data', async () => {
    const screen = await render(
      <ApiKeysList activeKeys={[sampleActiveKey]} expiredKeys={[sampleExpiredKey]} />,
    );

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
});
