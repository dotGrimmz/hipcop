"use client";

import React, { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const [supabase, setSupabase] = useState<any>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setSupabase(createSupabaseBrowserClient());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("Supabase client not initialized");
      return;
    }

    if (isSignUp) {
      if (!fullName) {
        setMessage("Please enter your full name");
        return;
      }

      // Sign up user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user) {
        // Insert profile row
        const { error: profileError } = await supabase
          .from("users")
          .insert([{ id: data.user.id, full_name: fullName, email }]);

        if (profileError) {
          setMessage(profileError.message);
          return;
        }
      }

      setMessage("Signup successful! Please check your email to confirm.");
    } else {
      // Sign in user
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Signed in successfully!");

      // TODO: redirect or reload page
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold">{isSignUp ? "Sign Up" : "Sign In"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full border p-2"
      />

      {isSignUp && (
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required={isSignUp}
          className="w-full border p-2"
        />
      )}

      <button type="submit" className="w-full bg-blue-600 text-white p-2">
        {isSignUp ? "Sign Up" : "Sign In"}
      </button>

      <p className="text-center mt-2">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>

      {message && <p className="mt-2 text-center text-red-600">{message}</p>}
    </form>
  );
}
