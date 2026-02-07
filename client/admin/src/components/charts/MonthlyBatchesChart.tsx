"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
    { name: "Jan", batches: 40 },
    { name: "Feb", batches: 30 },
    { name: "Mar", batches: 20 },
    { name: "Apr", batches: 27 },
    { name: "May", batches: 18 },
    { name: "Jun", batches: 23 },
    { name: "Jul", batches: 34 },
]

export function MonthlyBatchesChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Monthly Batch Creation</CardTitle>
                <CardDescription>
                    Number of batches created per month for the current year.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorBatches" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="batches"
                            stroke="#2563eb"
                            fillOpacity={1}
                            fill="url(#colorBatches)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
