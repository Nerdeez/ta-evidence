'use server';

import { auth, requireSession } from '@ta/auth/next';
import { headers } from 'next/headers';

import type { DashboardApiKey } from '../api-keys.utils';

const DELETE_API_KEY_ERROR_MESSAGE = 'Unable to delete this API key. Please try again.';

/** Deletes the caller's API key. Throws on failure; resolves with no value on success. */
export async function deleteApiKeyAction(keyId: DashboardApiKey['id']): Promise<void> {
  await requireSession();

  const trimmed = keyId.trim();
  if (!trimmed) {
    throw new Error('Invalid API key.');
  }

  try {
    const result = await auth.api.deleteApiKey({
      body: { keyId: trimmed },
      headers: await headers(),
    });

    if (!result.success) {
      throw new Error(DELETE_API_KEY_ERROR_MESSAGE);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Delete API key failed:', error);
      throw error;
    }
    throw new Error(DELETE_API_KEY_ERROR_MESSAGE);
  }
}
