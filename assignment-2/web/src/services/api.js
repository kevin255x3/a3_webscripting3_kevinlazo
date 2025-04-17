// api service - centralized axios instance for backend communication
// handles authentication and error interceptors
import axios from 'axios';
import config from '../config';

// create api client with base url from config
const api = axios.create({
    baseURL: config.API_URL
});

// request interceptor - adds auth token to all outgoing requests
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// response interceptor - handles authentication errors
api.interceptors.response.use(
    response => response,
    error => {
        // auto-logout when server returns 401 unauthorized
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');


        }

        return Promise.reject(error);
    }
);

export default api;