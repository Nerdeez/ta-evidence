import * as z from 'zod';

export const passwordFieldSchema = z.string().min(8, 'Password must be at least 8 characters.');

export const passwordConfirmationFieldSchema = z.string().min(1, 'Please confirm your password.');

export const passwordConfirmationRefine = {
  message: 'Passwords do not match.',
  path: ['passwordConfirmation'],
};

export function passwordsMatch(data: { password: string; passwordConfirmation: string }): boolean {
  return data.password === data.passwordConfirmation;
}
