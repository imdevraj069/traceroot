import Batch from '../models/batch.model.js';
import QualityMetric from '../models/qualityMetric.model.js';
import ApiError from '../utils/ApiError.js';
import { v4 as uuidv4 } from 'uuid';

export const createBatch = async (data) => {
    const batchId = `BATCH-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    const batch = await Batch.create({
        batchId,
        ...data,
        status: 'created'
    });

    return batch;
};

export const getAllBatches = async ({ page, limit, status, userId }) => {
    const query = {};

    if (status) query.status = status;
    if (userId) query.createdBy = userId;

    const skip = (page - 1) * limit;

    const [batches, total] = await Promise.all([
        Batch.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
        Batch.countDocuments(query)
    ]);

    return {
        batches,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getBatchById = async (id) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    const qualityMetrics = await QualityMetric.find({ batchId: id });

    return { ...batch.toObject(), qualityMetrics };
};

export const updateBatch = async (id, updates, userId) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    // Only allow owner to update
    if (batch.createdBy && batch.createdBy.toString() !== userId) {
        throw new ApiError(403, "Not authorized to update this batch");
    }

    Object.assign(batch, updates);
    await batch.save();

    return batch;
};

export const deleteBatch = async (id, userId) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    if (batch.createdBy && batch.createdBy.toString() !== userId) {
        throw new ApiError(403, "Not authorized to delete this batch");
    }

    await Batch.findByIdAndDelete(id);
    await QualityMetric.deleteMany({ batchId: id });
};

export const addQualityMetric = async (batchId, data) => {
    const batch = await Batch.findById(batchId);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    const metric = await QualityMetric.create({
        batchId,
        ...data
    });

    // Update batch status
    batch.status = 'inspected';
    await batch.save();

    return metric;
};

export const getBatchTimeline = async (id) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    const qualityMetrics = await QualityMetric.find({ batchId: id }).sort({ createdAt: 1 });

    const timeline = [
        {
            event: 'created',
            timestamp: batch.createdAt,
            description: `Batch created with ${batch.quantity} ${batch.unit} of ${batch.productName}`
        }
    ];

    qualityMetrics.forEach(metric => {
        timeline.push({
            event: 'quality_check',
            timestamp: metric.createdAt,
            description: `${metric.metricType}: ${metric.value} ${metric.unit || ''}`
        });
    });

    return timeline;
};

export const getPublicBatchInfo = async (batchId) => {
    const batch = await Batch.findOne({ batchId }).select('-createdBy');

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    const qualityMetrics = await QualityMetric.find({ batchId: batch._id }).select('-inspectorId');

    return {
        batch,
        qualityMetrics,
        verified: true
    };
};

export const verifyNfcTag = async (nfcTagId) => {
    const batch = await Batch.findOne({ nfcTagId });

    if (!batch) {
        return {
            valid: false,
            message: "NFC tag not registered"
        };
    }

    return {
        valid: true,
        batchId: batch.batchId,
        productName: batch.productName,
        message: "NFC tag verified successfully"
    };
};
