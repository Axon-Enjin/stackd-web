import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { configs } from "@/configs/configs";
import { Database } from "@/types/supabase.types";

/**
 * Creates a standard server-side client that utilizes cookies for session management.
 * NOTE: Using this function inside an API route or page will mark it as DYNAMIC
 * and bypass the Vercel Edge cache unless otherwise specified.
 */
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

/**
 * Creates a static anonymous client that does NOT look at cookies.
 * Use this for fetching PUBLIC data (Team Members, Testimonials) to enable
 * true Vercel Edge Caching (HIT) and extremely fast performance.
 */
export function createSupabaseAnonymousClient() {
  return createClient<Database>(
    configs.supabase.projectUrl!,
    configs.supabase.publishableKey!,
    {
      db: {
        schema: configs.supabase.schema,
      },
    }
  );
}
