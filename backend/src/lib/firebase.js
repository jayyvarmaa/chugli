// Firebase Admin SDK is not initialized on this backend.
// The backend verifies Firebase ID tokens by decoding them locally (jwt.decode)
// instead of calling Firebase Admin verifyIdToken(), which requires a service
// account key that cannot be stored in this environment.
//
// Frontend obtains ID tokens directly from Firebase Auth (client-side SDK),
// so the backend only needs to read the `user_id` / `sub` claim from the JWT.

let firebaseAdmin = null;
let firebaseInitialized = false;

export { firebaseAdmin, firebaseInitialized };
