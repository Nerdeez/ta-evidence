import * as z from 'zod';

import {
  passwordConfirmationFieldSchema,
  passwordConfirmationRefine,
  passwordFieldSchema,
  passwordsMatch,
} from '../../password.schema';

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    email: z.email('Please enter a valid email address.'),
    password: passwordFieldSchema,
    passwordConfirmation: passwordConfirmationFieldSchema,
  })
  .refine(passwordsMatch, passwordConfirmationRefine);

export type SignUpValues = z.infer<typeof signUpSchema>;
