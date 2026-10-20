'use server';

import { type ErrorResponse, errorResponse } from '@ta/api';
import { auth } from '@ta/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type LoginValues, loginSchema } from './login.schema';

export async function loginAction(values: LoginValues): Promise<ErrorResponse> {
  try {
    const { email, password } = loginSchema.parse(values);

    await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: '/dashboard',
      },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse([error]);
    }
    throw error;
  }

  redirect('/dashboard');
}
