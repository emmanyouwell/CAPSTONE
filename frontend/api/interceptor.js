import api from './axiosInstance'
import { logoutUser } from '../redux/actions/userActions';

import AsyncStorage from '@react-native-async-storage/async-storage';
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const setupAxiosInterceptors = (store) => {
    console.log("Initializing interceptors")
    api.interceptors.response.use(
        res => res,
        async error => {
            const originalRequest = error.config;

            if (error.response?.status === 403 && !originalRequest._retry) {
                originalRequest._retry = true;

                const refreshToken = await AsyncStorage.getItem('refreshToken');
                console.log("refresh: ", refreshToken);
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({
                            resolve: (token) => {
                                originalRequest.headers.Authorization = 'Bearer ' + token;
                                resolve(api(originalRequest));
                            },
                            reject: (err) => {
                                reject(err);
                            }
                        });
                    });
                }

                isRefreshing = true;

                try {
                    const res = await api.post('/api/v1/refresh-token', { refreshToken });
                    const newAccessToken = res.data.accessToken;
                    await AsyncStorage.setItem('token', newAccessToken);
                    processQueue(null, newAccessToken);
                    isRefreshing = false;
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    isRefreshing = false;
                    store.dispatch(logoutUser());
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        }
    );
}