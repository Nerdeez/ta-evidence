'use server';

import { type ErrorResponse, errorResponse } from '@ta/api';
import { auth } from '@ta/auth';
import { redirect } from 'next/navigation';

import { type ForgotPasswordValues, forgotPasswordSchema } from './forgot-password.schema';

function getResetPasswordRedirectUrl(): string {
  const baseUrl = process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3001';
  return `${baseUrl.replace(/\/$/, '')}/reset-password`;
}

export async function forgotPasswordAction(values: ForgotPasswordValues): Promise<ErrorResponse> {
  try {
    const { email } = forgotPasswordSchema.parse(values);

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: getResetPasswordRedirectUrl(),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Password reset request failed:', error);
      return errorResponse([new Error('Unable to send a reset email. Please try again later.')]);
    }
    throw error;
  }

  redirect('/forgot-password/check-email');
}
