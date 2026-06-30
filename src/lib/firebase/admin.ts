import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.startsWith('"') && trimmed.endsWith('"')
    ? trimmed.slice(1, -1)
    : trimmed;
}

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = normalizeEnvValue(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  const projectId = normalizeEnvValue(process.env.FIREBASE_ADMIN_PROJECT_ID);
  const clientEmail = normalizeEnvValue(process.env.FIREBASE_ADMIN_CLIENT_EMAIL);
  if (!privateKey) {
    throw new Error("Configure FIREBASE_ADMIN_PRIVATE_KEY.");
  }
  if (!projectId || !clientEmail) {
    throw new Error("Configure FIREBASE_ADMIN_PROJECT_ID e FIREBASE_ADMIN_CLIENT_EMAIL.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}
