import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = await createClient(); // creates the server-side Supabase client with cookies
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const protectedRoutes = ["/dashboard", "/admin"];

  // 🚫 Not logged in and trying to access protected route
  if (!session && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ Logged in - Check user's role
  if (session) {
    const { data: userData, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (error || !userData) {
      console.warn("Could not retrieve user role:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }

    const role = userData.role;

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard") && role !== "patient") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return response;
}
