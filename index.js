require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');

// Import API routes
const categoryAPI = require('./api/category');
const impactAPI = require('./api/impact');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Database initialization state
let dbInitialized = false;

// Middleware to ensure DB and tables are initialized
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (err) {
      console.error('Initial DB connection failed:', err);
    }
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'Rayeva AI System',
    version: '1.1.0',
    database: 'connected', // Simplification for now as connectDB is called on start
    mode: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/category', categoryAPI);
app.use('/api/impact', impactAPI);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      path: req.path,
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to Neon DB
    await connectDB();

    const server = app.listen(PORT)
      .on('listening', () => {
        console.log(`\n✓ Rayeva AI System is running on http://localhost:${PORT}`);
        console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
        console.log(`✓ Category API: POST http://localhost:${PORT}/api/category`);
        console.log(`✓ Impact API: POST http://localhost:${PORT}/api/impact`);
        console.log('\n📝 Ready for testing! Try the endpoints above.\n');
      })
      .on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
          console.log(`Port ${PORT} is in use, this is likely because another instance is running.`);
          console.log(`Try killing the process on port ${PORT} or wait a moment.`);
        } else {
          console.error('Server error:', e);
        }
      });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start server if not running on Vercel
if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;
