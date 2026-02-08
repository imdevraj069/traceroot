"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { batches } from "@/lib/api"
import { AlertCircle, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
    metricType: z.string().min(2, {
        message: "Metric Type is required.",
    }),
    score: z.number().min(0).max(100),
    category: z.string().optional(),
    status: z.enum(["Pending", "Passed", "Failed"]),
    unit: z.string().optional(),
    labName: z.string().optional(),
    testMethod: z.string().optional(),
    reportNumber: z.string().optional(),
    notes: z.string().optional(),
})

interface QualityMetricsFormProps {
    batchId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function QualityMetricsForm({ batchId, isOpen, onClose, onSuccess }: QualityMetricsFormProps) {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    
    // Only admin and manufacturer can add quality metrics
    const canAddQuality = user?.role === 'admin' || user?.role === 'manufacturer';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            metricType: "General Quality",
            score: 0,
            category: "Quality Check",
            status: "Pending",
            unit: "",
            labName: "",
            testMethod: "",
            reportNumber: "",
            notes: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('metricType', values.metricType);
            formData.append('score', values.score.toString());
            formData.append('category', values.category || "Quality Check");
            formData.append('status', values.status);
            if (values.unit) formData.append('unit', values.unit);
            if (values.labName) formData.append('labName', values.labName);
            if (values.testMethod) formData.append('testMethod', values.testMethod);
            // reportNumber is auto-generated if empty, but we can send it if user entered one
            if (values.reportNumber) formData.append('reportNumber', values.reportNumber);
            if (values.notes) formData.append('notes', values.notes);
            
            if (certificateFile) {
                formData.append('certificate', certificateFile);
            }

            await batches.addQuality(batchId, formData);
            onSuccess();
            onClose();
            form.reset();
            setCertificateFile(null);
        } catch (error) {
            console.error("Failed to add quality metric:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (!canAddQuality) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Add Quality Metric</DialogTitle>
                    </DialogHeader>
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="font-medium text-red-900">Access Denied</p>
                                <p className="text-sm text-red-700">Your role ({user?.role}) does not have permission to add quality metrics. Only Admin and Manufacturer roles can add quality metrics.</p>
                            </div>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Quality Metric</DialogTitle>
                    <DialogDescription>
                        Record a new quality test result for this batch.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="metricType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Metric Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select metric type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="General Quality">General Quality</SelectItem>
                                            <SelectItem value="Moisture Content">Moisture Content</SelectItem>
                                            <SelectItem value="Purity Analysis">Purity Analysis</SelectItem>
                                            <SelectItem value="Heavy Metals">Heavy Metals</SelectItem>
                                            <SelectItem value="Curcumin Content">Curcumin Content</SelectItem>
                                            <SelectItem value="Organic Certification">Organic Certification</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="score"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Score (0-100)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., %, mg/kg, ppm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Passed">Passed</SelectItem>
                                            <SelectItem value="Failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="labName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lab Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Bureau Veritas" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="testMethod"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Test Method</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., HPLC" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="reportNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Report Number (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Auto-generated if empty" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Certificate File</FormLabel>
                            <FormControl>
                                <Input 
                                    type="file" 
                                    accept=".pdf,image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setCertificateFile(file);
                                    }} 
                                />
                            </FormControl>
                            <FormDescription>Upload PDF or image certificate</FormDescription>
                        </FormItem>

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Additional comments..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? "Saving..." : "Save Metric"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
