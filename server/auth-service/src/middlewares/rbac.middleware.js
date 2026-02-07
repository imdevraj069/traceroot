import ApiError from '../utils/ApiError.js';

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = {
    consumer: 0,
    user: 0,
    retailer: 1,
    distributor: 2,
    manufacturer: 3,
    supplier: 4,
    admin: 5
};

// Check if user has required role
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        const userRole = req.user.role;

        // Convert single role to array
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(userRole)) {
            return next(new ApiError(403, `Access denied. Required roles: ${roles.join(', ')}`));
        }

        next();
    };
};

// Check if user has minimum role level
export const requireMinRole = (minRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        const userRoleLevel = ROLE_HIERARCHY[req.user.role] ?? -1;
        const minRoleLevel = ROLE_HIERARCHY[minRole] ?? 999;

        if (userRoleLevel < minRoleLevel) {
            return next(new ApiError(403, `Access denied. Minimum role required: ${minRole}`));
        }

        next();
    };
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Authentication required'));
    }

    if (req.user.role !== 'admin') {
        return next(new ApiError(403, 'Admin access required'));
    }

    next();
};

// Check if user is owner of resource or admin
export const requireOwnerOrAdmin = (getResourceOwnerId) => {
    return async (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        // Admins can access anything
        if (req.user.role === 'admin') {
            return next();
        }

        try {
            const ownerId = await getResourceOwnerId(req);

            if (ownerId && ownerId.toString() === req.user.id) {
                return next();
            }

            return next(new ApiError(403, 'Access denied. You can only access your own resources.'));
        } catch (error) {
            next(error);
        }
    };
};

export default {
    requireRole,
    requireMinRole,
    adminOnly,
    requireOwnerOrAdmin,
    ROLE_HIERARCHY
};
