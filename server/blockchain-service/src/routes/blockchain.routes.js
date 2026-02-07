import { Router } from 'express';
import * as blockchainController from '../controllers/blockchain.controller.js';

const router = Router();

// POST /api/blockchain/batch - Record batch on blockchain
router.post('/batch', blockchainController.recordBatch);

// POST /api/blockchain/verify-nfc - Verify NFC tag on blockchain
router.post('/verify-nfc', blockchainController.verifyNfc);

// POST /api/blockchain/quality - Record quality metric on blockchain
router.post('/quality', blockchainController.recordQualityMetric);

// POST /api/blockchain/status - Update status on blockchain
router.post('/status', blockchainController.updateStatus);

// GET /api/blockchain/tx/:hash - Get transaction status
router.get('/tx/:hash', blockchainController.getTransactionStatus);

// GET /api/blockchain/batch/:batchId - Get batch from blockchain
router.get('/batch/:batchId', blockchainController.getBatchFromChain);

// GET /api/blockchain/batch/:batchId/quality - Get quality metrics from blockchain
router.get('/batch/:batchId/quality', blockchainController.getBatchQualityMetrics);

// GET /api/blockchain/status - Get blockchain connection status
router.get('/status', blockchainController.getBlockchainStatus);

export default router;
