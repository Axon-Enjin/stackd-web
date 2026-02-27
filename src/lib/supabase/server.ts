import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { configs } from "@/configs/configs";
import { Database } from "@/types/supabase.types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    configs.supabase.projectUrl!,
    configs.supabase.publishableKey!, // As requested: utilizing the anon/publishable key
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options }),
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      db: {
        schema: configs.supabase.schema,
      },
    },
  );
}
