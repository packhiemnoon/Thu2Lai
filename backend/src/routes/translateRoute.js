import express from 'express';
const router = express.Router();

import { translateText } from '../controller/translateController.js';

import { requireAuth } from '../middleware/auth.js';

router.post('/', requireAuth, translateText);

export default router