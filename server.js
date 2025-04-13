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

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/character', characterRoutes);

app.get('/', (req, res) => {
  res.send('Ragnarok-inspired backend is running!');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)

}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// ✅ Bind to 0.0.0.0 so other devices (phone) can access this
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
