#!/bin/bash

echo "Starting Palm Island PICC servers..."

# Start Express API
echo "Starting Express API on port 3003..."
cd /Users/benknight/Code/Great\ Palm\ Island\ PICC
node expressApi.js &
API_PID=$!
echo "Express API started with PID: $API_PID"

# Wait a moment for API to start
sleep 2

# Start Next.js frontend
echo "Starting Next.js frontend..."
cd /Users/benknight/Code/Great\ Palm\ Island\ PICC/frontend
npm run dev

# If Next.js exits, kill the API
kill $API_PID 2>/dev/null