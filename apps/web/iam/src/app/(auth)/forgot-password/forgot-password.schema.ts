import * as z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address.'),
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
