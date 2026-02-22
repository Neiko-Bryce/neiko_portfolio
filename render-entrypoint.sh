#!/bin/bash
set -e

echo "🚀 Starting Neiko Portfolio deployment..."

# Create .env file from environment variables
echo "⚙️  Syncing environment variables to .env..."
echo "APP_NAME=\"$APP_NAME\"" > /var/www/html/.env
echo "APP_ENV=$APP_ENV" >> /var/www/html/.env
echo "APP_KEY=$APP_KEY" >> /var/www/html/.env
echo "APP_DEBUG=$APP_DEBUG" >> /var/www/html/.env
echo "APP_URL=$APP_URL" >> /var/www/html/.env
echo "DB_CONNECTION=$DB_CONNECTION" >> /var/www/html/.env
echo "DB_URL=\"$DB_URL\"" >> /var/www/html/.env
echo "DATABASE_URL=\"$DATABASE_URL\"" >> /var/www/html/.env

# Debug: Check if APP_KEY is present in the environment (print length only for security)
if [ -z "$APP_KEY" ]; then
    echo "❌ ERROR: APP_KEY is empty in the environment!"
else
    echo "✅ APP_KEY detected (${#APP_KEY} characters) and written to .env."
fi

# Run database migrations
echo "📦 Running database migrations..."
php artisan migrate --force

# Create storage symlink
echo "🔗 Creating storage symlink..."
php artisan storage:link --force 2>/dev/null || true

# Clear any existing cache first
echo "🧹 Clearing existing cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

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
