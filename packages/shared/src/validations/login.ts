import { z } from 'zod';

/**
 * Shared Login Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Please enter a valid email'),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

/** Infer TypeScript type from the schema — keeps types in sync automatically */
export type LoginFormData = z.infer<typeof loginSchema>;
