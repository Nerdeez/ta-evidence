import * as z from 'zod';

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset link is invalid.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    passwordConfirmation: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match.',
    path: ['passwordConfirmation'],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
