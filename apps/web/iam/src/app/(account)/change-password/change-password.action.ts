'use server';

import { type ErrorResponse, errorResponse } from '@ta/api';
import { auth, requireSession } from '@ta/auth/next';
import { headers } from 'next/headers';

import { type ChangePasswordValues, changePasswordSchema } from './change-password.schema';

export type ChangePasswordResult = { success: true } | ErrorResponse;

function isInvalidPasswordError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { body?: { code?: string }; code?: string };
  const code = candidate.body?.code ?? candidate.code;
  return code === 'INVALID_PASSWORD';
}

export async function changePasswordAction(
  values: ChangePasswordValues,
): Promise<ChangePasswordResult> {
  await requireSession();

  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return errorResponse([parsed.error]);
  }

  const { currentPassword, password } = parsed.data;

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword: password,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    if (isInvalidPasswordError(error)) {
      return errorResponse([new Error('Current password is incorrect.')]);
    }
    if (error instanceof Error) {
      console.error('Change password failed:', error);
      return errorResponse([new Error('Unable to change your password. Please try again later.')]);
    }
    throw error;
  }

  return { success: true };
}
