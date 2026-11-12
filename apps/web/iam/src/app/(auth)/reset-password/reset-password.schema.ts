import * as z from 'zod';

import {
  passwordConfirmationFieldSchema,
  passwordConfirmationRefine,
  passwordFieldSchema,
  passwordsMatch,
} from '../../password.schema';

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset link is invalid.'),
    password: passwordFieldSchema,
    passwordConfirmation: passwordConfirmationFieldSchema,
  })
  .refine(passwordsMatch, passwordConfirmationRefine);

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
