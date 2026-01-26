import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, 'public');
const sourceIcon = join(publicDir, 'logo.png');

async function generatePWAIcons() {
    console.log('Generating PWA icons...');

    // Generate 192x192 icon
    await sharp(sourceIcon)
        .resize(192, 192, {
            fit: 'contain',
            background: { r: 18, g: 18, b: 18, alpha: 1 }
        })
        .png()
        .toFile(join(publicDir, 'pwa-192x192.png'));
    console.log('✓ Generated pwa-192x192.png');

    // Generate 512x512 icon
    await sharp(sourceIcon)
        .resize(512, 512, {
            fit: 'contain',
            background: { r: 18, g: 18, b: 18, alpha: 1 }
        })
        .png()
        .toFile(join(publicDir, 'pwa-512x512.png'));
    console.log('✓ Generated pwa-512x512.png');

    // Generate 512x512 maskable icon (with padding for safe zone)
    // Maskable icons need 10% padding on each side for safe zone
    const maskableSize = 512;
    const iconSize = Math.floor(maskableSize * 0.8); // 80% of total size
    const padding = Math.floor(maskableSize * 0.1); // 10% padding

    await sharp(sourceIcon)
        .resize(iconSize, iconSize, {
            fit: 'contain',
            background: { r: 18, g: 18, b: 18, alpha: 1 }
        })
        .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 18, g: 18, b: 18, alpha: 1 }
        })
        .png()
        .toFile(join(publicDir, 'pwa-maskable-512x512.png'));
    console.log('✓ Generated pwa-maskable-512x512.png');

    console.log('All PWA icons generated successfully!');
}

generatePWAIcons().catch(console.error);
