import axios from 'axios';

// API Base URLs
export const API_BASE_URLS = {
    auth: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001',
    trace: process.env.NEXT_PUBLIC_TRACE_URL || 'http://localhost:8002',
    blockchain: process.env.NEXT_PUBLIC_BLOCKCHAIN_URL || 'http://localhost:8003',
};

// Create Axios instances
export const authApi = axios.create({
    baseURL: API_BASE_URLS.auth,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const traceApi = axios.create({
    baseURL: API_BASE_URLS.trace,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const blockchainApi = axios.create({
    baseURL: API_BASE_URLS.blockchain,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Public API calls (no auth required)
export const publicApi = {
    // Verify batch by batchId
    verifyBatch: async (batchId: string) => {
        const response = await traceApi.get(`/api/public/batch/${batchId}`);
        return response.data;
    },

    // Verify NFC tag
    verifyNfc: async (nfcTagId: string) => {
        const response = await traceApi.get(`/api/public/verify/${nfcTagId}`);
        return response.data;
    },

    // Get active certifications
    getCertifications: async () => {
        const response = await traceApi.get('/api/certifications/active');
        return response.data;
    },
};

// Types
export interface Batch {
    _id: string;
    batchId: string;
    batchNumber: string;
    productName: string;
    variety?: string;
    quantity: number;
    unit: string;
    origin: string;
    status: string;
    quality?: string;
    currentLocation?: string;
    nfcTagId?: string;
    harvestDate?: string;
    expiryDate?: string;
    createdAt: string;
}

export interface QualityMetric {
    _id: string;
    batchId: string;
    category: string;
    score: number;
    status: string;
    labName?: string;
    testMethod?: string;
    reportNumber?: string;
    certificateUrl?: string;
    metricType?: string;
}

export interface Certification {
    _id: string;
    name: string;
    active: boolean;
    issuingBody?: string;
    expiryDate?: string;
    documentUrl?: string;
    certificateNumber?: string;
    issuedDate?: string;
}

export interface TimelineEvent {
    type: string;
    event: string;
    timestamp: string;
    location?: string;
    description: string;
}

export interface VerificationResult {
    batch: Batch;
    qualityMetrics: QualityMetric[];
    certifications?: Certification[];
    timeline: TimelineEvent[];
    progress: number;
    verified: boolean;
}
