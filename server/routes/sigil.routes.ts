import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prisma.client.js';

const router = Router();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Get Sigil Count
router.get('/user/:userId/count', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const sigilCount = await prisma.sigil.count({
      where: { userId }
    });
    res.json({
      userId,
      count: sigilCount,
      maxSigils: 12,
      canCreateMore: sigilCount < 12,
      remainingSlots: 12 - sigilCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Get All Sigils
router.get('/allsigils', async (req, res) => {
  try {

    const sigils = await prisma.sigil.findMany({
      orderBy: { createdAt: 'desc' },
      include: { sigilGroups: true },
    });
    res.json(sigils);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/user/:userId/sigils', async (req, res) => {
  try {
    const sigils = await prisma.sigil.findMany({
      where: { userId: parseInt(req.params.userId) },
      orderBy: { createdAt: 'desc' },
      include: { sigilGroups: true },
    });
    res.json(sigils);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Sigil
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, intention, canvasData, imageData, locationName, latitude, longitude } = req.body;

    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated. Please log in to save sigils.'
      });
    }

    const sigil = await prisma.sigil.create({
      data: {
        name,
        userId,
        intention,
        canvasData,
        imageData,
        locationName,
        latitude,
        longitude,
      },
    });

    res.json({ id: sigil.id, message: 'Sigil saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Charge Sigil
router.patch('/:id/charge', async (req, res) => {
  try {

    const sigil = await prisma.sigil.update({
      where: { id: parseInt(req.params.id) },
      data: { isCharged: true }
    });
    res.json(sigil)

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Update Sigil Location
router.patch('/:id/location', async (req, res) => {
  try {
    const { locationName, latitude, longitude } = req.body;

    const sigil = await prisma.sigil.update({
      where: { id: parseInt(req.params.id) },
      data: {
        locationName,
        latitude,
        longitude
      }
    });
    res.json(sigil)

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Delete Sigil
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    console.log('deleting sigil id:', id);
    await prisma.sigil.deleteMany({ where: { id } });
    res.json({ message: 'destroyed sigil' });
  } catch (error) {
    console.error('prisma delete error:', error);  // add this
    res.status(500).json({ error: (error as Error).message });
  }
})

export default router;