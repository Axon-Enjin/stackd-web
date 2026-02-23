import { configs } from "@/configs/configs";
import { createClient } from "@supabase/supabase-js";

const projectUrl = configs.supabase.projectUrl;
const secretKey = configs.supabase.secretKey;

export const supabaseAdminClient = createClient(projectUrl!, secretKey!, {
    db: {
        schema: configs.supabase.schema
    }
});
