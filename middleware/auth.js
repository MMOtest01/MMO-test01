const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // 🔍 Debug: log headers to verify token presence
  console.log('HEADERS RECEIVED:', req.headers);

  // ✅ Try to extract token from either Authorization or x-access-token
  const bearerToken = req.header('Authorization')?.replace('Bearer ', '');
  const fallbackToken = req.headers['x-access-token'];
  const token = bearerToken || fallbackToken;

  if (!token) {
    console.warn('❌ No token provided.');
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    // ✅ Use your actual JWT secret (ideally from .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.warn('❌ User not found for decoded token');
      throw new Error('User not found');
    }

    req.user = user; // Attach user to request object
    next(); // Continue to the next middleware or route
  } catch (error) {
    console.error('
