const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create the favicons directory if it doesn't exist
const outputDir = path.join(__dirname, '../public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the SVG file
const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/favicon.svg'));

// Define the sizes we want to generate
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'mstile-150x150.png', size: 150 }
];

// Generate each size
sizes.forEach(({ name, size }) => {
  sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, name))
    .then(() => console.log(`Generated ${name}`))
    .catch(err => console.error(`Error generating ${name}:`, err));
});

// Note: We're using the SVG favicon as the primary favicon and the PNG files as fallbacks
// so we don't need to generate an .ico file
console.log('Favicon generation complete!'); 