const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const characterRoutes = require('./routes/character');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration to allow custom headers like x-access-token
app.use(cors({
  origin: '*', // Or your frontend URL for stricter security
  allowedHeaders: ['Content-Type', 'x-access-token'], // ✅ Allow this header
  exposedHeaders: ['x-access-token'], // Optional: expose it to frontend if needed
}));

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.json());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/character', characterRoutes);

// ✅ Optional debug route to verify headers (for testing)
app.post('/debug', (req, res) => {
  console.log('✅ Reached /debug route');
  console.log('HEADERS RECEIVED:', req.headers);
  res.json({ message: 'Debug success' });
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Ragnarok-inspired backend is running!');
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ✅ Start server (bind to all interfaces)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
