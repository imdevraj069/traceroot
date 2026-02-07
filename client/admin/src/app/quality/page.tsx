"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { batches, Batch } from "@/lib/api"

// Extended interface to include batch context
interface QualityReport {
    _id: string; // Batch ID
    batchNumber: string;
    productName: string;
    metricType: string;
    value: number;
    category: string;
    status: string;
    labName?: string;
    testDate?: string;
}

export default function QualityPage() {
    const [reports, setReports] = useState<QualityReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQualityReports();
    }, []);

    const fetchQualityReports = async () => {
        try {
            // Since we don't have a dedicated "getAllQualityMetrics" endpoint,
            // we'll fetch batches and extract the current quality status/metrics.
            // In a real app, this should be a dedicated endpoint for performance.
            const batchData = await batches.getAll();

            // Transform batches into a flat list of quality reports
            // Assuming 'quality' field in batch is the overall status, 
            // but if we want detailed metrics we'd need to fetch detail for each batch or have it in list.
            // For this overview, we'll use the batch's main quality status.

            const reportsData: QualityReport[] = batchData.map((batch: Batch) => ({
                _id: batch._id,
                batchNumber: batch.batchNumber,
                productName: batch.productName,
                metricType: "Batch Quality",
                value: 0, // Placeholder as list might not have score
                category: "General",
                status: batch.quality || "Pending",
                labName: "-", // Not in list view
                testDate: batch.updatedAt
            }));

            setReports(reportsData);
        } catch (error) {
            console.error("Failed to fetch quality reports:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Quality Control</h2>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Batch No.</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Lab Name</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : reports.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No quality reports found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            reports.map((report) => (
                                <TableRow key={report._id}>
                                    <TableCell className="font-medium">{report.batchNumber}</TableCell>
                                    <TableCell>{report.productName}</TableCell>
                                    <TableCell>{report.category}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            report.status === 'Passed' ? 'default' :
                                                report.status === 'Failed' ? 'destructive' : 'secondary'
                                        }>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{report.labName}</TableCell>
                                    <TableCell>{new Date(report.testDate!).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
