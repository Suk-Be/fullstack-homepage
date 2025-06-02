import axios from 'axios';
import Cookies from 'js-cookie';

const LaravelApiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

LaravelApiClient.interceptors.request.use(
    async (config) => {
        const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(
            (config.method ?? '').toLowerCase(),
        );
        if (needsCsrf) {
            await LaravelApiClient.get('/csrf-cookie').then();
            config.headers['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

LaravelApiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                console.warn('Nicht autorisiert – ggf. ausgeloggt');
            }

            if (status === 419) {
                console.warn('CSRF-Token abgelaufen');
            }

            if (status === 422) {
                console.warn('Validierungsfehler:', error.response.data.errors);
            }
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;
