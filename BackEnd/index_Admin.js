const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.Mongo_URL)
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log('Failed to Connect!', err));

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true, // Allow cookies to be sent and received
}));

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server listening on port 8000
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});