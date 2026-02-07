'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { BatchTable } from '@/components/BatchTable';
import { useAuthStore } from '@/store/auth-store';
import { Loader2, Plus, Filter, Download } from 'lucide-react';
import { batches, Batch } from '@/lib/api';
import { CreateBatchDialog } from '@/components/CreateBatchDialog';

export default function BatchesPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
    const [data, setData] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    // Only admin and supplier can create batches
    const canCreateBatch = user?.role === 'admin' || user?.role === 'supplier';

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const result = await batches.getAll({ status: filter || undefined });
            setData(result.data?.batches || []);
        } catch (error) {
            console.error('Failed to fetch batches:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBatches();
        }
    }, [isAuthenticated, filter]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
                            <p className="text-gray-500">Manage supply chain batches</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => { }} // TODO: Export CSV
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>
                            {canCreateBatch && <CreateBatchDialog onSuccess={fetchBatches} />}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {/* Filters */}
                        <div className="p-4 border-b bg-gray-50 flex gap-4">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="pl-9 pr-8 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Created">Created</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Quality Check">Quality Check</option>
                                    <option value="In Transit">In Transit</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                            </div>
                        ) : (
                            <BatchTable data={data} onRefresh={fetchBatches} />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
