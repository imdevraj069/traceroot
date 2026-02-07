import { ethers } from 'ethers';
import Transaction from '../models/transaction.model.js';
import ApiError from '../utils/ApiError.js';

// Environment variables
const RPC_URL = process.env.ETHEREUM_RPC_URL || 'http://localhost:8545';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Contract ABI (simplified - load from file in production)
const CONTRACT_ABI = [
    "function createBatch(string batchId, string productName, string variety, uint256 quantity, string unit, string location, uint256 harvestDate, uint256 expiryDate, string nfcTagId) public",
    "function authenticateNFC(string authId, string batchId, string nfcTagId, string location) public returns (bool)",
    "function addQualityMetric(string metricId, string batchId, string metricType, string value, string unit) public",
    "function getBatch(string batchId) public view returns (string, string, string, uint256, string, string, uint256, uint256, string, address, uint256, bool)",
    "function getAllBatchIds() public view returns (string[] memory)",
    "event BatchCreated(string indexed batchId, string productName, address indexed creator, uint256 timestamp)",
    "event NFCAuthenticated(string indexed authId, string indexed batchId, string nfcTagId, bool isValid, uint256 timestamp)",
    "event QualityMetricAdded(string indexed metricId, string indexed batchId, string metricType, address indexed inspector, uint256 timestamp)"
];

// Initialize provider and wallet
let provider;
let wallet;
let contract;

const initializeBlockchain = () => {
    try {
        provider = new ethers.JsonRpcProvider(RPC_URL);

        if (PRIVATE_KEY) {
            wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        }

        if (CONTRACT_ADDRESS && wallet) {
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
        }

        return true;
    } catch (error) {
        console.error('Failed to initialize blockchain:', error);
        return false;
    }
};

// Initialize on module load
initializeBlockchain();

export const recordBatchOnChain = async (data) => {
    if (!contract) {
        throw new ApiError(503, "Blockchain not configured");
    }

    try {
        const tx = await contract.createBatch(
            data.batchId,
            data.productName,
            data.variety || '',
            data.quantity || 0,
            data.unit || 'kg',
            data.location || '',
            data.harvestDate ? Math.floor(new Date(data.harvestDate).getTime() / 1000) : 0,
            data.expiryDate ? Math.floor(new Date(data.expiryDate).getTime() / 1000) : 0,
            data.nfcTagId || ''
        );

        // Wait for transaction confirmation
        const receipt = await tx.wait();

        // Store transaction record
        await Transaction.create({
            txHash: receipt.hash,
            type: 'batch_creation',
            batchId: data.batchId,
            status: 'confirmed',
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        });

        return {
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString(),
            confirmed: true
        };
    } catch (error) {
        console.error('Blockchain error:', error);
        throw new ApiError(500, `Blockchain transaction failed: ${error.message}`);
    }
};

export const verifyNfcOnChain = async ({ batchId, nfcTagId, location }) => {
    if (!contract) {
        throw new ApiError(503, "Blockchain not configured");
    }

    try {
        const authId = `AUTH-${Date.now()}`;
        const tx = await contract.authenticateNFC(authId, batchId, nfcTagId, location || '');
        const receipt = await tx.wait();

        await Transaction.create({
            txHash: receipt.hash,
            type: 'nfc_verification',
            batchId,
            status: 'confirmed',
            blockNumber: receipt.blockNumber
        });

        return {
            txHash: receipt.hash,
            authId,
            verified: true
        };
    } catch (error) {
        throw new ApiError(500, `NFC verification failed: ${error.message}`);
    }
};

export const recordQualityOnChain = async ({ batchId, metricType, value, unit }) => {
    if (!contract) {
        throw new ApiError(503, "Blockchain not configured");
    }

    try {
        const metricId = `METRIC-${Date.now()}`;
        const tx = await contract.addQualityMetric(metricId, batchId, metricType, value, unit || '');
        const receipt = await tx.wait();

        await Transaction.create({
            txHash: receipt.hash,
            type: 'quality_metric',
            batchId,
            status: 'confirmed',
            blockNumber: receipt.blockNumber
        });

        return {
            txHash: receipt.hash,
            metricId,
            recorded: true
        };
    } catch (error) {
        throw new ApiError(500, `Quality metric recording failed: ${error.message}`);
    }
};

export const getTransactionStatus = async (txHash) => {
    if (!provider) {
        throw new ApiError(503, "Blockchain not configured");
    }

    try {
        const receipt = await provider.getTransactionReceipt(txHash);

        if (!receipt) {
            return { status: 'pending', confirmed: false };
        }

        return {
            status: receipt.status === 1 ? 'confirmed' : 'failed',
            confirmed: receipt.status === 1,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        };
    } catch (error) {
        throw new ApiError(500, `Failed to get transaction status: ${error.message}`);
    }
};

export const getBatchFromChain = async (batchId) => {
    if (!contract) {
        throw new ApiError(503, "Blockchain not configured");
    }

    try {
        const result = await contract.getBatch(batchId);

        return {
            batchId: result[0],
            productName: result[1],
            variety: result[2],
            quantity: result[3].toString(),
            unit: result[4],
            location: result[5],
            harvestDate: new Date(Number(result[6]) * 1000),
            expiryDate: new Date(Number(result[7]) * 1000),
            nfcTagId: result[8],
            creator: result[9],
            timestamp: new Date(Number(result[10]) * 1000),
            exists: result[11]
        };
    } catch (error) {
        throw new ApiError(500, `Failed to get batch from blockchain: ${error.message}`);
    }
};

export const getBlockchainStatus = async () => {
    try {
        const isInitialized = initializeBlockchain();

        if (!provider) {
            return { connected: false, message: "Provider not configured" };
        }

        const network = await provider.getNetwork();
        const blockNumber = await provider.getBlockNumber();

        return {
            connected: true,
            network: network.name,
            chainId: network.chainId.toString(),
            blockNumber,
            contractConfigured: !!contract
        };
    } catch (error) {
        return {
            connected: false,
            message: error.message
        };
    }
};
