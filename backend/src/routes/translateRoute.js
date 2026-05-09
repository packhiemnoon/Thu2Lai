import express from 'express';
import { translateText } from '#controllers/translateController';
import { requireAuth } from '#middlewares/auth';

const router = express.Router();

router.post('/', requireAuth, translateText);

export default router;