import { redirect } from "next/navigation";
import FullDashboard from "@/components/customize/FullDashboard";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { prisma } from "@/lib/db/prisma";
import { ensureUserRecord } from "@/lib/db/upsert-user";
import { ThemeProvider } from "@/components/landing/theme-provider";
import { BlobBackground } from "@/components/landing/blob-background";
import { listIconsAction, type IconInfo } from "@/lib/actions/icons";
import type { Link } from "@prisma/client";

export const metadata = { title: "Dashboard | LinkWave" };

export default async function DashboardPage() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const record =
    (await prisma.user.findUnique({ where: { id: authUser.uid } })) ??
    (await ensureUserRecord(authUser.uid, authUser.email ?? ""));

  const profile = await prisma.profile.findFirst({
    where: { userId: authUser.uid },
    select: { bio: true },
  });
  const rawLinks: Link[] = await prisma.link.findMany({
    where: { userId: authUser.uid },
    orderBy: { orderPosition: "asc" },
  });
  const totalClicks = await prisma.click.count({ where: { userId: authUser.uid } });
  const iconsData: IconInfo[] = await listIconsAction();

  const allIcons = iconsData.map((icon: IconInfo) => icon.name);

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

  const links = rawLinks.map((link: Link) => ({
    id: link.id,
    user_id: link.userId,
    title: link.title,
    url: link.url,
    icon: link.icon,
    icone: link.icone,
    icon_blob: link.iconBlob,
    is_custom_icon: link.isCustomIcon,
    pinned: link.pinned,
    order_position: link.orderPosition,
    created_at: link.createdAt.toISOString(),
  }));

  return (
    <ThemeProvider>
      <div className="min-h-screen landing-bg">
        <BlobBackground />
        <div className="relative z-10">
          <FullDashboard
            initialUser={user}
            initialLinks={links}
            initialClicks={totalClicks}
            initialIcons={allIcons}
            initialBio={profile?.bio ?? ""}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
