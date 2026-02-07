import { Router } from 'express';
import * as batchController from '../controllers/batch.controller.js';

const router = Router();

// POST /api/batches - Create new batch
router.post('/', batchController.createBatch);

// GET /api/batches - List all batches
router.get('/', batchController.getAllBatches);

// GET /api/batches/:id - Get batch by ID
router.get('/:id', batchController.getBatchById);

// PUT /api/batches/:id - Update batch
router.put('/:id', batchController.updateBatch);

// DELETE /api/batches/:id - Delete batch
router.delete('/:id', batchController.deleteBatch);

// POST /api/batches/:id/quality - Add quality metric
router.post('/:id/quality', batchController.addQualityMetric);

// GET /api/batches/:id/timeline - Get supply chain timeline
router.get('/:id/timeline', batchController.getBatchTimeline);

export default router;
