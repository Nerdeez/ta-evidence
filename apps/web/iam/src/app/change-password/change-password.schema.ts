import * as z from 'zod';

import {
  passwordConfirmationFieldSchema,
  passwordConfirmationRefine,
  passwordFieldSchema,
  passwordsMatch,
} from '../password.schema';

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    password: passwordFieldSchema,
    passwordConfirmation: passwordConfirmationFieldSchema,
  })
  .refine(passwordsMatch, passwordConfirmationRefine);

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
