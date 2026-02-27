import { createBrowserClient } from "@supabase/ssr";
import { configs } from "@/configs/configs";
import { Database } from "@/types/supabase.types";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    configs.supabase.projectUrl!,
    configs.supabase.publishableKey!,
    {
      db: {
        schema: configs.supabase.schema,
      },
    },
  );
}
