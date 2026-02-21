const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

// Archivos HTML a procesar
const htmlFiles = [
    {
        name: 'partnerbanken/email-template',
        url: 'https://imagizer.imageshack.com/v2/280x200q70/923/4LocVL.png'
    },
    {
        name: 'dutsch-family-main/partnerbanken',
        url: 'https://imagizer.imageshack.com/v2/280x200q70/923/4LocVL.png'
    },
    {
        name: 'dutsch-family-main/index',
        url: 'https://imagizer.imageshack.com/v2/280x200q70/922/NusaK9.png'
    }
];

// Mapeo de URLs a imágenes (descargadas una vez y reutilizadas)
const imageCache = {};

// URLs de las imágenes del email
const imageUrls = [
    {
        name: 'dutch-family-logo',
        url: 'https://imagizer.imageshack.com/v2/280x200q70/923/4LocVL.png'
    },
    {
        name: 'partner-badge',
        url: 'https://imagizer.imageshack.com/v2/100x75q70/922/byy19C.png'
    },
    {
        name: 'deutsche-bank',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP0EciBOF-BubF1c8a0wG-9e9KDu0DnPzajw&s'
    },
    {
        name: 'raiffeisen-bank',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXIVU_YCVO5i_k_KRm_-za_y-R27XD7Ipdmg&s'
    },
    {
        name: 'revolut',
        url: 'https://1000logos.net/wp-content/uploads/2022/08/Revolut-Logo.jpg'
    },
    {
        name: 'bitpanda',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3wfZVjZTVTobei5FdGH6GYMgaqlxpJVLGYw&s'
    },
    {
        name: 'nusak9',
        url: 'https://imagizer.imageshack.com/v2/280x200q70/922/NusaK9.png'
    },
    {
        name: 'kva2un',
        url: 'https://imagizer.imageshack.com/v2/100x75q70/923/KVA2Un.png'
    },
    {
        name: 'j2w960',
        url: 'https://imagizer.imageshack.com/v2/100x75q70/924/j2W960.png'
    }
];

// Función para descargar imagen
function downloadImage(imageInfo) {
    return new Promise((resolve, reject) => {
        // Verificar cache
        if (imageCache[imageInfo.url]) {
            resolve({
                name: imageInfo.name,
                base64: imageCache[imageInfo.url].base64,
                originalUrl: imageInfo.url
            });
            return;
        }
        
        const protocol = imageInfo.url.startsWith('https') ? https : http;
        
        console.log(`Descargando: ${imageInfo.url}`);
        
        protocol.get(imageInfo.url, (response) => {
            // Manejar redirecciones
            if (response.statusCode === 301 || response.statusCode === 302) {
                const redirectUrl = response.headers.location;
                console.log(`Redirección a: ${redirectUrl}`);
                const redirectProtocol = redirectUrl.startsWith('https') ? https : http;
                redirectProtocol.get(redirectUrl, (resp) => {
                    const chunks = [];
                    resp.on('data', (chunk) => chunks.push(chunk));
                    resp.on('end', () => {
                        const buffer = Buffer.concat(chunks);
                        const base64 = buffer.toString('base64');
                        const mimeType = getMimeType(redirectUrl, buffer);
                        const result = {
                            name: imageInfo.name,
                            base64: `data:${mimeType};base64,${base64}`,
                            originalUrl: imageInfo.url
                        };
                        imageCache[imageInfo.url] = result;
                        resolve(result);
                    });
                    resp.on('error', reject);
                }).on('error', reject);
                return;
            }
            
            if (response.statusCode !== 200) {
                reject(new Error(`Error HTTP: ${response.statusCode}`));
                return;
            }
            
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const base64 = buffer.toString('base64');
                const mimeType = getMimeType(imageInfo.url, buffer);
                const result = {
                    name: imageInfo.name,
                    base64: `data:${mimeType};base64,${base64}`,
                    originalUrl: imageInfo.url
                };
                imageCache[imageInfo.url] = result;
                resolve(result);
            });
            response.on('error', reject);
        }).on('error', reject);
    });
}

// Detectar tipo MIME
function getMimeType(url, buffer) {
    // Detectar por los primeros bytes
    if (buffer.length >= 4) {
        if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
            return 'image/jpeg';
        }
        if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
            return 'image/png';
        }
        if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
            return 'image/gif';
        }
        if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
            return 'image/webp';
        }
    }
    
    // Detectar por extensión
    const ext = path.extname(url).toLowerCase();
    const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
    };
    
    return mimeTypes[ext] || 'image/jpeg';
}

// Procesar todas las imágenes
async function processImages() {
    const results = [];
    
    for (const img of imageUrls) {
        try {
            const result = await downloadImage(img);
            results.push(result);
            console.log(`✓ Convertida: ${img.name}`);
        } catch (error) {
            console.log(`✗ Error con ${img.name}: ${error.message}`);
        }
    }
    
    return results;
}

// Reemplazar URLs en el HTML
function replaceImagesInHtml(html, images) {
    let updatedHtml = html;
    
    for (const img of images) {
        if (img.base64) {
            // Reemplazar todas las ocurrencias de la URL
            updatedHtml = updatedHtml.replace(
                new RegExp(img.originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                img.base64
            );
        }
    }
    
    return updatedHtml;
}

// Main
async function main() {
    console.log('=== Convertidor de imágenes para email (Base64) ===\n');
    
    console.log('Descargando y convirtiendo imágenes...\n');
    
    // Procesar imágenes
    const images = await processImages();
    
    console.log('\nProcesando archivos HTML...\n');
    
    // Procesar cada archivo HTML
    const htmlFilesToProcess = [
        'partnerbanken/email-template.html',
        'dutsch-family-main/partnerbanken.html',
        'dutsch-family-main/index.html'
    ];
    
    for (const htmlFile of htmlFilesToProcess) {
        const htmlPath = path.join(__dirname, htmlFile);
        
        if (!fs.existsSync(htmlPath)) {
            console.log(`⚠ Archivo no encontrado: ${htmlFile}`);
            continue;
        }
        
        console.log(`Procesando: ${htmlFile}`);
        
        const html = fs.readFileSync(htmlPath, 'utf8');
        const updatedHtml = replaceImagesInHtml(html, images);
        
        // Guardar archivo de salida
        const outputPath = htmlPath.replace('.html', '-base64.html');
        fs.writeFileSync(outputPath, updatedHtml, 'utf8');
        
        console.log(`✓ Guardado: ${outputPath}`);
    }
    
    console.log('\n=== Proceso completado ===');
    console.log('Ahora las imágenes están embebidas como base64.');
    console.log('Los archivos -base64.html no deberían ser detectados como spam.');
}

main().catch(console.error);
