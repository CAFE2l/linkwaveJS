import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("__session")?.value;
    if (!sessionCookie) return null;

    // Firebase Admin is intentionally loaded only when a session exists so an
    // optional auth configuration cannot crash anonymous public routes.
    const { getAdminAuth } = await import("./admin");
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.uid ?? null;
}
