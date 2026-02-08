'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash2, MapPin, Share2 } from 'lucide-react';
import { Batch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { batches } from '@/lib/api';
import { DistributeBatchDialog } from './DistributeBatchDialog';

interface BatchTableProps {
    data: Batch[];
    onRefresh: () => void;
}

const statusColors: Record<string, string> = {
    'Created': 'bg-green-100 text-green-700 hover:bg-green-100',
    'Processing': 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    'Quality Check': 'bg-purple-100 text-purple-700 hover:bg-purple-100',
    'In Transit': 'bg-orange-100 text-orange-700 hover:bg-orange-100',
    'Delivered': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
    'Completed': 'bg-gray-100 text-gray-700 hover:bg-gray-100',
};

export function BatchTable({ data, onRefresh }: BatchTableProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [distributeBatch, setDistributeBatch] = useState<Batch | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this batch?')) {
            try {
                await batches.delete(id);
                onRefresh();
            } catch (error) {
                console.error('Failed to delete batch', error);
            }
        }
    };

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No batches found. Create one to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((batch) => (
                            <TableRow key={batch._id}>
                                <TableCell className="font-medium">{batch.batchId}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{batch.productName}</span>
                                        <span className="text-xs text-gray-500">{batch.variety}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`${statusColors[batch.status] || 'bg-gray-100 text-gray-700'} border-0`}
                                    >
                                        {batch.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{batch.quantity} {batch.unit}</TableCell>
                                <TableCell>
                                    <div className="flex items-center text-gray-500">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {batch.currentLocation || batch.origin}
                                    </div>
                                </TableCell>
                                <TableCell>{formatDate(batch.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => router.push(`/batches/${batch._id}`)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/batches/${batch._id}/edit`)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Batch
                                            </DropdownMenuItem>
                                            {!batch.isDistributed && (
                                                <DropdownMenuItem onClick={() => setDistributeBatch(batch)}>
                                                    <Share2 className="mr-2 h-4 w-4" />
                                                    Distribute
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() => handleDelete(batch._id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {distributeBatch && (
                <DistributeBatchDialog 
                    batchId={distributeBatch._id}
                    maxQuantity={distributeBatch.quantity}
                    isOpen={!!distributeBatch}
                    onClose={() => setDistributeBatch(null)}
                    onSuccess={() => {
                        setDistributeBatch(null);
                        onRefresh();
                    }}
                />
            )}
        </div>
    );
}
