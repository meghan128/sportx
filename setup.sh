
#!/bin/bash

# SportX India CPD Platform Setup Script
echo "🚀 Setting up SportX India CPD Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
print_status "Node.js version: $NODE_VERSION"

# Install dependencies
print_status "Installing npm dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from template..."
    cp .env.example .env
    print_warning "Please configure your environment variables in .env file"
    print_warning "Or use Replit Secrets for secure storage"
fi

# Check essential environment variables
print_status "Checking environment variables..."
if [ -z "$DATABASE_URL" ]; then
    print_warning "DATABASE_URL not set. Please configure your database connection."
fi

if [ -z "$VITE_SUPABASE_URL" ]; then
    print_warning "VITE_SUPABASE_URL not set. Please configure Supabase connection."
fi

# Database setup
print_status "Setting up database schema..."
npm run db:push
if [ $? -eq 0 ]; then
    print_success "Database schema updated successfully"
else
    print_warning "Database schema update failed. Check your DATABASE_URL"
fi

# Seed database with sample data
print_status "Do you want to seed the database with sample data? (y/n)"
read -r seed_choice
if [ "$seed_choice" = "y" ] || [ "$seed_choice" = "Y" ]; then
    print_status "Seeding database..."
    npm run seed
    if [ $? -eq 0 ]; then
        print_success "Database seeded successfully"
    else
        print_warning "Database seeding failed. You can run 'npm run seed' later"
    fi
fi

# Build check
print_status "Running TypeScript type check..."
npm run check
if [ $? -eq 0 ]; then
    print_success "TypeScript check passed"
else
    print_warning "TypeScript check failed. Check for type errors"
fi

# Final setup confirmation
print_success "🎉 Setup completed!"
echo ""
print_status "Next steps:"
echo "1. Configure your environment variables in Replit Secrets"
echo "2. Update your database connection if needed"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit your Repl URL to access the platform"
echo ""
print_status "Available commands:"
echo "  npm run dev       - Start development server"
echo "  npm run build     - Build for production"
echo "  npm run seed      - Seed database with sample data"
echo "  npm run db:push   - Update database schema"
echo "  npm run check     - Run TypeScript type check"
echo ""
print_success "Happy coding! 🚀"
