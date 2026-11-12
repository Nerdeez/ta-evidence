import * as z from 'zod';

import { passwordFieldSchema } from '../../password.schema';

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address.'),
  password: passwordFieldSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
