'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { batches, CreateBatchData } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

interface CreateProps {
    onSuccess: () => void;
}

export function CreateBatchDialog({ onSuccess }: CreateProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<CreateBatchData>({
        productName: '',
        variety: '',
        quantity: 0,
        unit: 'kg',
        origin: '',
        harvestDate: '',
        nfcTagId: '',
    });

    const { user } = useAuthStore();
    const isSupplier = user?.role === 'supplier' || user?.role === 'admin';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                variety: formData.variety || undefined,
                harvestDate: formData.harvestDate || undefined,
                nfcTagId: formData.nfcTagId || undefined,
            };
            await batches.create(payload);
            setOpen(false);
            setFormData({
                productName: '',
                variety: '',
                quantity: 0,
                unit: 'kg',
                origin: '',
                harvestDate: '',
                nfcTagId: '',
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create batch');
        } finally {
            setLoading(false);
        }
    };

    if (!isSupplier) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Batch
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Batch</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new agricultural batch.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                                id="productName"
                                name="productName"
                                placeholder="e.g. Coffee Beans"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="variety">Variety</Label>
                            <Input
                                id="variety"
                                name="variety"
                                placeholder="e.g. Arabica"
                                value={formData.variety}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Input
                                id="unit"
                                name="unit"
                                placeholder="kg, tons, etc."
                                value={formData.unit}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="origin">Origin Location</Label>
                        <Input
                            id="origin"
                            name="origin"
                            placeholder="e.g. Coorg Estate, India"
                            value={formData.origin}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="harvestDate">Harvest Date</Label>
                        <Input
                            id="harvestDate"
                            name="harvestDate"
                            type="date"
                            value={formData.harvestDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nfcTagId">NFC Tag ID (Optional)</Label>
                        <Input
                            id="nfcTagId"
                            name="nfcTagId"
                            placeholder="Scan NFC tag"
                            value={formData.nfcTagId}
                            onChange={handleChange}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Batch
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
