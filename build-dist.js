const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const filesToCopy = [
  'package.json',
  'package-lock.json',
  '.env.production',
  'web.config',
];

// 1. Copy root files
filesToCopy.forEach((f) => {
  if (fs.existsSync(f)) {
    console.log(`Copying ${f} to dist/`);
    fs.copyFileSync(f, path.join('dist', f));
  } else {
    console.warn(`Warning: File ${f} not found.`);
  }
});

// 2. Copy prisma directory
console.log('Copying prisma/ to dist/prisma/');
copyRecursiveSync('prisma', path.join('dist', 'prisma'));

console.log('Build preparation complete!');
