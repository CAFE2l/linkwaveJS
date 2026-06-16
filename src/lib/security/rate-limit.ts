import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_REGISTRATIONS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function getIpKey(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

export async function checkRegistrationRateLimit(ip: string) {
  const supabase = createAdminClient();
  const ipKey = getIpKey(ip);
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { count, error } = await supabase
    .from("registration_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_key", ipKey)
    .gte("created_at", since);

  if (error) {
    console.error("registration rate limit check failed", error);
    return { allowed: false, message: "Não foi possível validar sua tentativa agora." };
  }

  if ((count ?? 0) >= MAX_REGISTRATIONS) {
    return {
      allowed: false,
      message: "Muitas tentativas de cadastro. Tente novamente em 15 minutos.",
    };
  }

  const { error: insertError } = await supabase
    .from("registration_rate_limits")
    .insert({ ip_key: ipKey });

  if (insertError) {
    console.error("registration rate limit insert failed", insertError);
    return { allowed: false, message: "Não foi possível validar sua tentativa agora." };
  }

  return { allowed: true, message: "OK" };
}
