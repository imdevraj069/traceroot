import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { adminOnly } from '../middlewares/rbac.middleware.js';

const router = Router();

// ==================== Public Routes ====================

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', authController.refreshToken);

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', authController.resetPassword);

// ==================== Protected Routes ====================

// POST /api/auth/logout - Logout (revoke refresh token)
router.post('/logout', authController.logout);

// POST /api/auth/logout-all - Logout from all devices
router.post('/logout-all', verifyToken, authController.logoutAll);

// POST /api/auth/change-password - Change password (authenticated)
router.post('/change-password', verifyToken, authController.changePassword);

// GET /api/auth/profile - Get current user profile
router.get('/profile', verifyToken, authController.getProfile);

// PUT /api/auth/profile - Update current user profile
router.put('/profile', verifyToken, authController.updateProfile);

// ==================== Admin Routes ====================

// GET /api/auth/users - Get all users (admin only)
router.get('/users', verifyToken, adminOnly, authController.getAllUsers);

// PUT /api/auth/users/:userId/role - Update user role (admin only)
router.put('/users/:userId/role', verifyToken, adminOnly, authController.updateUserRole);

export default router;
