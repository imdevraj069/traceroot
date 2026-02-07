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
import { batches, certifications } from "@/lib/api"
import { AlertCircle, CheckCircle, Loader2, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Certification name is required.",
    }),
    type: z.enum(["organic", "quality", "safety", "environmental", "social", "other"]),
    issuingBody: z.string().min(2, {
        message: "Issuing body is required.",
    }),
    issuedDate: z.string(),
    expiryDate: z.string().optional(),
    certificateNumber: z.string().optional(),
    documentUrl: z.string().optional(),
})

interface CertificationFormProps {
    batchId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CertificationForm({ batchId, isOpen, onClose, onSuccess }: CertificationFormProps) {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Only admin and manufacturer can add certifications
    const canAddCertification = user?.role === 'admin' || user?.role === 'manufacturer';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "other",
            issuingBody: "",
            issuedDate: new Date().toISOString().split('T')[0],
            expiryDate: "",
            certificateNumber: "",
            documentUrl: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setMessage(null);
        try {
            await certifications.create({
                name: values.name,
                type: values.type,
                issuingBody: values.issuingBody,
                issuedDate: values.issuedDate,
                expiryDate: values.expiryDate,
                certificateNumber: values.certificateNumber,
                documentUrl: values.documentUrl,
            });
            setMessage({ type: "success", text: "Certification added successfully" });
            setTimeout(() => {
                onSuccess();
                onClose();
                form.reset();
                setMessage(null);
            }, 1500);
        } catch (error) {
            console.error("Failed to add certification:", error);
            setMessage({ type: "error", text: "Failed to add certification" });
        } finally {
            setIsLoading(false);
        }
    }

    if (!canAddCertification) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Add Certification</DialogTitle>
                    </DialogHeader>
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="font-medium text-red-900">Access Denied</p>
                                <p className="text-sm text-red-700">Your role ({user?.role}) does not have permission to add certifications. Only Admin and Manufacturer roles can add certifications.</p>
                            </div>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Certification</DialogTitle>
                    <DialogDescription>
                        Record a new certification for this batch.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Certificate Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Organic Certified" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="issuingBody"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issuing Authority</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. USDA" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="issueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Issue Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="certificateNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Certificate Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Optional" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {message && (
                            <div className={`flex items-center gap-2 p-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {message.type === "success" ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <AlertCircle className="w-4 h-4" />
                                )}
                                <span className="text-sm">{message.text}</span>
                            </div>
                        )}

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isLoading ? "Saving..." : "Save Certificate"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
