// const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

// Use JSON middleware to parse incoming requests
app.use(express.json());

// Register the /api/auth routes
app.use('/api/auth', authRoutes);

// Add your other routes, like the home route
app.get('/', (req, res) => res.send('Hello World!'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const mongoose = require('mongoose');
require('dotenv').config(); // only needed locally
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error", err));

// Load models
require('./models/User');
require('./models/Character');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// const express = require('express');
const app = express();
app.use(express.json());

// Auth route
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


// Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error(err);
});

// Test route
app.get('/', (req, res) => {
  res.send('Ragnarok-inspired backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
