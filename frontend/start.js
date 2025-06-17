const { spawn } = require('child_process');

console.log('Starting Next.js development server...');

const next = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

next.on('error', (err) => {
  console.error('Failed to start server:', err);
});

next.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});