'use client';

import { Batch, QualityMetric, Certification, API_BASE_URLS } from '@/lib/api';
import {
    Package,
    MapPin,
    Calendar,
    Hash,
    Tag,
    Scale,
    Leaf,
    Shield,
    CheckCircle,
    AlertCircle,
    FileText,
    Award
} from 'lucide-react';

interface Props {
    batch: Batch;
    qualityMetrics: QualityMetric[];
    certifications?: Certification[];
    progress: number;
    verified: boolean;
}

const qualityColors: Record<string, string> = {
    'Premium': 'bg-green-100 text-green-700',
    'Standard': 'bg-blue-100 text-blue-700',
    'Economy': 'bg-gray-100 text-gray-700',
};

export function BatchVerification({ batch, qualityMetrics, certifications, progress, verified }: Props) {
    return (
        <div className="space-y-6">
            {/* Verification Badge */}
            <div className={`p-4 rounded-lg flex items-center gap-3 ${verified ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                {verified ? (
                    <>
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-semibold text-green-800">Verified Authentic</p>
                            <p className="text-sm text-green-600">This product has been verified on the blockchain</p>
                        </div>
                    </>
                ) : (
                    <>
                        <AlertCircle className="w-6 h-6 text-yellow-600" />
                        <div>
                            <p className="font-semibold text-yellow-800">Verification Pending</p>
                            <p className="text-sm text-yellow-600">Unable to verify blockchain record</p>
                        </div>
                    </>
                )}
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Supply Chain Progress</span>
                    <span className="text-sm font-bold text-green-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Product Info */}
            <div className="bg-white border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{batch.productName}</h2>
                        {batch.variety && (
                            <p className="text-gray-500">{batch.variety}</p>
                        )}
                    </div>
                    {batch.quality && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${qualityColors[batch.quality] || qualityColors['Standard']}`}>
                            {batch.quality}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InfoItem icon={Hash} label="Batch ID" value={batch.batchId} />
                    <InfoItem icon={Tag} label="Batch Number" value={batch.batchNumber} />
                    <InfoItem icon={Scale} label="Quantity" value={`${batch.quantity} ${batch.unit}`} />
                    <InfoItem icon={MapPin} label="Origin" value={batch.origin} />
                    <InfoItem icon={Leaf} label="Status" value={batch.status} />
                    <InfoItem icon={MapPin} label="Current Location" value={batch.currentLocation || 'N/A'} />
                    {batch.harvestDate && (
                        <InfoItem icon={Calendar} label="Harvest Date" value={new Date(batch.harvestDate).toLocaleDateString()} />
                    )}
                    {batch.expiryDate && (
                        <InfoItem icon={Calendar} label="Expiry Date" value={new Date(batch.expiryDate).toLocaleDateString()} />
                    )}
                </div>
            </div>

            {/* Quality Metrics */}
            {qualityMetrics.length > 0 && (
                <div className="bg-white border rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        Quality Metrics
                    </h3>
                    <div className="space-y-3">
                        {qualityMetrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{metric.category}</p>
                                    {metric.labName && (
                                        <p className="text-xs text-gray-500">Lab: {metric.labName}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-lg text-green-600">{metric.score}%</span>
                                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${metric.status === 'Pass' ? 'bg-green-100 text-green-700' :
                                            metric.status === 'Fail' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {metric.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Documents & Certifications */}
            {((certifications && certifications.length > 0) || (qualityMetrics.some(m => m.certificateUrl))) && (
                <div className="bg-white border rounded-xl p-6">
                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Documents & Certifications
                    </h3>
                    <div className="space-y-3">
                        {certifications?.map((cert, index) => (
                            <div key={`cert-${index}`} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <Award className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">{cert.name}</p>
                                        <p className="text-xs text-gray-500">{cert.issuingBody || 'Certified'}</p>
                                    </div>
                                </div>
                                {cert.documentUrl && (
                                    <a 
                                        href={`${API_BASE_URLS.trace}${cert.documentUrl}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                                    >
                                        View
                                    </a>
                                )}
                            </div>
                        ))}
                        
                        {qualityMetrics.filter(m => m.certificateUrl).map((metric, index) => (
                            <div key={`qm-doc-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-gray-600 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">{metric.metricType || metric.category} Report</p>
                                        <p className="text-xs text-gray-500">Quality Check</p>
                                    </div>
                                </div>
                                <a 
                                    href={`${API_BASE_URLS.trace}${metric.certificateUrl}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                                >
                                    View
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof Package; label: string; value: string }) {
    return (
        <div className="flex items-start gap-2">
            <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900">{value}</p>
            </div>
        </div>
    );
}
