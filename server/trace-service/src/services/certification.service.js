import Certification from '../models/certification.model.js';
import ApiError from '../utils/ApiError.js';

/**
 * Create a new certification
 */
export const createCertification = async (data, userId) => {
    const certification = new Certification({
        ...data,
        organizationId: userId
    });
    await certification.save();
    return certification;
};

/**
 * Get all certifications with optional filters
 */
export const getCertifications = async (filters = {}) => {
    const query = {};

    if (filters.active !== undefined) {
        query.active = filters.active === 'true' || filters.active === true;
    }

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.organizationId) {
        query.organizationId = filters.organizationId;
    }

    const certifications = await Certification.find(query)
        .sort({ createdAt: -1 });

    return certifications;
};

/**
 * Get certification by ID
 */
export const getCertificationById = async (id) => {
    const certification = await Certification.findById(id);
    if (!certification) {
        throw new ApiError(404, 'Certification not found');
    }
    return certification;
};

/**
 * Update certification
 */
export const updateCertification = async (id, data) => {
    const certification = await Certification.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
    );

    if (!certification) {
        throw new ApiError(404, 'Certification not found');
    }

    return certification;
};

/**
 * Delete certification
 */
export const deleteCertification = async (id) => {
    const certification = await Certification.findByIdAndDelete(id);

    if (!certification) {
        throw new ApiError(404, 'Certification not found');
    }

    return certification;
};

/**
 * Get active certifications
 */
export const getActiveCertifications = async () => {
    const now = new Date();
    return await Certification.find({
        active: true,
        $or: [
            { expiryDate: { $gte: now } },
            { expiryDate: null }
        ]
    });
};

/**
 * Get expiring certifications (within X days)
 */
export const getExpiringCertifications = async (days = 30) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return await Certification.find({
        active: true,
        expiryDate: {
            $gte: now,
            $lte: futureDate
        }
    }).sort({ expiryDate: 1 });
};
