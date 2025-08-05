import { createSupabaseServerClient } from "./server";

export async function testSupabaseConnection() {
  const supabase = createSupabaseServerClient();

  // Safe table with RLS
  const { data, error } = await supabase
    .from("your_table")
    .select("id")
    .limit(1);

  return {
    success: !error,
    error: error?.message,
    data,
  };
}
