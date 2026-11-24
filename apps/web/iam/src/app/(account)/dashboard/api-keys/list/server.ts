import { formatMaskedApiKeyDisplay, type PublicApiKey } from '@ta/auth/api-key';
import { auth } from '@ta/auth/next';
import { headers } from 'next/headers';

import { asApiKeyDate, type DashboardApiKey, partitionDashboardApiKeys } from '../utils';

export type DashboardApiKeySections = {
  active: DashboardApiKey[];
  expired: DashboardApiKey[];
};

function mapApiKeyFromBetterAuth(row: PublicApiKey): DashboardApiKey {
  return {
    id: row.id,
    name: row.name?.trim() || 'Unnamed key',
    maskedKey: formatMaskedApiKeyDisplay(row.start, row.prefix),
    createdAt: asApiKeyDate(row.createdAt) ?? new Date(0),
    lastUsedAt: asApiKeyDate(row.lastRequest),
    expiresAt: asApiKeyDate(row.expiresAt),
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
