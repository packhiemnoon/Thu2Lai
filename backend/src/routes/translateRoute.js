import express from 'express';
const router = express.Router();

import translateController from '../controller/translateController.js';

import { requireAuth } from '../middleware/auth.js';

//router.post('/', requireAuth, something);

export default router