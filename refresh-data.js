#!/usr/bin/env node
/**
 * This script refreshes the Airtable data to get fresh image URLs
 * Airtable image URLs expire after a certain time, so this needs to be run periodically
 */

const { execSync } = require('child_process');

console.log('🔄 Refreshing Airtable data...');

try {
  execSync('node syncAirtableToDb.js', { stdio: 'inherit' });
  console.log('✅ Data refresh complete!');
  console.log('ℹ️  Note: You may need to refresh your browser to see the updated images.');
} catch (error) {
  console.error('❌ Error refreshing data:', error.message);
  process.exit(1);
}