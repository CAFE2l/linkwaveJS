import { redirect } from "next/navigation";
import FullDashboard from "@/components/customize/FullDashboard";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { prisma } from "@/lib/db/prisma";
import { ThemeProvider } from "@/components/landing/theme-provider";
import { BlobBackground } from "@/components/landing/blob-background";
import { listIconsAction } from "@/lib/actions/icons";

export const metadata = { title: "Dashboard | LinkWave" };

export default async function DashboardPage() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const [record, profile, rawLinks, totalClicks, iconsData] = await Promise.all([
    prisma.user.findUnique({ where: { id: authUser.uid } }),
    prisma.profile.findFirst({ where: { userId: authUser.uid }, select: { bio: true } }),
    prisma.link.findMany({ where: { userId: authUser.uid }, orderBy: { orderPosition: "asc" } }),
    prisma.click.count({ where: { userId: authUser.uid } }),
    listIconsAction(),
  ]);

  const allIcons = iconsData.map((i) => i.name);

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
