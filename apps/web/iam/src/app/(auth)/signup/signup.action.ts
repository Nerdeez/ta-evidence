'use server';

import { type ErrorResponse, errorResponse } from '@ta/api';
import { auth } from '@ta/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type SignUpValues, signUpSchema } from './signup.schema';

export async function signUpAction(values: SignUpValues): Promise<ErrorResponse> {
  try {
    const { name, email, password } = signUpSchema.parse(values);

    await auth.api.signUpEmail({
      body: {
        name,
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

  redirect('/verify-email');
}
