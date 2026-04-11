import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/prisma.client.js';
import 'express-session';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Checks if User

router.get('/me', async (req, res) => {
  //   console.log('[/me] session:', req.session)
  // console.log('[/me] userId:', req.session.userId)
  if (!req.session.userId) {
    res.json({ user: null });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  if (!user) {
    res.json({ user: null });
    return;
  }
const needsProfile = !user.username || user.avatar === null || user.theme === null || !user.homeLocation


  res.json({ user, needsProfile });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Sends to Google/ Returns token
router.post('/google', async (req, res) => {
  try {
const { credential, username, avatar, theme, homeLocation } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(401).json({ error: 'invalid token' });
      return;
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email || !googleId) {
      res.status(401).json({ error: 'Missing requirements email or gid' });
      return;
    }
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email, name, picture, googleId,
          username,
          ...(avatar != null && { avatar: parseInt(avatar) }),
          ...(theme != null && { theme: parseInt(theme) }),
          homeLocation: homeLocation || null,

        },

      });
      // await prisma.sigil.createMany({
      //   data: Array.from({ length: 12 }, (_, i) => ({
      //     name: `sigil-${user!.id}-${i + 1}`,
      //     userId: user!.id,
      //   })),
      // });
    } else if (username || homeLocation) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          username: username || user.username,
          ...(avatar != null && { avatar: parseInt(avatar) }),
          ...(theme != null && { theme: parseInt(theme) }),
          homeLocation: homeLocation || user.homeLocation,
        }
      });
    }


    req.session.userId = user.id;

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) { reject(err); }
        else { resolve(); }
      });
    });

    const needsProfile = !user.username || user.avatar === null || user.theme === null || !user.homeLocation

    res.json({ success: true, needsProfile, user });

  } catch (error) {
    console.error('Google Auth error: ', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
