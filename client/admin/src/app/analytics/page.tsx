"use client"

import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyBatchesChart } from "@/components/charts/MonthlyBatchesChart"
import { QualityTrendChart } from "@/components/charts/QualityTrendChart"
import { BatchStatusChart } from "@/components/charts/BatchStatusChart"
import { RegionalDistribution } from "@/components/charts/RegionalDistribution"

export default function AnalyticsPage() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center justify-between space-y-2 mb-6">
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
                </main>
            </div>
        </div>
    )
}
