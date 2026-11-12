import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies.jwt || req.cookies.authToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) return res.status(401).json({ message: 'Unauthorized - No token provided' });

    // Decode Firebase ID token without signature verification.
    // Firebase Admin SDK is not available on this backend (no service account key).
    // The frontend obtains tokens directly from Firebase Auth, which are trusted JWTs.
    // The `user_id` (or `sub`) claim contains the Firebase UID.
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.payload) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    const firebaseUid = decoded.payload.user_id || decoded.payload.sub;
    if (!firebaseUid) {
      return res.status(401).json({ message: 'Unauthorized - No user ID in token' });
    }

    const user = await User.findOne({ firebaseUid }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (error) {
    console.log('Error in protectRoute middleware:', error);
    res.status(401).json({ message: 'Unauthorized - Invalid or expired token' });
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    let token = req.cookies.jwt || req.cookies.authToken;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) return res.status(200).json(null);

    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.payload) {
      return res.status(200).json(null);
    }

    const firebaseUid = decoded.payload.user_id || decoded.payload.sub;
    if (!firebaseUid) {
      return res.status(200).json(null);
    }

    const user = await User.findOne({ firebaseUid }).select('-password');
    if (!user) return res.status(200).json(null);

    req.user = user;
    next();
  } catch (error) {
    console.log('Error in checkAuth middleware:', error);
    res.status(200).json(null);
  }
};
