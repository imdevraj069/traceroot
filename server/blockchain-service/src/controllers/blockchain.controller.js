import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import blockchainService from '../services/blockchain.service.js';
import { v4 as uuidv4 } from 'uuid';

// Initialize blockchain service on first request
let initialized = false;

const ensureInitialized = async () => {
    if (!initialized) {
        initialized = await blockchainService.initialize();
    }
    return initialized;
};

// Record batch on blockchain
export const recordBatch = asyncHandler(async (req, res) => {
    await ensureInitialized();

    const { batchId, productName, variety, quantity, unit, location, harvestDate, expiryDate, nfcTagId } = req.body;

    if (!batchId || !productName) {
        throw new ApiError(400, "Batch ID and product name are required");
    }

    const result = await blockchainService.createBatch({
        batchId,
        productName,
        variety,
        quantity: quantity || 0,
        unit: unit || 'kg',
        location: location || '',
        harvestDate: harvestDate ? Math.floor(new Date(harvestDate).getTime() / 1000) : Math.floor(Date.now() / 1000),
        expiryDate: expiryDate ? Math.floor(new Date(expiryDate).getTime() / 1000) : Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60,
        nfcTagId: nfcTagId || ''
    });

    res.status(201).json(new ApiResponse(201, result, "Batch recorded on blockchain"));
});

// Verify NFC tag on blockchain
export const verifyNfc = asyncHandler(async (req, res) => {
    await ensureInitialized();

    const { batchId, nfcTagId, location } = req.body;

    if (!batchId || !nfcTagId) {
        throw new ApiError(400, "Batch ID and NFC tag ID are required");
    }

    const authId = `AUTH-${uuidv4().slice(0, 8).toUpperCase()}`;
    const result = await blockchainService.authenticateNFC(
        authId,
        batchId,
        nfcTagId,
        location || 'Unknown'
    );

    res.status(200).json(new ApiResponse(200, result, "NFC verification completed"));
});

// Record quality metric on blockchain
export const recordQualityMetric = asyncHandler(async (req, res) => {
    await ensureInitialized();

    const { batchId, metricType, value, unit } = req.body;

    if (!batchId || !metricType || value === undefined) {
        throw new ApiError(400, "Batch ID, metric type, and value are required");
    }

    const metricId = `QM-${uuidv4().slice(0, 8).toUpperCase()}`;
    const result = await blockchainService.addQualityMetric(
        metricId,
        batchId,
        metricType,
        String(value),
        unit || ''
    );

    res.status(201).json(new ApiResponse(201, result, "Quality metric recorded on blockchain"));
});

// Update status on blockchain
export const updateStatus = asyncHandler(async (req, res) => {
    await ensureInitialized();

    const { batchId, status, location, notes } = req.body;

    if (!batchId || !status) {
        throw new ApiError(400, "Batch ID and status are required");
    }

    const result = await blockchainService.updateStatus(batchId, status, location, notes);

    res.status(200).json(new ApiResponse(200, result, "Status updated on blockchain"));
});

// Get transaction status
export const getTransactionStatus = asyncHandler(async (req, res) => {
    await ensureInitialized();

    const { hash } = req.params;

    if (!hash) {
        throw new ApiError(400, "Transaction hash is required");
    }

    const tx = await blockchainService.provider.getTransaction(hash);
    const receipt = await blockchainService.provider.getTransactionReceipt(hash);

    if (!tx) {
        throw new ApiError(404, "Transaction not found");
    }

    res.status(200).json(new ApiResponse(200, {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value?.toString(),
        blockNumber: receipt?.blockNumber,
        status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending',
        gasUsed: receipt?.gasUsed?.toString()
    }, "Transaction status retrieved"));
});

// Get batch from blockchain
export const getBatchFromChain = asyncHandler(async (req, res) => {
    await ensureInitialized();

    const { batchId } = req.params;

    if (!batchId) {
        throw new ApiError(400, "Batch ID is required");
    }

    try {
        const batch = await blockchainService.getBatch(batchId);
        res.status(200).json(new ApiResponse(200, batch, "Batch retrieved from blockchain"));
    } catch (error) {
        throw new ApiError(404, "Batch not found on blockchain");
    }
});

// Get blockchain connection status
export const getBlockchainStatus = asyncHandler(async (req, res) => {
    const isInit = await ensureInitialized();
    const isConnected = await blockchainService.isConnected();

    let walletAddress = null;
    let balance = null;
    let gasPrice = null;
    let totalBatches = 0;

    if (isConnected && blockchainService.signer) {
        try {
            walletAddress = await blockchainService.signer.getAddress();
            balance = await blockchainService.getBalance();
            gasPrice = await blockchainService.getGasPrice();
            totalBatches = await blockchainService.getTotalBatches();
        } catch (e) {
            console.error('Error getting status details:', e.message);
        }
    }

    res.status(200).json(new ApiResponse(200, {
        initialized: isInit,
        connected: isConnected,
        walletAddress,
        balance,
        gasPrice,
        totalBatches,
        contracts: {
            batchTracking: blockchainService.config.batchTrackingAddress || 'Not configured',
            supplyChainStatus: blockchainService.config.supplyChainAddress || 'Not configured'
        }
    }, "Blockchain status retrieved"));
});

// Get quality metrics for batch
export const getBatchQualityMetrics = asyncHandler(async (req, res) => {
    await ensureInitialized();

    const { batchId } = req.params;

    if (!batchId) {
        throw new ApiError(400, "Batch ID is required");
    }

    const metrics = await blockchainService.getBatchQualityMetrics(batchId);

    res.status(200).json(new ApiResponse(200, { metricIds: metrics }, "Quality metrics retrieved"));
});
