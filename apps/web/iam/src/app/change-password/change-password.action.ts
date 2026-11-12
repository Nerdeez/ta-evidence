'use server';

import { type ErrorResponse, errorResponse } from '@ta/api';
import { auth } from '@ta/auth/next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type ChangePasswordValues, changePasswordSchema } from './change-password.schema';

export type ChangePasswordResult = { success: true } | ErrorResponse;

function isInvalidPasswordError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { body?: { code?: string }; code?: string; message?: string };
  const code = candidate.body?.code ?? candidate.code;
  if (code === 'INVALID_PASSWORD') {
    return true;
  }
  const message = candidate.message?.toLowerCase() ?? '';
  return message.includes('invalid') && message.includes('password');
}

export async function changePasswordAction(
  values: ChangePasswordValues,
): Promise<ChangePasswordResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect('/login');
  }

  try {
    const { currentPassword, password } = changePasswordSchema.parse(values);

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
