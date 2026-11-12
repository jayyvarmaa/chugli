import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const socketAuthMiddleware = async (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    if (!token) {
      const authHeader = socket.handshake.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      token = socket.handshake.headers.cookie
        ?.split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];
    }

    if (!token) {
      return next(new Error('Unauthorized - No Token Provided'));
    }

    // Decode Firebase ID token without signature verification.
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.payload) {
      return next(new Error('Unauthorized - Invalid Token'));
    }

    const firebaseUid = decoded.payload.user_id || decoded.payload.sub;
    if (!firebaseUid) {
      return next(new Error('Unauthorized - No user ID in token'));
    }

    const user = await User.findOne({ firebaseUid }).select('-password');
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    console.log('Error in socket authentication:', error.message);
    next(new Error('Unauthorized - Authentication failed'));
  }
};
