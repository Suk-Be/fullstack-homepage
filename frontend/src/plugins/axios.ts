import axios from 'axios';
import Cookies from 'js-cookie';
import apiBaseUrl from '../utils/apiBaseUrl';

const LaravelApiClient = axios.create({
    baseURL: apiBaseUrl(),
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


// Response interceptor: handle Laravel errors globally
LaravelApiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            console.warn('Access errors', error.response.data.message);
        }

        if (status === 419) {
            console.warn('Token errors', error.response.data.message);
        }

        if (status === 422 && error.response?.data?.errors) {
            console.warn('Validation errors', error.response.data.errors);
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;
