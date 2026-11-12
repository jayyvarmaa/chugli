import admin from 'firebase-admin';
import { ENV } from './env.js';

// Initialize Firebase Admin only when credentials are available.
// This keeps the server from crashing in environments where Firebase
// auth is not (yet) configured (e.g. missing FIREBASE_* env vars).
let firebaseAdmin = null;
let firebaseInitialized = false;

if (
  ENV.FIREBASE_PROJECT_ID &&
  ENV.FIREBASE_CLIENT_EMAIL &&
  ENV.FIREBASE_PRIVATE_KEY &&
  !admin.apps.length
) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: ENV.FIREBASE_PROJECT_ID,
        clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
        privateKey: ENV.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    firebaseInitialized = true;
    console.log('[FIREBASE] Admin SDK initialized successfully');
  } catch (error) {
    console.error('[FIREBASE] Admin SDK initialization failed:', error.message);
  }
} else {
  console.warn(
    '[FIREBASE] Admin SDK not initialized: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY is missing.'
  );
}

export { firebaseAdmin, firebaseInitialized };
