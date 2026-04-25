import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { env } from "../config/env.js";

let app: App | undefined;
let auth: Auth | undefined;

export function initFirebaseAdmin(): void {
  if (getApps().length > 0) {
    app = getApps()[0]!;
    auth = getAuth(app);
    return;
  }

  let serviceAccount: Record<string, unknown>;
  try {
    const decoded = Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8");
    serviceAccount = JSON.parse(decoded);
  } catch (err) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_B64 is not valid base64-encoded JSON: ${(err as Error).message}`
    );
  }

  app = initializeApp({
    credential: cert(serviceAccount as Parameters<typeof cert>[0]),
    projectId: env.FIREBASE_PROJECT_ID,
  });
  auth = getAuth(app);
}

export function firebaseAuth(): Auth {
  if (!auth) throw new Error("Firebase Admin not initialised. Call initFirebaseAdmin() at boot.");
  return auth;
}
