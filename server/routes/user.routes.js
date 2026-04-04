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
import prisma from '../prisma/prisma.client.js';
const router = Router();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Searches for User from DB
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'username is required to search!' });
        }
        const users = yield prisma.user.findMany({
            where: {
                username: { contains: q }
            },
            select: { id: true, username: true, avatar: true, picture: true }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Friends Follow/unfollow
router.post('/follow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { followerId, followingId } = req.body;
        const follow = yield prisma.follow.create({
            data: {
                followerId: parseInt(followerId),
                followingId: parseInt(followingId)
            }
        });
        res.json(follow);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
router.patch('/unfollow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { followerId, followingId } = req.body;
        yield prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: parseInt(followerId),
                    followingId: parseInt(followingId)
                }
            }
        });
        res.json({ message: 'user has been unfollowed!' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Gets User info from DB
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { sigils: true }
    });
    if (!user) {
        return res.status(404).json({ message: 'user could not be found' });
    }
    ;
    res.json(user);
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Updates User info from DB
router.patch('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, avatar, theme, homeLocation } = req.body;
        const user = yield prisma.user.update({
            where: { id: parseInt(req.params.id) },
            data: {
                username,
                avatar: avatar != null ? parseInt(avatar) : undefined,
                theme: theme != null ? parseInt(theme) : undefined,
                homeLocation: homeLocation || null,
            },
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Deletes User info from DB
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.user.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'user profile has been deleted' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
export default router;
