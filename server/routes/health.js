/**
 * ================================================
 * HEALTH CHECK & KEEP-ALIVE ROUTES
 * ================================================
 * Endpoints for monitoring and keeping Supabase active
 * ================================================
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { cloudinary } = require('../config/cloudinary');

/**
 * Basic health check
 * GET /api/health
 */
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

/**
 * Keep-alive endpoint for Supabase (prevents database pause)
 * GET /api/health/keep-alive
 * 
 * Called by GitHub Actions cron job every 3 days
 */
router.get('/keep-alive', async (req, res) => {
  try {
    const startTime = Date.now();

    // Perform lightweight database query to keep Supabase active
    const { data, error } = await supabase
      .from('settings')
      .select('setting_key')
      .limit(1);

    if (error) {
      console.error('Keep-alive database query failed:', error);
      return res.status(500).json({
        status: 'error',
        database: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }

    const responseTime = Date.now() - startTime;

    // Log keep-alive activity
    console.log(`✅ Keep-alive ping successful (${responseTime}ms) at ${new Date().toISOString()}`);

    res.json({
      status: 'ok',
      database: 'connected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      message: 'Database keep-alive successful'
    });
  } catch (error) {
    console.error('Keep-alive error:', error);
    res.status(500).json({
      status: 'error',
      database: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Detailed health check with service status
 * GET /api/health/detailed
 */
router.get('/detailed', async (req, res) => {
  try {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {}
    };

    // Check Supabase connection
    try {
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      health.services.database = {
        status: error ? 'down' : 'up',
        provider: 'Supabase',
        error: error?.message
      };
    } catch (dbError) {
      health.services.database = {
        status: 'down',
        provider: 'Supabase',
        error: dbError.message
      };
    }

    // Check Cloudinary connection
    try {
      const result = await cloudinary.api.ping();
      health.services.storage = {
        status: result.status === 'ok' ? 'up' : 'down',
        provider: 'Cloudinary'
      };
    } catch (storageError) {
      health.services.storage = {
        status: 'down',
        provider: 'Cloudinary',
        error: storageError.message
      };
    }

    // Overall status
    const allServicesUp = Object.values(health.services)
      .every(service => service.status === 'up');
    
    health.status = allServicesUp ? 'ok' : 'degraded';

    const statusCode = allServicesUp ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
