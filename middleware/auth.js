const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // 🔍 Log all incoming headers for debugging
  console.log('HEADERS RECEIVED:', req.headers);

  // ✅ Support both standard and legacy token headers
  const bearerToken = req.header('Authorization')?.replace('Bearer ', '');
  const fallbackToken = req.headers['x-access-token'];
  const token = bearerToken || fallbackToken;

  if (!token) {
    console.warn('❌ No token provided.');
    return res.status(401).json({ error: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_super_secret_key'); // 🔐 Replace with process.env.JWT_SECRET in production
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.warn('❌ User not found for decoded token');
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
