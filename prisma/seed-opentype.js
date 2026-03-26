import 'dotenv/config';
import mysql from 'mysql2/promise';
import opentype from 'opentype.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  try {
    console.log('Connecting to MySQL database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sigilife',
    });

    console.log('Truncating svg_vectors table...');
    await connection.query('TRUNCATE svg_vectors');

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
      // Get path for character
      // Standardizing on 100px size, centered
      const glyphPath = font.getPath(char, 10, 80, 72);
      const pathData = glyphPath.toPathData();

      const svgPathElement = `<path d="${pathData}" stroke="black" fill="none" stroke-width="2"/>`;

      await connection.query(
        'INSERT INTO svg_vectors (filename, vector_data, width, height, file_size, sigil_id) VALUES (?, ?, ?, ?, ?, ?)',
        [char, svgPathElement, 100, 100, svgPathElement.length, null],
      );
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    if (connection) await connection.end();
  }
}

seed();
