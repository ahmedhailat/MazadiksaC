#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

console.log('Building Mazad KSA for production...');

try {
  // Build the frontend
  console.log('Building frontend...');
  execSync('vite build', { stdio: 'inherit' });

  // Build the backend
  console.log('Building backend...');
  execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=api/index.js', { stdio: 'inherit' });

  // Ensure api directory exists
  await fs.mkdir('api', { recursive: true });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}