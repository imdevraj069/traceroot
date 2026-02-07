import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as certificationService from '../services/certification.service.js';

/**
 * Create new certification
 * POST /api/certifications
 */
export const createCertification = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    const certification = await certificationService.createCertification(req.body, userId);

    res.status(201).json(new ApiResponse(201, certification, 'Certification created successfully'));
});

/**
 * Get all certifications
 * GET /api/certifications
 */
export const getCertifications = asyncHandler(async (req, res) => {
    const { active, type, organizationId } = req.query;

    const certifications = await certificationService.getCertifications({
        active,
        type,
        organizationId
    });

    res.status(200).json(new ApiResponse(200, { certifications }, 'Certifications fetched'));
});

/**
 * Get certification by ID
 * GET /api/certifications/:id
 */
export const getCertificationById = asyncHandler(async (req, res) => {
    const certification = await certificationService.getCertificationById(req.params.id);

    res.status(200).json(new ApiResponse(200, certification, 'Certification fetched'));
});

/**
 * Update certification
 * PUT /api/certifications/:id
 */
export const updateCertification = asyncHandler(async (req, res) => {
    const certification = await certificationService.updateCertification(req.params.id, req.body);

    res.status(200).json(new ApiResponse(200, certification, 'Certification updated'));
});

/**
 * Delete certification
 * DELETE /api/certifications/:id
 */
export const deleteCertification = asyncHandler(async (req, res) => {
    await certificationService.deleteCertification(req.params.id);

    res.status(200).json(new ApiResponse(200, null, 'Certification deleted'));
});

/**
 * Get active certifications
 * GET /api/certifications/active
 */
export const getActiveCertifications = asyncHandler(async (req, res) => {
    const certifications = await certificationService.getActiveCertifications();

    res.status(200).json(new ApiResponse(200, { certifications }, 'Active certifications fetched'));
});

/**
 * Get expiring certifications
 * GET /api/certifications/expiring
 */
export const getExpiringCertifications = asyncHandler(async (req, res) => {
    const days = parseInt(req.query.days) || 30;

    const certifications = await certificationService.getExpiringCertifications(days);

    res.status(200).json(new ApiResponse(200, {
        certifications,
        expiringWithinDays: days
    }, 'Expiring certifications fetched'));
});
