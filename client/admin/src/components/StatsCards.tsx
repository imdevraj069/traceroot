'use client';

import { Package, TrendingUp, Shield, Users, ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    trend: 'up' | 'down';
    icon: typeof Package;
    color: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className="flex items-center mt-4">
                {trend === 'up' ? (
                    <ArrowUp className="w-4 h-4 text-green-600" />
                ) : (
                    <ArrowDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
        </div>
    );
}

interface StatsCardsProps {
    stats?: {
        totalBatches: number;
        activeBatches: number;
        qualityScore: number;
        totalUsers: number;
    };
}

export function StatsCards({ stats }: StatsCardsProps) {
    const defaultStats = {
        totalBatches: stats?.totalBatches || 0,
        activeBatches: stats?.activeBatches || 0,
        qualityScore: stats?.qualityScore || 0,
        totalUsers: stats?.totalUsers || 0,
    };

    const cards: StatCardProps[] = [
        {
            title: 'Total Batches',
            value: defaultStats.totalBatches,
            change: '+12%',
            trend: 'up',
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            title: 'Active Batches',
            value: defaultStats.activeBatches,
            change: '+8%',
            trend: 'up',
            icon: TrendingUp,
            color: 'bg-green-500',
        },
        {
            title: 'Quality Score',
            value: `${defaultStats.qualityScore.toFixed(1)}%`,
            change: '+2.1%',
            trend: 'up',
            icon: Shield,
            color: 'bg-purple-500',
        },
        {
            title: 'Total Users',
            value: defaultStats.totalUsers,
            change: '+5%',
            trend: 'up',
            icon: Users,
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
}
