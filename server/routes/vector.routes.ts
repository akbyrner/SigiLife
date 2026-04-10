import { Router } from 'express';
import prisma from '../prisma/prisma.client.js';

const router = Router();

// Fetch SVG vector data for a string of characters
router.post('/character-vectors', async (req, res) => {
  try {
    const { chars } = req.body;
    if (!chars || typeof chars !== 'string') {
      return res.json([]);
    }
    const charArray = chars.split('');
    if (charArray.length === 0) {
      return res.json([]);
    }

    const vectors = await prisma.svgVector.findMany({
      where: { filename: { in: charArray } },
      select: { filename: true, vectorData: true },
    });

    res.json(vectors);
  } catch (error) {
    console.error('Error fetching character vectors:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
