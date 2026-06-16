import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PublicLinkButton } from "@/components/shared/public-link-button";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils/url";

type Props = {
  params: Promise<{ username: string }>;
};

async function getPublicProfile(username: string) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("active", true)
    .maybeSingle();

  if (!user) return null;

  const [{ data: profile }, { data: links }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("links").select("*").eq("user_id", user.id).order("order_position"),
  ]);

  return { user, profile, links: links ?? [] };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const data = await getPublicProfile(username);

  if (!data) {
    return { title: "Perfil não encontrado" };
  }

  const title = `@${data.user.username}`;
  const description = data.profile?.bio || "Minha página LinkWave.";
  const image = data.user.avatar_url || "/brand/banner.png";

  return {
    title,
    description,
    alternates: { canonical: `${getBaseUrl()}/u/${data.user.username}` },
    openGraph: {
      title,
      description,
      images: [image],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const data = await getPublicProfile(username);
  if (!data) notFound();

  const { user, profile, links } = data;

  return (
    <main className="aurora-shell relative min-h-screen overflow-hidden px-4 py-10">
      <div className="mesh-grid pointer-events-none absolute inset-0" />
      <section className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl flex-col justify-center">
        <div className="glass-panel rounded-[2rem] p-6 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-border bg-white/80 shadow-xl dark:bg-white/10">
            <Image
              src={user.avatar_url || "/brand/icon.png"}
              alt={user.username}
              width={112}
              height={112}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="mt-6 text-3xl font-black">@{user.username}</h1>
          <p className="mx-auto mt-3 max-w-md leading-7 text-muted">
            {profile?.bio || "Minha onda de links."}
          </p>
          <div className="mt-8 space-y-3 text-left">
            {links.map((link) => (
              <PublicLinkButton key={link.id} link={link} />
            ))}
            {links.length === 0 ? (
              <div className="rounded-2xl border border-border bg-white/60 p-5 text-center text-sm font-semibold text-muted dark:bg-white/5">
                Este perfil ainda não publicou links.
              </div>
            ) : null}
          </div>
        </div>
        <a href="/" className="mt-6 text-center text-sm font-bold text-muted hover:text-foreground">
          Criado com LinkWave
        </a>
      </section>
    </main>
  );
}
