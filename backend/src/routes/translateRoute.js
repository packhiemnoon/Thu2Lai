import express from 'express';
import { translateText } from '#controllers/translateController';

const router = express.Router();

router.post('/', translateText);
// router.post('/', requireAuth, translateText);

export default router;