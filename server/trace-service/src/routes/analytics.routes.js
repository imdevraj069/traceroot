import { Router } from 'express';
import { getBatchStats } from '../controllers/analytics.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/stats', getBatchStats);

export default router;
