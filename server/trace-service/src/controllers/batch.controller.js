import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as batchService from '../services/batch.service.js';

export const createBatch = asyncHandler(async (req, res) => {
    const { productName, variety, quantity, unit, location, harvestDate, expiryDate, nfcTagId } = req.body;

    if (!productName || !quantity || !location) {
        throw new ApiError(400, "Product name, quantity, and location are required");
    }

    const batch = await batchService.createBatch({
        productName,
        variety,
        quantity,
        unit,
        location,
        harvestDate,
        expiryDate,
        nfcTagId,
        createdBy: req.user?.id
    });

    res.status(201).json(new ApiResponse(201, batch, "Batch created successfully"));
});

export const getAllBatches = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const batches = await batchService.getAllBatches({ page, limit, status, userId: req.user?.id });

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

    const batch = await batchService.updateBatch(id, updates, req.user?.id);

    res.status(200).json(new ApiResponse(200, batch, "Batch updated successfully"));
});

export const deleteBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await batchService.deleteBatch(id, req.user?.id);

    res.status(200).json(new ApiResponse(200, null, "Batch deleted successfully"));
});

export const addQualityMetric = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { metricType, value, unit } = req.body;

    if (!metricType || !value) {
        throw new ApiError(400, "Metric type and value are required");
    }

    const metric = await batchService.addQualityMetric(id, {
        metricType,
        value,
        unit,
        inspectorId: req.user?.id
    });

    res.status(201).json(new ApiResponse(201, metric, "Quality metric added successfully"));
});

export const getBatchTimeline = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const timeline = await batchService.getBatchTimeline(id);

    res.status(200).json(new ApiResponse(200, timeline, "Timeline fetched successfully"));
});
