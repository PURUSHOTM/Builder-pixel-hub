#!/bin/bash

echo "🚀 Starting ContractPro Backend Server..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ to continue."
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found. Please run this script from the project root."
    exit 1
fi

cd backend

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🌱 Seeding database with demo data..."
npm run seed

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database seeded successfully!"
    echo ""
    echo "🔑 Demo Login Credentials:"
    echo "   Email: demo@contractpro.com"
    echo "   Password: demo123"
    echo ""
    echo "🚀 Starting backend server..."
    echo "   API will be available at: http://localhost:3001"
    echo "   Health check: http://localhost:3001/health"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    
    npm start
else
    echo ""
    echo "⚠️  Database seeding failed (this might be due to MongoDB connection issues)"
    echo "   Don't worry! The app will work in demo mode."
    echo ""
    echo "🚀 Starting backend server anyway..."
    echo "   API will be available at: http://localhost:3001"
    echo ""
    
    npm start
fi
