'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import apiClient from '@/lib/api-client';
import { User } from '@/types/auth';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { setUser, setToken, accessToken, clearAuth } = useAuthStore();
    const hasInitialized = useRef(false);

    useEffect(() => {
        const fetchAccessToken = async () => {
            if (hasInitialized.current) return;
            hasInitialized.current = true;

            try {
                if (accessToken) {
                    setToken(accessToken);
                }

                if (accessToken) {
                    const response = await apiClient.post('/auth/refresh');
                    const userData = response.data.data as User;
                    setUser(userData);
                }
            } catch (error) {
                clearAuth();
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchAccessToken();
    }, [setUser, setToken, accessToken]);

    return <>{children}</>;
}
