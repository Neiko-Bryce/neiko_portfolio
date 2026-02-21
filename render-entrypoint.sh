#!/bin/bash
set -e

echo "🚀 Starting Neiko Portfolio deployment..."

# Generate APP_KEY if not already set
if [ -z "$APP_KEY" ]; then
    echo "⚙️  Generating application key..."
    php artisan key:generate --force
fi

# Run database migrations
echo "📦 Running database migrations..."
php artisan migrate --force

# Create storage symlink
echo "🔗 Creating storage symlink..."
php artisan storage:link --force 2>/dev/null || true

# Cache configuration for performance
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Fix permissions
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

echo "✅ Application ready! Starting Apache..."

# Start Apache in foreground
apache2-foreground
