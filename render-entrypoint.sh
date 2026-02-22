#!/bin/bash
set -e

echo "🚀 Starting Neiko Portfolio deployment..."

# Create .env file from environment variables (Render sets env vars, not .env)
# Laravel commands like config:cache expect a .env file to exist
if [ ! -f /var/www/html/.env ]; then
    echo "⚙️  Creating .env from environment variables..."
    touch /var/www/html/.env
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
