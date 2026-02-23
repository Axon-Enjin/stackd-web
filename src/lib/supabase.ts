import { configs } from "@/configs/configs";
import { Database } from "@/types/supabase.types";
import { createClient } from "@supabase/supabase-js";

const projectUrl = configs.supabase.projectUrl;
const secretKey = configs.supabase.secretKey;

export const supabaseAdminClient = createClient<Database>(projectUrl!, secretKey!, {
    db: {
        schema: configs.supabase.schema 
    }
});
