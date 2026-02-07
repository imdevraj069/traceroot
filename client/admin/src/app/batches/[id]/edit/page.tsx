'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuthStore } from '@/store/auth-store';
import { EditBatchForm } from '@/components/EditBatchForm';
import { Loader2 } from 'lucide-react';

export default function EditBatchPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Batch</h1>
                    <EditBatchForm batchId={params.id as string} />
                </main>
            </div>
        </div>
    );
}
