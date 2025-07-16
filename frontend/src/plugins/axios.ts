import apiBaseUrl from '@/utils/apiBaseUrl';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = apiBaseUrl();

const LaravelApiClient = axios.create({
    baseURL: api,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

LaravelApiClient.interceptors.request.use(
    (config) => {
        const xsrfToken = Cookies.get('XSRF-TOKEN');
        if (xsrfToken) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
        return config;
    },
    (error) => Promise.reject(error),
);

LaravelApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const axiosStatus = getAxiosStatus(error);

        if (axiosStatus === 401) {
            logRecoverableError({
                context: 'Access errors',
                error,
                extra: { axiosStatus },
            });
        }

        if (axiosStatus === 419) {
            logRecoverableError({
                context: 'Token errors',
                error,
                extra: { axiosStatus },
            });
        }

        if (axiosStatus === 422 && error.response?.data?.errors) {
            logRecoverableError({
                context: 'Validation errors',
                error,
                extra: { axiosStatus },
            });
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;
