import type { User } from "@prisma/client";
import { prisma } from "./prisma";

function generateUsername(uid: string): string {
  return `u_${uid.slice(0, 26)}`;
}

export async function ensureUserRecord(
  uid: string,
  email: string,
  displayName?: string,
): Promise<User> {
  const existing = await prisma.user.findUnique({ where: { id: uid } });
  if (existing) return existing;

  const username = generateUsername(uid);
  const name = displayName ?? "";

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: { id: uid, email, username, name },
    });
    await tx.profile.create({
      data: {
        userId: uid,
        name,
        username,
        email,
        active: true,
        bio: "Minha onda de links.",
        theme: "wave",
        customColors: {},
      },
    });
  });

  const created = await prisma.user.findUnique({ where: { id: uid } });
  if (!created) throw new Error("Failed to create user record");
  return created;
}
