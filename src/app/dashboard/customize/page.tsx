import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { prisma } from "@/lib/db/prisma";
import { ensureUserRecord } from "@/lib/db/upsert-user";
import { CustomizePanel } from "@/components/customize/customize-panel";

export const metadata = { title: "Customizar | LinkWave" };

export default async function CustomizePage() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const record =
    (await prisma.user.findUnique({ where: { id: authUser.uid } })) ??
    (await ensureUserRecord(authUser.uid, authUser.email ?? ""));

  const profile = await prisma.profile.findFirst({
    where: { userId: authUser.uid },
    select: { bio: true },
  });

  const user = {
    id: record.id,
    email: record.email,
    username: record.username,
    name: record.name,
    avatar_url: record.avatarUrl,
    banner_url: record.bannerUrl,
    theme_json: record.themeJson,
    role: record.role,
    active: record.active,
    created_at: record.createdAt.toISOString(),
  };

  return (
    <CustomizePanel
      user={user}
      initialBio={profile?.bio ?? ""}
    />
  );
}
