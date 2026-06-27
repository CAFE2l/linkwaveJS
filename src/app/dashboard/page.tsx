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

  const [user, links, totalClicks, iconsData] = await Promise.all([
    prisma.user.findUnique({ where: { id: authUser.uid } }),
    prisma.link.findMany({ where: { userId: authUser.uid }, orderBy: { orderPosition: "asc" } }),
    prisma.click.count({ where: { userId: authUser.uid } }),
    listIconsAction(),
  ]);

  const allIcons = iconsData.map((i) => i.name);

  if (!user) redirect("/register");

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
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
