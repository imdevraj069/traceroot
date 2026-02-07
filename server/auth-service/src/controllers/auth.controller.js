import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
        throw new ApiError(400, "Email, password, and name are required");
    }

    const result = await authService.registerUser({ email, password, name, role });

    res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const result = await authService.loginUser({ email, password });

    res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

export const getProfile = asyncHandler(async (req, res) => {
    // TODO: Get user ID from JWT middleware
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await authService.getUserProfile(userId);

    res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const updates = req.body;
    const user = await authService.updateUserProfile(userId, updates);

    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});
