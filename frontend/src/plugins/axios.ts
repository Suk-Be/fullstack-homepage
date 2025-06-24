import axios from 'axios';
import Cookies from 'js-cookie';
import apiBaseUrl, { serverBaseUrl } from '../utils/apiBaseUrl';

const LaravelApiClient = axios.create({
    baseURL: apiBaseUrl(),
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});


let csrfFetched = false;

LaravelApiClient.interceptors.request.use(
    async (config) => {
        const method = config.method?.toLowerCase() ?? '';
        const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);

        if (needsCsrf && !csrfFetched) {
            await axios.get(`${serverBaseUrl()}/api/csrf-cookie`, {
                withCredentials: true,
            });
            csrfFetched = true;
        }

        const csrfToken = Cookies.get('XSRF-TOKEN');
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken;
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

        if (status === 422 && error.response?.data?.errors) {
            console.warn('Validation errors', error.response.data.errors);
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;
