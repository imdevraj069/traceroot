"use client"

import { useEffect, useState } from "react"
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { certifications } from "@/lib/api"
import { formatDate } from "@/lib/utils"

interface Certification {
    _id: string;
    name: string;
    issuingBody?: string;
    certificateNumber?: string;
    issuedDate?: string;
    expiryDate?: string;
}

export default function CertificationsPage() {
    const [certs, setCerts] = useState<Certification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCertifications();
    }, []);

    const fetchCertifications = async () => {
        try {
            const response = await certifications.getAll();
            setCerts(response.data?.certifications || []);
        } catch (error) {
            console.error("Failed to fetch certifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center justify-between space-y-2 mb-6">
                        <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => { }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Certification
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Certifications</CardTitle>
                    <CardDescription>
                        Manage certifications and compliance documents.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Issuing Body</TableHead>
                                <TableHead>Certificate No.</TableHead>
                                <TableHead>Issued Date</TableHead>
                                <TableHead>Expiry Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : certs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                        No certifications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                certs.map((cert) => (
                                    <TableRow key={cert._id}>
                                        <TableCell className="font-medium">{cert.name}</TableCell>
                                        <TableCell>{cert.issuingBody || "-"}</TableCell>
                                        <TableCell>{cert.certificateNumber || "-"}</TableCell>
                                        <TableCell>{cert.issuedDate ? formatDate(cert.issuedDate) : "-"}</TableCell>
                                        <TableCell>{cert.expiryDate ? formatDate(cert.expiryDate) : "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">Active</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
                </main>
            </div>
        </div>
    )
}
