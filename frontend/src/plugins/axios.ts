import { store } from '@/store';
import { logout } from '@/store/loginSlice';
import { apiUrl, baseUrl } from '@/utils/apiBaseUrl';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import axios from 'axios';
import Cookies from 'js-cookie';

const api = apiUrl(); // http://localhost:8000/api
const base = baseUrl(); // http://localhost:8000

const ApiClient = axios.create({
    baseURL: api,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

const BaseClient = axios.create({
    baseURL: base,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
    },
    withCredentials: true,
});

// CSRF Interceptor: bei jedem Request XSRF-Token setzen
function attachXsrfInterceptor(client: typeof ApiClient | typeof BaseClient) {
    client.interceptors.request.use(
        (config) => {
            const xsrfToken = Cookies.get('XSRF-TOKEN');
            if (xsrfToken) {
                config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
            }
            return config;
        },
        (error) => Promise.reject(error),
    );
}

// für beide Clients aktivieren
attachXsrfInterceptor(ApiClient);
attachXsrfInterceptor(BaseClient);

// Response-Interceptor für API-Client
ApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const axiosStatus = getAxiosStatus(error);

        switch (axiosStatus) {
            case 401:
                logRecoverableError({ context: 'Access errors', error, extra: { axiosStatus } });
                store.dispatch(logout());
                break;

            case 419:
                logRecoverableError({ context: 'Token errors', error, extra: { axiosStatus } });
                break;

            case 422:
                if (error.response?.data?.errors) {
                    logRecoverableError({
                        context: 'Validation errors',
                        error,
                        extra: { axiosStatus },
                    });
                }
                break;

            default:
                break;
        }

        return Promise.reject(error);
    },
);

export default ApiClient;
export { BaseClient };
