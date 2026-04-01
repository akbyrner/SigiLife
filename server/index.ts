import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';


import authRouter from './routes/auth.routes.js';
import sigilRouter from './routes/sigil.routes.js';
import userRouter from './routes/user.routes.js';

import 'express-session';
import session from 'express-session';
import { sessionStore } from './sessionStore.js';
import prisma from './prisma/prisma.client.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use('/api/auth', authRouter);
app.use('/api/sigils', sigilRouter);
app.use('/api/users', userRouter)

const distPath = path.join(process.cwd(), 'dist');

app.use(express.static(distPath));

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import path from 'path';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'http://18.223.34.170'
    : 'http://localhost:5173',
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



app.get('/', (req, res) => {
  res.send('Hello SigiLife!');
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
