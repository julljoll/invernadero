const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src',
  'public',
  'docs',
  'legacy',
  'scripts',
  '.agents'
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  const allowedExts = ['.ts', '.tsx', '.js', '.jsx', '.html', '.md', '.json', '.svg'];
  if (!allowedExts.includes(ext)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Pattern replacements
  content = content.replace(/110 \/ 130 gsm/g, '130 gsm');
  content = content.replace(/110 y 130 gsm/g, '130 gsm');
  content = content.replace(/110 gsm/g, '130 gsm');
  content = content.replace(/110gsm/g, '130gsm');
  content = content.replace(/110 g\/m²/g, '130 g/m²');
  content = content.replace(/110 gramos/g, '130 gramos');
  content = content.replace(/110\s*\|\s*130/g, '130');
  content = content.replace(/'110'\s*\|\s*'130'/g, "'130'");
  content = content.replace(/meshGsm:\s*110/g, 'meshGsm: 130');
  content = content.replace(/useState<([^>]+)>\('110'\)/g, "useState<$1>('130')");
  
  // For any remaining exact matches of '110' that might refer to the mesh variant
  content = content.replace(/selectedVariant:\s*'110'/g, "selectedVariant: '130'");
  content = content.replace(/onSelectVariant:\s*\(\w+:\s*'110'\)\s*=>\s*void/g, "onSelectVariant: (variant: '130') => void");
  content = content.replace(/useState<'110'>\('110'\)/g, "useState<'130'>('130')");
  content = content.replace(/meshGsmVariant:\s*'110'/g, "meshGsmVariant: '130'");

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

targetDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  walkDir(fullPath, processFile);
});

console.log('Update complete.');
