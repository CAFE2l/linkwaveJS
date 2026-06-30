import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const client = new PrismaClient({
    adapter: new PrismaNeon({ connectionString }),
  });

  // Reuse one connection pool across hot reloads and warm function invocations.
  globalForPrisma.prisma = client;
  return client;
}
