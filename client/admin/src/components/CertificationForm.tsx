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
import { certifications } from "@/lib/api"
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
    scope: z.string().optional(),
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
    const [certificateFile, setCertificateFile] = useState<File | null>(null);

    // Only admin, manufacturer, inspector can add certifications
    const canAddCertification = ['admin', 'manufacturer', 'inspector'].includes(user?.role?.toLowerCase() || '');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "other",
            issuingBody: "",
            issuedDate: new Date().toISOString().split('T')[0],
            expiryDate: "",
            certificateNumber: "",
            scope: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setMessage(null);
        try {
            const formData = new FormData();
            formData.append('batchId', batchId);
            formData.append('name', values.name);
            formData.append('type', values.type);
            formData.append('issuingBody', values.issuingBody);
            formData.append('issuedDate', values.issuedDate);
            if (values.expiryDate) formData.append('expiryDate', values.expiryDate);
            if (values.certificateNumber) formData.append('certificateNumber', values.certificateNumber);
            if (values.scope) formData.append('scope', values.scope);
            
            if (certificateFile) {
                formData.append('certificate', certificateFile);
            }

            // Using any to bypass strict type checking during transition
            await certifications.create(formData as any);
            
            setMessage({ type: "success", text: "Certification added successfully" });
            setTimeout(() => {
                onSuccess();
                onClose();
                form.reset();
                setCertificateFile(null);
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
                                <p className="text-sm text-red-700">Your role ({user?.role}) does not have permission to add certifications.</p>
                            </div>
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Certification</DialogTitle>
                    <DialogDescription>
                        Upload a new certification document for this batch.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Certification Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Organic Certified" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="organic">Organic</SelectItem>
                                                <SelectItem value="quality">Quality</SelectItem>
                                                <SelectItem value="safety">Safety</SelectItem>
                                                <SelectItem value="environmental">Environmental</SelectItem>
                                                <SelectItem value="social">Social</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="issuedDate"
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

                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <FormLabel htmlFor="certificate">Certificate Document</FormLabel>
                            <Input 
                                id="certificate" 
                                type="file" 
                                onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <p className="text-[0.8rem] text-muted-foreground">
                                Upload certificate (PDF, JPG, PNG)
                            </p>
                        </div>

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
