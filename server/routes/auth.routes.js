var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../prisma/prisma.client.js';
import 'express-session';
const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Checks if User
router.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('[/me] session:', req.session);
    console.log('[/me] userId:', req.session.userId);
    if (!req.session.userId) {
        res.json({ user: null });
        return;
    }
    const user = yield prisma.user.findUnique({
        where: { id: req.session.userId },
    });
    if (!user) {
        res.json({ user: null });
        return;
    }
    const needsProfile = !user.username || user.avatar === null || user.theme === null || !user.homeLocation;
    res.json({ user, needsProfile });
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Sends to Google/ Returns token
router.post('/google', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credential, username, avatar, theme, homeLocation } = req.body;
        const ticket = yield client.verifyIdToken({
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
        let user = yield prisma.user.findUnique({ where: { googleId } });
        if (!user) {
            user = yield prisma.user.create({
                data: Object.assign(Object.assign(Object.assign({ email, name, picture, googleId,
                    username }, (avatar != null && { avatar: parseInt(avatar) })), (theme != null && { theme: parseInt(theme) })), { homeLocation: homeLocation || null }),
            });
            yield prisma.sigil.createMany({
                data: Array.from({ length: 12 }, (_, i) => ({
                    name: `sigil-${user.id}-${i + 1}`,
                    userId: user.id,
                })),
            });
        }
        else if (username || homeLocation) {
            user = yield prisma.user.update({
                where: { id: user.id },
                data: Object.assign(Object.assign(Object.assign({ username: username || user.username }, (avatar != null && { avatar: parseInt(avatar) })), (theme != null && { theme: parseInt(theme) })), { homeLocation: homeLocation || user.homeLocation })
            });
        }
        req.session.userId = user.id;
        yield new Promise((resolve, reject) => {
            req.session.save((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        const needsProfile = !user.username || user.avatar === null || user.theme === null || !user.homeLocation;
        res.json({ success: true, needsProfile, user });
    }
    catch (error) {
        console.error('Google Auth error: ', error);
        res.status(500).json({ error: error.message });
    }
}));
export default router;
