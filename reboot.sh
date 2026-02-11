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

# 3. Stop PM2
echo "🛑 Stopping PM2..."
pm2 stop pm-tools

# 4. Delete process
echo "🗑️  Deleting PM2 process..."
pm2 delete pm-tools

# 5. Start fresh (перечитает .env)
echo "🚀 Starting PM2 (перечитает .env)..."
pm2 start ecosystem.config.cjs

# 6. Save configuration
echo "💾 Saving PM2 config..."
pm2 save

echo "✅ Deployment complete!"
echo "📊 PM2 status:"
pm2 status