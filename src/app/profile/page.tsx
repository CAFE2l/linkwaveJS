import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { prisma } from "@/lib/db/prisma";

export const metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const record = await prisma.user.findUnique({ where: { id: authUser.uid } });
  if (!record) redirect("/register");

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

  const profile = await prisma.profile.findFirst({
    where: { userId: authUser.uid },
    select: { bio: true },
  });

  return (
    <DashboardShell user={user}>
      <ProfileEditor user={user} initialBio={profile?.bio ?? ""} />
    </DashboardShell>
  );

}
