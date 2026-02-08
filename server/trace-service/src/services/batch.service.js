import Batch from '../models/batch.model.js';
import QualityMetric from '../models/qualityMetric.model.js';
import StatusHistory from '../models/statusHistory.model.js';
import Certification from '../models/certification.model.js';
import ApiError from '../utils/ApiError.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const BLOCKCHAIN_SERVICE_URL = process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:8003';

// Valid status transitions
const VALID_STATUSES = [
    'Created',
    'Harvested',
    'Processing',
    'Quality Check',
    'Packaged',
    'In Transit',
    'In Distribution',
    'Delivered',
    'Completed',
    'Cancelled'
];

export const createBatch = async (data) => {
    const batchId = `BATCH-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const batchNumber = `TR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const batch = await Batch.create({
        batchId,
        batchNumber,
        ...data,
        status: 'Created'
    });

    // Create initial status history
    await StatusHistory.create({
        batchId: batch._id,
        status: 'Created',
        location: data.origin,
        notes: 'Batch created',
        updatedBy: data.createdBy
    });

    // Call blockchain service to record batch on blockchain
    try {
        const blockchainResponse = await axios.post(`${BLOCKCHAIN_SERVICE_URL}/api/blockchain/batch`, {
            batchId: batch.batchId,
            productName: data.productName,
            variety: data.variety || '',
            quantity: data.quantity,
            unit: data.unit,
            location: data.origin,
            harvestDate: data.harvestDate,
            expiryDate: data.expiryDate,
            nfcTagId: data.nfcTagId || ''
        });

        if (blockchainResponse.data?.data?.txHash) {
            batch.blockchainTxHash = blockchainResponse.data.data.txHash;
            await batch.save();
        }
    } catch (error) {
        console.error('Blockchain service error:', error.message);
        // Continue even if blockchain fails - batch is already created in MongoDB
    }

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

    const qualityMetrics = await QualityMetric.find({ batchId: id }).sort({ createdAt: -1 });
    const statusHistory = await StatusHistory.find({ batchId: id }).sort({ createdAt: -1 });
    const certifications = await Certification.find({ batchId: id }).sort({ createdAt: -1 });

    return { ...batch.toObject(), qualityMetrics, statusHistory, certifications };
};

export const updateBatch = async (id, updates, userId, userRole) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    // Only owner or admin can update
    if (userRole !== 'admin' && batch.createdBy?.toString() !== userId) {
        throw new ApiError(403, "Not authorized to update this batch");
    }

    // Remove protected fields
    delete updates.batchId;
    delete updates.batchNumber;
    delete updates.createdBy;
    delete updates.status;

    Object.assign(batch, updates);
    await batch.save();

    return batch;
};

export const deleteBatch = async (id, userId, userRole) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    // Only owner or admin can delete
    if (userRole !== 'admin' && batch.createdBy?.toString() !== userId) {
        throw new ApiError(403, "Not authorized to delete this batch");
    }

    await Batch.findByIdAndDelete(id);
    await QualityMetric.deleteMany({ batchId: id });
    await StatusHistory.deleteMany({ batchId: id });
};

export const addQualityMetric = async (batchId, data) => {
    const batch = await Batch.findById(batchId);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    // Auto-generate report number if not provided
    if (!data.reportNumber) {
        data.reportNumber = `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    // Assign file URL if uploaded
    if (data.certificateUrl) {
        data.reportUrl = data.certificateUrl;
    }

    const metric = await QualityMetric.create({
        batchId,
        ...data
    });

    // Update batch status if in processing/created
    if (['Created', 'Harvested', 'Processing'].includes(batch.status)) {
        batch.status = 'Quality Check';
        await batch.save();

        await StatusHistory.create({
            batchId: batch._id,
            status: 'Quality Check',
            notes: `Quality inspection: ${data.metricType}`,
            updatedBy: data.inspectorId
        });
    }

    // Record quality metric on blockchain
    try {
        const blockchainResponse = await axios.post(`${BLOCKCHAIN_SERVICE_URL}/api/blockchain/quality`, {
            batchId: batch.batchId,
            metricType: data.metricType,
            value: data.score || data.value,
            unit: data.unit || ''
        });

        if (blockchainResponse.data?.data?.txHash) {
            metric.blockchainTxHash = blockchainResponse.data.data.txHash;
            await metric.save();
        }
    } catch (error) {
        console.error('Blockchain quality metric error:', error.message);
        // Continue even if blockchain fails
    }

    return metric;
};

export const updateBatchStatus = async (id, { status, location, notes, updatedBy }) => {
    if (!VALID_STATUSES.includes(status)) {
        throw new ApiError(400, `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    batch.status = status;
    if (location) batch.currentLocation = location;
    await batch.save();

    // Record status change
    const statusRecord = await StatusHistory.create({
        batchId: batch._id,
        status,
        location,
        notes,
        updatedBy
    });

    // Record status update on blockchain
    try {
        const blockchainResponse = await axios.post(`${BLOCKCHAIN_SERVICE_URL}/api/blockchain/status`, {
            batchId: batch.batchId,
            status,
            location: location || '',
            timestamp: Math.floor(Date.now() / 1000)
        });

        if (blockchainResponse.data?.data?.txHash) {
            statusRecord.blockchainTxHash = blockchainResponse.data.data.txHash;
            await statusRecord.save();
        }
    } catch (error) {
        console.error('Blockchain status update error:', error.message);
        // Continue even if blockchain fails
    }

    return batch;
};

export const getBatchTimeline = async (id) => {
    const batch = await Batch.findById(id);

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    const statusHistory = await StatusHistory.find({ batchId: id }).sort({ createdAt: 1 });
    const qualityMetrics = await QualityMetric.find({ batchId: id }).sort({ createdAt: 1 });

    const timeline = [];

    // Add status changes to timeline
    statusHistory.forEach(history => {
        timeline.push({
            type: 'status_change',
            event: history.status,
            timestamp: history.createdAt,
            location: history.location,
            description: history.notes || `Status changed to ${history.status}`
        });
    });

    // Add quality metrics to timeline
    qualityMetrics.forEach(metric => {
        timeline.push({
            type: 'quality_check',
            event: 'Quality Check',
            timestamp: metric.createdAt,
            description: `${metric.metricType}: ${metric.value} ${metric.unit || ''}`
        });
    });

    // Sort by timestamp
    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return timeline;
};

// Calculate progress percentage based on status
export const calculateProgress = (status) => {
    const statusOrder = VALID_STATUSES.filter(s => s !== 'Cancelled');
    const index = statusOrder.indexOf(status);
    if (index === -1) return 0;
    return Math.round(((index + 1) / statusOrder.length) * 100);
};

// Get next stage in supply chain
export const getNextStage = (status) => {
    const transitions = {
        'Created': 'Harvested',
        'Harvested': 'Processing',
        'Processing': 'Quality Check',
        'Quality Check': 'Packaged',
        'Packaged': 'In Transit',
        'In Transit': 'In Distribution',
        'In Distribution': 'Delivered',
        'Delivered': 'Completed'
    };
    return transitions[status] || null;
};

// Public methods
export const getPublicBatchInfo = async (batchId) => {
    const batch = await Batch.findOne({ batchId }).select('-createdBy');

    if (!batch) {
        throw new ApiError(404, "Batch not found");
    }

    const qualityMetrics = await QualityMetric.find({ batchId: batch._id }).select('-inspectorId');
    const certifications = await Certification.find({ batchId: batch._id });
    const timeline = await getBatchTimeline(batch._id);
    const progress = calculateProgress(batch.status);

    return {
        batch,
        qualityMetrics,
        certifications,
        timeline,
        progress,
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
        batchNumber: batch.batchNumber,
        productName: batch.productName,
        status: batch.status,
        quality: batch.quality,
        progress: calculateProgress(batch.status),
        message: "NFC tag verified successfully"
    };
};
