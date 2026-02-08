"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { batches } from "@/lib/api"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface DistributeBatchDialogProps {
    batchId: string
    maxQuantity: number
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function DistributeBatchDialog({ batchId, maxQuantity, isOpen, onClose, onSuccess }: DistributeBatchDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState<{ location: string; quantity: number | string; productName?: string }[]>([
        { location: "", quantity: "", productName: "" }
    ])

    const addItem = () => {
        setItems([...items, { location: "", quantity: "", productName: "" }])
    }

    const removeItem = (index: number) => {
        const newItems = [...items]
        newItems.splice(index, 1)
        setItems(newItems)
    }

    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const handleSubmit = async () => {
        // Validate
        const distributions = items.map(item => ({
            location: item.location,
            quantity: Number(item.quantity) || 0,
            productName: item.productName || undefined
        })).filter(item => item.location && item.quantity > 0);

        if (distributions.length === 0) return;

        const total = distributions.reduce((sum, item) => sum + item.quantity, 0);
        if (total > maxQuantity) {
            alert(`Total quantity (${total}) exceeds available batch quantity (${maxQuantity})`);
            return;
        }

        setIsLoading(true);
        try {
            await batches.distribute(batchId, distributions);
            onSuccess();
            onClose();
            setItems([{ location: "", quantity: "", productName: "" }]);
        } catch (error) {
            console.error("Failed to distribute batch:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-white">
                <DialogHeader>
                    <DialogTitle>Distribute Batch</DialogTitle>
                    <DialogDescription>
                        Split this batch into multiple shipments for different locations.
                        Available Quantity: {maxQuantity}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-3 items-end p-3 bg-gray-50 rounded-lg border">
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-medium text-gray-500">Location</label>
                                <Input 
                                    placeholder="Destination" 
                                    value={item.location}
                                    onChange={(e) => updateItem(index, 'location', e.target.value)}
                                />
                            </div>
                            <div className="w-24 space-y-2">
                                <label className="text-xs font-medium text-gray-500">Qty</label>
                                <Input 
                                    type="number"
                                    placeholder="0" 
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-medium text-gray-500">Product Name (Opt)</label>
                                <Input 
                                    placeholder="e.g. Chips" 
                                    value={item.productName || ''}
                                    onChange={(e) => updateItem(index, 'productName', e.target.value)}
                                />
                            </div>
                            {items.length > 1 && (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-700 h-10 w-10"
                                    onClick={() => removeItem(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    
                    <Button variant="outline" size="sm" onClick={addItem} className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> Add Destination
                    </Button>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Distribute
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
