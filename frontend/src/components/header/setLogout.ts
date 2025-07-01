import LaravelApiClient from '../../plugins/axios';
import initializeCookie, { resetCsrfFetched } from '../../plugins/fetchCsrfCookie';

const setLogout = async (logState: boolean) => {
    try {
        // Logout request
        await LaravelApiClient.post('/auth/spa/logout');

        // log post-logout state
        if (logState) {
            await LaravelApiClient.get('/me')
                .then((res) => {
                    console.log('User is still logged in:', res.data);
                })
                .catch((error) => {
                    if (error.response?.status === 401) {
                        console.log('User is logged out as expected.');
                    } else {
                        console.error('Unexpected error checking login status:', error);
                    }
                });
        }

        // Re-fetch XSRF cookie after session ends to reset token
        resetCsrfFetched();
        await initializeCookie();
        console.log('XSRF cookie re-initialized after logout');
    } catch (error) {
        console.error('Logout error:', error);
    }
};

export default setLogout;
