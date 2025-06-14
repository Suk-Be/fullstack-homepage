import axios from 'axios';
import Cookies from 'js-cookie';

const LaravelApiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

// Request interceptor: fetch CSRF token if needed
LaravelApiClient.interceptors.request.use(
    async (config) => {
        const method = config.method?.toLowerCase() ?? '';
        const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);

        if (needsCsrf) {
            await LaravelApiClient.get('/csrf-cookie');
            const csrfToken = Cookies.get('XSRF-TOKEN');
            if (csrfToken) {
                config.headers['X-XSRF-TOKEN'] = csrfToken;
            }
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// Response interceptor: handle Laravel errors globally
LaravelApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            console.warn('Nicht autorisiert – ggf. ausgeloggt');
        }

        if (status === 419) {
            console.warn('CSRF-Token abgelaufen');
        }

        if (status === 422) {
            console.warn('Validierungsfehler', error.response.data.errors);
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;
