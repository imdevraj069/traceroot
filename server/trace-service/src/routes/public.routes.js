import { Router } from 'express';
import * as publicController from '../controllers/public.controller.js';

const router = Router();

// GET /api/public/batch/:batchId - Public batch verification (no auth)
router.get('/batch/:batchId', publicController.getPublicBatch);

// GET /api/public/verify/:nfcTagId - Verify NFC tag publicly
router.get('/verify/:nfcTagId', publicController.verifyNfcTag);

export default router;
