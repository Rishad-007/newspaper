import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL"),
});

const adminEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
});

type PublicEnv = z.infer<typeof publicEnvSchema>;

type AdminEnv = z.infer<typeof adminEnvSchema>;

let publicEnvCache: PublicEnv | undefined;
let adminEnvCache: AdminEnv | undefined;

function formatZodError(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

function parseOrThrow<T>(
  schema: z.ZodType<T>,
  input: unknown,
  label: string,
): T {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    throw new Error(
      `Invalid ${label} environment variables. ${formatZodError(parsed.error)}`,
    );
  }

  return parsed.data;
}

export function getPublicEnv() {
  if (!publicEnvCache) {
    publicEnvCache = parseOrThrow(publicEnvSchema, process.env, "public");
  }

  return publicEnvCache;
}

export function getAdminEnv() {
  if (!adminEnvCache) {
    adminEnvCache = parseOrThrow(adminEnvSchema, process.env, "admin");
  }

  return adminEnvCache;
}

export function getSupabaseEnv() {
  const env = getPublicEnv();

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

export function getSiteUrl() {
  return getPublicEnv().NEXT_PUBLIC_SITE_URL;
}

export function getServiceRoleKey() {
  return getAdminEnv().SUPABASE_SERVICE_ROLE_KEY;
}
