#!/bin/bash

echo "=== LoveMatch Setup Script ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please install Node.js first."
    exit 1
fi
echo "Node.js: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "npm not found. Please install npm first."
    exit 1
fi
echo "npm: $(npm -v)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo ""
    echo "PostgreSQL not found!"
    echo "Install with: brew install postgresql@15"
    echo "Start with: brew services start postgresql@15"
    exit 1
fi
echo "PostgreSQL: $(psql --version)"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# Create database
echo ""
echo "Setting up database..."
createdb dating_app 2>/dev/null || echo "Database 'dating_app' already exists"

# Run migrations
echo ""
echo "Running migrations..."
cd server
npx prisma generate
npx prisma migrate dev --name init 2>/dev/null || npx prisma db push
cd ..

# Seed data
echo ""
echo "Seeding demo data..."
cd server && npm run db:seed && cd ..

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "To start the app:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Demo accounts (password: demo123):"
echo "  - anna@demo.com"
echo "  - ivan@demo.com"
echo ""
