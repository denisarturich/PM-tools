#!/bin/bash
# Скрипт для деплоя изменений на продакшен

echo "🚀 Starting deployment..."

# 1. Собираем клиент (React/Vite)
echo "📦 Building client..."
npm run build:client
if [ $? -ne 0 ]; then
    echo "❌ Client build failed!"
    exit 1
fi

# 2. Собираем сервер (Node/Express)
echo "📦 Building server..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Server build failed!"
    exit 1
fi

# 3. Перезапускаем PM2
echo "🔄 Restarting PM2..."
pm2 restart ecosystem.config.cjs --update-env
if [ $? -ne 0 ]; then
    echo "⚠️  PM2 restart failed, trying to start..."
    pm2 start ecosystem.config.cjs
fi

echo "✅ Deployment complete!"
echo "📊 Checking PM2 status..."
pm2 status
