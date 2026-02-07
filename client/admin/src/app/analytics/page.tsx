"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyBatchesChart } from "@/components/charts/MonthlyBatchesChart"
import { QualityTrendChart } from "@/components/charts/QualityTrendChart"
import { BatchStatusChart } from "@/components/charts/BatchStatusChart"
import { RegionalDistribution } from "@/components/charts/RegionalDistribution"

export default function AnalyticsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* We can duplicate StatsCards here or create specific analytics cards */}
                {/* For now, let's focus on the charts as requested */}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <MonthlyBatchesChart />
                </div>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Batch Status Distribution</CardTitle>
                        <CardDescription>
                            Current status of all active batches
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <BatchStatusChart />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quality Trends</CardTitle>
                        <CardDescription>
                            Average quality scores over the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <QualityTrendChart />
                    </CardContent>
                </Card>
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Regional Distribution</CardTitle>
                        <CardDescription>
                            Batches by origin region
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegionalDistribution />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
