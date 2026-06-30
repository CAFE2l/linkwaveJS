import { createHash } from "node:crypto";
import { getPrisma } from "@/lib/db/prisma";

const MAX_REGISTRATIONS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function getIpKey(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

export async function checkRegistrationRateLimit(ip: string) {
  const ipKey = getIpKey(ip);
  const since = new Date(Date.now() - WINDOW_MS);

  try {
    const count = await getPrisma().registrationRateLimit.count({
      where: {
        ipKey,
        createdAt: { gte: since },
      },
    });

    if (count >= MAX_REGISTRATIONS) {
      return {
        allowed: false,
        message: "Muitas tentativas de cadastro. Tente novamente em 15 minutos.",
      };
    }

    await getPrisma().registrationRateLimit.create({
      data: { ipKey },
    });

    return { allowed: true, message: "OK" };
  } catch (err) {
    console.error("registration rate limit check failed", err);
    return { allowed: false, message: "Não foi possível validar sua tentativa agora." };
  }
}
