import { createClient } from "@supabase/supabase-js";
import { configs } from "@/configs/configs";
import { Database } from "@/types/supabase.types";

export function createSupabaseServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || configs.supabase.projectUrl;
  
  // Try multiple common names for the service role key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || configs.supabase.secretKey;

  if (!supabaseUrl) {
    throw new Error("Missing Supabase URL. Please check NEXT_PUBLIC_SUPABASE_PROJECT_URL in your .env file.");
  }

  if (!serviceRoleKey) {
    throw new Error("Missing Supabase Service Role Key. This administrative script requires the 'service_role' key (not the anon/publishable key). Please add SUPABASE_SERVICE_ROLE_KEY to your .env file.");
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: (configs.supabase.schema as any) || "client_stackd",
    },
  });
}
