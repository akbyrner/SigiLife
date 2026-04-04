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
import '../types/session.d.ts';
const router = Router();
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Get All Sigils
router.get('/allsigils', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sigils = yield prisma.sigil.findMany({
            orderBy: { createdAt: 'desc' },
            include: { sigilGroups: true },
        });
        res.json(sigils);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
router.get('/user/:userId/sigils', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sigils = yield prisma.sigil.findMany({
            where: { userId: parseInt(req.params.userId) },
            orderBy: { createdAt: 'desc' },
            include: { sigilGroups: true },
        });
        res.json(sigils);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Save Sigil
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, intention, canvasData, imageData, locationName, latitude, longitude } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'User not authenticated. Please log in to save sigils.'
            });
        }
        const sigil = yield prisma.sigil.create({
            data: {
                name,
                userId,
                intention,
                canvasData,
                imageData,
                locationName,
                latitude,
                longitude,
            },
        });
        res.json({ id: sigil.id, message: 'Sigil saved successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Charge Sigil
router.patch('/:id/charge', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sigil = yield prisma.sigil.update({
            where: { id: parseInt(req.params.id) },
            data: { isCharged: true }
        });
        res.json(sigil);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Update Sigil Location
router.patch('/:id/location', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locationName, latitude, longitude } = req.body;
        const sigil = yield prisma.sigil.update({
            where: { id: parseInt(req.params.id) },
            data: {
                locationName,
                latitude,
                longitude
            }
        });
        res.json(sigil);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Delete Sigil
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma.sigil.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'destroyed sigil' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
export default router;
