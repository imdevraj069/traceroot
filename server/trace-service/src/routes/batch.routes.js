import { Router } from 'express';
import * as batchController from '../controllers/batch.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { canCreateBatch, canAddQuality, canUpdateShipping } from '../middlewares/rbac.middleware.js';

const router = Router();

// ==================== Protected Routes (require auth) ====================

// POST /api/batches - Create new batch (farmers, admins)
router.post('/', verifyToken, canCreateBatch, batchController.createBatch);

// GET /api/batches - List all batches (authenticated users)
router.get('/', verifyToken, batchController.getAllBatches);

// GET /api/batches/:id - Get batch by ID (authenticated users)
router.get('/:id', verifyToken, batchController.getBatchById);

// PUT /api/batches/:id - Update batch (owner or admin)
router.put('/:id', verifyToken, batchController.updateBatch);

// DELETE /api/batches/:id - Delete batch (owner or admin)
router.delete('/:id', verifyToken, batchController.deleteBatch);

// POST /api/batches/:id/quality - Add quality metric (inspectors, admins)
router.post('/:id/quality', verifyToken, canAddQuality, batchController.addQualityMetric);

// GET /api/batches/:id/timeline - Get supply chain timeline
router.get('/:id/timeline', verifyToken, batchController.getBatchTimeline);

// PUT /api/batches/:id/status - Update batch status (distributors, admins)
router.put('/:id/status', verifyToken, canUpdateShipping, batchController.updateBatchStatus);

// ==================== QR Code Routes ====================

// GET /api/batches/:id/qr - Generate QR code for batch
router.get('/:id/qr', verifyToken, batchController.generateBatchQR);

// GET /api/batches/:id/qr/download - Download QR code as file
router.get('/:id/qr/download', verifyToken, batchController.downloadBatchQR);

export default router;
