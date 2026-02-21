const fs = require('fs');

let html = fs.readFileSync('./index.html', 'utf8');

// Replace all base64 images with file paths
// Pattern: data:image/png;base64,... until the closing quote

// Dutch Family header logo (large)
html = html.replace(
    /src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAuCAYAAADz2gaI[^"]+"/g,
    'src="images/logo/dutch-family-logo.png"'
);

// Shell header logo
html = html.replace(
    /src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4Tnrq[^"]+"/g,
    'src="images/logo/shell-logo.png"'
);

// Dutch Family footer logo (smaller)
html = html.replace(
    /src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAQCAYAAADgUdqD[^"]+"/g,
    'src="images/logo/dutch-family-logo-footer.png"'
);

fs.writeFileSync('./index.html', html);
console.log('✓ HTML updated with logo image paths!');
