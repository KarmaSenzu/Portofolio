/**
 * ================================================
 * PM2 ECOSYSTEM CONFIGURATION
 * ================================================
 * Process manager configuration for production deployment
 * Usage: pm2 start ecosystem.config.js
 * ================================================
 */

module.exports = {
  apps: [
    {
      name: 'portfolio-cms',
      script: './server/index.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      
      // Restart behavior
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // Restart on file changes in development
      // watch: ['server'],
      // ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Logging
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      
      // Restart delays
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: false,
      listen_timeout: 3000,
      
      // Additional settings
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:username/portfolio-damar.git',
      path: '/var/www/portfolio',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
