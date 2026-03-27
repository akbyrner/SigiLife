import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/prisma.client';
import 'express-session';

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Real Auth Route w Google

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

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
      update: { name, picture },
      create: { email, name, picture, googleId },
    });

    req.session.userId = user.id;
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Google Auth error: ', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
