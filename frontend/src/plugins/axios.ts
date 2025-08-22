import { store } from '@/store';
import { logout } from '@/store/loginSlice';
import { resetUserGrid } from '@/store/userSaveGridsSlice';
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
    async (error) => {
        const axiosStatus = getAxiosStatus(error);

        switch (axiosStatus) {
          case 401:
            logRecoverableError({ context: 'Access errors', error, extra: { axiosStatus } });
            store.dispatch(resetUserGrid());
            store.dispatch(logout());
            break;

          case 419:
            logRecoverableError({ context: 'Token errors', error, extra: { axiosStatus } });
            break;

          case 422:
            if (error.response?.data?.errors) {
              logRecoverableError({ context: 'Validation errors', error, extra: { axiosStatus } });
            }
            break;

          default:
            break;
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;
