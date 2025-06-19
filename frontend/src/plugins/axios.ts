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

let isFetchingCsrfCookie = false;
let csrfCookiePromise: Promise<any> | null = null;

LaravelApiClient.interceptors.request.use(
    async (config) => {
        const method = config.method?.toLowerCase() ?? '';
        const needsCsrf = ['post', 'put', 'patch', 'delete'].includes(method);

        if (needsCsrf) {
            let csrfToken = Cookies.get('XSRF-TOKEN');

            // If token is missing, or if we're not already fetching it
            if (!csrfToken && !isFetchingCsrfCookie) {
                isFetchingCsrfCookie = true;
                csrfCookiePromise = LaravelApiClient.get('/csrf-cookie') // Laravel Sanctum's default path
                    .finally(() => {
                        isFetchingCsrfCookie = false;
                        csrfCookiePromise = null;
                    });
            }

            // Wait for the CSRF cookie to be fetched if a request initiated it
            if (csrfCookiePromise) {
                await csrfCookiePromise;
                csrfToken = Cookies.get('XSRF-TOKEN'); // Get updated token after fetch
            }

            if (csrfToken) {
                config.headers['X-XSRF-TOKEN'] = csrfToken;
            } else {
                // If after all attempts, no token, you might want to throw an error
                // or handle this gracefully, e.g., redirect to login.
                console.error('CSRF token not available for state-changing request.');
                // Depending on your error handling, you might reject here or let it go to the response interceptor
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

        // Global handling for specific statuses
        if (status === 401) {
            console.warn('Global: Session expired or unauthorized. Redirecting to home page');
            // todo redirecting to home page when session expires
            // E.g., redirect to login page, clear user state
            // Example: window.location.href = '/login'; // Or use React Router's navigate
            // IMPORTANT: If you globally handle and redirect, you might not want to re-reject the promise.
            // But if you still want the specific request to catch it for localized messages,
            // then Promise.reject(error) is necessary. Let's keep reject for now.
        }

        if (status === 419) {
            // CSRF token expired or invalid (Laravel's default for XSRF-TOKEN issues)
            console.warn('CSRF-Token abgelaufen');
            // todo reload page when token expires
            // window.location.reload(); // Common strategy
        }

        return Promise.reject(error);
    },
);

export default LaravelApiClient;
