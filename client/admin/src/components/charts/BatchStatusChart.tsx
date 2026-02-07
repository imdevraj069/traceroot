'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
    { name: 'Created', value: 12, color: '#22c55e' }, // green-500
    { name: 'Processing', value: 8, color: '#3b82f6' }, // blue-500
    { name: 'Quality Check', value: 5, color: '#a855f7' }, // purple-500
    { name: 'In Transit', value: 7, color: '#f97316' }, // orange-500
    { name: 'Delivered', value: 15, color: '#10b981' }, // emerald-500
];

export function BatchStatusChart() {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
