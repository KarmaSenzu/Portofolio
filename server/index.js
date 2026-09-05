require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
const { testConnection: testDbConnection } = require('./config/supabase');
const { testConnection: testCloudinaryConnection } = require('./config/cloudinary');

const app = express();
const PORT = process.env.PORT || 5001;

// Gzip compression untuk semua responses (reduces JS/CSS ~70%)
app.use(compression({ level: 6 }));

// Security headers (X-Frame-Options, X-Content-Type-Options, dll)
app.use(helmet({
  contentSecurityPolicy: false, // Nonaktifkan CSP default (frontend & Cloudinary/Supabase butuh fleksibilitas)
}));

// CORS configuration - locked to specific origins (SECURITY: no open fallback)
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // SECURITY: reject unknown origins (jangan open CORS)
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - reduced limit (SECURITY: prevent JSON DoS)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Note: Cloudinary handles file storage now, no local uploads directory needed

// Mount routes
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const skillRoutes = require('./routes/skills');
const certificateRoutes = require('./routes/certificates');
const experienceRoutes = require('./routes/experiences');
const settingRoutes = require('./routes/settings');
const uploadRoutes = require('./routes/upload');
const recycleBinRoutes = require('./routes/recycleBin');

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/recycle-bin', recycleBinRoutes);

// Serve frontend static files in production (Docker)
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  console.log('Serving frontend from:', distPath);

  // Immutable caching untuk hashed assets + no-cache untuk HTML
  app.use(express.static(distPath, {
    setCustomCacheControl: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        // Hashed filenames - cache forever
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // HTML & other files - always revalidate
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // SPA fallback - all non-API routes serve index.html
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // 404 handler (dev mode - frontend served by Vite)
  app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found.' });
  });
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large.' });
  }

  res.status(500).json({ error: 'Internal server error.' });
});

// Start server
async function start() {
  console.log('🚀 Starting Portfolio CMS Server...\n');

  // Test Supabase connection
  console.log('📊 Testing Supabase connection...');
  await testDbConnection();

  // Test Cloudinary connection
  console.log('☁️  Testing Cloudinary connection...');
  await testCloudinaryConnection();

  console.log('');

  app.listen(PORT, () => {
    console.log('✅ Server running successfully!');
    console.log(`📍 API: http://localhost:${PORT}/api`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log(`🔄 Keep-Alive: http://localhost:${PORT}/api/health/keep-alive`);
    console.log(`\n🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start();
