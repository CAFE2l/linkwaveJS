import { createClient } from "@supabase/supabase-js";

// Uses public anon key for client-side reads. For server-side actions use service_role key securely.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(url, anon);
