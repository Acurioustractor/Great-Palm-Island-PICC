require('dotenv').config();
const { exec } = require('child_process');
const cron = require('node-cron');

// Configure sync intervals (in cron format)
const SYNC_SCHEDULE = process.env.SYNC_SCHEDULE || '0 */4 * * *'; // Default: every 4 hours

console.log('Starting scheduled sync service...');
console.log(`Sync schedule: ${SYNC_SCHEDULE}`);

// Function to run the sync
function runSync() {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] Starting scheduled sync...`);
  
  exec('npm run sync:enhanced', (error, stdout, stderr) => {
    if (error) {
      console.error(`[${timestamp}] Sync error:`, error.message);
      return;
    }
    
    if (stderr) {
      console.error(`[${timestamp}] Sync stderr:`, stderr);
    }
    
    console.log(`[${timestamp}] Sync output:`, stdout);
    console.log(`[${timestamp}] Sync completed successfully`);
  });
}

// Schedule the sync
const task = cron.schedule(SYNC_SCHEDULE, runSync, {
  scheduled: true,
  timezone: "Australia/Brisbane" // Adjust to your timezone
});

// Run initial sync on startup
runSync();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping scheduled sync...');
  task.stop();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('\nStopping scheduled sync...');
  task.stop();
  process.exit();
});

console.log('Scheduled sync service is running. Press Ctrl+C to stop.');