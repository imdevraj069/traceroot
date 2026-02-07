import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, User } from '@/lib/api';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: true,

            login: async (email: string, password: string) => {
                const response = await auth.login(email, password);
                const { user, accessToken, refreshToken } = response.data;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: async () => {
                try {
                    await auth.logout();
                } catch {
                    // Ignore logout errors
                } finally {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },

            checkAuth: async () => {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    set({ isLoading: false, isAuthenticated: false });
                    return;
                }

                try {
                    const response = await auth.getProfile();
                    set({
                        user: response.data,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch {
                    // Token invalid, try refresh
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        try {
                            const refreshResponse = await auth.refresh(refreshToken);
                            const { accessToken: newToken, refreshToken: newRefresh } = refreshResponse.data;

                            localStorage.setItem('accessToken', newToken);
                            localStorage.setItem('refreshToken', newRefresh);

                            const profileResponse = await auth.getProfile();
                            set({
                                user: profileResponse.data,
                                accessToken: newToken,
                                refreshToken: newRefresh,
                                isAuthenticated: true,
                                isLoading: false,
                            });
                        } catch {
                            get().logout();
                        }
                    } else {
                        get().logout();
                    }
                }
            },

            setUser: (user: User) => set({ user }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);
