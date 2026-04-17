/**
 * Validation schemas for authentication flows.
 */

import { z } from "zod";

/**
 * Email validation (standard)
 */
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

/**
 * Password validation:
 * - min 8 chars
 * - at least one uppercase
 * - at least one lowercase
 * - at least one number
 */
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/\d/, "Password must contain a number");

/**
 * Sign-up form validation
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm password is required"),
    displayName: z.string().optional().default(""),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Sign-in form validation
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * OAuth sign-in (minimal)
 */
export const oAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  redirectTo: z.string().optional(),
});

export type OAuthInput = z.infer<typeof oAuthSchema>;
