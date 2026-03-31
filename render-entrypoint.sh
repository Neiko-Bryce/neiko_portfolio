#!/bin/bash
set -e

echo "🚀 Starting Neiko Portfolio deployment..."

# Laravel will automatically read environment variables set in Render Dashboard.
# We ensure an empty .env exists for compatibility.
touch /var/www/html/.env

# Wait for database connection before running migrations
echo "⏳ Checking database connection..."
MAX_RETRIES=5
COUNT=0
until php artisan tinker --execute="DB::connection()->getPdo();" > /dev/null 2>&1 || [ $COUNT -eq $MAX_RETRIES ]; do
    echo "⚠️ Database not ready... retrying ($((COUNT+1))/$MAX_RETRIES)"
    sleep 3
    COUNT=$((COUNT+1))
done

if [ $COUNT -lt $MAX_RETRIES ]; then
    echo "✅ Database connection successful. Running migrations..."
    php artisan migrate --force
else
    echo "❌ ERROR: Could not connect to database after $MAX_RETRIES attempts."
    echo "Check your DATABASE_URL and DB_CONNECTION environment variables in Render Dashboard."
    # We exit here because without DB the app will fail anyway
    exit 1
fi

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
