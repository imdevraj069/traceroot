import jwt from 'jsonwebtoken';
import axios from 'axios';
import ApiError from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

// Verify JWT token locally
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Access token is required');
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ApiError(401, 'Token has expired'));
        }
        if (error.name === 'JsonWebTokenError') {
            return next(new ApiError(401, 'Invalid token'));
        }
        next(error);
    }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        }
        next();
    } catch (error) {
        // Continue without user if token is invalid
        next();
    }
};

// Verify token via auth-service (for distributed validation)
export const verifyTokenRemote = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Access token is required');
        }

        const token = authHeader.split(' ')[1];

        // Verify with auth-service
        const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        req.user = response.data.data;
        next();
    } catch (error) {
        if (error.response?.status === 401) {
            return next(new ApiError(401, 'Invalid or expired token'));
        }
        next(new ApiError(503, 'Auth service unavailable'));
    }
};

export default { verifyToken, optionalAuth, verifyTokenRemote };
