// Root entry point for Render deployment
import { execSync } from 'child_process';

console.log('Starting AI Startup Validator backend...');
execSync('cd backend && node index.js', { stdio: 'inherit' });
