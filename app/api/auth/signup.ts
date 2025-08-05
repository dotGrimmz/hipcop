import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Create user via admin API
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // or false if you want verification
      });

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    const userId = userData.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "Failed to get user ID" },
        { status: 500 }
      );
    }
    // Insert into users table
    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: userId,
      email,
      role: "user",
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "User signed up successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
