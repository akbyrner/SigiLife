import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import authRouter from './auth.js';

import 'express-session';
import session from 'express-session';
import { sessionStore } from './sessionStore';
import prisma from '../prisma/prisma.client';

const app = express();
const PORT = process.env.PORT || 3000;

// const router = express.Router();

//import path from 'path';
//import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/api', router);
// app.use(express.static(path.join(__dirname, '../dist')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use('/api/auth', authRouter);



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Routes
app.post('/api/character-vectors', async (req, res) => {
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
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/api/sigils', async (req, res) => {
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

app.post('/api/sigils', async (req, res) => {
  try {
    const { name, userId, intention, canvasData, imageData } = req.body;

    const sigil = await prisma.sigil.create({
      data: {
        name,
        userId: userId || 1,
        intention,
        canvasData,
        imageData,
      },
    });

    res.json({ id: sigil.id, message: 'Sigil saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello SigiLife!');
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Temp Auth
app.post('/dummy', (req, res) => {
  res.json({
    user: 'HopeyQueenie',
    gmail: 'someGmail@gmail.com',
    friends: ['BernMan'],
    avatar: 2,
    theme: 1,
    admin: true,
    sigils: [
      {
        sigilOne: {
          name: 'sigilOne',
          created_at: '2026-03-22T00:00:00.001Z',
          isCharged: false,
          img_url: 'img_url1',
          location: { name: 'sigil-here', latitude: 1, longitude: 1 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilTwo: {
          name: 'sigilTwo',
          created_at: '2026-03-22T00:00:00.002Z',
          isCharged: false,
          img_url: 'img_url2',
          location: { name: 'sigil-here2', latitude: 2, longitude: 2 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilThree: {
          name: 'sigilThree',
          created_at: '2026-03-22T00:00:00.003Z',
          isCharged: false,
          img_url: 'img_url3',
          location: { name: 'sigil-here3', latitude: 3, longitude: 3 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilFour: {
          name: 'sigilFour',
          created_at: '2026-03-22T00:00:00.004Z',
          isCharged: false,
          img_url: 'img_url4',
          location: { name: 'sigil-here4', latitude: 4, longitude: 4 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilFive: {
          name: 'sigilFive',
          created_at: '2026-03-22T00:00:00.005Z',
          isCharged: false,
          img_url: 'img_url5',
          location: { name: 'sigil-here5', latitude: 5, longitude: 5 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilSix: {
          name: 'sigilSix',
          created_at: '2026-03-22T00:00:00.006Z',
          isCharged: false,
          img_url: 'img_url6',
          location: { name: 'sigil-here6', latitude: 6, longitude: 6 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilSeven: {
          name: 'sigilSeven',
          created_at: '2026-03-22T00:00:00.007Z',
          isCharged: false,
          img_url: 'img_url7',
          location: { name: 'sigil-here7', latitude: 7, longitude: 7 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilEight: {
          name: 'sigilEight',
          created_at: '2026-03-22T00:00:00.008Z',
          isCharged: false,
          img_url: 'img_url8',
          location: { name: 'sigil-here8', latitude: 8, longitude: 8 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilNine: {
          name: 'sigilNine',
          created_at: '2026-03-22T00:00:00.009Z',
          isCharged: false,
          img_url: 'img_url9',
          location: { name: 'sigil-here9', latitude: 9, longitude: 9 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilTen: {
          name: 'sigilTen',
          created_at: '2026-03-22T00:00:00.010Z',
          isCharged: false,
          img_url: 'img_url10',
          location: { name: 'sigil-here10', latitude: 10, longitude: 10 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilEleven: {
          name: 'sigilEleven',
          created_at: '2026-03-22T00:00:00.011Z',
          isCharged: false,
          img_url: 'img_url11',
          location: { name: 'sigil-here11', latitude: 11, longitude: 11 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilTwelve: {
          name: 'sigilTwelve',
          created_at: '2026-03-22T00:00:00.012Z',
          isCharged: false,
          img_url: 'img_url12',
          location: { name: 'sigil-here12', latitude: 12, longitude: 12 },
          sigilGroup: ['BernMan'],
        },
      },
      {
        sigilThirteen: {
          name: 'sigilThirteen',
          created_at: '2026-03-22T00:00:00.013Z',
          isCharged: false,
          img_url: 'img_url13',
          location: { name: 'sigil-here13', latitude: 13, longitude: 13 },
          sigilGroup: ['BernMan'],
        },
      },
    ],
  });
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error handler
import { Request, Response, NextFunction } from 'express';


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
