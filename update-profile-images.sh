#!/bin/bash

echo "🔄 Refreshing Airtable data to get fresh profile image URLs..."

# Run enhanced sync to get fresh data from Airtable
node syncEnhanced.js

# Export the fresh data to JSON files
node export-static-data.js

# Copy to frontend directory
cp -r data/* frontend/data/

echo "✅ Profile images updated!"
echo "📁 Fresh data copied to frontend/data/"
echo "🚀 Ready to deploy with current Airtable profile images"