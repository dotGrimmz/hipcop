import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const first_name = "Rakeem";
    const last_name = "Gordon";
    const email = "rakeemxng@gmail.com";
    const phone_number = "561-565-8570";
    const date_of_birth = "01/16/1990";
    // const body = await req.json();
    // const { first_name, last_name, email, phone_number, date_of_birth } = body;

    // // Basic validation (add more as needed)
    // if (!first_name || !last_name || !email || !date_of_birth) {
    //   return NextResponse.json(
    //     { error: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          first_name,
          last_name,
          email,
          phone_number: phone_number || null,
          date_of_birth,
          // user_id should come from auth context in real app
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ patient: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 }
    );
  }
}
