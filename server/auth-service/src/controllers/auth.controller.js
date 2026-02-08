import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as authService from '../services/auth.service.js';

// Get client IP helper
const getIp = (req) => authService.getClientIp(req);

export const register = asyncHandler(async (req, res) => {
    const { email, password, name, role, location, organization } = req.body;

    if (!email || !password || !name) {
        throw new ApiError(400, "Email, password, and name are required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    const result = await authService.registerUser({ email, password, name, role, location, organization }, getIp(req));

    res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const result = await authService.loginUser({ email, password }, getIp(req));

    res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, "Refresh token is required");
    }

    const result = await authService.refreshAccessToken(refreshToken, getIp(req));

    res.status(200).json(new ApiResponse(200, result, "Token refreshed successfully"));
});

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const result = await authService.logout(refreshToken, getIp(req));

    res.status(200).json(new ApiResponse(200, result, "Logged out successfully"));
});

export const logoutAll = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const result = await authService.logoutAll(userId, getIp(req));

    res.status(200).json(new ApiResponse(200, result, "Logged out from all devices"));
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const result = await authService.requestPasswordReset(email);

    res.status(200).json(new ApiResponse(200, result, "Password reset email sent"));
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, code, password } = req.body;

    if (!token || !code || !password) {
        throw new ApiError(400, "Token, code, and new password are required");
    }

    if (password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters");
    }

    const result = await authService.resetPassword(token, code, password);

    res.status(200).json(new ApiResponse(200, result, "Password reset successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters");
    }

    const result = await authService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json(new ApiResponse(200, result, "Password changed successfully"));
});

export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await authService.getUserProfile(userId);

    res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const updates = req.body;

    const user = await authService.updateUserProfile(userId, updates);

    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

// Admin endpoints
export const getAllUsers = asyncHandler(async (req, res) => {
    const { page, limit, role } = req.query;

    const result = await authService.getAllUsers({ page, limit, role });

    res.status(200).json(new ApiResponse(200, result, "Users fetched successfully"));
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
        throw new ApiError(400, "Role is required");
    }

    const user = await authService.updateUserRole(userId, role);

    res.status(200).json(new ApiResponse(200, user, "User role updated successfully"));
});
