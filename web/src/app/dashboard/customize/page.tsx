import React from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabaseServer";
import ClientCustomize from "./ClientCustomize";

export default async function Page() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Not authenticated — redirect to login
    redirect("/login");
  }

  // Fetch the user's profile (server-side)
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();

  // If no profile exists, profile will be null — ClientCustomize handles create flow
  return <ClientCustomize initialProfile={profile ?? null} />;
}
