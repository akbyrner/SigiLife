import { Router } from 'express';
import prisma from '../../prisma/prisma.client';

const router = Router();

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

router.patch('/:id', async (req, res) => {
  const {username, avatar, theme, homeLatitude, homeLongitude} = req.body;
  const user = await prisma.user.update({
    where: {id: parseInt(req.params.id)},
    data: {
      username,
      avatar: avatar != null ? parseInt(avatar) : undefined,
      theme: theme != null ? parseInt(theme): undefined,
      homeLatitude: homeLatitude != null ? parseInt(homeLongitude) : undefined,
      homeLongitude: homeLongitude != null ? parseInt(homeLongitude) : undefined,
    },
  });
  res.json(user)
});

export default router;