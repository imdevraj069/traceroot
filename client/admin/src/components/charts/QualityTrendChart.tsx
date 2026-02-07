'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QualityTrendChartProps {
    data?: Array<{ name: string; score: number }>;
}

export function QualityTrendChart({ data = [] }: QualityTrendChartProps) {
    if (!data.length) {
        return <div className="h-[300px] w-full flex items-center justify-center text-gray-500">No data available</div>;
    }
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280' }}
                        dy={10}
                    />
                    <YAxis
                        domain={[80, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#16a34a"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
