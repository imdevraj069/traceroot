'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QrCode, Camera, Smartphone, ArrowRight, Info } from 'lucide-react';

export default function ScanPage() {
    const [isScanning, setIsScanning] = useState(false);

    return (
        <div className="min-h-[80vh] bg-gradient-to-br from-green-50 to-white py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-lg mx-auto text-center">
                    {/* Header */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-3xl mb-6">
                        <QrCode className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                        Scan QR Code
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Point your camera at the product QR code to verify authenticity
                    </p>

                    {/* Scanner Placeholder */}
                    <div className="relative bg-gray-900 rounded-2xl aspect-square mb-8 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            {isScanning ? (
                                <div className="text-center">
                                    <Camera className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                    <p className="text-white/70">Camera access required</p>
                                    <p className="text-white/50 text-sm mt-2">
                                        Allow camera permissions to scan
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Smartphone className="w-16 h-16 text-white/50 mx-auto mb-4" />
                                    <p className="text-white/70">Click to start scanning</p>
                                </div>
                            )}
                        </div>

                        {/* Scanner overlay */}
                        <div className="absolute inset-8 border-2 border-white/30 rounded-xl">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
                        </div>
                    </div>

                    {/* Start Scan Button */}
                    <button
                        onClick={() => setIsScanning(!isScanning)}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-700 transition-all mb-6"
                    >
                        <Camera className="w-5 h-5" />
                        {isScanning ? 'Stop Scanning' : 'Start Scanner'}
                    </button>

                    {/* Alternative */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-blue-800">Camera not working?</p>
                                <p className="text-sm text-blue-600 mt-1">
                                    You can manually enter the batch ID instead
                                </p>
                                <Link
                                    href="/verify"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 mt-2"
                                >
                                    Enter Batch ID
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 text-left">
                        <h3 className="font-semibold text-gray-900 mb-3">How to scan</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                                Allow camera access when prompted
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                                Position the QR code within the frame
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                                Hold steady for automatic scan
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
