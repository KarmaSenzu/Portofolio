#!/bin/bash

# ================================================
# PORTFOLIO CMS - START SCRIPT
# ================================================
# Quick start script for development and updates
# Usage: ./start.sh
# ================================================

set -e

echo "🚀 Starting Portfolio CMS..."
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed"
    echo "Install with: npm install -g pm2"
    exit 1
fi

# Check if already running
if pm2 id portfolio-cms > /dev/null 2>&1; then
    echo "🔄 Restarting existing instance..."
    pm2 restart portfolio-cms
else
    echo "▶️  Starting new instance..."
    pm2 start ecosystem.config.js
fi

# Show status
echo ""
pm2 status

echo ""
echo "✅ Portfolio CMS is running"
echo ""
echo "📍 URLs:"
echo "   API:        http://localhost:5001/api"
echo "   Health:     http://localhost:5001/api/health"
echo "   Keep-Alive: http://localhost:5001/api/health/keep-alive"
echo ""
echo "📊 Useful commands:"
echo "   pm2 logs portfolio-cms    # View logs"
echo "   pm2 monit                 # Monitor resources"
echo "   pm2 stop portfolio-cms    # Stop application"
echo ""
