'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    BarChart3,
    Shield,
    Award,
    Users,
    Settings,
    LogOut,
    Leaf,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/batches', label: 'Batches', icon: Package },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/quality', label: 'Quality', icon: Shield },
    { href: '/certifications', label: 'Certifications', icon: Award },
    { href: '/users', label: 'Users', icon: Users, adminOnly: true },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const isAdmin = user?.role === 'admin';

    return (
        <aside className={cn(
            "flex flex-col h-screen bg-gray-900 text-white transition-all duration-300",
            collapsed ? "w-16" : "w-64"
        )}>
            {/* Logo */}
            <div className="flex items-center h-16 px-4 border-b border-gray-800">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold">TraceRoot</span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    if (item.adminOnly && !isAdmin) return null;

                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center px-3 py-2.5 rounded-lg transition-colors",
                                isActive
                                    ? "bg-green-600 text-white"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && (
                                <span className="ml-3">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-gray-800">
                {!collapsed && user && (
                    <div className="mb-3 px-2">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                )}
                <button
                    onClick={() => logout()}
                    className="flex items-center w-full px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="ml-3">Logout</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center h-10 border-t border-gray-800 text-gray-400 hover:text-white transition-colors"
            >
                {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
        </aside>
    );
}
