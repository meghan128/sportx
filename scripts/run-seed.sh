#!/bin/bash

# SportXTracker Database Seeding Script
echo "🌱 Starting SportXTracker database seeding..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    exit 1
fi

# Run the SQL seed file
echo "📝 Executing seed.sql..."
psql "$DATABASE_URL" -f scripts/seed.sql

if [ $? -eq 0 ]; then
    echo "✅ Database seeding completed successfully!"
    echo ""
    echo "📊 Created dummy data for:"
    echo "   • 5 Professional users (physiotherapists, coaches, nutritionists)"
    echo "   • 6 Forum categories"
    echo "   • 3 Comprehensive events with ticket types"
    echo "   • 3 Professional courses"
    echo "   • 5 CPD categories"
    echo "   • Multiple CPD activities per user"
    echo "   • Discussion topics and community content"
    echo "   • Mentorship opportunities"
    echo "   • Professional credentials"
    echo "   • Messages and notifications"
    echo ""
    echo "🔐 Demo Login Credentials:"
    echo "   Resource Person: resource@example.com / password"
    echo "   General User: user@example.com / password"
else
    echo "❌ Error occurred during database seeding"
    exit 1
fi