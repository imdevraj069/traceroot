import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as blockchainService from '../services/blockchain.service.js';

export const recordBatch = asyncHandler(async (req, res) => {
    const { batchId, productName, variety, quantity, unit, location, harvestDate, expiryDate, nfcTagId } = req.body;

    if (!batchId || !productName) {
        throw new ApiError(400, "Batch ID and product name are required");
    }

    const result = await blockchainService.recordBatchOnChain({
        batchId,
        productName,
        variety,
        quantity,
        unit,
        location,
        harvestDate,
        expiryDate,
        nfcTagId
    });

    res.status(201).json(new ApiResponse(201, result, "Batch recorded on blockchain"));
});

export const verifyNfc = asyncHandler(async (req, res) => {
    const { batchId, nfcTagId, location } = req.body;

    if (!batchId || !nfcTagId) {
        throw new ApiError(400, "Batch ID and NFC tag ID are required");
    }

    const result = await blockchainService.verifyNfcOnChain({ batchId, nfcTagId, location });

    res.status(200).json(new ApiResponse(200, result, "NFC verification completed"));
});

export const recordQualityMetric = asyncHandler(async (req, res) => {
    const { batchId, metricType, value, unit } = req.body;

    if (!batchId || !metricType || !value) {
        throw new ApiError(400, "Batch ID, metric type, and value are required");
    }

    const result = await blockchainService.recordQualityOnChain({ batchId, metricType, value, unit });

    res.status(201).json(new ApiResponse(201, result, "Quality metric recorded on blockchain"));
});

export const getTransactionStatus = asyncHandler(async (req, res) => {
    const { hash } = req.params;

    const status = await blockchainService.getTransactionStatus(hash);

    res.status(200).json(new ApiResponse(200, status, "Transaction status retrieved"));
});

export const getBatchFromChain = asyncHandler(async (req, res) => {
    const { batchId } = req.params;

    const batch = await blockchainService.getBatchFromChain(batchId);

    res.status(200).json(new ApiResponse(200, batch, "Batch retrieved from blockchain"));
});

export const getBlockchainStatus = asyncHandler(async (req, res) => {
    const status = await blockchainService.getBlockchainStatus();

    res.status(200).json(new ApiResponse(200, status, "Blockchain status retrieved"));
});
