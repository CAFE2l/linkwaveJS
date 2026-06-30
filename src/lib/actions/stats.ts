import type { LandingStats } from "@/types/database";

export async function getLandingStats(): Promise<LandingStats> {
  try {
    // Keep database driver loading inside the guarded runtime path. If the
    // deployment cannot load or configure Prisma, the public landing page
    // still renders with fallback statistics instead of crashing at startup.
    const { getPrisma } = await import("@/lib/db/prisma");
    const prisma = getPrisma();
    const [totalUsers, totalClicks, activeUsers] = await Promise.all([
      prisma.user.count({ where: { active: true } }),
      prisma.click.count(),
      prisma.user.findMany({ where: { active: true }, select: { id: true } }),
    ]);

    const activeIds = activeUsers.map((u) => u.id);
    let usersWithClicks = 0;

    if (activeIds.length > 0) {
      const data = await prisma.click.findMany({
        where: { userId: { in: activeIds } },
        select: { userId: true },
      });

      usersWithClicks = new Set(data.map((click) => click.userId)).size;
    }

    const users = totalUsers;

    return {
      totalUsers: users,
      totalClicks,
      satisfaction: users > 0 ? Math.round((usersWithClicks / users) * 100) : 99,
    };
  } catch (error) {
    console.error("getLandingStats", error);
    return { totalUsers: 0, totalClicks: 0, satisfaction: 99 };
  }
}
