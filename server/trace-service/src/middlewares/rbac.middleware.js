import ApiError from '../utils/ApiError.js';

// Role hierarchy matching auth-service
const ROLE_HIERARCHY = {
    consumer: 0,
    user: 0,
    retailer: 1,
    distributor: 2,
    manufacturer: 3,
    supplier: 4,
    admin: 5
};

// Require specific roles
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        const userRole = req.user.role;
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!roles.includes(userRole)) {
            return next(new ApiError(403, `Access denied. Required roles: ${roles.join(', ')}`));
        }

        next();
    };
};

// Require minimum role level
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

// Admin only
export const isAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new ApiError(401, 'Authentication required'));
    }

    if (req.user.role !== 'admin') {
        return next(new ApiError(403, 'Admin access required'));
    }

    next();
};

// Suppliers can create batches (they are the farmers/producers)
export const canCreateBatch = requireRole(['admin', 'supplier']);

// Manufacturers can process batches
export const canProcessBatch = requireRole(['admin', 'manufacturer']);

// Quality check (admin or manufacturer)
export const canAddQuality = requireRole(['admin', 'manufacturer']);

// Distributors can update shipping/transit status
export const canUpdateShipping = requireRole(['admin', 'distributor']);

// Retailers can mark as delivered
export const canMarkDelivered = requireRole(['admin', 'retailer']);

export default {
    requireRole,
    requireMinRole,
    isAdmin,
    canCreateBatch,
    canProcessBatch,
    canAddQuality,
    canUpdateShipping,
    canMarkDelivered
};
