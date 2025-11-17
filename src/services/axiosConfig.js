import axios from 'axios';
import { store } from '../store';


// Configuration de base
axios.defaults.baseURL = import.meta.env.VITE_URL_BASE // que cette URL est correcte

// Intercepteur pour injecter le token
axios.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Intercepteur pour rafraîchir le token
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await axios.post('/api/auth/refresh-token');
                const newToken = response.data.token;
                store.dispatch({ type: 'auth/updateToken', payload: newToken });
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);