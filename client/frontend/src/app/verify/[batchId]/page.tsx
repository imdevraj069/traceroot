'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { publicApi, VerificationResult } from '@/lib/api';
import { BatchVerification } from '@/components/BatchVerification';
import { SupplyChainTimeline } from '@/components/SupplyChainTimeline';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

export default function BatchDetailPage() {
    const params = useParams();
    const batchId = params.batchId as string;

    const [data, setData] = useState<VerificationResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBatch = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await publicApi.verifyBatch(decodeURIComponent(batchId));
                setData(result.data);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message :
                    (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Batch not found';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (batchId) {
            fetchBatch();
        }
    }, [batchId]);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Verifying product...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        {error || "We couldn't find a product with this batch ID. Please check the ID and try again."}
                    </p>
                    <Link
                        href="/verify"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Try Another Search
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <Link
                    href="/verify"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Search
                </Link>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Product Info */}
                    <div>
                        <BatchVerification
                            batch={data.batch}
                            qualityMetrics={data.qualityMetrics}
                            progress={data.progress}
                            verified={data.verified}
                        />
                    </div>

                    {/* Right: Timeline */}
                    <div className="bg-white border rounded-xl p-6">
                        <SupplyChainTimeline
                            timeline={data.timeline}
                            currentStatus={data.batch.status}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
