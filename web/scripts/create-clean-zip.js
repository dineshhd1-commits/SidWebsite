const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceDir = 'd:/d/sid/web';
const tempDir = 'd:/d/sid/temp-web-export/web';
const destinationZip = 'd:/d/sid/web.zip';

console.log('1. Preparing export directory...');
if (fs.existsSync('d:/d/sid/temp-web-export')) {
  fs.rmSync('d:/d/sid/temp-web-export', { recursive: true, force: true });
}
if (fs.existsSync(destinationZip)) {
  fs.unlinkSync(destinationZip);
}

fs.mkdirSync(tempDir, { recursive: true });

const excludeDirs = new Set(['node_modules', '.next', '.git', '.qodo', 'CRM']);
const excludeFiles = new Set(['tsconfig.tsbuildinfo', 'web.zip', 'create-clean-zip.ps1', 'create-clean-zip.js']);

function copyRecursive(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (excludeDirs.has(entry.name)) continue;
      const subDest = path.join(dest, entry.name);
      fs.mkdirSync(subDest, { recursive: true });
      copyRecursive(path.join(src, entry.name), subDest);
    } else if (entry.isFile()) {
      if (excludeFiles.has(entry.name) || entry.name.endsWith('.zip')) continue;
      fs.copyFileSync(path.join(src, entry.name), path.join(dest, entry.name));
    }
  }
}

console.log('2. Copying clean web source and assets...');
copyRecursive(sourceDir, tempDir);

console.log('3. Compressing into zip...');
execSync(`powershell -Command "Compress-Archive -Path 'd:\\d\\sid\\temp-web-export\\web' -DestinationPath '${destinationZip}' -Force"`, { stdio: 'inherit' });

console.log('4. Cleaning up temporary staging...');
fs.rmSync('d:/d/sid/temp-web-export', { recursive: true, force: true });

const stat = fs.statSync(destinationZip);
console.log(`\nSUCCESS! Created zip at: ${destinationZip}`);
console.log(`Zip size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
