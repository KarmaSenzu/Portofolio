#!/bin/bash

# ================================================
# PORTFOLIO CMS - DEPLOYMENT SCRIPT
# ================================================
# Initial deployment setup for VPS
# Run once: chmod +x deploy.sh && ./deploy.sh
# ================================================

set -e  # Exit on error

echo "🚀 Portfolio CMS Deployment Script"
echo "=================================="
echo ""

# ================================================
# 1. CHECK PREREQUISITES
# ================================================

echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Install with: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION found"

# Check PM2
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 not found. Installing globally..."
    sudo npm install -g pm2
fi

PM2_VERSION=$(pm2 -v)
echo "✅ PM2 $PM2_VERSION found"

echo ""

# ================================================
# 2. ENVIRONMENT SETUP
# ================================================

echo "🔧 Setting up environment..."

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  No server/.env file found"
    
    if [ -f "server/.env.example" ]; then
        echo "📝 Copying server/.env.example to server/.env"
        cp server/.env.example server/.env
        echo ""
        echo "⚠️  IMPORTANT: Edit server/.env and fill in your credentials:"
        echo "   - SUPABASE_URL"
        echo "   - SUPABASE_SERVICE_KEY"
        echo "   - CLOUDINARY_CLOUD_NAME"
        echo "   - CLOUDINARY_API_KEY"
        echo "   - CLOUDINARY_API_SECRET"
        echo "   - JWT_SECRET"
        echo "   - FRONTEND_URL"
        echo ""
        echo "Press ENTER after editing server/.env to continue..."
        read -r
    else
        echo "❌ server/.env.example not found"
        exit 1
    fi
fi

# Check if frontend .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "📝 Copying .env.example to .env"
        cp .env.example .env
    fi
fi

echo "✅ Environment files ready"
echo ""

# ================================================
# 3. INSTALL DEPENDENCIES
# ================================================

echo "📦 Installing dependencies..."

# Backend dependencies
echo "Installing backend dependencies..."
cd server
npm install --production
cd ..

# Frontend dependencies
echo "Installing frontend dependencies..."
npm install

echo "✅ Dependencies installed"
echo ""

# ================================================
# 4. BUILD FRONTEND
# ================================================

echo "🏗️  Building frontend..."
npm run build

if [ -d "dist" ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""

# ================================================
# 5. CREATE LOGS DIRECTORY
# ================================================

echo "📁 Creating logs directory..."
mkdir -p logs
echo "✅ Logs directory created"
echo ""

# ================================================
# 6. TEST CONNECTIONS
# ================================================

echo "🔌 Testing connections..."
echo "Starting server for connection test..."

# Start server in background
cd server
node index.js &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 5

# Test health endpoint
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Server is running and responding"
else
    echo "⚠️  Server health check failed (this might be OK if env vars not set yet)"
fi

# Stop test server
kill $SERVER_PID 2>/dev/null || true

echo ""

# ================================================
# 7. START WITH PM2
# ================================================

echo "🚀 Starting application with PM2..."

# Stop existing instance if any
pm2 delete portfolio-cms 2>/dev/null || true

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
echo "Setting up PM2 startup script..."
pm2 startup | tail -n 1 | sudo bash || true

echo "✅ Application started with PM2"
echo ""

# ================================================
# 8. DEPLOYMENT SUMMARY
# ================================================

echo "=================================="
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "📍 Application Status:"
pm2 status
echo ""
echo "📊 Monitoring:"
echo "   View logs:    pm2 logs portfolio-cms"
echo "   Monitor:      pm2 monit"
echo "   Status:       pm2 status"
echo ""
echo "🔄 Management Commands:"
echo "   Restart:      pm2 restart portfolio-cms"
echo "   Stop:         pm2 stop portfolio-cms"
echo "   Delete:       pm2 delete portfolio-cms"
echo ""
echo "🌐 Next Steps:"
echo "1. Configure Nginx reverse proxy (see nginx.conf)"
echo "2. Setup SSL certificate (certbot)"
echo "3. Configure firewall (ufw)"
echo "4. Setup GitHub Actions secret (API_URL)"
echo ""
echo "📝 Important Files:"
echo "   - server/.env (credentials)"
echo "   - logs/ (application logs)"
echo "   - ecosystem.config.js (PM2 config)"
echo ""
