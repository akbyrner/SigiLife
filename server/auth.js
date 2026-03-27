import router from 'express';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from './prisma/prisma.client.js';



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Real Auth Route w Google

router.post ('/google', async (req, res) => {
  const {credential} = req.body;
  const ticket = await client.verifyIdToken({

    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, name, picture, sub: googleId } = ticket.getPayload()!;

  const user = await prisma.user.upsert({
    where: { googleId },
    update: { name, picture },
    create: { email, name, picture, googleId },
  });

  req.session.userId = user.id;
  res.json({ success: true})
});

export default router;
