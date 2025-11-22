#!/bin/bash

echo "🐳 Testing CraftBid Docker Setup..."
echo ""

# Check Docker
echo "1. Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✅ Docker is installed: $(docker --version)"

# Check Docker Compose
echo ""
echo "2. Checking Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✅ Docker Compose is installed: $(docker compose version)"

# Validate docker-compose.yml
echo ""
echo "3. Validating docker-compose.yml..."
if docker compose config &> /dev/null; then
    echo "✅ docker-compose.yml is valid"
    echo "   Services found:"
    docker compose config --services | sed 's/^/   - /'
else
    echo "❌ docker-compose.yml has errors"
    exit 1
fi

# Check Dockerfile
echo ""
echo "4. Checking Dockerfile..."
if [ -f "Dockerfile" ]; then
    echo "✅ Dockerfile exists"
else
    echo "❌ Dockerfile not found"
    exit 1
fi

# Check Frontend Dockerfile
echo ""
echo "5. Checking Frontend Dockerfile..."
if [ -f "UI_CraftBid/Dockerfile" ]; then
    echo "✅ Frontend Dockerfile exists"
else
    echo "❌ Frontend Dockerfile not found"
    exit 1
fi

# Check .dockerignore
echo ""
echo "6. Checking .dockerignore..."
if [ -f ".dockerignore" ]; then
    echo "✅ .dockerignore exists"
else
    echo "⚠️  .dockerignore not found (optional)"
fi

echo ""
echo "✅ All checks passed! Docker setup is ready."
echo ""
echo "To start the application, run:"
echo "  docker compose up -d --build"
echo ""
echo "To start in development mode, run:"
echo "  docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d"

