import express from 'express';
const router = express.Router();

import * as usersController from '../controller/usersController.js';

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.post('/logout', usersController.logoutUser);

export default router