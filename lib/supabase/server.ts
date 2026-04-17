import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "./env";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(
            ({ name, value, options }: { name: string; value: string; options: CookieOptions }) => {
              cookieStore.set(name, value, options);
            },
          );
        } catch {
          // Server Components may not allow setting cookies directly.
        }
      },
    },
  });
}
