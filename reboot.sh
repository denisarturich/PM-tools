#!/bin/bash
echo "🚀 Starting deployment..."

# 1. Build client
echo "📦 Building client..."
npm run build:client
if [ $? -ne 0 ]; then
    echo "❌ Client build failed!"
    exit 1
fi

# 2. Build server
echo "📦 Building server..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Server build failed!"
    exit 1
fi

# 3. ВАЖНО: Delete + Start вместо Restart
echo "🔄 Stopping PM2..."
pm2 delete pm-tools || true

echo "🚀 Starting PM2 (перечитает .env)..."
pm2 start ecosystem.config.cjs

pm2 save

echo "✅ Deployment complete!"
pm2 status