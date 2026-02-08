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
    headers: { 'Content-Type': 'application/json' },
});

export const traceApi = axios.create({
    baseURL: API_BASE_URLS.trace,
    headers: { 'Content-Type': 'application/json' },
});

export const blockchainApi = axios.create({
    baseURL: API_BASE_URLS.blockchain,
    headers: { 'Content-Type': 'application/json' },
});

// Add auth token interceptor
const addAuthInterceptor = (instance: typeof authApi) => {
    instance.interceptors.request.use((config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    });
};

addAuthInterceptor(traceApi);
addAuthInterceptor(blockchainApi);

// Auth API
export const auth = {
    login: async (email: string, password: string) => {
        const res = await authApi.post('/api/auth/login', { email, password });
        return res.data;
    },
    register: async (data: { name: string; email: string; password: string; role?: string }) => {
        const res = await authApi.post('/api/auth/register', data);
        return res.data;
    },
    refresh: async (refreshToken: string) => {
        const res = await authApi.post('/api/auth/refresh', { refreshToken });
        return res.data;
    },
    getProfile: async () => {
        const token = localStorage.getItem('accessToken');
        const res = await authApi.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
    logout: async () => {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        await authApi.post('/api/auth/logout', { refreshToken }, {
            headers: { Authorization: `Bearer ${token}` },
        });
    },
    getUsers: async () => {
        const token = localStorage.getItem('accessToken');
        const res = await authApi.get('/api/auth/users', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
    updateUserRole: async (userId: string, role: string) => {
        const token = localStorage.getItem('accessToken');
        const res = await authApi.put(`/api/auth/users/${userId}/role`, { role }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

// Batches API
export const batches = {
    getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
        const res = await traceApi.get('/api/batches', { params });
        return res.data;
    },
    getById: async (id: string) => {
        const res = await traceApi.get(`/api/batches/${id}`);
        return res.data;
    },
    create: async (data: CreateBatchData) => {
        const res = await traceApi.post('/api/batches', data);
        return res.data;
    },
    update: async (id: string, data: Partial<CreateBatchData>) => {
        const res = await traceApi.put(`/api/batches/${id}`, data);
        return res.data;
    },
    updateStatus: async (id: string, data: { status: string; location?: string; notes?: string; productName?: string }) => {
        const res = await traceApi.put(`/api/batches/${id}/status`, data);
        return res.data;
    },
    distribute: async (id: string, distributions: { location: string; quantity: number }[]) => {
        const res = await traceApi.post(`/api/batches/${id}/distribute`, { distributions });
        return res.data;
    },
    addQuality: async (id: string, data: QualityMetricData | FormData) => {
        if (data instanceof FormData) {
            const res = await traceApi.post(`/api/batches/${id}/quality`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } else {
            const res = await traceApi.post(`/api/batches/${id}/quality`, data);
            return res.data;
        }
    },
    addCertification: async (id: string, data: CertificationData) => {
        const res = await traceApi.post(`/api/batches/${id}/certifications`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await traceApi.delete(`/api/batches/${id}`);
        return res.data;
    },
    getTimeline: async (id: string) => {
        const res = await traceApi.get(`/api/batches/${id}/timeline`);
        return res.data;
    },
};

// Certifications API
export const certifications = {
    getAll: async () => {
        const res = await traceApi.get('/api/certifications');
        return res.data;
    },
    getActive: async () => {
        const res = await traceApi.get('/api/certifications/active');
        return res.data;
    },
    create: async (data: CertificationData | FormData) => {
        if (data instanceof FormData) {
            const res = await traceApi.post('/api/certifications', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        }
        const res = await traceApi.post('/api/certifications', data);
        return res.data;
    },
    update: async (id: string, data: Partial<CertificationData>) => {
        const res = await traceApi.put(`/api/certifications/${id}`, data);
        return res.data;
    },
    delete: async (id: string) => {
        const res = await traceApi.delete(`/api/certifications/${id}`);
        return res.data;
    },
};

// Analytics API
export const analytics = {
    getStats: async () => {
        const res = await traceApi.get('/api/analytics/stats');
        return res.data;
    }
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
    createdBy?: string;
    createdAt: string;
    updatedAt: string;
    qualityMetrics?: QualityMetric[];
    statusHistory?: StatusHistory[];
    certifications?: Certification[];
    isDistributed?: boolean;
    parentId?: string;
}

export interface Certification {
    _id: string;
    name: string;
    active: boolean;
    issuedDate?: string;
    expiryDate?: string;
    issuingBody?: string;
    certificateNumber?: string;
    documentUrl?: string;
    type: string;
    scope?: string;
    batchId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBatchData {
    productName: string;
    variety?: string;
    quantity: number;
    unit: string;
    origin: string;
    harvestDate?: string;
    expiryDate?: string;
    nfcTagId?: string;
}

export interface QualityMetricData {
    metricType: string;
    score: number;
    category?: string;
    status?: string;
    notes?: string;
    labName?: string;
    testMethod?: string;
    reportNumber?: string;
    reportUrl?: string;
    testDate?: string;
    // value and unit removed as they are legacy/unused now
}

export interface CertificationData {
    name: string;
    type?: string;
    issuingBody?: string;
    certificateNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
    documentUrl?: string;
    scope?: string;
    organizationId?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
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
}

export interface TimelineEvent {
    type: string;
    event: string;
    timestamp: string;
    location?: string;
    description: string;
}

export interface StatusHistory {
    _id?: string;
    batchId: string;
    status: string;
    location?: string;
    notes?: string;
    updatedBy?: string;
    createdAt?: string;
}
