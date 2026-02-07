'use client';

import { useAuthStore } from '@/store/auth-store';
import { ReactNode } from 'react';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: string[];
    fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { user } = useAuthStore();

    if (!user) return null;

    if (allowedRoles.includes(user.role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
