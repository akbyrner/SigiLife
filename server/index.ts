import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import session from 'express-session';
import 'express-session';
import { Request, Response, NextFunction } from 'express';

import authRouter from './routes/auth.routes.js';
import sigilRouter from './routes/sigil.routes.js';
import userRouter from './routes/user.routes.js';
import vectorRouter from './routes/vector.routes.js';
import { sessionStore } from './sessionStore.js';
import prisma from './prisma/prisma.client.js';




const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(compression());


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Middleware
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Necessary for 8th Wall Standalone Engine (WASM + SharedArrayBuffer)
  if (req.path.includes('/xr/')) {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  }
  
  // Ensure WASM files are served with the correct MIME type
  if (req.path.endsWith('.wasm')) {
    res.setHeader('Content-Type', 'application/wasm');
  }
  
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
}));


// app.use(cors({
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       'http://18.223.34.170',
//       'http://ec2-18-223-34-170.us-east-2.compute.amazonaws.com',
//     ];
    
//     const devOrigins = [
//       /^http:\/\/localhost:\d+$/,
//       /^http:\/\/127\.0\.0\.1:\d+$/
//     ];

//     if (!origin) return callback(null, true);

//     const isAllowed = allowedOrigins.includes(origin) || 
//                      (process.env.NODE_ENV !== 'production' && devOrigins.some(regex => regex.test(origin)));

//     if (isAllowed) {
//       callback(null, true);
//     } else {
//       console.warn(`CORS blocked for origin: ${origin}`);
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production' && process.env.ENABLE_HTTPS === 'true',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use('/api/auth', authRouter);
app.use('/api/sigils', sigilRouter);
app.use('/api/users', userRouter);
app.use('/api/vectors', vectorRouter);

const distPath = path.join(process.cwd(), 'dist');

app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Hello SigiLife!');
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error handler



app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});



app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});
