'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, QrCode, ArrowRight } from 'lucide-react';

export default function VerifyPage() {
    const [batchId, setBatchId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (batchId.trim()) {
            setIsLoading(true);
            router.push(`/verify/${encodeURIComponent(batchId.trim())}`);
        }
    };

    return (
        <div className="min-h-[80vh] bg-gradient-to-br from-green-50 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
                            <Search className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            Verify Your Product
                        </h1>
                        <p className="text-gray-600">
                            Enter the batch ID to view complete product information and supply chain journey
                        </p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                                placeholder="Enter Batch ID (e.g., BATCH-1234567890-ABCD)"
                                className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-xl text-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        <button
                            type="submit"
                            disabled={!batchId.trim() || isLoading}
                            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    Verify Product
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info Card */}
                    <div className="mt-10 p-6 bg-white border rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3">Where to find the Batch ID?</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                Check the product packaging for a printed label
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                Scan the QR code to get redirected automatically
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                                Format: BATCH-XXXXXXXXXX-XXXX
                            </li>
                        </ul>
                    </div>

                    {/* Alternative */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-500 mb-3">Or scan the product QR code</p>
                        <a
                            href="/scan"
                            className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
                        >
                            <QrCode className="w-5 h-5" />
                            Open QR Scanner
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
