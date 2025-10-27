import { useAuthStore } from "@/stores/auth-store";
import axios, { InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedRequestsQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedRequestsQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedRequestsQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response, // Directly return successful responses
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._isRetry) {
            if (isRefreshing) {
                // If we are already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then(newAccessToken => {
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return apiClient(originalRequest); // Retry with new token
                    })
                    .catch(err => {
                        return Promise.reject(err); // Refresh failed, reject this promise
                    });
            }

            originalRequest._isRetry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = refreshResponse.data.data;
                useAuthStore.getState().setToken(accessToken)
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                console.error('Token refresh failed', refreshError);
                useAuthStore.getState().clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

