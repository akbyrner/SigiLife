import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../prisma/prisma.client.js';
import '../types/session.d.ts';

const router = Router();

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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Delete Sigil
router.delete('/:id', async (req, res) =>{
  try {

    await prisma.sigil.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'destroyed sigil' })

  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
})

export default router;