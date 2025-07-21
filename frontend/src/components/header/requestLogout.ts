import LaravelApiClient from '@/plugins/axios';
import { resetIsCsrfFetchedAndResetCookies } from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';
import { getAxiosStatus, logRecoverableError } from '@/utils/logger';
import toast from 'react-hot-toast';

const requestLogout = async (logState: boolean) => {
    try {
        const response = await LaravelApiClient.post('/auth/spa/logout');
        resetIsCsrfFetchedAndResetCookies();

        if (logState) {
            await LaravelApiClient.get('/me')
                .then((res) => {
                    console.log('User is still logged in:', res.data);
                })
                .catch((error) => {
                    const axiosStatus = getAxiosStatus(error);
                    if (error.response?.status === 401) {
                        logRecoverableError({
                            context: 'User is logged out as expected.',
                            error,
                            extra: { axiosStatus },
                        });
                    } else {
                        logRecoverableError({
                            context: 'Unexpected error checking login status.',
                            error,
                            extra: { axiosStatus },
                        });
                    }
                });
        }

        const message = response.data.message || 'Logout erfolgreich!';
        toast.success(message);
        return setResponseValidationSuccess(message);
    } catch (error: unknown) {
        // on 419 or 422
        await resetCookiesOnResponseError(error);

        return setResponseValidationError(error);
    }
};

export default requestLogout;
