import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/prisma.client';
import 'express-session';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Real Auth Route w Google

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    res.json({ user: null });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: req.session.userId },
  });
  res.json({ user });
});

router.post('/google', async (req, res) => {
  try {
    const { credential, username, homeLatitude, homeLongitude } = req.body;

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

    const user = await prisma.user.upsert({
      where: { googleId },
      update: {
        name,
        picture,
        username,
        homeLatitude:
          homeLatitude ?
            parseFloat(homeLatitude) :
            null,
        homeLongitude:
          homeLongitude ?
            parseFloat(homeLongitude) :
            null,
      },
      create: {
        email, name, picture, googleId,
        username,
        homeLatitude: homeLatitude ? parseFloat(homeLatitude) : null,
        homeLongitude: homeLongitude ? parseFloat(homeLongitude) : null,
      },
    });

    req.session.userId = user.id;

    if (!user.username ) {
      res.json({ success: true, needsProfile: true, user });
      return;
    }

    res.json({ success: true, needsProfile: false, user });

  } catch (error) {
    console.error('Google Auth error: ', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
