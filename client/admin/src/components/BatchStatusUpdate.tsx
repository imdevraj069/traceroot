"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { batches } from "@/lib/api"
import { AlertCircle, CheckCircle, Loader2, Lock } from "lucide-react"

interface BatchStatusUpdateProps {
    batchId: string
    currentStatus: string
    onSuccess: () => void
}

const BATCH_STATUSES = [
    "Created",
    "Harvested",
    "Processing",
    "Quality Check",
    "Packaged",
    "In Transit",
    "In Distribution",
    "Delivered",
    "Completed",
    "Cancelled"
]

// Role-based allowed statuses
const ROLE_STATUS_MAP: Record<string, string[]> = {
    admin: BATCH_STATUSES,
    distributor: ["In Transit", "In Distribution", "Delivered"],
    retailer: ["Delivered", "Completed"],
    supplier: [],
    manufacturer: [],
    user: [],
    consumer: [],
}

export function BatchStatusUpdate({ batchId, currentStatus, onSuccess }: BatchStatusUpdateProps) {
    const { user } = useAuthStore()
    const [newStatus, setNewStatus] = useState(currentStatus)
    const [location, setLocation] = useState("")
    const [notes, setNotes] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    // Check if user has permission to update status
    const userRole = user?.role || ""
    const allowedStatuses = ROLE_STATUS_MAP[userRole] || []
    const canUpdateStatus = allowedStatuses.length > 0

    if (!canUpdateStatus) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-red-600" />
                    <div>
                        <p className="font-medium text-red-900">Status Update Not Available</p>
                        <p className="text-sm text-red-700">Your role ({userRole}) does not have permission to update batch status.</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleUpdateStatus = async () => {
        if (newStatus === currentStatus && !location && !notes) {
            setMessage({ type: "error", text: "Please make changes before updating" })
            return
        }

        setIsLoading(true)
        try {
            await batches.updateStatus(batchId, {
                status: newStatus,
                location: location || undefined,
                notes: notes || undefined
            })
            setMessage({ type: "success", text: "Status updated successfully" })
            setTimeout(() => {
                setMessage(null)
                onSuccess()
            }, 2000)
        } catch (error) {
            console.error("Failed to update status:", error)
            setMessage({ type: "error", text: "Failed to update status" })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-green-200 bg-green-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Update Batch Status
                </CardTitle>
                <CardDescription>
                    Change the current processing status and track location updates
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Current Status</label>
                        <div className="px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm text-gray-600">
                            {currentStatus}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">New Status</label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {allowedStatuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location (Optional)</label>
                    <Input
                        placeholder="e.g., Distribution Center A"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <Input
                        placeholder="e.g., Quality check completed, ready for packaging"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
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

                <Button
                    onClick={handleUpdateStatus}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        "Update Status"
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
