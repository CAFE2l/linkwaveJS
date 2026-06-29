import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/firebase/auth-server";

export async function requireAdminApi() {
  const authUser = await getCurrentUser();
  if (!authUser) {
    return { ok: false as const, status: 401, message: "Não autenticado." };
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.uid },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "admin") {
    return { ok: false as const, status: 403, message: "Acesso negado." };
  }

  return { ok: true as const, user };
}
