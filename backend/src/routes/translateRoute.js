import express from 'express';
import { translateText } from '../controllers/translateController.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', translateText);
//router.post('/', requireAuth, translateText);

export default router;