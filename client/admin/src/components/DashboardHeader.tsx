'use client';

import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export function DashboardHeader() {
    const { user } = useAuthStore();

    return (
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search batches, products..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-4 border-l">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
