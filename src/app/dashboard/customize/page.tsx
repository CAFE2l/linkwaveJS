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

  const [profile, rawLinks] = await Promise.all([
    prisma.profile.findFirst({ where: { userId: authUser.uid }, select: { bio: true } }),
    prisma.link.findMany({ where: { userId: authUser.uid }, orderBy: { orderPosition: "asc" } }),
  ]);

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

  const links = rawLinks.map((l) => ({
    id: l.id,
    user_id: l.userId,
    title: l.title,
    url: l.url,
    icon: l.icon,
    icone: l.icone,
    icon_blob: l.iconBlob,
    is_custom_icon: l.isCustomIcon,
    pinned: l.pinned,
    order_position: l.orderPosition,
    created_at: l.createdAt.toISOString(),
  }));

  return (
    <CustomizePanel
      user={user}
      links={links}
      initialBio={profile?.bio ?? ""}
    />
  );
}
