import express from 'express';
const router = express.Router();

import * as usersController from '../controller/usersController.js';

import { requireAuth } from '../middleware/auth.js';

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/logout', requireAuth, usersController.logoutUser);

export default router