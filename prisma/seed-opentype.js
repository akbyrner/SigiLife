import 'dotenv/config';
import opentype from 'opentype.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  try {
    console.log('Clearing svg_vectors...');
    await prisma.svgVector.deleteMany({});

    const fontPath = path.join(
      __dirname,
      '..',
      'server',
      'assets',
      'fonts',
      'UncialAntiqua-Regular.ttf',
    );
    console.log(`Loading font from ${fontPath}...`);

    // Load font
    const font = await opentype.load(fontPath);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    console.log(`Extracting vectors for ${chars.length} characters...`);

    for (const char of chars) {
      const glyphPath = font.getPath(char, 10, 80, 72);
      const pathData = glyphPath.toPathData();

      const svgPathElement = `<path d="${pathData}" stroke="black" fill="none" stroke-width="2"/>`;

      await prisma.svgVector.create({
        data: {
          filename: char,
          vectorData: svgPathElement,
          width: 100,
          height: 100,
          fileSize: svgPathElement.length,
          sigilId: null,
        },
      });
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect
  }
}

seed();
