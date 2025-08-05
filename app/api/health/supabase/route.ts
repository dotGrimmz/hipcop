import { testSupabaseConnection } from "@/lib/supabase/health";
import { NextResponse } from "next/server";

export async function GET() {
  const { success, error, data } = await testSupabaseConnection();

  if (!success) {
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}
