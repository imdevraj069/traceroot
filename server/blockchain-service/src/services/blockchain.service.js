import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load contract ABIs
const loadABI = (contractName) => {
    const abiPath = path.join(__dirname, '..', 'contracts', `${contractName}.json`);
    if (fs.existsSync(abiPath)) {
        return JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    }
    // Fallback to repo contracts if not yet deployed
    const fallbackPath = path.join(__dirname, '..', '..', '..', 'repo', 'src', 'contracts', `${contractName}.json`);
    if (fs.existsSync(fallbackPath)) {
        return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
    return null;
};

class BlockchainService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.batchTrackingContract = null;
        this.supplyChainContract = null;
        this.config = {
            rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545',
            batchTrackingAddress: process.env.BATCH_TRACKING_ADDRESS || '',
            supplyChainAddress: process.env.SUPPLY_CHAIN_ADDRESS || '',
            chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '1337'),
            privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || ''
        };
    }

    async initialize() {
        try {
            console.log('🔗 Initializing blockchain service...');

            // Initialize provider
            this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);

            // Check connection
            const network = await this.provider.getNetwork();
            console.log(`📡 Connected to network: ${network.name} (chainId: ${network.chainId})`);

            // Initialize signer
            if (this.config.privateKey) {
                this.signer = new ethers.Wallet(this.config.privateKey, this.provider);
                console.log(`👛 Wallet address: ${this.signer.address}`);
            } else {
                // Use first account from provider (for development)
                const accounts = await this.provider.listAccounts();
                if (accounts.length > 0) {
                    this.signer = await this.provider.getSigner(0);
                    console.log(`👛 Using provider account: ${await this.signer.getAddress()}`);
                }
            }

            // Load BatchTracking contract
            if (this.config.batchTrackingAddress) {
                const batchABI = loadABI('BatchTracking');
                if (batchABI) {
                    this.batchTrackingContract = new ethers.Contract(
                        this.config.batchTrackingAddress,
                        batchABI.abi,
                        this.signer
                    );
                    console.log(`📄 BatchTracking contract: ${this.config.batchTrackingAddress}`);
                }
            }

            // Load SupplyChainStatus contract
            if (this.config.supplyChainAddress) {
                const statusABI = loadABI('SupplyChainStatus');
                if (statusABI) {
                    this.supplyChainContract = new ethers.Contract(
                        this.config.supplyChainAddress,
                        statusABI.abi,
                        this.signer
                    );
                    console.log(`📄 SupplyChainStatus contract: ${this.config.supplyChainAddress}`);
                }
            }

            console.log('✅ Blockchain service initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize blockchain:', error.message);
            return false;
        }
    }

    async isConnected() {
        try {
            if (!this.provider) return false;
            await this.provider.getBlockNumber();
            return true;
        } catch {
            return false;
        }
    }

    async getBalance(address) {
        if (!this.provider) throw new Error('Not initialized');
        const balance = await this.provider.getBalance(address || await this.signer.getAddress());
        return ethers.formatEther(balance);
    }

    // ============== Batch Functions ==============

    async createBatch(batchData) {
        if (!this.batchTrackingContract) throw new Error('BatchTracking contract not loaded');

        const {
            batchId,
            productName,
            variety,
            quantity,
            unit,
            location,
            harvestDate,
            expiryDate,
            nfcTagId
        } = batchData;

        console.log(`📦 Creating batch on blockchain: ${batchId}`);

        const tx = await this.batchTrackingContract.createBatch(
            batchId,
            productName,
            variety || '',
            BigInt(quantity),
            unit || 'kg',
            location,
            BigInt(harvestDate),
            BigInt(expiryDate),
            nfcTagId || '',
            { gasLimit: 3000000 }
        );

        console.log(`📤 Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Batch created in block: ${receipt.blockNumber}`);

        return {
            txHash: tx.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString()
        };
    }

    async getBatch(batchId) {
        if (!this.batchTrackingContract) throw new Error('BatchTracking contract not loaded');

        const result = await this.batchTrackingContract.getBatch(batchId);

        return {
            productName: result[0],
            variety: result[1],
            quantity: Number(result[2]),
            unit: result[3],
            location: result[4],
            harvestDate: new Date(Number(result[5]) * 1000),
            expiryDate: new Date(Number(result[6]) * 1000),
            nfcTagId: result[7],
            creator: result[8],
            timestamp: new Date(Number(result[9]) * 1000)
        };
    }

    async getTotalBatches() {
        if (!this.batchTrackingContract) return 0;
        const total = await this.batchTrackingContract.getTotalBatches();
        return Number(total);
    }

    // ============== Quality Metric Functions ==============

    async addQualityMetric(metricId, batchId, metricType, value, unit) {
        if (!this.batchTrackingContract) throw new Error('BatchTracking contract not loaded');

        const tx = await this.batchTrackingContract.addQualityMetric(
            metricId,
            batchId,
            metricType,
            value,
            unit,
            { gasLimit: 2000000 }
        );

        console.log(`📊 Quality metric added: ${tx.hash}`);
        const receipt = await tx.wait();

        return {
            txHash: tx.hash,
            blockNumber: receipt.blockNumber
        };
    }

    async getBatchQualityMetrics(batchId) {
        if (!this.batchTrackingContract) return [];
        return await this.batchTrackingContract.getBatchQualityMetrics(batchId);
    }

    // ============== NFC Authentication Functions ==============

    async authenticateNFC(authId, batchId, nfcTagId, location) {
        if (!this.batchTrackingContract) throw new Error('BatchTracking contract not loaded');

        console.log(`🔐 Authenticating NFC: ${nfcTagId} for batch ${batchId}`);

        const tx = await this.batchTrackingContract.authenticateNFC(
            authId,
            batchId,
            nfcTagId,
            location,
            { gasLimit: 2000000 }
        );

        const receipt = await tx.wait();

        // Get authentication result
        const authDetails = await this.batchTrackingContract.getAuthenticationDetails(authId);

        return {
            txHash: tx.hash,
            blockNumber: receipt.blockNumber,
            isValid: authDetails.isValid
        };
    }

    // ============== Status Functions ==============

    async updateStatus(batchId, status, location, notes) {
        if (!this.supplyChainContract) throw new Error('SupplyChainStatus contract not loaded');

        const statusMap = {
            'Created': 0,
            'Harvested': 1,
            'Processing': 2,
            'Quality Check': 3,
            'Packaged': 4,
            'In Transit': 5,
            'In Distribution': 6,
            'Delivered': 7,
            'Completed': 8,
            'Cancelled': 9
        };

        const statusCode = statusMap[status] ?? 0;

        const tx = await this.supplyChainContract.updateStatus(
            batchId,
            statusCode,
            location || '',
            notes || '',
            { gasLimit: 500000 }
        );

        const receipt = await tx.wait();

        return {
            txHash: tx.hash,
            blockNumber: receipt.blockNumber
        };
    }

    // ============== Utility Functions ==============

    async getGasPrice() {
        if (!this.provider) return null;
        const feeData = await this.provider.getFeeData();
        return {
            gasPrice: ethers.formatUnits(feeData.gasPrice || 0n, 'gwei'),
            maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null
        };
    }

    async estimateGas(method, ...args) {
        if (!this.batchTrackingContract) return null;
        try {
            const gas = await this.batchTrackingContract[method].estimateGas(...args);
            return gas.toString();
        } catch (error) {
            console.error('Gas estimation failed:', error.message);
            return null;
        }
    }
}

// Singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;
