'use server';

import { auth, requireSession } from '@ta/auth/next';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import type { DashboardApiKey } from '../api-keys.utils';

const DELETE_API_KEY_ERROR_MESSAGE = 'Unable to delete this API key. Please try again.';

/** Errors are returned rather than thrown: Next.js redacts thrown server action messages in production. */
export type DeleteApiKeyResult = { ok: true } | { ok: false; error: string };

/** Deletes the caller's API key. */
export async function deleteApiKeyAction(
  keyId: DashboardApiKey['id'],
): Promise<DeleteApiKeyResult> {
  await requireSession();

  const trimmed = keyId.trim();
  if (!trimmed) {
    return { ok: false, error: 'Invalid API key.' };
  }

  try {
    const result = await auth.api.deleteApiKey({
      body: { keyId: trimmed },
      headers: await headers(),
    });

    if (!result.success) {
      return { ok: false, error: DELETE_API_KEY_ERROR_MESSAGE };
    }
  } catch (error) {
    console.error('Delete API key failed:', error);
    return { ok: false, error: DELETE_API_KEY_ERROR_MESSAGE };
  }

  revalidatePath('/dashboard');
  return { ok: true };
}
