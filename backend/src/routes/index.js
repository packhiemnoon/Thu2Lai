import express from 'express';
import usersRoute from '#routes/usersRoute';
import translateRoute from '#routes/translateRoute';

const router = express.Router();

router.use('/users', usersRoute);
router.use('/translate', translateRoute);

export default router;