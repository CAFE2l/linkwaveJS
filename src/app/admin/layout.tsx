import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { prisma } from "@/lib/db/prisma";
import { AdminLayout } from "@/components/admin/admin-layout";

export const metadata = { title: "Admin | LinkWave" };

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const record = await prisma.user.findUnique({ where: { id: authUser.uid } });
  if (!record || record.role !== "admin") redirect("/dashboard");

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

  return <AdminLayout user={user}>{children}</AdminLayout>;
}
