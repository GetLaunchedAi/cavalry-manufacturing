/**
 * Process all product images to 1000x750px (4:3 aspect ratio)
 * 
 * Strategy:
 * - Images close to 4:3: smart crop to fill 1000x750
 * - Images with very different ratios: resize to fit within 1000x750 and pad with dark background
 * - Target file size: <150KB per image
 * - Preserves originals in a backup folder before processing
 * 
 * Note: Reads files into memory buffers first to avoid OneDrive file-lock issues on Windows.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_DIR = path.join(__dirname, '..', 'src', 'assets', 'img', 'products');
const BACKUP_DIR = path.join(__dirname, '..', 'src', 'assets', 'img', 'products-originals');
const TARGET_WIDTH = 1000;
const TARGET_HEIGHT = 750;
const TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT; // 1.333...

// Skip non-product images (logos, placeholders, payment icons)
const SKIP_FILES = [
  'cavalry-logo-white.png',
  'cavalry-manufacturing-logo-black-01.png',
  'cavalry-manufacturing-logo-black-02.png',
  'cavalry-manufacturing-logo-yellow-01.png',
  'cavalry-manufacturing-logo-yellow-02.png',
  'cavalry-manufacturing-logo-yellow-03.png',
  'cavalry-manufacturing-logo-yellow-04.png',
  'cavalry-manufacturing-logo-yellow-05.png',
  'cavalry-medical-logo-01.jpg',
  'cavalry-medical-logo-02.jpg',
  'cavalry-medical-logo-03.jpg',
  'cavalry-medical-logo-04.jpg',
  'cavalry-medical-logo-05.jpg',
  'store-placeholder.png',
  'payment-icons-01.png',
  'payment-icons-02.png',
];

async function processImage(filePath, filename, backupPath) {
  try {
    // Read file into buffer first to avoid OneDrive file locks
    const inputBuffer = fs.readFileSync(filePath);
    const metadata = await sharp(inputBuffer).metadata();
    const { width, height } = metadata;
    
    if (!width || !height) {
      console.log(`  ⚠ Skipping ${filename} — could not read dimensions`);
      return { status: 'skipped', reason: 'no dimensions' };
    }

    const currentRatio = width / height;
    const ratioDiff = Math.abs(currentRatio - TARGET_RATIO) / TARGET_RATIO;

    let pipeline;

    if (ratioDiff < 0.15) {
      // Close to 4:3 — resize and crop to fill exactly 1000x750
      pipeline = sharp(inputBuffer)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, {
          fit: 'cover',
          position: 'centre',
        });
    } else {
      // Very different ratio — resize to fit within bounds, then pad with dark background
      pipeline = sharp(inputBuffer)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, {
          fit: 'contain',
          background: { r: 24, g: 24, b: 24, alpha: 1 }, // Dark background (#181818)
        });
    }

    // Determine output format
    const ext = path.extname(filename).toLowerCase();
    let outputBuffer;

    if (ext === '.png') {
      outputBuffer = await pipeline
        .png({ quality: 85, compressionLevel: 9 })
        .toBuffer();
    } else {
      // Default to JPEG for .jpg files
      outputBuffer = await pipeline
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
    }

    // If still over 150KB, reduce quality further
    if (outputBuffer.length > 150 * 1024) {
      if (ext === '.png') {
        outputBuffer = await sharp(outputBuffer)
          .png({ quality: 70, compressionLevel: 9 })
          .toBuffer();
      } else {
        outputBuffer = await sharp(outputBuffer)
          .jpeg({ quality: 70, mozjpeg: true })
          .toBuffer();
      }
    }

    // If still over 150KB after quality reduction, go lower
    if (outputBuffer.length > 150 * 1024) {
      if (ext === '.png') {
        outputBuffer = await sharp(outputBuffer)
          .png({ quality: 50, compressionLevel: 9 })
          .toBuffer();
      } else {
        outputBuffer = await sharp(outputBuffer)
          .jpeg({ quality: 55, mozjpeg: true })
          .toBuffer();
      }
    }

    // Write the processed image back
    fs.writeFileSync(filePath, outputBuffer);

    const originalSize = inputBuffer.length;
    const newSize = outputBuffer.length;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(
      `  ✓ ${filename}: ${width}x${height} → ${TARGET_WIDTH}x${TARGET_HEIGHT} | ` +
      `${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${savings}% ${Number(savings) > 0 ? 'saved' : 'increase'})`
    );

    return {
      status: 'processed',
      original: { width, height, size: originalSize },
      result: { width: TARGET_WIDTH, height: TARGET_HEIGHT, size: newSize },
      method: ratioDiff < 0.15 ? 'crop' : 'pad',
    };
  } catch (err) {
    console.error(`  ✗ Error processing ${filename}: ${err.message}`);
    return { status: 'error', error: err.message };
  }
}

async function main() {
  console.log('=== Product Image Standardization ===');
  console.log(`Target: ${TARGET_WIDTH}x${TARGET_HEIGHT}px (4:3 ratio)\n`);

  // Get all image files
  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && !SKIP_FILES.includes(f);
  });

  console.log(`Found ${files.length} product images to process.`);
  console.log(`Skipping ${SKIP_FILES.length} non-product files.\n`);

  // Create backup directory
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`Created backup directory: ${BACKUP_DIR}\n`);
  }

  // Backup all files first
  console.log('--- Backing up originals ---');
  let backedUp = 0;
  for (const file of files) {
    const src = path.join(PRODUCTS_DIR, file);
    const dest = path.join(BACKUP_DIR, file);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      backedUp++;
    }
  }
  console.log(`Backed up ${backedUp} new files (${files.length - backedUp} already backed up).\n`);

  // Process each image
  console.log('--- Processing images ---');
  const results = { processed: 0, skipped: 0, errors: 0 };
  let totalOriginalSize = 0;
  let totalNewSize = 0;

  for (const file of files) {
    const filePath = path.join(PRODUCTS_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);
    const result = await processImage(filePath, file, backupPath);

    if (result.status === 'processed') {
      results.processed++;
      totalOriginalSize += result.original.size;
      totalNewSize += result.result.size;
    } else if (result.status === 'skipped') {
      results.skipped++;
    } else {
      results.errors++;
    }
  }

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Processed: ${results.processed}`);
  console.log(`Skipped:   ${results.skipped}`);
  console.log(`Errors:    ${results.errors}`);
  if (totalOriginalSize > 0) {
    console.log(`Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Savings:    ${((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1)}%`);
  }
  console.log('\nDone! Originals backed up to: src/assets/img/products-originals/');
}

main().catch(console.error);
