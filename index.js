// Root entry point for Render deployment
import { execSync } from 'child_process';

console.log('Installing backend dependencies...');
try {
    execSync('cd backend && npm install', { stdio: 'inherit' });
} catch (error) {
    console.error('Failed to install backend dependencies:', error);
    process.exit(1);
}

console.log('Starting AI Startup Validator backend...');
try {
    execSync('cd backend && node index.js', { stdio: 'inherit' });
} catch (error) {
    console.error('Backend failed to start:', error);
    process.exit(1);
}
