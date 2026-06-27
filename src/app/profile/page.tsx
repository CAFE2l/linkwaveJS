import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { prisma } from "@/lib/db/prisma";

export const metadata = { title: "Perfil" };

export default async function ProfilePage() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: authUser.uid } });
  if (!user) redirect("/register");

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
