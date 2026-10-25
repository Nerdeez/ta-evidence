'use server';

import { type ErrorResponse, errorResponse } from '@ta/api';
import { auth } from '@ta/auth';
import { redirect } from 'next/navigation';

import { type ResetPasswordValues, resetPasswordSchema } from './reset-password.schema';

function isInvalidTokenError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const candidate = error as { body?: { code?: string }; code?: string; message?: string };
  const code = candidate.body?.code ?? candidate.code;
  if (code === 'INVALID_TOKEN') {
    return true;
  }
  const message = candidate.message?.toLowerCase() ?? '';
  return message.includes('invalid') && message.includes('token');
}

export async function resetPasswordAction(values: ResetPasswordValues): Promise<ErrorResponse> {
  try {
    const { token, password } = resetPasswordSchema.parse(values);

    await auth.api.resetPassword({
      body: {
        token,
        newPassword: password,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (isInvalidTokenError(error)) {
        return errorResponse([new Error('This reset link is invalid or has expired.')]);
      }
      console.error('Password reset failed:', error);
      return errorResponse([new Error('Unable to reset your password. Please try again later.')]);
    }
    throw error;
  }

  redirect('/reset-password/success');
}
