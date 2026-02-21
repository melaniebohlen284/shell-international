const fs = require('fs');
const path = require('path');

// Read the image files and convert to base64
function imageToBase64(imagePath) {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64 = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${base64}`;
}

// Map of image filenames to their base64 data
const imageMap = {
    'shell-logo.png': imageToBase64('./images/logo/shell-logo.png'),
    'dutch-family-logo.png': imageToBase64('./images/logo/dutch-family-logo.png'),
    'dutch-family-logo-footer.png': imageToBase64('./images/logo/dutch-family-logo-footer.png'),
};

console.log('=== Embedding local images as base64 ===\n');

// Read the index.html
let html = fs.readFileSync('./index.html', 'utf8');

// Replace the shell-logo.png references
html = html.replace(
    /src="images\/logo\/shell-logo\.png"/g,
    `src="${imageMap['shell-logo.png']}"`
);

// Replace the dutch-family-logo.png references
html = html.replace(
    /src="images\/logo\/dutch-family-logo\.png"/g,
    `src="${imageMap['dutch-family-logo.png']}"`
);

// Replace the dutch-family-logo-footer.png references
html = html.replace(
    /src="images\/logo\/dutch-family-logo-footer\.png"/g,
    `src="${imageMap['dutch-family-logo-footer.png']}"`
);

// Write the updated HTML
fs.writeFileSync('./index.html', html);

console.log('✓ Images embedded successfully!');
console.log('  - shell-logo.png');
console.log('  - dutch-family-logo.png');
console.log('  - dutch-family-logo-footer.png');
console.log('\nThe HTML now contains embedded base64 images instead of file references.');
