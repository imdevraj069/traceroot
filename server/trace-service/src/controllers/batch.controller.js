import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as batchService from '../services/batch.service.js';
import * as qrService from '../services/qr.service.js';

export const createBatch = asyncHandler(async (req, res) => {
    const { productName, variety, quantity, unit, origin, harvestDate, expiryDate, nfcTagId } = req.body;
    console.log(req.body);

    if (!productName || !quantity || !origin) {
        throw new ApiError(400, "Product name, quantity, and location are required");
    }

    const batch = await batchService.createBatch({
        productName,
        variety,
        quantity,
        unit,
        origin,
        harvestDate,
        expiryDate,
        nfcTagId,
        createdBy: req.user.id
    });

    res.status(201).json(new ApiResponse(201, batch, "Batch created successfully"));
});

export const getAllBatches = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    // Allow admin, supplier, manufacturer, and distributor to see all batches
    // Other roles only see batches they created
    const canViewAll = ['admin', 'supplier', 'manufacturer', 'distributor', 'retailer'].includes(req.user.role);
    const userId = canViewAll ? null : req.user.id;

    const batches = await batchService.getAllBatches({ page, limit, status, userId });

    res.status(200).json(new ApiResponse(200, batches, "Batches fetched successfully"));
});

export const getBatchById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const batch = await batchService.getBatchById(id);

    res.status(200).json(new ApiResponse(200, batch, "Batch fetched successfully"));
});

export const updateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const batch = await batchService.updateBatch(id, updates, req.user.id, req.user.role);

    res.status(200).json(new ApiResponse(200, batch, "Batch updated successfully"));
});

export const deleteBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await batchService.deleteBatch(id, req.user.id, req.user.role);

    res.status(200).json(new ApiResponse(200, null, "Batch deleted successfully"));
});

export const addQualityMetric = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { metricType, score, category, status, labName, testMethod, reportNumber, notes } = req.body;

    if (!metricType || score === undefined) {
        throw new ApiError(400, "Metric type and score are required");
    }

    const metricData = {
        metricType,
        score,
        category: category || 'General',
        status: status || 'Pending',
        labName,
        testMethod,
        reportNumber,
        notes,
        inspectorId: req.user.id
    };

    // Handle certificate file
    if (req.file) {
        metricData.certificateUrl = `/uploads/certificates/${req.file.filename}`;
        metricData.certificatePath = req.file.path;
    }

    const metric = await batchService.addQualityMetric(id, metricData);

    res.status(201).json(new ApiResponse(201, metric, "Quality metric added successfully"));
});

export const getBatchTimeline = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const timeline = await batchService.getBatchTimeline(id);

    res.status(200).json(new ApiResponse(200, timeline, "Timeline fetched successfully"));
});

export const updateBatchStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, location, notes, productName } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const batch = await batchService.updateBatchStatus(id, {
        status,
        location,
        notes,
        productName,
        updatedBy: req.user.id
    });

    res.status(200).json(new ApiResponse(200, batch, "Batch status updated successfully"));
});

// QR Code Generation
export const generateBatchQR = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { format = 'dataUrl' } = req.query;

    // Verify batch exists
    const batch = await batchService.getBatchById(id);

    const qrCode = await qrService.generateBatchQR(batch.batchId, format);

    if (format === 'svg') {
        res.status(200).json(new ApiResponse(200, { svg: qrCode, batchId: batch.batchId }, "QR code generated"));
    } else {
        res.status(200).json(new ApiResponse(200, { qrCode, batchId: batch.batchId }, "QR code generated"));
    }
});

export const downloadBatchQR = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Verify batch exists
    const batch = await batchService.getBatchById(id);

    const qrBuffer = await qrService.generateBatchQR(batch.batchId, 'buffer');

    res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="traceroot-${batch.batchId}.png"`,
        'Content-Length': qrBuffer.length
    });

    res.send(qrBuffer);
});
