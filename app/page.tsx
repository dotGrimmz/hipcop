"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import AuthForm from "./components/AuthForm";

export default function LandingPage() {
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // Example: check session or user data if needed
    supabase.auth.getSession().then(({ data }) => {});
  }, []);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to HIPCOP</h1>
      <AuthForm />
    </main>
  );
}
