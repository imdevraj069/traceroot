"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    issuingAuthority: z.string().min(2, {
        message: "Authority must be at least 2 characters.",
    }),
    issueDate: z.string(),
    expiryDate: z.string().optional(),
    certificateNumber: z.string().optional(),
})

interface CertificationFormProps {
    batchId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CertificationForm({ batchId, isOpen, onClose, onSuccess }: CertificationFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            issuingAuthority: "",
            issueDate: new Date().toISOString().split('T')[0],
            certificateNumber: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            await batches.addCertification(batchId, {
                name: values.name,
                issuingBody: values.issuingAuthority,
                issuedDate: values.issueDate,
                expiryDate: values.expiryDate,
                certificateNumber: values.certificateNumber,
            });
            onSuccess();
            onClose();
            form.reset();
        } catch (error) {
            console.error("Failed to add certification:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
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
                            name="issuingAuthority"
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
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Certificate"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
