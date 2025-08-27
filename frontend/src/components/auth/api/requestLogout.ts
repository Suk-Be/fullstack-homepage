import LaravelApiClient from '@/plugins/axios';
import { resetIsCsrfFetchedAndResetCookies } from '@/utils/auth/initializeCookies';
import resetCookiesOnResponseError from '@/utils/auth/resetCookiesOnResponseError';
import { setResponseValidationError } from '@/utils/auth/setResponseValidationError';
import { setResponseValidationSuccess } from '@/utils/auth/setResponseValidationSuccess';
import toast from 'react-hot-toast';

const requestLogout = async () => {
    try {
        const response = await LaravelApiClient.post('/auth/spa/logout');
        resetIsCsrfFetchedAndResetCookies();

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
