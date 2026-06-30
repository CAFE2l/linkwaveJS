import { NextResponse, type NextRequest } from "next/server";

function generateUsername(uid: string): string {
  return `u_${uid.slice(0, 26)}`;
}

export async function POST(request: NextRequest) {
  let idToken: string;

  try {
    const body = (await request.json()) as { idToken?: unknown };
    if (typeof body.idToken !== "string" || body.idToken.length === 0) {
      return NextResponse.json(
        { error: "Missing idToken", code: "MISSING_ID_TOKEN" },
        { status: 400 },
      );
    }
    idToken = body.idToken;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body", code: "INVALID_REQUEST_BODY" },
      { status: 400 },
    );
  }

  let decoded;
  let sessionCookie: string;
  try {
    const { getAdminAuth } = await import("@/lib/firebase/admin");
    const adminAuth = getAdminAuth();
    decoded = await adminAuth.verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });
  } catch (error: unknown) {
    const firebaseCode =
      typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "unknown";
    console.error("Firebase session verification failed", { code: firebaseCode });
    return NextResponse.json(
      { error: "Firebase token validation failed", code: "FIREBASE_TOKEN_REJECTED" },
      { status: 401 },
    );
  }

  try {
    const { getPrisma } = await import("@/lib/db/prisma");
    const prisma = getPrisma();
    const { uid, email, name: displayName } = decoded;
    const userEmail = email ?? "";
    await prisma.user.upsert({
      where: { id: uid },
      create: {
        id: uid,
        email: userEmail,
        username: generateUsername(uid),
        name: displayName ?? "",
      },
      update: {},
    });

    await prisma.profile.upsert({
      where: { userId: uid },
      create: {
        userId: uid,
        name: displayName ?? "",
        username: generateUsername(uid),
        email: userEmail,
        active: true,
        bio: "Minha onda de links.",
        theme: "wave",
        customColors: {},
      },
      update: {},
    });
  } catch (error: unknown) {
    const databaseCode =
      typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "unknown";
    console.error("Firebase user database sync failed", { code: databaseCode });
    return NextResponse.json(
      { error: "User database sync failed", code: "USER_SYNC_FAILED" },
      { status: 500 },
    );
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const response = NextResponse.json({ success: true });
  response.cookies.set("__session", sessionCookie, {
    maxAge: expiresIn / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("__session", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
