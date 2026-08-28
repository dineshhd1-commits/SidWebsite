const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = 'd:/d/sid/web';
const stagingDir = 'd:/d/sid/staging';
const stagingWebDir = path.join(stagingDir, 'web');
const outputZip = 'd:/d/sid/web.zip';

// Clean old staging and zip
if (fs.existsSync(stagingDir)) fs.rmSync(stagingDir, { recursive: true, force: true });
if (fs.existsSync(outputZip)) fs.unlinkSync(outputZip);
if (fs.existsSync('d:/d/sid/web-clean.zip')) fs.unlinkSync('d:/d/sid/web-clean.zip');

fs.mkdirSync(stagingWebDir, { recursive: true });

const excludeDirs = new Set(['node_modules', '.next', '.git', 'CRM', '.qodo']);
const excludeFiles = new Set(['tsconfig.tsbuildinfo', 'web.zip', 'web-clean.zip', 'create-clean-zip.ps1', 'create-clean-zip.js']);

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (excludeDirs.has(entry.name)) continue;
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      if (excludeFiles.has(entry.name) || entry.name.endsWith('.zip')) continue;
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying clean files to staging...');
copyDir(srcDir, stagingWebDir);

console.log('Compressing with tar...');
execSync(`tar -a -c -f "${outputZip}" web`, { cwd: stagingDir, stdio: 'inherit' });

console.log('Cleaning up staging...');
fs.rmSync(stagingDir, { recursive: true, force: true });

const stats = fs.statSync(outputZip);
console.log(`\nSuccessfully created ${outputZip} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
