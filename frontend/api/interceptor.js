import api from './axiosInstance'
import { logoutUser } from '../redux/actions/userActions';
import store from '../redux/store'
import AsyncStorage from '@react-native-async-storage/async-storage';
let isRefreshing = false;
export const setupAxiosInterceptors = () => {
    // Add access token to request
    api.interceptors.request.use(async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers['x-client-type'] = 'mobile'; // identify as mobile
        }
        return config;
    });

    // Handle expired access token
    api.interceptors.response.use(
        res => res,
        async error => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                // Use refresh token to get a new access token
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (!isRefreshing) {
                    isRefreshing = true;
                    try {
                        const res = await api.post('/api/v1/refresh-token', {
                            refreshToken,
                        });
                        const newAccessToken = res.data.accessToken;
                        await AsyncStorage.setItem('token', newAccessToken);
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        isRefreshing=false;
                        return api(originalRequest);
                    } catch (refreshError) {
                        // logout or show error
                        isRefreshing=false;
                        store.dispatch(logoutUser())
                        return Promise.reject(refreshError);
                    }
                }

            }

            return Promise.reject(error);
        }
    );
}