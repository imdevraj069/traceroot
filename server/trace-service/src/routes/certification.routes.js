import { Router } from 'express';
import * as certController from '../controllers/certification.controller.js';
import { verifyToken, optionalAuth } from '../middlewares/auth.middleware.js';
import { requireRole, isAdmin } from '../middlewares/rbac.middleware.js';

const router = Router();

// Public routes
router.get('/active', certController.getActiveCertifications);

// Protected routes (require authentication)
router.use(verifyToken);

// Get all certifications
router.get('/', certController.getCertifications);

// Get expiring certifications
router.get('/expiring', certController.getExpiringCertifications);

// Get certification by ID
router.get('/:id', certController.getCertificationById);

// Create certification (admin/manufacturer only)
router.post('/', requireRole(['admin', 'manufacturer']), certController.createCertification);

// Update certification (admin/manufacturer only)
router.put('/:id', requireRole(['admin', 'manufacturer']), certController.updateCertification);

// Delete certification (admin only)
router.delete('/:id', isAdmin, certController.deleteCertification);

export default router;
