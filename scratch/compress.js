const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public/images');
const images = ['envelope.png', 'envelopOpen.png', 'wax-seal.png', 'invitation-paper.png'];

async function compress() {
  for (const img of images) {
    const inputPath = path.join(dir, img);
    const outputPath = path.join(dir, 'temp-' + img);
    
    if (fs.existsSync(inputPath)) {
      console.log('Compressing ' + img + '...');
      // Resize to max 1000px, use high compression png or webp
      // We will keep png extension but optimize it
      await sharp(inputPath)
        .resize({ width: 800, withoutEnlargement: true })
        .png({ quality: 70, compressionLevel: 9 })
        .toFile(outputPath);
        
      fs.renameSync(outputPath, inputPath);
      console.log(img + ' done!');
    }
  }
}

compress().catch(console.error);
