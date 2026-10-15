'use server';

import { auth } from '@ta/auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type SignUpValues, signUpSchema } from './signup.schema';

export type SignUpActionResult = { ok: true } | { ok: false; error: string };

export async function signUpAction(values: SignUpValues): Promise<SignUpActionResult> {
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: 'Please fix the errors in the form.' };
  }

  const { name, email, password } = parsed.data;

  try {
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
    if (error instanceof APIError) {
      return { ok: false, error: error.message || 'Sign up failed.' };
    }
    throw error;
  }

  redirect('/verify-email');
}
