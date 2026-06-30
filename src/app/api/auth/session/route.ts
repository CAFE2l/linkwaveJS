import { NextResponse, type NextRequest } from "next/server";

function generateUsername(uid: string): string {
  return `u_${uid.slice(0, 26)}`;
}

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const { getAdminAuth } = await import("@/lib/firebase/admin");
    const { getPrisma } = await import("@/lib/db/prisma");
    const prisma = getPrisma();

    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const { uid, email, name: displayName } = decoded;
    const userEmail = email ?? "";

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn,
    });

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

    const response = NextResponse.json({ success: true });
    response.cookies.set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("__session", "", {
    maxAge: 0,
    path: "/",
  });
  return response;
}
