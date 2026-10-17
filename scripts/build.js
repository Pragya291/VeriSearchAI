const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building VeriSearch AI Frontend...');

// 1. Install frontend dependencies
execSync('npm --prefix autonomous-research-agent/frontend install', { stdio: 'inherit' });

// 2. Build frontend using Vite
execSync('npm --prefix autonomous-research-agent/frontend run build', { stdio: 'inherit' });

// 3. Mirror dist folder to repository root so Vercel finds it anywhere
const frontendDist = path.join(__dirname, '..', 'autonomous-research-agent', 'frontend', 'dist');
const rootDist = path.join(__dirname, '..', 'dist');

if (fs.existsSync(frontendDist)) {
  fs.cpSync(frontendDist, rootDist, { recursive: true });
  console.log('Successfully mirrored dist to repository root.');
}
