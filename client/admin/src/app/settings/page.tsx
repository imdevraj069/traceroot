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
import { useAuthStore } from "@/store/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
// import { useToast } from "@/components/ui/use-toast"

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
})

export default function SettingsPage() {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    // const { toast } = useToast()

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
        },
    })

    async function onSubmit(values: z.infer<typeof profileFormSchema>) {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            console.log(values)
            // toast({ title: "Profile updated" })
        }, 1000)
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Manage your public profile information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your email" {...field} disabled />
                                        </FormControl>
                                        <FormDescription>
                                            Email changes are currently disabled.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update profile"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
