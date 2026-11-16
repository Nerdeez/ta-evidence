import { formatMaskedApiKeyDisplay, type PublicApiKey } from '@ta/auth/api-key';
import { auth } from '@ta/auth/next';
import { headers } from 'next/headers';

import { type DashboardApiKey, partitionDashboardApiKeys } from '../api-keys.utils';

export type DashboardApiKeySections = {
  active: DashboardApiKey[];
  expired: DashboardApiKey[];
};

function mapApiKeyFromBetterAuth(row: PublicApiKey): DashboardApiKey {
  return {
    id: row.id,
    name: row.name?.trim() || 'Unnamed key',
    maskedKey: formatMaskedApiKeyDisplay(row.start, row.prefix),
    createdAt: row.createdAt,
    lastUsedAt: row.lastRequest,
    expiresAt: row.expiresAt,
  };
}

export async function listDashboardApiKeys(): Promise<DashboardApiKeySections> {
  const result = await auth.api.listApiKeys({
    headers: await headers(),
    query: {
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
  });

  const mapped = result.apiKeys.map((row) => mapApiKeyFromBetterAuth(row));
  return partitionDashboardApiKeys(mapped);
}
