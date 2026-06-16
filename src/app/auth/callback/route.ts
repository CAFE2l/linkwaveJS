import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const admin = createAdminClient();
        const { data: existingProfile } = await admin
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!existingProfile) {
          const metadata = user.user_metadata ?? {};
          const email = user.email;
          const username =
            normalize(
              String(metadata.username || email.split("@")[0] || "user"),
            ) || `user_${Math.random().toString(36).slice(2, 10)}`;
          const name = String(metadata.name || metadata.full_name || username);

          await admin
            .from("users")
            .insert({
              id: user.id,
              email: email.toLowerCase(),
              username,
              name,
              avatar_url:
                typeof metadata.avatar_url === "string"
                  ? metadata.avatar_url
                  : typeof metadata.picture === "string"
                    ? metadata.picture
                    : null,
              active: true,
            } as never);

          await admin
            .from("profiles")
            .insert({
              user_id: user.id,
              name,
              username,
              email: email.toLowerCase(),
              avatar_url:
                typeof metadata.avatar_url === "string"
                  ? metadata.avatar_url
                  : typeof metadata.picture === "string"
                    ? metadata.picture
                    : null,
              active: true,
              bio: "Minha onda de links.",
              theme: "wave",
              custom_colors: {},
            } as never);
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
