import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import * as batchService from '../services/batch.service.js';

export const getPublicBatch = asyncHandler(async (req, res) => {
    const { batchId } = req.params;

    const batch = await batchService.getPublicBatchInfo(batchId);

    res.status(200).json(new ApiResponse(200, batch, "Batch verified successfully"));
});

export const verifyNfcTag = asyncHandler(async (req, res) => {
    const { nfcTagId } = req.params;

    const result = await batchService.verifyNfcTag(nfcTagId);

    res.status(200).json(new ApiResponse(200, result, "NFC tag verified"));
});
