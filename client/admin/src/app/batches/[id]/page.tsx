'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuthStore } from '@/store/auth-store';
import { batches, Batch, QualityMetric } from '@/lib/api';
import {
    ArrowLeft,
    Loader2,
    MapPin,
    Calendar,
    Package,
    Shield,
    FileText,
    MoreVertical,
    Flag,
    Navigation
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate, formatDateTime } from '@/lib/utils';
import { TimelineEvent } from '@/lib/api';
import { QualityMetricsForm } from '@/components/QualityMetricsForm';
import { CertificationForm } from '@/components/CertificationForm';
import { QrCodeDialog } from '@/components/QrCodeDialog';
import { BatchStatusUpdate } from '@/components/BatchStatusUpdate';

export default function BatchDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { isAuthenticated, isLoading, checkAuth, user } = useAuthStore();
    const [batch, setBatch] = useState<Batch | null>(null);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQualityForm, setShowQualityForm] = useState(false);
    const [showCertForm, setShowCertForm] = useState(false);
    const [showQrDialog, setShowQrDialog] = useState(false);

    // Role-based permissions
    const userRole = user?.role || "";
    const canAddQuality = userRole === 'admin' || userRole === 'manufacturer';
    const canAddCertification = userRole === 'admin';
    const canUpdateStatus = userRole === 'admin' || userRole === 'distributor' || userRole === 'retailer';

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const fetchBatchData = async () => {
        if (isAuthenticated && params.id) {
            try {
                const [batchData, timelineData] = await Promise.all([
                    batches.getById(params.id as string),
                    batches.getTimeline(params.id as string),
                ]);
                setBatch(batchData.data);
                setTimeline(timelineData.data || []);
            } catch (error) {
                console.error('Failed to fetch batch data:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchBatchData();
    }, [isAuthenticated, params.id]);

    if (isLoading || loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (!batch) return <div>Batch not found</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                Batch {batch.batchNumber}
                                <Badge variant="outline" className="ml-2 font-normal">
                                    {batch.status}
                                </Badge>
                            </h1>
                            <p className="text-gray-500">Created on {formatDate(batch.createdAt)}</p>
                        </div>
                        <div className="ml-auto flex gap-2">
                            {canAddQuality && (
                                <Button variant="outline" onClick={() => setShowQualityForm(true)}>
                                    Add Quality Metric
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">More Actions</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => router.push(`/batches/${batch._id}/edit`)}>Edit Batch</DropdownMenuItem>
                                    {canAddCertification && (
                                        <DropdownMenuItem onClick={() => setShowCertForm(true)}>Add Certification</DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => setShowQrDialog(true)}>Add Quality Report</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { }}>Generate QR Code</DropdownMenuItem>
                                    {userRole === 'admin' && (
                                        <DropdownMenuItem className="text-red-600">Delete Batch</DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="quality">Quality Checks</TabsTrigger>
                            <TabsTrigger value="documents">Documents</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Product Details</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Name</span>
                                                <span className="text-sm font-medium">{batch.productName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Variety</span>
                                                <span className="text-sm font-medium">{batch.variety}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Quantity</span>
                                                <span className="text-sm font-medium">{batch.quantity} {batch.unit}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Logistics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500 align-middle"><MapPin className="w-3 h-3 inline mr-1" /> Origin</span>
                                                <span className="text-sm font-medium">{batch.origin}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500 align-middle"><Navigation className="w-3 h-3 inline mr-1" /> Current Location</span>
                                                <span className="text-sm font-medium">{batch.currentLocation || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500 align-middle"><Calendar className="w-3 h-3 inline mr-1" /> Harvest Date</span>
                                                <span className="text-sm font-medium">{batch.harvestDate ? formatDate(batch.harvestDate) : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium">Identifiers</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Internal ID</span>
                                                <span className="text-sm font-mono">{batch._id.substring(0, 8)}...</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">Public ID</span>
                                                <span className="text-sm font-mono">{batch.batchId}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-500">NFC Tag</span>
                                                <span className="text-sm font-mono">{batch.nfcTagId || 'Not Assigned'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-6">
                                {canUpdateStatus && (
                                    <BatchStatusUpdate 
                                        batchId={params.id as string} 
                                        currentStatus={batch.status}
                                        onSuccess={fetchBatchData}
                                    />
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="timeline">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Supply Chain Journey</CardTitle>
                                    <CardDescription>Track every step of this batch from origin to destination</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                        {timeline.map((event, index) => (
                                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-green-500 text-slate-500 group-[.is-active]:text-green-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                    <Flag className="w-5 h-5" />
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                                        <div className="font-bold text-slate-900">{event.event}</div>
                                                        <time className="font-caveat font-medium text-indigo-500">{formatDateTime(event.timestamp)}</time>
                                                    </div>
                                                    <div className="text-slate-500 text-sm">{event.description}</div>
                                                    {event.location && (
                                                        <div className="mt-2 text-xs text-slate-400 flex items-center">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {event.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="quality">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quality Reports</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {batch.qualityMetrics && batch.qualityMetrics.length > 0 ? (
                                        <div className="space-y-4">
                                            {batch.qualityMetrics.map((metric: QualityMetric) => (
                                                <div key={metric._id} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-semibold">{metric.category}</h4>
                                                            <p className="text-sm text-gray-500">Score: {metric.score}/100</p>
                                                            {metric.labName && <p className="text-sm text-gray-500">Lab: {metric.labName}</p>}
                                                        </div>
                                                        <Badge variant={metric.status === 'Passed' ? 'default' : metric.status === 'Failed' ? 'destructive' : 'secondary'}>
                                                            {metric.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">
                                            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p>No quality reports available for this batch yet.</p>
                                            <Button variant="outline" className="mt-4" onClick={() => setShowQualityForm(true)}>Add Report</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="documents">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Documents</CardTitle>
                                    <CardDescription>Certifications and compliance documents</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-10 text-gray-500">
                                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                        <p>No documents available for this batch yet.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Dialogs */}
                    {batch && (
                        <>
                            <QualityMetricsForm
                                batchId={batch._id}
                                isOpen={showQualityForm}
                                onClose={() => setShowQualityForm(false)}
                                onSuccess={fetchBatchData}
                            />
                            <CertificationForm
                                batchId={batch._id}
                                isOpen={showCertForm}
                                onClose={() => setShowCertForm(false)}
                                onSuccess={fetchBatchData}
                            />
                            <QrCodeDialog
                                isOpen={showQrDialog}
                                onClose={() => setShowQrDialog(false)}
                                batchId={batch.batchId}
                                productName={batch.productName}
                            />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
