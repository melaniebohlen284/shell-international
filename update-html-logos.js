const fs = require('fs');

let html = fs.readFileSync('./index.html', 'utf8');

// Replace Dutch Family logo in header
html = html.replace(
    /<img src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAuCAYAAADz2gaIAAAACXBIWXMAAAsSAAALEgHS3X78AAAAInpUWHRTb2Z0d2FyZQAACJlzTMlPSlXwzE1MTw1KTUypBAAvnAXUekLysgAAHT9JREFUeJztXQl4VNX1z7x1Mnv2yZ5M9kwm2yQzWSeZNSQhQCAkAaVYF7TaulVtq12sG63WKkWtC38RFXFB0cqmbKIgKq64AILQWrfWta2KC\+T9z3mTZd6bNwshQxKZ833ng5k5d3k37\/ze2e59MTFIshiZOkeRUX5h[^"]+"/,
    '<img src="images/logo/dutch-family-logo.png"'
);

// Replace Shell logo in header
html = html.replace(
    /<img src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAACXBIWXMAARlAAAEZQAGA43XUAAAgAElEQVR4nO18CZhcVbXuqTrDns45NXZ3EhIzEFBmhwjKoCiKogQBBScE9So\+Re9zgCv3IldAUXFAxRG9oDIqyHtMYUrMSKZOutNNkk7SXT2n566xu6trXm\/tfao63Qj3SQDj\+57n\+\/ZX1edUnbP3v9f617\/W3tWa9o9wfOmjGuDLp6LC\/ye\/Zv5vv2b9jGjmJYt1XbtsscbPn3eke3hkjj8QQ\/ux6fdts4xAs\+uc1M\/slf1MXDVkOzePCPH7OKV\/ThHy0DihDw0Kfs\+wy24dYfxrAyR4yW4eeFMjZ3X3mIa\+2jSP9FBeneN3fJF2LT3J12jbdTHB3tvPne8nGN80wflwgYt8kfNK[^"]+"/,
    '<img src="images/logo/shell-logo.png"'
);

// Replace Dutch Family logo in footer (smaller version)
html = html.replace(
    /<img src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAQCAYAAADgUdqDAAAACXBIWXMAARlAAAEZQAGA43XUAAAHeUlEQVRYhdWYB2xVVRjHK5RVZEMNQ5TVCkXZBTrgvrsAKbRAgfYBYlCGgEbFqFFGUCPGiCAqoDIlKjJUQBFjwRBkCjJlj0IVEwVFBZX5\+f\/O\+W7ffe2jVFMi3OSX13fWff3\+5xvnRAVz3REgD1wCF29QdoEkEMXcrI\/3\+\/1EGvQjIGbAicIEj\+u\+68mA48V61wJQ\+mYVRAS4BdQB0b7PQgPVP5x9xKW0dQ51zXGoG7PaoR7rHeq3X4z1bwzMYuYVX8z0zfp9ffcVOScnO9cpT0QNQHuQKPDfzUE0KDED8lqgiryD31kWtCzuu0SAGHA\/GATKgvogXfoCoIX83QOMArFaEBghc49L[^"]+"/,
    '<img src="images/logo/dutch-family-logo-footer.png"'
);

fs.writeFileSync('./index.html', html);
console.log('HTML updated successfully!');
