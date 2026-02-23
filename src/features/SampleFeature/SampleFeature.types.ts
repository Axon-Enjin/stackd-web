import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

export type sampleResourceRow = Tables<
  { schema: "client_stackd" },
  "test_resource"
>;
export type sampleResourceInsertDTO = TablesInsert<
  { schema: "client_stackd" },
  "test_resource"
>;
export type sampleResourceUpdateDTO = TablesUpdate<
  { schema: "client_stackd" },
  "test_resource"
>;
