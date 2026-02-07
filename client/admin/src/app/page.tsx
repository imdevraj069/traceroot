'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { StatsCards } from '@/components/StatsCards';
import { BatchStatusChart } from '@/components/charts/BatchStatusChart';
import { QualityTrendChart } from '@/components/charts/QualityTrendChart';
import { RegionalDistribution } from '@/components/charts/RegionalDistribution';
import { useAuthStore } from '@/store/auth-store';
import { Loader2 } from 'lucide-react';
import { analytics } from '@/lib/api';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    async function fetchStats() {
      if (isAuthenticated) {
        try {
          const stats = await analytics.getStats();
          setData(stats.data);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setLoadingStats(false);
        }
      }
    }

    fetchStats();
  }, [isAuthenticated]);

  if (isLoading || loadingStats) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500">Overview of your supply chain performance</p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={{
              totalBatches: data?.totalBatches || 0,
              activeBatches: data?.activeBatches || 0,
              qualityScore: data?.averageQuality || 0,
              totalUsers: data?.totalUsers || 0
            }} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Batch Status */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Batch Status Distribution</h3>
                <BatchStatusChart data={data?.statusDistribution} />
              </div>

              {/* Quality Trends */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Score Trend</h3>
                <QualityTrendChart data={data?.qualityTrends} />
              </div>

              {/* Regional Distribution */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Distribution</h3>
                <RegionalDistribution data={data?.regionalDistribution} />
              </div>

              {/* Recent Activity Placeholder */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">B{i}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Batch #{1000 + i} updated</p>
                        <p className="text-xs text-gray-500">Status changed to In Transit • 2h ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
