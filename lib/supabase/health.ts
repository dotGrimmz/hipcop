import { createClient } from "@/lib/supabase/server";

export async function testSupabaseConnection() {
  const supabase = await createClient(); // creates the server-side Supabase client with cookies

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
