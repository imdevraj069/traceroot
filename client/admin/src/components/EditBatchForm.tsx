"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { batches, Batch } from "@/lib/api"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    productName: z.string().min(2, "Product name is required"),
    variety: z.string().optional(),
    quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Quantity must be a positive number",
    }),
    unit: z.string().min(1, "Unit is required"),
    origin: z.string().min(2, "Origin is required"),
    harvestDate: z.string().optional(),
    expiryDate: z.string().optional(),
})

interface EditBatchFormProps {
    batchId: string;
}

export function EditBatchForm({ batchId }: EditBatchFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [batch, setBatch] = useState<Batch | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            variety: "",
            quantity: "",
            unit: "kg",
            origin: "",
            harvestDate: "",
            expiryDate: "",
        },
    })

    // Fetch batch data
    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const data = await batches.getById(batchId)
                setBatch(data)
                form.reset({
                    productName: data.productName,
                    variety: data.variety || "",
                    quantity: data.quantity.toString(),
                    unit: data.unit,
                    origin: data.origin,
                    harvestDate: data.harvestDate ? new Date(data.harvestDate).toISOString().split('T')[0] : "",
                    expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : "",
                })
            } catch (error) {
                console.error("Failed to fetch batch:", error)
            }
        }
        if (batchId) {
            fetchBatch()
        }
    }, [batchId, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            await batches.update(batchId, {
                ...values,
                quantity: Number(values.quantity),
                harvestDate: values.harvestDate ? new Date(values.harvestDate).toISOString() : undefined,
                expiryDate: values.expiryDate ? new Date(values.expiryDate).toISOString() : undefined,
            })
            router.push(`/batches/${batchId}`)
            router.refresh()
        } catch (error) {
            console.error("Failed to update batch:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!batch) {
        return <div>Loading batch data...</div>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg shadow-sm border">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="productName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Organic Apples" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="variety"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Variety</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Gala" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                        <SelectItem value="ton">Tons</SelectItem>
                                        <SelectItem value="box">Boxes</SelectItem>
                                        <SelectItem value="pc">Pieces</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Origin</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Himanchal Pradesh, India" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="harvestDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Harvest Date</FormLabel>
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

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" type="button" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
