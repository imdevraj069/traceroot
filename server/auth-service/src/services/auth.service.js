import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
import PasswordReset from '../models/passwordReset.model.js';
import ApiError from '../utils/ApiError.js';
import { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from './email.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Generate refresh token
const generateRefreshToken = async (user, ipAddress) => {
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
        userId: user._id,
        token,
        expiresAt,
        createdByIp: ipAddress
    });

    return token;
};

// Get client IP
export const getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
};

// Register user
export const registerUser = async ({ email, password, name, role = 'consumer' }, ipAddress) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        email,
        password: hashedPassword,
        name,
        role
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, ipAddress);

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(user).catch(err => console.error('Welcome email failed:', err));

    return {
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

// Login user
export const loginUser = async ({ email, password }, ipAddress) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, ipAddress);

    return {
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

// Refresh access token
export const refreshAccessToken = async (refreshToken, ipAddress) => {
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
        throw new ApiError(401, "Invalid refresh token");
    }

    if (storedToken.revokedAt) {
        // Token was revoked - possible token reuse attack
        // Revoke all tokens for this user
        await RefreshToken.updateMany(
            { userId: storedToken.userId },
            { revokedAt: new Date(), revokedByIp: ipAddress }
        );
        throw new ApiError(401, "Token has been revoked");
    }

    if (new Date() >= storedToken.expiresAt) {
        throw new ApiError(401, "Refresh token has expired");
    }

    const user = await User.findById(storedToken.userId);
    if (!user) {
        throw new ApiError(401, "User not found");
    }

    // Rotate refresh token
    storedToken.revokedAt = new Date();
    storedToken.revokedByIp = ipAddress;
    const newRefreshToken = await generateRefreshToken(user, ipAddress);
    storedToken.replacedByToken = newRefreshToken;
    await storedToken.save();

    const accessToken = generateAccessToken(user);

    return {
        accessToken,
        refreshToken: newRefreshToken
    };
};

// Logout - revoke refresh token
export const logout = async (refreshToken, ipAddress) => {
    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (storedToken && !storedToken.revokedAt) {
        storedToken.revokedAt = new Date();
        storedToken.revokedByIp = ipAddress;
        await storedToken.save();
    }

    return { message: "Logged out successfully" };
};

// Logout from all devices
export const logoutAll = async (userId, ipAddress) => {
    await RefreshToken.updateMany(
        { userId, revokedAt: null },
        { revokedAt: new Date(), revokedByIp: ipAddress }
    );

    return { message: "Logged out from all devices" };
};

// Request password reset
export const requestPasswordReset = async (email) => {
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
        return { message: "If the email exists, a reset link will be sent" };
    }

    // Invalidate any existing reset tokens
    await PasswordReset.updateMany(
        { userId: user._id, usedAt: null },
        { usedAt: new Date() }
    );

    // Generate new reset token and code
    const token = crypto.randomBytes(32).toString('hex');
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await PasswordReset.create({
        userId: user._id,
        token,
        code,
        expiresAt
    });

    // Send reset email
    await sendPasswordResetEmail(user, code, token);

    return { message: "If the email exists, a reset link will be sent" };
};

// Reset password with token
export const resetPassword = async (token, code, newPassword) => {
    const resetRecord = await PasswordReset.findOne({ token });

    if (!resetRecord) {
        throw new ApiError(400, "Invalid or expired reset token");
    }

    if (resetRecord.usedAt) {
        throw new ApiError(400, "Reset token has already been used");
    }

    if (new Date() >= resetRecord.expiresAt) {
        throw new ApiError(400, "Reset token has expired");
    }

    if (resetRecord.code !== code) {
        throw new ApiError(400, "Invalid reset code");
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Mark token as used
    resetRecord.usedAt = new Date();
    await resetRecord.save();

    // Revoke all refresh tokens for security
    await RefreshToken.updateMany(
        { userId: user._id, revokedAt: null },
        { revokedAt: new Date() }
    );

    // Send confirmation email
    sendPasswordChangedEmail(user).catch(err => console.error('Password changed email failed:', err));

    return { message: "Password reset successfully" };
};

// Change password (authenticated)
export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(400, "Current password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Send confirmation email
    sendPasswordChangedEmail(user).catch(err => console.error('Password changed email failed:', err));

    return { message: "Password changed successfully" };
};

// Get user profile
export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return user;
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
    delete updates.password;
    delete updates.role;
    delete updates.email;

    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};

// Admin: Get all users
export const getAllUsers = async ({ page = 1, limit = 10, role }) => {
    const query = {};
    if (role) query.role = role;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find(query).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
        User.countDocuments(query)
    ]);

    return {
        users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

// Admin: Update user role
export const updateUserRole = async (userId, newRole) => {
    const validRoles = ['admin', 'farmer', 'inspector', 'distributor', 'consumer'];
    if (!validRoles.includes(newRole)) {
        throw new ApiError(400, `Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
    ).select('-password');

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return user;
};
