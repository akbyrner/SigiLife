import { Router } from 'express';
import prisma from '../prisma/prisma.client.js';

const router = Router();


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Gets User info from DB
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { sigils: true }
  });

  if (!user) {
    return res.status(404).json({ message: 'user could not be found' })
  };
  res.json(user);
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Updates User info from DB
router.patch('/:id', async (req, res) => {
  try {
    const { username, avatar, theme, homeLocation } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        username,
        avatar: avatar != null ? parseInt(avatar) : undefined,
        theme: theme != null ? parseInt(theme) : undefined,
        homeLocation: homeLocation || null,
      },
    });
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Deletes User info from DB
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'user profile has been deleted' })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});





export default router;