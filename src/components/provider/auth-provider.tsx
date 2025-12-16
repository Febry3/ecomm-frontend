'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import apiClient from '@/lib/api-client';
import { User } from '@/types/auth';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { setUser, setToken, accessToken, user, clearAuth } = useAuthStore();
    const hasInitialized = useRef(false);

    useEffect(() => {
        const fetchAccessToken = async () => {
            if (!accessToken) return;

            setToken(accessToken);

            if (!hasInitialized.current || !user) {
                hasInitialized.current = true;

                try {
                    const response = await apiClient.get('/user');
                    const userData = response.data.data as User;
                    setUser(userData);
                } catch (error) {
                    clearAuth();
                    console.error('Failed to fetch user data:', error);
                }
            }
        };

        fetchAccessToken();
        console.log("refetch user data");
    }, [setUser, setToken, accessToken, user, clearAuth]);

    return <>{children}</>;
}
