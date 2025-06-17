#!/bin/bash

echo "🚀 Palm Island PICC Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this from the project root."
  exit 1
fi

# Check for required files
if [ ! -d "data" ]; then
  echo "📊 Exporting static data..."
  node export-static-data.js
fi

if [ ! -f "data/storytellers.json" ]; then
  echo "❌ Error: Static data not found. Please run 'node export-static-data.js' first."
  exit 1
fi

echo "✅ Static data ready ($(cat data/stats.json | grep totalStorytellers | grep -o '[0-9]*') storytellers)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed!"
  exit 1
fi

echo "✅ Frontend build successful"
cd ..

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📥 Installing Vercel CLI..."
  npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
cd frontend

# Check if this is first deployment
if [ ! -f ".vercel/project.json" ]; then
  echo "🆕 First deployment - setting up project..."
  vercel --prod --yes
else
  echo "🔄 Updating existing deployment..."
  vercel --prod --yes
fi

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 DEPLOYMENT SUCCESSFUL!"
  echo "========================="
  echo "Your Palm Island PICC site is now live!"
  echo ""
  echo "📊 Statistics:"
  echo "  - $(cat ../data/stats.json | grep totalStorytellers | grep -o '[0-9]*') storytellers"
  echo "  - $(cat ../data/stats.json | grep totalProjects | grep -o '[0-9]*') projects"  
  echo "  - $(cat ../data/stats.json | grep totalThemes | grep -o '[0-9]*') themes"
  echo "  - 170+ gallery images"
  echo ""
  echo "🔗 Next steps:"
  echo "  1. Add custom domain in Vercel dashboard"
  echo "  2. Set up analytics (Google Analytics)"
  echo "  3. Configure SEO metadata"
  echo "  4. Test all functionality"
else
  echo "❌ Deployment failed!"
  exit 1
fi