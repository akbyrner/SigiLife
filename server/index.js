var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import session from 'express-session';
import 'express-session';
import authRouter from './routes/auth.routes.js';
import sigilRouter from './routes/sigil.routes.js';
import userRouter from './routes/user.routes.js';
import { sessionStore } from './sessionStore.js';
import prisma from './prisma/prisma.client.js';
const app = express();
const PORT = process.env.PORT || 3000;
// Trust proxy for secure cookies behind ELB/Nginx
app.set('trust proxy', 1);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(compression());
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Middleware
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
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
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        // Only set secure to true if we are in production AND actually on HTTPS
        secure: process.env.NODE_ENV === 'production' && process.env.ENABLE_HTTPS === 'true',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
}));
app.use('/api/auth', authRouter);
app.use('/api/sigils', sigilRouter);
app.use('/api/users', userRouter);
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Routes
app.post('/api/character-vectors', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chars } = req.body;
        if (!chars || typeof chars !== 'string') {
            return res.json([]);
        }
        const charArray = chars.split('');
        if (charArray.length === 0) {
            return res.json([]);
        }
        const vectors = yield prisma.svgVector.findMany({
            where: { filename: { in: charArray } },
            select: { filename: true, vectorData: true },
        });
        res.json(vectors);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
app.use(express.static(distPath));
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
app.get('/', (req, res) => {
    res.send('Hello SigiLife!');
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Error handler
app.use((err, req, res, next) => {
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
